#cython: language_level=3
import cv2
import time
import numpy as np
import youtube_dl

import pyximport
pyximport.install()
from painter import asciify, invert_chars

MAX_IMG_WIDTH = 600
MAX_VIDEO_WIDTH = 300

def invert_brightness():
    invert_chars()

def asciify_image(img_data: str, width=MAX_IMG_WIDTH) -> str:
    width = int(width)
    if width > MAX_IMG_WIDTH:
        width = MAX_IMG_WIDTH

    nparr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    
    ratio = width/img.shape[1]
    height = int(img.shape[0]*ratio)

    frame = cv2.resize(img, (width, height))
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    return asciify(frame, width, height), width, height

def asciify_yt_video(yt_url: str, width=MAX_VIDEO_WIDTH):
    width = int(width)
    if width > MAX_VIDEO_WIDTH:
        width = MAX_VIDEO_WIDTH
        
    options = {}
    Y = youtube_dl.YoutubeDL(options)
    info_dict = Y.extract_info(yt_url, download=False)
    best_video_format = find_best_video_quality_url(info_dict)    
    
    try:
        video = cv2.VideoCapture(best_video_format["url"])
        ok, frame = video.read()
        if not ok:
            print("could not extract frame from video")
            
        ratio = width/frame.shape[1]
        height = int(frame.shape[0]*ratio)
        
        frame_count = 0
        frames_per_ms = best_video_format["fps"]/1000
        start = time.perf_counter_ns()//1000000
        while True:
            ok, orig_frame = video.read()
            if not ok:
                break

            frame = cv2.resize(orig_frame, (width, height))
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            ascii_frame = asciify(frame, width, height)
            yield ascii_frame, width, height
            
            elapsed = (time.perf_counter_ns()//1000000) - start
            supposed_frame_count = frames_per_ms * elapsed
            if frame_count > supposed_frame_count:
                time.sleep((frame_count-supposed_frame_count)*(1/frames_per_ms)/1000)
            frame_count += 1
    except Exception as e:
        print("error streaming video:", e)

def find_best_video_quality_url(video_info: dict) -> dict:
    preferred_resolutions = [136, 144, 224, 240, 338]
    found_formats = {}
    for format in video_info["formats"]:
        if format["vcodec"] != "":
            codec = format["vcodec"]
            # height because it basically defines resolution. e.g. 640x480 -> 480p
            resolution = format["height"]
            fps = format["fps"]
            found_formats["%s_%s_%s" % (codec, resolution, fps)] = format
            
            if resolution == preferred_resolutions[0]:
                return format

    for resolution in preferred_resolutions[1:]:
        for format in found_formats.values():
            if resolution == format["height"]:
                return format
            
    raise Exception("no desired resolution found, found resolutions:", list(map(lambda x: x["height"], found_formats.values())))