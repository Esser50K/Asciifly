FROM opencv_ubuntu:latest

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    gcc python3-dev

RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && dpkg -i google-chrome*.deb || true
RUN apt-get --fix-broken install -y
RUN sed -i "s/google-chrome-stable/google-chrome-stable --no-sandbox/g" /usr/share/applications/google-chrome.desktop

COPY requirements.txt /
RUN pip3 install -r /requirements.txt

COPY app /app
WORKDIR /app
RUN cython -3 encoder.pyx

ENTRYPOINT [ "python3", "main.py" ]