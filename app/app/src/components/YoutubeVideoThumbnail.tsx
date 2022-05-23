import {createStyles, makeStyles, Theme} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        thumbnailContainer: {
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': {
                transform: 'scale(1.05)',
            }
        },
        thumbnail: {
            backgroundSize: "cover",
            '&::before': {
                content: "''",
                display: "inline-block",
                width: "1px",
                height: 0,
                paddingBottom: "calc(100% / (16/9))",
            },
            marginBottom: theme.spacing(1.5),
        }
    })
)

interface YoutubeVideoThumbnailProps {
    youtubeId: string
    title: string
    thumbnailImage: {
        src: string
    }
    avatarImage: {
        alt: string
        src: string
    }
}

function YoutubeVideoThumbnail({ youtubeId, title, thumbnailImage, avatarImage }: YoutubeVideoThumbnailProps) {
    const classes = useStyles();
    const navigate = useNavigate();

    const navigateToWatch = () => navigate(`/watch?v=${youtubeId}`)

    return (
        <Box className={classes.thumbnailContainer} bgcolor="background.paper" onClick={navigateToWatch}>
            <Box className={classes.thumbnail} style={{backgroundImage: `url('${thumbnailImage.src}')`}} />
            <Grid container spacing={1}>
                <Grid item xs={2}>
                    <Avatar alt={avatarImage.alt} src={avatarImage.src} />
                </Grid>
                <Grid item xs={10}>
                    <Typography variant="subtitle2" color="textPrimary">
                        { title }
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

export default YoutubeVideoThumbnail;