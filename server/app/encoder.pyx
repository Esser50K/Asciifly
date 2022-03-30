import time
import cython
from functools import lru_cache
from libc.stdlib cimport malloc, free

characters = [' ', '.', ',', '\'', '"', '-', '~', ':', ';', '=', '!', '*', '?', '$', '#', '@']
char_range = int(255 / len(characters))

def invert_chars():
    global characters
    characters = characters[::-1]

@lru_cache
def get_char(val):
    return characters[min(int(val/char_range), len(characters)-1)]

@cython.boundscheck(False)
cpdef asciify(unsigned char [:, :] frame, watermark=''):
    cdef int x, y, idx

    height = frame.shape[0]
    width  = frame.shape[1]

    # array size is number of pixels plus \n for every line
    arr_size = (width*height) + height + 1
    cdef char *arr = <char *> malloc(arr_size * sizeof(char))
    for y in range(0, height):
        for x in range(0, width):
            idx = (y * (width+1)) + x
            arr[idx] = ord(get_char(frame[y, x]))
        arr[idx+1] = b'\n'
    
    # write watermark
    watermark_start_idx = arr_size - len(watermark) - 2
    for x in range(len(watermark)):
        arr[watermark_start_idx+x] = ord(watermark[x])

    arr[arr_size-1] = b'\x00'
    str_result = arr.decode('ascii')
    free(arr)
    return str_result
