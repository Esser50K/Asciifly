import {createStyles, makeStyles, Theme} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        thumbnail: {
            background: "url('/images/video-thumbnails/thumbnail.webp')",
            backgroundSize: "cover",
            '&::before': {
                content: "''",
                display: "inline-block",
                width: "1px",
                height: 0,
                paddingBottom: "calc(100% / (16/9))",
            },
            marginBottom: theme.spacing(1.5)
        }
    })
)

function YoutubeVideoThumbnail() {
    const classes = useStyles();

    return (
        <Box bgcolor="background.paper">
            <Box className={classes.thumbnail} />
            <Grid container spacing={1}>
                <Grid item xs={2}>
                    <Avatar alt="Remy Sharp" src="/images/avatar/Esser50k.jpg" />
                </Grid>
                <Grid item xs={10}>
                    <Typography variant="subtitle2" color="textPrimary">
                        Turning videos into TEXT? 🔠
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

export default YoutubeVideoThumbnail;