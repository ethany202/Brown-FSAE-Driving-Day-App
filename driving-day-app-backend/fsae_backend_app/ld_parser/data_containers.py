import datetime
import struct
from .file_utils import decode_string, read_ldfile


class ldData(object):
    """Class to represent and manage ld file data including header and channels."""

    def __init__(self, head, channs):
        self.head = head
        self.channs = channs

    def __getitem__(self, item):
        if not isinstance(item, int):
            col = [n for n, x in enumerate(self.channs) if x.name == item]
            if len(col) != 1:
                raise Exception("Could not get column", item, col)
            item = col[0]
        return self.channs[item]

    def __iter__(self):
        return iter([x.name for x in self.channs])

    def to_dict(self):
        """
        Convert ldData to a dictionary for tabular representation.

        Returns:
            dict: A dictionary containing the channel data.
        """
        data_dict = {}

        for chann in self.channs:
            print("Parsing channel:", chann.name)
            try:
                chann_data = chann.data
                if chann_data is not None:
                    data_dict[chann.name] = chann_data
            except Exception as e:
                print(f"Error parsing {chann.name}: {e}")

        # Ensure all columns have the same length by padding with None
        max_length = max(len(v) for v in data_dict.values())
        for key, value in data_dict.items():
            if len(value) < max_length:
                value.extend([None] * (max_length - len(value)))

        return data_dict

    @classmethod
    def fromfile(cls, f):
        return cls(*read_ldfile(f))


class ldChan(object):
    """Class to represent a channel within an ld file."""

    fmt = '<IIIIHHHHhhhh32s8s12s40x'

    def __init__(self, _f, meta_ptr, prev_meta_ptr, next_meta_ptr, data_ptr, data_len,
                 dtype, freq, shift, mul, scale, dec, name, short_name, unit):
        self._f = _f
        self.meta_ptr = meta_ptr
        self._data = None

        (self.prev_meta_ptr, self.next_meta_ptr, self.data_ptr, self.data_len,
         self.dtype, self.freq, self.shift, self.mul, self.scale, self.dec,
         self.name, self.short_name, self.unit) = (
            prev_meta_ptr, next_meta_ptr, data_ptr, data_len,
            dtype, freq, shift, mul, scale, dec,
            name, short_name, unit
        )

    @classmethod
    def fromfile(cls, _f, meta_ptr):
        with open(_f, 'rb') as f:
            f.seek(meta_ptr)
            (prev_meta_ptr, next_meta_ptr, data_ptr, data_len, _,
             dtype, freq, shift, mul, scale, dec,
             name, short_name, unit) = struct.unpack(
                ldChan.fmt, f.read(struct.calcsize(ldChan.fmt))
            )

        name, short_name, unit = map(decode_string, [name, short_name, unit])

        # Map dtype to struct format strings
        dtype_map = {0x01: 'h', 0x03: 'i', 0x07: 'f'}  # int16, int32, float32
        dtype_format = dtype_map.get(dtype, None)
        if dtype_format is None:
            raise ValueError(f"Unsupported dtype {dtype}")

        return cls(_f, meta_ptr, prev_meta_ptr, next_meta_ptr, data_ptr, data_len,
                   dtype_format, freq, shift, mul, scale, dec, name, short_name, unit)

    @property
    def data(self):
        """
        Retrieve the channel data.
        Reads the data from the ld file on demand, applies scaling, shifting,
        and multiplication factors, and returns the processed data as a list.
        """
        if self.dtype is None:
            raise ValueError(f'Channel {self.name} has unknown data type')

        if self._data is None:
            with open(self._f, 'rb') as f:
                f.seek(self.data_ptr)
                try:
                    raw_data = f.read(self.data_len * struct.calcsize(self.dtype))
                    self._data = list(struct.unpack(f"{self.data_len}{self.dtype}", raw_data))

                    # Apply scaling, shifting, and multiplication
                    self._data = [
                        ((value / self.scale) * pow(10., -self.dec) + self.shift) * self.mul
                        for value in self._data
                    ]

                except Exception as e:
                    print(f"Error reading data for channel {self.name}: {e}")

        return self._data


class ldEvent(object):
    """Class to represent an event within an ld file."""

    fmt = '<64s64s1024sH'

    def __init__(self, name, session, comment, venue_ptr, venue):
        self.name = name
        self.session = session
        self.comment = comment
        self.venue_ptr = venue_ptr
        self.venue = venue

    @classmethod
    def fromfile(cls, f):
        name, session, comment, venue_ptr = struct.unpack(
            ldEvent.fmt, f.read(struct.calcsize(ldEvent.fmt)))
        name, session, comment = map(decode_string, [name, session, comment])

        venue = None
        if venue_ptr > 0:
            f.seek(venue_ptr)
            venue = ldVenue.fromfile(f)

        return cls(name, session, comment, venue_ptr, venue)


class ldVenue(object):
    """Class to represent a venue within an ld file."""

    fmt = '<64s1034xH'

    def __init__(self, name, vehicle_ptr, vehicle):
        self.name = name
        self.vehicle_ptr = vehicle_ptr
        self.vehicle = vehicle

    @classmethod
    def fromfile(cls, f):
        name, vehicle_ptr = struct.unpack(
            ldVenue.fmt, f.read(struct.calcsize(ldVenue.fmt)))

        vehicle = None
        if vehicle_ptr > 0:
            f.seek(vehicle_ptr)
            vehicle = ldVehicle.fromfile(f)
        return cls(decode_string(name), vehicle_ptr, vehicle)


class ldHead(object):
    """Class to represent the header of an ld file."""

    fmt = '<' + (
        "I4xII20xI24xHHHI8sHHI4x16s16x16s16x64s64s64x64s64x1024xI66x64s126x"
    )

    def __init__(self, meta_ptr, data_ptr, event_ptr, event, driver, vehicleid, venue, datetime, short_comment):
        self.meta_ptr = meta_ptr
        self.data_ptr = data_ptr
        self.event_ptr = event_ptr
        self.event = event
        self.driver = driver
        self.vehicleid = vehicleid
        self.venue = venue
        self.datetime = datetime
        self.short_comment = short_comment

    @classmethod
    def fromfile(cls, f):
        (_, meta_ptr, data_ptr, event_ptr, _, _, _, _, _, _,
         _, _, _, date, time, driver, vehicleid, venue, _, short_comment) = struct.unpack(
            ldHead.fmt, f.read(struct.calcsize(ldHead.fmt)))

        date, time, driver, vehicleid, venue, short_comment = map(
            decode_string, [date, time, driver, vehicleid, venue, short_comment])

        try:
            _datetime = datetime.datetime.strptime(
                f'{date} {time}', '%d/%m/%Y %H:%M:%S')
        except ValueError:
            _datetime = datetime.datetime.strptime(
                f'{date} {time}', '%d/%m/%Y %H:%M')

        event = None
        if event_ptr > 0:
            f.seek(event_ptr)
            event = ldEvent.fromfile(f)
        return cls(meta_ptr, data_ptr, event_ptr, event, driver, vehicleid, venue, _datetime, short_comment)
