import React from "react";
import Grid from "@material-ui/core/Grid";
import YoutubeVideoThumbnail from "../components/YoutubeVideoThumbnail";

function Home() {
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

    return (
        <Grid container spacing={3}>
            {
                featuredVideos.map(featuredVideo => (
                    <Grid key={featuredVideo.id} item xs={3}>
                        <YoutubeVideoThumbnail {...featuredVideo.props} />
                    </Grid>
                ))
            }
        </Grid>
    )
}

export default Home;