import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import Grid from "@material-ui/core/Grid/Grid";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AsciiPlayer from "../components/AsciiPlayer";
import YTPlayer from "../components/YTPlayer";
import DownloadButton from "../components/DownloadButton";
import {Theme} from "@material-ui/core";
import Toast from "../components/Toast";

function Watch() {
    const [searchParams] = useSearchParams();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const [playerContent, setPlayerContent] = useState("")
    const [muted, setMuted] = useState(true)
    const [image, setImage] = useState()
    const [downloading, setDownloading] = useState(false)

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
        // setShowPlayer(true)

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
            // setShowPlayer(false)
        }

        const decoded = await resp.json()
        console.info(decoded)
        setImage(decoded)
        setPlayerContent(decoded.img)
        // setShowPlayer(true)
    }

    useEffect(() => {
        setMuted(true)
    }, [])

    return (
        <>
            <Grid container>
                <Grid item xs={9}>
                    <AsciiPlayer
                        ytURL={`https://www.youtube.com/watch?v=${searchParams.get('v')}`}
                        image={image}
                        show={true}
                        onRepaint={setPlayerContent}
                        isMobile={isMobile}
                    />
                    <YTPlayer
                        ytURL={`https://www.youtube.com/watch?v=${searchParams.get('v')}`}
                        mute={muted}
                    />

                    {
                        playerContent !== "" &&
                            <div className='download-btn-wrap'>
                                <DownloadButton
                                    downloading={downloading}
                                    onClick={downloadImage}
                                />
                            </div>
                    }
                </Grid>
                <Grid item xs={3}>
                    video list
                </Grid>
            </Grid>
            {muted ? <Toast text={(isMobile ? "tap" : "click") + " to unmute"}/> : null}
        </>
    )
}

export default Watch;