import { useEffect, useState } from 'react';
import './AsciiPlayer.css';

export enum PlayerState {
    Empty,
    Loading,
    Loaded,
    Playing
}

interface Image {
    img: string
    width: number
    height: number
}

interface AsciiPlayerProps {
    show: boolean
    ytURL?: string
    image?: Image
    isMobile?: boolean

    onRepaint?: (content: string) => void
    onPlayerStart?: (content: string) => void
    onPlayerStateChange?: (state: PlayerState) => void
}

function AsciiPlayer(props: AsciiPlayerProps) {
    const [playerContent, setPlayerContent] = useState("")
    const [loadingIdx, setLoadingIdx] = useState(0)
    const [lineLength, setLineLength] = useState(0)
    const [nLines, setNLines] = useState(0)
    const [lineHeight, setLineHeight] = useState(0)
    const [fontSize, setFontSize] = useState(0)
    const [windowSize, setWindowSize] = useState([0, 0])
    const [playerState, setPlayerState] = useState(PlayerState.Empty)


    const loading = [
        `    __                      __ _                  \n   / /   ____   ____ _ ____/ /(_)____   ____ _    \n  / /   / __ \\ / __ \`// __  // // __ \\ / __ \`/    \n / /___/ /_/ // /_/ // /_/ // // / / // /_/ /  _  \n/_____/\\____/ \\__,_/ \\__,_//_//_/ /_/ \\__, /  (_) \n                                     /____/       `,
        `    __                      __ _                       \n   / /   ____   ____ _ ____/ /(_)____   ____ _         \n  / /   / __ \\ / __ \`// __  // // __ \\ / __ \`/         \n / /___/ /_/ // /_/ // /_/ // // / / // /_/ /  _    _  \n/_____/\\____/ \\__,_/ \\__,_//_//_/ /_/ \\__, /  (_)  (_) \n                                     /____/            `,
        `    __                      __ _                            \n   / /   ____   ____ _ ____/ /(_)____   ____ _              \n  / /   / __ \\ / __ \`// __  // // __ \\ / __ \`/              \n / /___/ /_/ // /_/ // /_/ // // / / // /_/ /  _    _    _  \n/_____/\\____/ \\__,_/ \\__,_//_//_/ /_/ \\__, /  (_)  (_)  (_) \n                                     /____/                 \n`
    ]

    const isHttps = (): boolean => {
        return window.location.protocol.startsWith("https")
    }

    const getUrl = () => {
        if (window.location.host.startsWith("localhost") || window.location.host.startsWith("192")) {
            return window.location.protocol + "//" + window.location.host.split(":")[0] + ":8080"
        }

        return window.location.protocol + "//" + window.location.host
    }

    const updatePlayerState = (state: PlayerState) => {
        setPlayerState(state);
        props.onPlayerStateChange && props.onPlayerStateChange(state)
    }

    const startPlayingFromURL = (ytUrl: string) => {
        const ws = new WebSocket(getUrl().replace(window.location.protocol + "//", (isHttps() ? "wss://" : "ws://")) + "/vid")
        //const ws = new WebSocket("wss://www.asciifly.com/vid")
        var firstFrame = false
        ws.onopen = () => {
            ws.send(JSON.stringify({ url: ytUrl, width: window.innerWidth / 6 }))
        }
        ws.onerror = () => {
            alert("error processing video")
            updatePlayerState(PlayerState.Empty)
        }
        ws.onclose = () => {
            if (!firstFrame) {
                alert("error processing video")
            }
            updatePlayerState(PlayerState.Empty)
        }
        ws.onmessage = async (msg: MessageEvent) => {
            const decoded = JSON.parse(msg.data);
            if (!firstFrame) {
                updatePlayerState(PlayerState.Playing)
                firstFrame = true
                setLineLength(decoded.width)
                setNLines(decoded.height)
                setPlayerContent(decoded.frame)
                props.onPlayerStart && props.onPlayerStart(decoded.frame)
                // @ts-ignore
                window.YTPlayer.playVideo()
                return
            }

            setPlayerContent(decoded.frame)
            props.onRepaint && props.onRepaint(decoded.frame)
        }
    }

    useEffect(() => {
        const setSize = () => { setWindowSize([window.innerWidth, window.innerHeight]) }
        window.addEventListener('resize', setSize)
        if (window.location.pathname === "/watch" && window.location.search !== "") {
            new URLSearchParams(window.location.search).forEach((v, k) => {
                if (k !== "v") {
                    return
                }

                window.addEventListener('click', () => {
                    // @ts-ignore
                    if (window.YTPlayer && window.YTPlayer.isMuted()) {
                        // @ts-ignore
                        window.YTPlayer.unMute();
                    }
                })

                updatePlayerState(PlayerState.Loading)
            })
        }

        return () => {
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

        if (props.isMobile) {
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
    useEffect(() => {
        if (!props.show || !props.ytURL || props.ytURL === "") {
            return
        }

        startPlayingFromURL(props.ytURL)
    }, [props.ytURL, props.show])

    useEffect(() => {
        if (!props.image) {
            return
        }

        setPlayerState(PlayerState.Playing)
        setPlayerContent(props.image.img)
        setLineLength(props.image.width)
        setNLines(props.image.height)
    }, [props.image])
    if (lineHeight === 0) {
        adjustPlayerSize()
    }

    return (props.show ?
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
        </div> : null
    );
}

export default AsciiPlayer;
