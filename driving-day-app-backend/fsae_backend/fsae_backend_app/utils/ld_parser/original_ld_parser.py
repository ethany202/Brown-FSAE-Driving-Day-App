""" Parser for MoTec ld files

Code created through reverse engineering the data format.
"""

import datetime
import struct

import numpy as np
import pandas as pd 
import sys 
import glob


class ldData(object):
    """Container for parsed data of an ld file.

    Allows reading and writing.
    """

    def __init__(self, head, channs):
        self.head = head
        self.channs = channs

    def __getitem__(self, item):
        if not isinstance(item, int):
            col = [n for n, x in enumerate(self.channs) if x.name == item]
            if len(col) != 1:
                raise Exception("Could get column", item, col)
            item = col[0]
        return self.channs[item]

    def __iter__(self):
        return iter([x.name for x in self.channs])

    def to_dataframe(self):
        data_dict = {}

        for chann in self.channs:
            print("Parsing channel:", chann.name)
            try: 
                chann_data = chann.data
                if chann_data is not None:
                    if isinstance(chann_data, np.ndarray):
                        chann_data = chann_data.tolist()
                    data_dict[chann.name] = chann_data
            except Exception as e: 
                print(f"Error parsing {chann.name}: {e}")

        max_length = max(len(v) for v in data_dict.values())
        # fill shorter lists with NaN to match the maximum length
        for key, value in data_dict.items():
            if len(value) < max_length:
                if isinstance(value, list):
                    value.extend([float('nan')] * (max_length - len(value)))
                else:
                    value = np.concatenate([value, np.full((max_length - len(value),), np.nan)])
                    data_dict[key] = value.tolist()  # Convert back to list for DataFrame

        df = pd.DataFrame(data_dict)
        return df

    @classmethod
    def fromfile(cls, f):
        # type: (str) -> ldData
        """Parse data of an ld file"""
        return cls(*read_ldfile(f))


class ldEvent(object):
    fmt = '<64s64s1024sH'

    def __init__(self, name, session, comment, venue_ptr, venue):
        self.name, self.session, self.comment, self.venue_ptr, self.venue = \
            name, session, comment, venue_ptr, venue

    @classmethod
    def fromfile(cls, f):
        # type: (file) -> ldEvent
        """Parses and stores the event information in an ld file
        """
        name, session, comment, venue_ptr = struct.unpack(
            ldEvent.fmt, f.read(struct.calcsize(ldEvent.fmt)))
        name, session, comment = map(decode_string, [name, session, comment])

        venue = None
        if venue_ptr > 0:
            f.seek(venue_ptr)
            venue = ldVenue.fromfile(f)

        return cls(name, session, comment, venue_ptr, venue)



class ldVenue(object):
    fmt = '<64s1034xH'

    def __init__(self, name, vehicle_ptr, vehicle):
        self.name, self.vehicle_ptr, self.vehicle = name, vehicle_ptr, vehicle

    @classmethod
    def fromfile(cls, f):
        # type: (file) -> ldVenue
        """Parses and stores the venue information in an ld file
        """
        name, vehicle_ptr = struct.unpack(ldVenue.fmt, f.read(struct.calcsize(ldVenue.fmt)))

        vehicle = None
        if vehicle_ptr > 0:
            f.seek(vehicle_ptr)
            vehicle = ldVehicle.fromfile(f)
        return cls(decode_string(name), vehicle_ptr, vehicle)



class ldHead(object):
    fmt = '<' + (
        "I4x"     # ldmarker
        "II"      # chann_meta_ptr chann_data_ptr
        "20x"     # ??
        "I"       # event_ptr
        "24x"     # ??
        "HHH"     # unknown static (?) numbers
        "I"       # device serial
        "8s"      # device type
        "H"       # device version
        "H"       # unknown static (?) number
        "I"       # num_channs
        "4x"      # ??
        "16s"     # date
        "16x"     # ??
        "16s"     # time
        "16x"     # ??
        "64s"     # driver
        "64s"     # vehicleid
        "64x"     # ??
        "64s"     # venue
        "64x"     # ??
        "1024x"   # ??
        "I"       # enable "pro logging" (some magic number?)
        "66x"     # ??
        "64s"     # short comment
        "126x"    # ??
    )

    def __init__(self, meta_ptr, data_ptr, event_ptr, event, driver, vehicleid, venue, datetime, short_comment):
        self.meta_ptr, self.data_ptr, self.event_ptr, self.event, self.driver, self.vehicleid, \
        self.venue, self.datetime, self.short_comment = meta_ptr, data_ptr, event_ptr, event, \
                                                driver, vehicleid, venue, datetime, short_comment

    @classmethod
    def fromfile(cls, f):
        # type: (file) -> ldHead
        """Parses and stores the header information of an ld file
        """
        (_, meta_ptr, data_ptr, event_ptr,
            _, _, _,
            _, _, _, _, n,
            date, time,
            driver, vehicleid, venue,
            _, short_comment) = struct.unpack(ldHead.fmt, f.read(struct.calcsize(ldHead.fmt)))
        date, time, driver, vehicleid, venue, short_comment = \
            map(decode_string, [date, time, driver, vehicleid, venue, short_comment])

        try:
            # first, try to decode datatime with seconds
            _datetime = datetime.datetime.strptime(
                    '%s %s'%(date, time), '%d/%m/%Y %H:%M:%S')
        except ValueError:
            _datetime = datetime.datetime.strptime(
                '%s %s'%(date, time), '%d/%m/%Y %H:%M')

        event = None
        if event_ptr > 0:
            f.seek(event_ptr)
            event = ldEvent.fromfile(f)
        return cls(meta_ptr, data_ptr, event_ptr, event, driver, vehicleid, venue, _datetime, short_comment)


