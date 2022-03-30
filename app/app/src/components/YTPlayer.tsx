import { useEffect, useState } from 'react';
import './DownloadButton.css';


interface YTPlayerProps {
    ytURL: string
    mute: boolean
}

function YTPlayer(props: YTPlayerProps) {
    const loadYT = (ytUrl: string, mute: boolean) => {
        /* @ts-ignore */
        if (!window.YT) { // If not, load the script asynchronously
            // @ts-ignore onYouTubeIframeAPIReady will load the video after the script is loaded
            window.onYouTubeIframeAPIReady = () => loadVideo(ytUrl, mute);
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';

            const firstScriptTag = document.getElementById('youtube-player');
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
        if (props.ytURL === "") {
            return;
        }

        loadYT(props.ytURL, props.mute);
    }, [props.ytURL])

    useEffect(() => {
        if (props.mute) {
            // @ts-ignore
            window.YTPlayer && window.YTPlayer.mute();
        } else {
            // @ts-ignore
            window.YTPlayer && window.YTPlayer.unMute();
        }
    }, [props.mute])

    return <div>
        <div id='youtube-player'></div>
    </div>
}

export default YTPlayer;
