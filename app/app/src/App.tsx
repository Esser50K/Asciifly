import React, { FormEvent, useEffect, useRef, useState } from 'react';
import './App.css';

enum PlayerState {
  Empty,
  Loading,
  Loaded,
  Playing
}

function App() {
  const imgInput = useRef(null)
  const audioPlayer = useRef(null)
  const [ytUrl, setYtUrl] = useState("")
  const [audioUrl, setAudioUrl] = useState("")
  const [playerContent, setPlayerContent] = useState("")
  const [fileIsHovering, setFileIsHovering] = useState(false)
  const [wrongFileType, setWrongFileType] = useState(false)
  const [loadingIdx, setLoadingIdx] = useState(0)
  const [playerState, setPlayerState] = useState(PlayerState.Empty)
  const [lineLength, setLineLength] = useState(0)
  const [nLines, setNLines] = useState(0)
  const [lineHeight, setLineHeight] = useState(0)
  const [fontSize, setFontSize] = useState(0)
  const [windowSize, setWindowSize] = useState(0)
  const [userInteracted, setUserInteracted] = useState(false)

  const supportedImageTypes = ["image/jpeg", "image/jpg", "image/png"]
  const loading = [
    `    __                      __ _                  \n   / /   ____   ____ _ ____/ /(_)____   ____ _    \n  / /   / __ \\ / __ \`// __  // // __ \\ / __ \`/    \n / /___/ /_/ // /_/ // /_/ // // / / // /_/ /  _  \n/_____/\\____/ \\__,_/ \\__,_//_//_/ /_/ \\__, /  (_) \n                                     /____/       `,
    `    __                      __ _                       \n   / /   ____   ____ _ ____/ /(_)____   ____ _         \n  / /   / __ \\ / __ \`// __  // // __ \\ / __ \`/         \n / /___/ /_/ // /_/ // /_/ // // / / // /_/ /  _    _  \n/_____/\\____/ \\__,_/ \\__,_//_//_/ /_/ \\__, /  (_)  (_) \n                                     /____/            `,
    `    __                      __ _                            \n   / /   ____   ____ _ ____/ /(_)____   ____ _              \n  / /   / __ \\ / __ \`// __  // // __ \\ / __ \`/              \n / /___/ /_/ // /_/ // /_/ // // / / // /_/ /  _    _    _  \n/_____/\\____/ \\__,_/ \\__,_//_//_/ /_/ \\__, /  (_)  (_)  (_) \n                                     /____/                 \n`
  ]

  const isHttps = () => {
    return window.location.protocol.startsWith("https")
  }

  const getUrl = () => {
    if (window.location.host.startsWith("localhost")) {
      return window.location.protocol + "//" + window.location.host.split(":")[0] + ":8080"
    }

    return window.location.protocol + "//" + window.location.host
  }

  const loadYT = (ytUrl: string, mute: boolean) => {
    /* @ts-ignore */
    if (!window.YT) { // If not, load the script asynchronously
      // @ts-ignore onYouTubeIframeAPIReady will load the video after the script is loaded
      window.onYouTubeIframeAPIReady = () => loadVideo(ytUrl, mute);
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }

  const loadVideo = (ytUrl: string, mute: boolean) => {
    const videoId = ytUrl.split("v=")[1]

    // @ts-ignore the Player object is created uniquely based on the id in props
    const player = new window.YT.Player('youtube-player', {
      videoId: videoId,
      width: '0',
      height: '0',
      muted: true,
      events: {
        onReady: (e: any) => {
          startPlayingFromURL(ytUrl)
          if (mute) {
            e.target.mute()
          }
          // @ts-ignore
          window.YTPlayer = e.target;
        },
        onError: (e: any) => console.error("yt player error:", e)
      },
    });
  }

  useEffect(() => {
    if (imgInput.current === null) {
      return
    }

    const div = imgInput.current! as HTMLDivElement
    div.addEventListener('dragenter', handleDragIn)
    div.addEventListener('dragleave', handleDragOut)
    div.addEventListener('dragover', handleDrag)
    div.addEventListener('drop', handleDrop)

    const setSize = () => { setWindowSize(window.innerWidth) }
    window.addEventListener('resize', setSize)
    if (window.location.pathname === "/watch" && window.location.search !== "") {
      new URLSearchParams(window.location.search).forEach((v, k) => {
        if (k !== "v") {
          return
        }

        scrollDown()
        window.addEventListener('click', () => {
          setUserInteracted(true);

          // @ts-ignore
          if (window.YTPlayer && window.YTPlayer.isMuted()) {
            // @ts-ignore
            window.YTPlayer.unMute();
          }
        })
        setPlayerState(PlayerState.Loading)
        loadYT("https://www.youtube.com/watch?v=" + v, true);
      })
    }

    return () => {
      div.removeEventListener('dragenter', handleDragIn)
      div.removeEventListener('dragleave', handleDragOut)
      div.removeEventListener('dragover', handleDrag)
      div.removeEventListener('drop', handleDrop)
      window.removeEventListener('resize', setSize)
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
    setWrongFileType(false)
    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      if (!supportedImageTypes.includes(e.dataTransfer.items[0].type)) {
        setPlayerState(PlayerState.Empty)
        return
      }

      setPlayerState(PlayerState.Loading)

      const arrBuffer = await e.dataTransfer?.items[0].getAsFile()?.arrayBuffer()
      if (arrBuffer === undefined)
        return

      const base64String = window.btoa(new Uint8Array(arrBuffer).reduce(function (data, byte) {
        return data + String.fromCharCode(byte);
      }, ''));
      const resp = await fetch(getUrl() + "/img", { method: "POST", body: base64String })
      if (resp.status !== 200) {
        console.error("error uploading image:", await resp.text())
        alert("error processing image")
      }

      const decoded = await resp.json()
      setPlayerState(PlayerState.Playing)
      setPlayerContent(decoded.img)
      setLineLength(decoded.width)
      setNLines(decoded.height)
      scrollDown()
    }
  }

  const scrollDown = () => {
    const scrollingElement = (document.scrollingElement || document.body);
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
  }

  const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files ? e.target.files[0] : null;
    if (f === null) {
      return;
    }

    setPlayerState(PlayerState.Loading);
    const base64String = window.btoa(new Uint8Array(await f.arrayBuffer()).reduce(function (data, byte) {
      return data + String.fromCharCode(byte);
    }, ''));
    const resp = await fetch(getUrl() + "/img", { method: "POST", body: base64String })
    if (resp.status !== 200) {
      console.error("error uploading image:", await resp.text())
      alert("error processing image")
    }

    const decoded = await resp.json()
    setPlayerContent("")
    setPlayerState(PlayerState.Playing)

    setPlayerContent(decoded.img)
    setLineLength(decoded.width)
    setNLines(decoded.height)
    scrollDown()
  }

  const onYTUrlChange = (url: string) => {
    setYtUrl(url)
  }

  const onYTUrlSubmit = (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPlayerState(PlayerState.Loading)
    loadYT(ytUrl, false)
  }

  const startPlayingFromURL = (ytUrl: string) => {
    const ws = new WebSocket(getUrl().replace(window.location.protocol + "//", (isHttps() ? "wss://" : "ws://")) + "/vid")
    //const ws = new WebSocket("wss://www.asciifly.com/vid")
    var firstFrame = false
    var scrolledDown = false
    ws.onopen = () => {
      ws.send(JSON.stringify({ url: ytUrl }))
      // @ts-ignore
      window.YTPlayer.playVideo()
    }
    ws.onerror = () => {
      alert("error processing image")
      setPlayerState(PlayerState.Empty)
    }
    ws.onclose = () => {
      if (!firstFrame) {
        alert("error processing image")
      }
      setPlayerState(PlayerState.Empty)
    }
    ws.onmessage = async (msg: MessageEvent) => {
      const decoded = JSON.parse(msg.data);
      setLineLength(decoded.width)
      setNLines(decoded.height)
      setPlayerContent(decoded.frame)
      if (firstFrame && !scrolledDown) {
        scrollDown()
        scrolledDown = true
      }
      if (!firstFrame) {
        firstFrame = true
        setPlayerState(PlayerState.Playing)
      }

    }
  }

  useEffect(() => {
    if (playerState === PlayerState.Loading) {
      setLoadingAnim()
      return
    }
  }, [playerState, loadingIdx])

  const setLoadingAnim = async () => {
    setPlayerContent(loading[loadingIdx])
    await new Promise((resolve => setTimeout(resolve, 200)))
    setLoadingIdx((loadingIdx + 1) % loading.length)
  }

  const adjustPlayerSize = () => {
    if (nLines === 0 || lineLength === 0) {
      return
    }

    const windowPortion = 0.9

    let newLineHeight = 0
    let newFontSize = 0
    const greaterWidth = window.innerWidth > window.innerHeight
    if (greaterWidth) {
      // this is the character ratio of a base monospace font
      const characterRatio = 5 / 3
      const ratio = lineLength / nLines
      newLineHeight = ((window.innerHeight / nLines)) * windowPortion
      newFontSize = (((window.innerHeight * ratio) / lineLength) * characterRatio) * windowPortion

    } else {
      const characterRatio = 3 / 5
      const ratio = nLines / lineLength
      newFontSize = ((window.innerWidth) / lineLength) * windowPortion
      newLineHeight = (((window.innerHeight * ratio) / nLines) * characterRatio) * windowPortion
    }

    setLineHeight(newLineHeight)
    setFontSize(newFontSize)
  }

  useEffect(adjustPlayerSize, [windowSize])
  if (lineHeight === 0) {
    adjustPlayerSize()
  }

  // eslint-disable-next-line
  //const title = `     **                     ** ** ********  **         \r\n    ****                   \/\/ \/\/ \/**\/\/\/\/\/  \/**  **   **\r\n   **\/\/**    ******  *****  ** **\/**       \/** \/\/** ** \r\n  **  \/\/**  **\/\/\/\/  **\/\/\/**\/**\/**\/*******  \/**  \/\/***  \r\n **********\/\/***** \/**  \/\/ \/**\/**\/**\/\/\/\/   \/**   \/**   \r\n\/**\/\/\/\/\/\/** \/\/\/\/\/**\/**   **\/**\/**\/**       \/**   **    \r\n\/**     \/** ****** \/\/***** \/**\/**\/**       ***  **     \r\n\/\/      \/\/ \/\/\/\/\/\/   \/\/\/\/\/  \/\/ \/\/ \/\/       \/\/\/  \/\/      `
  //const title = `                                                                                   \n                                                                                   \n   ,---,                                                 ,---,.  ,--,              \n  \'  .\' \\                             ,--,    ,--,     ,\'  .\' |,--.\'|              \n /  ;    \'.                         ,--.\'|  ,--.\'|   ,---.\'   ||  | :              \n:  :       \\    .--.--.             |  |,   |  |,    |   |   .\':  : \'              \n:  |   /\\   \\  /  /    \'     ,---.  \`--\'_   \`--\'_    :   :  :  |  \' |        .--,  \n|  :  \' ;.   :|  :  /\`./    /     \\ ,\' ,\'|  ,\' ,\'|   :   |  |-,\'  | |      /_ ./|  \n|  |  ;/  \\   \\  :  ;_     /    / \' \'  | |  \'  | |   |   :  ;/||  | :   , \' , \' :  \n\'  :  | \\  \\ ,\'\\  \\    \`. .    \' /  |  | :  |  | :   |   |   .\'\'  : |__/___/ \\: |  \n|  |  \'  \'--\'   \`----.   \\\'   ; :__ \'  : |__\'  : |__ \'   :  \'  |  | \'.\'|.  \\  \' |  \n|  :  :        /  /\`--\'  /\'   | \'.\'||  | \'.\'|  | \'.\'||   |  |  ;  :    ; \\  ;   :  \n|  | ,\'       \'--\'.     / |   :    :;  :    ;  :    ;|   :  \\  |  ,   /   \\  \\  ;  \n\`--\'\'           \`--\'---\'   \\   \\  / |  ,   /|  ,   / |   | ,\'   ---\`-\'     :  \\  \\ \n                            \`----\'   ---\`-\'  ---\`-\'  \`----\'                 \\  \' ; \n                                                                             \`--\`  `
  //const title = ` ______                          ____    ___                \n/\\  _  \\                  __  __/\\  _\`\\ /\\_ \\               \n\\ \\ \\_\\ \\    ____    ___ /\\_\\/\\_\\ \\ \\_\\_\\//\\ \\    __  __    \n \\ \\  __ \\  /\',__\\  /\'___\\/\\ \\/\\ \\ \\  _\\/ \\ \\ \\  /\\ \\/\\ \\   \n  \\ \\ \\/\\ \\/\\__, \`\\/\\ \\__/\\ \\ \\ \\ \\ \\ \\/   \\_\\ \\_\\ \\ \\_\\ \\  \n   \\ \\_\\ \\_\\/\\____/\\ \\____\\\\ \\_\\ \\_\\ \\_\\   /\\____\\\\/\`____ \\ \n    \\/_/\\/_/\\/___/  \\/____/ \\/_/\\/_/\\/_/   \\/____/ \`/___/> \\\n                                                      /\\___/\n                                                      \\/__/ `
  const title = `_____/\\\\\\\\\\\\\\\\\\____________________________________________/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\__/\\\\\\\\\\\\__________________        \n ___/\\\\\\\\\\\\\\\\\\\\\\\\\\_________________________________________\\/\\\\\\///////////__\\////\\\\\\__________________       \n  __/\\\\\\/////////\\\\\\_____________________________/\\\\\\__/\\\\\\_\\/\\\\\\________________\\/\\\\\\_______/\\\\\\__/\\\\\\_      \n   _\\/\\\\\\_______\\/\\\\\\__/\\\\\\\\\\\\\\\\\\\\_____/\\\\\\\\\\\\\\\\_\\///__\\///__\\/\\\\\\\\\\\\\\\\\\\\\\________\\/\\\\\\______\\//\\\\\\/\\\\\\__     \n    _\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_\\/\\\\\\//////____/\\\\\\//////___/\\\\\\__/\\\\\\_\\/\\\\\\///////_________\\/\\\\\\_______\\//\\\\\\\\\\___    \n     _\\/\\\\\\/////////\\\\\\_\\/\\\\\\\\\\\\\\\\\\\\__/\\\\\\_________\\/\\\\\\_\\/\\\\\\_\\/\\\\\\________________\\/\\\\\\________\\//\\\\\\____   \n      _\\/\\\\\\_______\\/\\\\\\_\\////////\\\\\\_\\//\\\\\\________\\/\\\\\\_\\/\\\\\\_\\/\\\\\\________________\\/\\\\\\_____/\\\\_/\\\\\\_____  \n       _\\/\\\\\\_______\\/\\\\\\__/\\\\\\\\\\\\\\\\\\\\__\\///\\\\\\\\\\\\\\\\_\\/\\\\\\_\\/\\\\\\_\\/\\\\\\______________/\\\\\\\\\\\\\\\\\\_\\//\\\\\\\\/______ \n        _\\///________\\///__\\//////////_____\\////////__\\///__\\///__\\///______________\\/////////___\\////________`
  return (
    <div className="app">
      <header className="app-header">
        <pre>
          {title}
        </pre>
      </header>

      {playerState === PlayerState.Empty ?
        <div className="input-container">
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
        <div
          className="ascii-player"
          style={playerState === PlayerState.Loading ? { position: 'relative' } : {}}
        >
          <pre
            className={(playerState === PlayerState.Loading ? 'loading-screen' : '')}
            style={playerState === PlayerState.Loading ? {} : { lineHeight: lineHeight + "px", fontSize: fontSize + "px" }}
          >
            {playerContent}
          </pre>
        </div>
        {audioUrl !== "" && false ?
          <div className="audio-player">
            <video ref={audioPlayer}>
              <source src={audioUrl} type="audio/webm"></source>
            </video>
          </div> :
          null}
        <div id='youtube-player'></div>
      </div>
    </div>
  );
}

export default App;
