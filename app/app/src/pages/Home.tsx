import React, { FormEvent, useEffect, useRef, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Toast from "../components/Toast";
import TextInput from "../components/TextInput";
import ImageInput from "../components/ImageInput";
import DonateButton from "../components/DonateButton";
import AsciiPlayer from "../components/AsciiPlayer";
import YTPlayer from "../components/YTPlayer";
import DownloadButton from "../components/DownloadButton";
import YoutubeVideoThumbnail from "../components/YoutubeVideoThumbnail";

function Home() {
    const [ytUrl, setYtUrl] = useState("")
    const [playerContent, setPlayerContent] = useState("")
    const [showPlayer, setShowPlayer] = useState(false)
    const [image, setImage] = useState()
    const [downloading, setDownloading] = useState(false)
    const [showToast, setShowToast] = useState(false)

    const featuredVideos = [
        {
            id: '1',
            props: {
                youtubeId: 'ASJ3iY0-qpQ',
                title: 'Turning videos into TEXT? 🔠',
                thumbnailImage: {
                    src: '/images/video-thumbnails/1.webp'
                },
                avatarImage: {
                    alt: 'Esser50k',
                    src: '/images/avatar/Esser50k.jpg'
                },
            }
        },
        {
            id: '2',
            props: {
                youtubeId: '5nnVj1i3Si4',
                title: 'BANNED from Twitter for being offensive',
                thumbnailImage: {
                    src: '/images/video-thumbnails/2.webp'
                },
                avatarImage: {
                    alt: 'Esser50k',
                    src: '/images/avatar/Esser50k.jpg'
                },
            }
        },
        {
            id: '3',
            props: {
                youtubeId: 'hId3HtBwPKo',
                title: 'Neighbour got Caught! 😱',
                thumbnailImage: {
                    src: '/images/video-thumbnails/3.webp'
                },
                avatarImage: {
                    alt: 'Esser50k',
                    src: '/images/avatar/Esser50k.jpg'
                },
            }
        },
        {
            id: '4',
            props: {
                youtubeId: 'CxMRcBD5sE8',
                title: 'Detecting Faces in Thousands of Videos FAST #python',
                thumbnailImage: {
                    src: '/images/video-thumbnails/4.webp'
                },
                avatarImage: {
                    alt: 'Esser50k',
                    src: '/images/avatar/Esser50k.jpg'
                },
            }
        },
        {
            id: '5',
            props: {
                youtubeId: 'if2q0XxCWQ0',
                title: '#Python Tips, Tricks and Quirks - Hackertalk',
                thumbnailImage: {
                    src: '/images/video-thumbnails/5.webp'
                },
                avatarImage: {
                    alt: 'Esser50k',
                    src: '/images/avatar/Esser50k.jpg'
                },
            }
        },
        {
            id: '6',
            props: {
                youtubeId: 'ASJ3iY0-qpQ',
                title: 'Exploiting my Cat for Fun and Profit #shorts',
                thumbnailImage: {
                    src: '/images/video-thumbnails/6.webp'
                },
                avatarImage: {
                    alt: 'Esser50k',
                    src: '/images/avatar/Esser50k.jpg'
                },
            }
        },
        {
            id: '7',
            props: {
                youtubeId: 'ASJ3iY0-qpQ',
                title: 'Smart Home Cat turns on Lights #shorts',
                thumbnailImage: {
                    src: '/images/video-thumbnails/7.webp'
                },
                avatarImage: {
                    alt: 'Esser50k',
                    src: '/images/avatar/Esser50k.jpg'
                },
            }
        },
        {
            id: '8',
            props: {
                youtubeId: 'ASJ3iY0-qpQ',
                title: 'Saving Sushi from Doom #shorts',
                thumbnailImage: {
                    src: '/images/video-thumbnails/8.webp'
                },
                avatarImage: {
                    alt: 'Esser50k',
                    src: '/images/avatar/Esser50k.jpg'
                },
            }
        }
    ]

    const isMobile = (): boolean => {
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
        const resp = await fetch(getUrl() + "/img/download", {
            method: "POST",
            body: JSON.stringify({ascii_img: playerContent})
        })
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
        const resp = await fetch(getUrl() + "/img", {
            method: "POST",
            body: JSON.stringify({img: base64String, width: window.innerWidth / 4})
        })
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

    return (
        <>
            <Grid container spacing={3}>
                {
                    featuredVideos.map(featuredVideo => (
                        <Grid key={featuredVideo.id} item xs={3}>
                            <YoutubeVideoThumbnail {...featuredVideo.props} />
                        </Grid>
                    ))
                }
            </Grid>
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

                        <div className="input-divider">
                            OR
                        </div>

                        <div className='donate-btn-wrap'>
                            <DonateButton></DonateButton>
                            <div className='donate-btn-text'>
                                To support my server costs <br/> and development efforts C:
                            </div>
                        </div>
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
        </>
    )
}

export default Home;