FROM opencv_ubuntu:latest

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0

COPY requirements.txt /
RUN pip3 install -r /requirements.txt

COPY app /app
WORKDIR /app
RUN cython -3 painter.pyx

ENTRYPOINT [ "python3", "main.py" ]