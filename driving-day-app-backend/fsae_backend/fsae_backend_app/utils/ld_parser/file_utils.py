import struct
import numpy as np

def decode_string(bytes):
    try:
        return bytes.decode('ascii').strip().rstrip('\0').strip()
    except Exception as e:
        print(f"Could not decode string: {e} - {bytes}")
        return ""

def read_channels(f_, meta_ptr):
    chans = []
    while meta_ptr:
        from .data_containers import ldChan
        chan_ = ldChan.fromfile(f_, meta_ptr)
        chans.append(chan_)
        meta_ptr = chan_.next_meta_ptr
    return chans

def read_ldfile(f_):
    from .data_containers import ldHead
    head_ = ldHead.fromfile(open(f_, 'rb'))
    chans = read_channels(f_, head_.meta_ptr)
    return head_, chans
