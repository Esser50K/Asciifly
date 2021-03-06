#cython: language_level=3
import os
import cv2
import time
import numpy as np
import youtube_dl
from html2image import Html2Image
from opentelemetry import trace

import pyximport
pyximport.install()
from encoder import asciify

MIN_IMG_WIDTH = 150
MAX_IMG_WIDTH = 600
MIN_VIDEO_WIDTH = 120
MAX_VIDEO_WIDTH = 300
WATERMARK = "made with asciifly.com"
tracer = trace.get_tracer(__name__)


def invert_brightness():
    invert_chars()

def asciify_image(img_data: str, width=MAX_IMG_WIDTH) -> str:
    width = int(width)
    if width < MIN_IMG_WIDTH:
        width = MIN_IMG_WIDTH
    elif width > MAX_IMG_WIDTH:
        width = MAX_IMG_WIDTH
        
    with tracer.start_as_current_span("opencv-conversions"):
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        ratio = width/img.shape[1]
        height = int(img.shape[0]*ratio)

        frame = cv2.resize(img, (width, height))
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
    with tracer.start_as_current_span("asciify"):
        return asciify(frame, WATERMARK), width, height

def ascii_to_img(ascii_img: str, scale_factor=6) -> str:
    with tracer.start_as_current_span("ascii-to-img"):
        hti = Html2Image(custom_flags=["--no-sandbox", "--hide-scrollbars"])
        img_name = str(hash(ascii_img)) + ".png"
        ascii_lines = ascii_img.split("\n")
        img_width = len(ascii_lines[0])
        img_height = len(ascii_lines)
        
        # writing html to file avoids some hacks where
        # one could manipulate the input to execute a shell command
        tmp_html_name = img_name+".html"
        with open(tmp_html_name, "w") as tmp_html:
            html_page = _gen_html(ascii_img, scale_factor)
            if "script" in html_page:
                raise Exception("script tag attempt detected:\n", html_page)
            tmp_html.write(html_page)
        hti.screenshot(html_file=tmp_html_name, size=(img_width*scale_factor, img_height*scale_factor), save_as=img_name)
        os.remove(tmp_html_name)
        
        return img_name

def _gen_html(ascii_img: str, scale_factor: int) -> str:
    return \
"""
<body style="margin: 0px; width: min-content;">
<pre style="background-color: #282c34; color:#fff; line-height: %dpx; font-size: %f;">
%s
</pre>
<div style="position:fixed; bottom: 0; right: 0;background-color: #fff; font-size:1vw; padding: 5px; border: solid #282c34 5px">
<pre style="margin:0px">
made with asciifly.com
</pre>
</div>
</body>
""" % (scale_factor, scale_factor*(5/3), ascii_img)

def asciify_yt_video(yt_url: str, width=MAX_VIDEO_WIDTH):
    width = int(width)
    if width < MIN_VIDEO_WIDTH:
        width = MIN_VIDEO_WIDTH
    if width > MAX_VIDEO_WIDTH:
        width = MAX_VIDEO_WIDTH
        
    with tracer.start_as_current_span("find-best-video"):
        options = {}
        Y = youtube_dl.YoutubeDL(options)
        info_dict = Y.extract_info(yt_url, download=False)
        best_video_format = find_best_video_quality_url(info_dict)    
    
    try:
        with tracer.start_as_current_span("read-first-frame"):
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

            ascii_frame = asciify(frame, WATERMARK)
            yield ascii_frame, width, height
            
            elapsed = (time.perf_counter_ns()//1000000) - start
            supposed_frame_count = frames_per_ms * elapsed
            if frame_count > supposed_frame_count:
                time.sleep((frame_count-supposed_frame_count)*(1/frames_per_ms)/1000)
            frame_count += 1
    except Exception as e:
        print("error streaming video:", e)

def find_best_video_quality_url(video_info: dict) -> dict:
    highest_allowed_resolution = 340
    found_formats = {}
    for format in video_info["formats"]:
        if format["vcodec"] != "":
            codec = format["vcodec"]
            # height because it basically defines resolution. e.g. 640x480 -> 480p
            resolution = format["height"]
            fps = format["fps"]
            found_formats["%s_%s_%s" % (codec, resolution, fps)] = format
    
    video_formats = [format for format in found_formats.values() if type(format["height"]) is int]
    sorted_formats = sorted(video_formats, key = lambda x: x["height"])
    if sorted_formats[0]["height"] > highest_allowed_resolution:
        raise Exception("no desired resolution found, found resolutions:", list(map(lambda x: x["height"], found_formats.values())))

    return sorted_formats[0]
            
    