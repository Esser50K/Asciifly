import Box from "@material-ui/core/Box/Box";
import Typography from "@material-ui/core/Typography/Typography";
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        centeringBox: {
            display: 'grid',
            placeItems: 'center',
        },
        h1: {
            color: theme.palette.background.paper,
        },
        homepageLinkBox: {
            background: theme.palette.text.primary,
            textAlign: 'center',
            marginTop: theme.spacing(4),
            padding: theme.spacing(2, 4, 2, 4),
        }
    })
)

function NoPage() {
    const classes = useStyles();

    return (
        <Box className={classes.centeringBox}>
            <img src="/images/futureIsHere.gif" alt="Mickey Mouse club looking at ya" />
            <Typography className={classes.h1} variant="h1" color="inherit">This page did not exist</Typography>
            <Typography className={classes.homepageLinkBox} variant="subtitle1" color="inherit">
                <Link to="/">Back to homepage</Link>
            </Typography>
        </Box>
    )
}

export default NoPage;