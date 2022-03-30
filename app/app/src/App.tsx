import React, { FormEvent, useEffect, useRef, useState } from 'react';
import './App.css';
import Toast from './components/Toast';
import AsciiPlayer from './components/AsciiPlayer';
import YTPlayer from './components/YTPlayer';
import TextInput from './components/TextInput';
import ImageInput from './components/ImageInput';
import DownloadButton from './components/DownloadButton';


function App() {
  const [ytUrl, setYtUrl] = useState("")
  const [playerContent, setPlayerContent] = useState("")
  const [showPlayer, setShowPlayer] = useState(false)
  const [image, setImage] = useState()
  const [downloading, setDownloading] = useState(false)
  const [showToast, setShowToast] = useState(false)

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

  const hashCode = (input: string) => {
    var hash = 0, i, chr;
    if (input.length === 0) return hash;
    for (i = 0; i < input.length; i++) {
      chr = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  const downloadImage = async () => {
    setDownloading(true);
    const resp = await fetch(getUrl() + "/img/download", { method: "POST", body: JSON.stringify({ ascii_img: playerContent }) })
    if (resp.status !== 200) {
      console.error("error downloading image:", await resp.text())
      alert("error downloading image")
      setDownloading(false);
    }

    downloadFile(await resp.blob())
    setDownloading(false);
  }

  const downloadFile = (blob: Blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = (Math.abs(hashCode(playerContent))).toString() + '.png';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  const handleSubmitImage = async (e: File) => {
    setShowPlayer(true)

    const arrBuffer = await e.arrayBuffer()
    if (arrBuffer === undefined) {
      return
    }

    const base64String = window.btoa(new Uint8Array(arrBuffer).reduce(function (data, byte) {
      return data + String.fromCharCode(byte);
    }, ''));
    const resp = await fetch(getUrl() + "/img", { method: "POST", body: JSON.stringify({ img: base64String, width: window.innerWidth / 4 }) })
    if (resp.status !== 200) {
      console.error("error uploading image:", await resp.text())
      alert("error processing image")
      setShowPlayer(false)
    }

    const decoded = await resp.json()
    console.info(decoded)
    setImage(decoded)
    setPlayerContent(decoded.img)
    setShowPlayer(true)
    scrollDown()
  }

  const scrollDown = () => {
    const scrollingElement = (document.scrollingElement || document.body);
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
  }

  const onYTUrlChange = (url: string) => {
    setYtUrl(url)
  }

  const onYTUrlSubmit = (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setYtUrl(ytUrl)
    setShowPlayer(true)
    setShowToast(false)
  }

  useEffect(() => {
    if (window.location.pathname === "/watch" && window.location.search !== "") {
      setShowToast(true);
      new URLSearchParams(window.location.search).forEach((v, k) => {
        if (k !== "v") {
          return
        }

        scrollDown()
        window.addEventListener('click', () => {
          setShowToast(false);
        })
        setShowPlayer(true)
        setYtUrl("https://www.youtube.com/watch?v=" + v)
        setShowToast(true)
      })
    }
  }, [])

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
      {showToast ? <Toast text={(isMobile() ? "tap" : "click") + " to unmute"}></Toast> : null}
      {!showPlayer ?
        <div className="input-container">
          <div className="yt-url-input-container">
            <TextInput
              onChange={onYTUrlChange}
              onSubmit={onYTUrlSubmit}
            ></TextInput>

            <div className="input-divider">
              OR
            </div>

            <ImageInput
              onImageSubmit={handleSubmitImage}
            ></ImageInput>
          </div>
        </div> : null}

      <AsciiPlayer
        ytURL={ytUrl}
        image={image}
        show={showPlayer}
        onPlayerStart={scrollDown}
        onRepaint={setPlayerContent}
        isMobile={isMobile()}
      ></AsciiPlayer>
      <YTPlayer
        ytURL={ytUrl}
        mute={showToast}
      ></YTPlayer>

      {
        playerContent !== "" && showPlayer ?
          <div className='download-btn-wrap'>
            <DownloadButton
              downloading={downloading}
              onClick={downloadImage}
            ></DownloadButton>
          </div>
          : null
      }
    </div>
  );
}

export default App;