class ldChan(object):
    """Channel (meta) data

    Parses and stores the channel meta data of a channel in a ld file.
    Needs the pointer to the channel meta block in the ld file.
    The actual data is read on demand using the 'data' property.
    """

    fmt = '<' + (
        "IIII"    # prev_addr next_addr data_ptr n_data
        "H"       # some counter?
        "HHH"     # datatype datatype rec_freq
        "hhhh"    # shift mul scale dec_places
        "32s"     # name
        "8s"      # short name
        "12s"     # unit
        "40x"     # ? (40 bytes for ACC, 32 bytes for acti)
    )

    def __init__(self, _f, meta_ptr, prev_meta_ptr, next_meta_ptr, data_ptr, data_len,
                 dtype, freq, shift, mul, scale, dec,
                 name, short_name, unit):

        self._f = _f
        self.meta_ptr = meta_ptr
        self._data = None

        (self.prev_meta_ptr, self.next_meta_ptr, self.data_ptr, self.data_len,
        self.dtype, self.freq,
        self.shift, self.mul, self.scale, self.dec,
        self.name, self.short_name, self.unit) = prev_meta_ptr, next_meta_ptr, data_ptr, data_len,\
                                                 dtype, freq,\
                                                 shift, mul, scale, dec,\
                                                 name, short_name, unit

    @classmethod
    def fromfile(cls, _f, meta_ptr):
        # type: (str, int) -> ldChan
        """Parses and stores the header information of an ld channel in a ld file
        """
        with open(_f, 'rb') as f:
            f.seek(meta_ptr)

            (prev_meta_ptr, next_meta_ptr, data_ptr, data_len, _,
             dtype_a, dtype, freq, shift, mul, scale, dec,
             name, short_name, unit) = struct.unpack(ldChan.fmt, f.read(struct.calcsize(ldChan.fmt)))

        name, short_name, unit = map(decode_string, [name, short_name, unit])

        def safe_get(lst, idx):
            if idx < 0 or idx >= len(lst):
                return None
            return lst[idx]

        if dtype_a in [0x07]:
            dtype = safe_get([None, np.float16, None, np.float32], dtype - 1)
        elif dtype_a in [0, 0x03, 0x05]:
            dtype = safe_get([None, np.int16, None, np.int32], dtype - 1)
        else:
            dtype = None

        return cls(_f, meta_ptr, prev_meta_ptr, next_meta_ptr, data_ptr, data_len,
                   dtype, freq, shift, mul, scale, dec,name, short_name, unit)
    @property
    def data(self):
        # type: () -> np.array
        """ Read the data words of the channel
        """
        if self.dtype is None:
            raise ValueError(f'Channel {self.name} has unknown data type')
        if self._data is None:
            # jump to data and read
            with open(self._f, 'rb') as f:
                f.seek(self.data_ptr)
                try:
                    self._data = np.fromfile(f,
                                            count=self.data_len, dtype=self.dtype)

                    self._data = (self._data/self.scale * pow(10., -self.dec) + self.shift) * self.mul

                    if len(self._data) != self.data_len:
                        raise ValueError("Not all data read!")

                except ValueError as v:
                    print(v, self.name, self.freq,
                          hex(self.data_ptr), hex(self.data_len),
                          hex(len(self._data)),hex(f.tell()))
                    # raise v
        return self._data

def decode_string(bytes):
    # type: (bytes) -> str
    """decode the bytes and remove trailing zeros
    """
    try:
        return bytes.decode('ascii').strip().rstrip('\0').strip()
    except Exception as e:
        print("Could not decode string: %s - %s"%(e, bytes))
        return ""
        # raise e

def read_channels(f_, meta_ptr):
    # type: (str, int) -> list
    """ Read channel data inside ld file

    Cycles through the channels inside an ld file,
     starting with the one where meta_ptr points to.
     Returns a list of ldchan objects.
    """
    chans = []
    while meta_ptr:
        chan_ = ldChan.fromfile(f_, meta_ptr)
        chans.append(chan_)
        meta_ptr = chan_.next_meta_ptr
    return chans


def read_ldfile(f_):
    # type: (str) -> (ldHead, list)
    """ Read an ld file, return header and list of channels
    """
    head_ = ldHead.fromfile(open(f_,'rb'))
    chans = read_channels(f_, head_.meta_ptr)
    return head_, chans


if __name__ == '__main__':
    """ Small test of the parser.
    
    Decodes all ld files in the directory. For each file, creates 
    a plot for data with the same sample frequency.  
    """

    if len(sys.argv)!=2:
        print("Usage: ldparser.py /some/path/")
        exit(1)

    for f in glob.glob('%s/*.ld'%sys.argv[1]):

        l = ldData.fromfile(f)

        df = l.to_dataframe()
        df.to_csv('sample.csv', index=False)
        print("Data saved to sample.csv")
