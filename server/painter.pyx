import cython
from cpython cimport array
from functools import lru_cache
import time

characters = [' ', '.', ',', '\'', '"', '-', '~', ':', ';', '=', '!', '?', '*', '$', '#', '@']
char_range = int(255 / len(characters))

def invert_chars():
    global characters
    characters = characters[::-1]

@lru_cache
def get_char(val):
    return characters[min(int(val/char_range), len(characters)-1)]

@cython.boundscheck(False)
cpdef asciify(unsigned char [:, :] frame, int width, int height):
    cdef int x, y, idx
    cdef array.array[char] arr, template = array.array('B')

    height = frame.shape[0]
    width  = frame.shape[1]

    # array size is number of pixels plus \n for every line
    arr_size = (width*height) + height
    arr = array.clone(template, arr_size, False)
    for y in range(0, height):
        for x in range(0, width):
            idx = (y * (width+1)) + x
            arr[idx] = ord(get_char(frame[y, x]))
        arr[idx+1] = b'\n'

    return arr.tobytes().decode('utf-8')