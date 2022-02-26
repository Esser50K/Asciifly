import os
import sys
import json
import base64
import logging
from flask import Flask, request, send_file
from flask_cors import CORS
from flask_sockets import Sockets
from geventwebsocket.websocket import WebSocket
from werkzeug.exceptions import BadRequest
from ascii_utils import asciify_image, asciify_yt_video, ascii_to_img, MAX_IMG_WIDTH

app = Flask(__name__)
CORS(app)
sockets = Sockets(app)

# Request Types
GET = "GET"
POST = "POST"
DELETE = "DELETE"

@app.route("/img", methods=[POST])
def upload():
    req = None
    try:
        req = json.loads(request.data)
    except Exception as e:
        return BadRequest("image was not encoded correctly")
    
    
    img_data = None
    try:
        img_data = base64.b64decode(req["img"])
    except Exception as e:
        return BadRequest("image was not encoded correctly")

    width = req["width"] if "width" in req.keys() else MAX_IMG_WIDTH
    ascii_img, width, height = asciify_image(img_data, req["width"])
    return json.dumps({'img': ascii_img, 'width': width, 'height': height})

@app.route("/img/download", methods=[POST])
def download():
    req = None
    try:
        req = json.loads(request.data)
    except Exception as e:
        return BadRequest("image was not encoded correctly")
        
    if "ascii_img" not in req.keys():
        return BadRequest("missing ascii_img param")

    ascii_img = req["ascii_img"]    
    img_name = ascii_to_img(ascii_img)
    result =  send_file(img_name)
    os.remove(img_name)
    return result

@sockets.route('/vid')
def get_updates(ws: WebSocket):
    try:
        video_info = ws.read_message()
        try:
            video_info = json.loads(video_info)
        except Exception as e:
            return BadRequest("video info was not encoded correctly")
    
        for frame, width, height in asciify_yt_video(video_info["url"], video_info["width"]):
            try:
                ws.send(json.dumps({'frame': frame, 'width': width, 'height': height}))
            except Exception as e:
                print("error sending frame:", e)
                return
    except Exception as e:
        logging.error("failed to decode message:", e)
    finally:
        ws.close()

if __name__ == '__main__':
    from gevent import monkey
    monkey.patch_all()

    try:
        from gevent import pywsgi
        from geventwebsocket.handler import WebSocketHandler

        print("Starting WebServer...")
        server = pywsgi.WSGIServer(('', 8080), app, handler_class=WebSocketHandler)
        server.serve_forever()

    except KeyboardInterrupt:
        sys.exit(0)
