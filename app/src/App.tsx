import React, { FormEvent, useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const imgInput = useRef(null)
  const [ytUrl, setYtUrl] = useState("")
  const [audioUrl, setAudioUrl] = useState("")
  const [playerContent, setPlayerContent] = useState("")
  const [fileIsHovering, setFileIsHovering] = useState(false)
  const [wrongFileType, setWrongFileType] = useState(false)
  const [lineLength, setLineLength] = useState(0)
  const [nLines, setNLines] = useState(0)

  const supportedImageTypes = ["image/jpeg", "image/jpg", "image/png"]

  useEffect(() => {
    const div = imgInput.current! as HTMLDivElement
    div.addEventListener('dragenter', handleDragIn)
    div.addEventListener('dragleave', handleDragOut)
    div.addEventListener('dragover', handleDrag)
    div.addEventListener('drop', handleDrop)

    return () => {
      div.removeEventListener('dragenter', handleDragIn)
      div.removeEventListener('dragleave', handleDragOut)
      div.removeEventListener('dragover', handleDrag)
      div.removeEventListener('drop', handleDrop)
    }
  }, [])

  let dragInCount = 0

  const handleDrag = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleDragIn = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragInCount++
    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setWrongFileType(false)
      setFileIsHovering(true)
      if (!supportedImageTypes.includes(e.dataTransfer.items[0].type)) {
        setWrongFileType(true)
      }
    }
  }
  const handleDragOut = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragInCount--
    if (dragInCount > 0)
      return

    setFileIsHovering(false);
    setWrongFileType(false)
  }
  const handleDrop = async (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setFileIsHovering(false)
    if (wrongFileType) {
      setWrongFileType(false)
      return
    }

    setWrongFileType(false)
    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      const scrollingElement = (document.scrollingElement || document.body);
      scrollingElement.scrollTop = scrollingElement.scrollHeight;

      const arrBuffer = await e.dataTransfer?.items[0].getAsFile()?.arrayBuffer()
      if (arrBuffer === undefined)
        return

      const base64String = window.btoa(new Uint8Array(arrBuffer).reduce(function (data, byte) {
        return data + String.fromCharCode(byte);
      }, ''));
      const resp = await fetch("http://127.0.0.1:8080/img", { method: "POST", body: base64String })
      if (resp.status !== 200) {
        console.error("error uploading image:", await resp.text())
      }

      const decoded = await resp.json()

      setPlayerContent(decoded.img)
      setLineLength(decoded.width)
      setNLines(decoded.height)
    }
  }

  const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files ? e.target.files[0] : null;
    if (f === null) {
      return;
    }

    const base64String = window.btoa(new Uint8Array(await f.arrayBuffer()).reduce(function (data, byte) {
      return data + String.fromCharCode(byte);
    }, ''));
    const resp = await fetch("http://127.0.0.1:8080/img", { method: "POST", body: base64String })
    if (resp.status !== 200) {
      console.error("error uploading image:", await resp.text())
    }

    const decoded = await resp.json()

    setPlayerContent(decoded.img)
    setLineLength(decoded.width)
    setNLines(decoded.height)
  }

  const onYTUrlChange = (url: string) => {
    console.log(url);
    setYtUrl(url)
  }

  const onYTUrlSubmit = (e: FormEvent) => {
    const scrollingElement = (document.scrollingElement || document.body);
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
    e.preventDefault()
    e.stopPropagation()

    const ws = new WebSocket("ws://127.0.0.1:8080/vid")
    var firstMsg = false
    ws.onopen = () => {
      ws.send(JSON.stringify({ url: ytUrl }))
    }
    ws.onmessage = (msg: MessageEvent) => {
      const decoded = JSON.parse(msg.data);
      if (!firstMsg) {
        firstMsg = true
        setAudioUrl(decoded.frame)
        return
      }

      setLineLength(decoded.width)
      setNLines(decoded.height)
      setPlayerContent(decoded.frame)
    }
  }

  // this is the character ratio of a base monospace font
  const characterRatio = 5 / 3
  const windowPortion = 1
  const ratio = lineLength / nLines
  const lineHeight = ((window.innerHeight / nLines)) * windowPortion
  const fontSize = (((window.innerHeight * ratio) / lineLength) * characterRatio) * windowPortion

  // eslint-disable-next-line
  const titel = `     **                     ** ** ********  **         \r\n    ****                   \/\/ \/\/ \/**\/\/\/\/\/  \/**  **   **\r\n   **\/\/**    ******  *****  ** **\/**       \/** \/\/** ** \r\n  **  \/\/**  **\/\/\/\/  **\/\/\/**\/**\/**\/*******  \/**  \/\/***  \r\n **********\/\/***** \/**  \/\/ \/**\/**\/**\/\/\/\/   \/**   \/**   \r\n\/**\/\/\/\/\/\/** \/\/\/\/\/**\/**   **\/**\/**\/**       \/**   **    \r\n\/**     \/** ****** \/\/***** \/**\/**\/**       ***  **     \r\n\/\/      \/\/ \/\/\/\/\/\/   \/\/\/\/\/  \/\/ \/\/ \/\/       \/\/\/  \/\/      `
  return (
    <div className="app">
      <header className="app-header">
        <pre>
          {titel}
        </pre>
      </header>

      {playerContent === "" ? <div className="input-container">
        <div className="yt-url-input-container">
          <form className="yt-url-input-form" onSubmit={(e) => { onYTUrlSubmit(e) }}>
            <label className="yt-url-input-label" htmlFor="yt-url-input-input">Paste Youtube URL here</label>
            <input id="yt-url-input-input" className="yt-url-input-input" type="text" onChange={(e) => onYTUrlChange(e.target.value)}></input>
          </form>

          <div className="input-divider">
            OR
          </div>

          <div className="img-input-container">

            <div ref={imgInput}
              className={"img-input-box " +
                (fileIsHovering ?
                  wrongFileType ? "img-input-with-wrong-file" : "img-input-with-file"
                  : "img-input-without-file")}
              style={{ cursor: 'pointer' }}
              onClick={() => document.getElementById("file-input")?.click()}>
              <input type="file"
                accept="image/png, image/jpeg"
                id="file-input"
                style={{ "display": "none" }}
                onChange={handleSelectImage}>
              </input>
              <div className="img-input-text">
                {fileIsHovering ?
                  wrongFileType ? "Unsupported file type" : "Drop the image now"
                  : "Click to select or drag an image on this box"}
              </div>
            </div>
          </div>
        </div>
      </div> : null}

      <div className="player-container">
        <pre
          style={{ lineHeight: lineHeight + "px", fontSize: fontSize + "px" }}
          className="ascii-player"
        >
          {playerContent}
        </pre>
        {audioUrl !== "" ?
          <div className="audio-player">
            <video autoPlay>
              <source src={audioUrl} type="audio/webm"></source>
            </video>
          </div> :
          null}
      </div>
    </div>
  );
}

export default App;
