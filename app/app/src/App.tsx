import React, { FormEvent, useEffect, useRef, useState } from 'react';
import './App.css';
import Toast from './components/Toast';

enum PlayerState {
  Empty,
  Loading,
  Loaded,
  Playing
}

function App() {
  const imgInput = useRef(null)
  const [ytUrl, setYtUrl] = useState("")
  const [playerContent, setPlayerContent] = useState("")
  const [fileIsHovering, setFileIsHovering] = useState(false)
  const [wrongFileType, setWrongFileType] = useState(false)
  const [loadingIdx, setLoadingIdx] = useState(0)
  const [playerState, setPlayerState] = useState(PlayerState.Empty)
  const [lineLength, setLineLength] = useState(0)
  const [nLines, setNLines] = useState(0)
  const [lineHeight, setLineHeight] = useState(0)
  const [fontSize, setFontSize] = useState(0)
  const [windowSize, setWindowSize] = useState([0, 0])
  const [showToast, setShowToast] = useState(false)

  const supportedImageTypes = ["image/jpeg", "image/jpg", "image/png"]
  const loading = [
    `    __                      __ _                  \n   / /   ____   ____ _ ____/ /(_)____   ____ _    \n  / /   / __ \\ / __ \`// __  // // __ \\ / __ \`/    \n / /___/ /_/ // /_/ // /_/ // // / / // /_/ /  _  \n/_____/\\____/ \\__,_/ \\__,_//_//_/ /_/ \\__, /  (_) \n                                     /____/       `,
    `    __                      __ _                       \n   / /   ____   ____ _ ____/ /(_)____   ____ _         \n  / /   / __ \\ / __ \`// __  // // __ \\ / __ \`/         \n / /___/ /_/ // /_/ // /_/ // // / / // /_/ /  _    _  \n/_____/\\____/ \\__,_/ \\__,_//_//_/ /_/ \\__, /  (_)  (_) \n                                     /____/            `,
    `    __                      __ _                            \n   / /   ____   ____ _ ____/ /(_)____   ____ _              \n  / /   / __ \\ / __ \`// __  // // __ \\ / __ \`/              \n / /___/ /_/ // /_/ // /_/ // // / / // /_/ /  _    _    _  \n/_____/\\____/ \\__,_/ \\__,_//_//_/ /_/ \\__, /  (_)  (_)  (_) \n                                     /____/                 \n`
  ]

  const isHttps = (): boolean => {
    return window.location.protocol.startsWith("https")
  }

  const isMobile = (): boolean => {
    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substring(0, 4))) {
      return true;
    }

    return false;
  }

  const getUrl = () => {
    if (window.location.host.startsWith("localhost") || window.location.host.startsWith("192")) {
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
    console.info("LOADING VID")
    const videoId = ytUrl.split("v=")[1]

    // @ts-ignore the Player object is created uniquely based on the id in props
    const player = new window.YT.Player('youtube-player', {
      videoId: videoId,
      width: '0',
      height: '0',
      muted: true,
      events: {
        onReady: (e: any) => {
          if (mute) {
            e.target.mute()
          }

          //e.target.seekTo(0)
          //e.target.pauseVideo()
          // @ts-ignore
          window.YTPlayer = e.target;
          startPlayingFromURL(ytUrl)
        },
        onError: (e: any) => console.error("yt player error:", e)
      },
    });
  }

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
      const resp = await fetch(getUrl() + "/img", { method: "POST", body: JSON.stringify({ img: base64String, width: window.innerWidth / 4 }) })
      if (resp.status !== 200) {
        console.error("error uploading image:", await resp.text())
        alert("error processing image")
        setPlayerState(PlayerState.Empty)
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
    const resp = await fetch(getUrl() + "/img", { method: "POST", body: JSON.stringify({ img: base64String, width: window.innerWidth / 4 }) })
    if (resp.status !== 200) {
      console.error("error uploading image:", await resp.text())
      alert("error processing image")
      setPlayerState(PlayerState.Empty)
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
      ws.send(JSON.stringify({ url: ytUrl, width: window.innerWidth / 6 }))
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
      if (!firstFrame) {
        setPlayerState(PlayerState.Playing)
        firstFrame = true
        setLineLength(decoded.width)
        setNLines(decoded.height)
        setPlayerContent(decoded.frame)
        return
      }

      setPlayerContent(decoded.frame)
      if (firstFrame && !scrolledDown) {
        scrollDown()
        scrolledDown = true
        // @ts-ignore
        window.YTPlayer.playVideo()
        console.info("PLAYED VIDEO")
      }
    }
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

    const setSize = () => { setWindowSize([window.innerWidth, window.innerHeight]) }
    window.addEventListener('resize', setSize)
    if (window.location.pathname === "/watch" && window.location.search !== "") {
      setShowToast(true);
      new URLSearchParams(window.location.search).forEach((v, k) => {
        if (k !== "v") {
          return
        }

        scrollDown()
        window.addEventListener('click', () => {
          // @ts-ignore
          if (window.YTPlayer && window.YTPlayer.isMuted()) {
            console.info("UNMUTED")
            // @ts-ignore
            window.YTPlayer.unMute();
            setShowToast(false);
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

    let newLineHeight = 0
    let newFontSize = 0

    // this is the character ratio of a base monospace font
    const characterRatio = 5 / 3
    const windowPortion = 0.9
    const ratio = lineLength / nLines
    const heightLimited = (lineLength / window.innerWidth) < (nLines / window.innerHeight)
    const limiter = heightLimited ? window.innerHeight : window.innerWidth
    if (limiter === window.innerHeight) {
      newLineHeight = (limiter / nLines) * windowPortion
      newFontSize = (((limiter * ratio) / lineLength) * characterRatio) * windowPortion
    } else {
      newFontSize = ((limiter / lineLength) * characterRatio) * windowPortion
      newLineHeight = ((limiter * (1 / ratio)) / nLines) * windowPortion
    }

    if (isMobile()) {
      const adjustedNewLineHeight = (newLineHeight | 0)
      const adjustedNewFontSize = newFontSize * (adjustedNewLineHeight / newLineHeight)
      newLineHeight = adjustedNewLineHeight
      newFontSize = adjustedNewFontSize
      if (newLineHeight < 1) {
        newLineHeight = 1
        newFontSize = characterRatio
      }
    }

    setLineHeight(newLineHeight)
    setFontSize(newFontSize)
  }

  useEffect(() => { adjustPlayerSize() }, [windowSize])
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
        <div>
          <pre>
            {title}
          </pre>
          <p className='description'>
            a tool that transforms images and youtube videos into ascii art on the fly
          </p>
        </div>
      </header>
      <div className='description'>
      </div>
      {showToast ? <Toast text={isMobile() ? "tap" : "click" + " to unmute"}></Toast> : null}
      {playerState === PlayerState.Empty ?
        <div className="input-container">
          <div className="yt-url-input-container">
            <form className="yt-url-input-form" onSubmit={(e) => { onYTUrlSubmit(e) }}>
              <label className="yt-url-input-label" htmlFor="yt-url-input-input">paste a Youtube URL to asciify it on the fly</label>
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
                    : "Click to select or drag an image on this box to asciify it"}
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
        <div id='youtube-player'></div>
      </div>
    </div>
  );
}

export default App;
