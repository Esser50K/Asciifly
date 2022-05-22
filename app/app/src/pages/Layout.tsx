import React from "react";
import { Outlet } from "react-router-dom";
import {
    alpha,
    AppBar,
    Container, createStyles,
    CssBaseline,
    Drawer,
    IconButton,
    InputBase,
    makeStyles, Theme,
    Toolbar,
    Typography
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
          display: 'flex',
        },
        grow: {
            flexGrow: 1,
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        toolbar: {
            justifyContent: 'space-between',
        },
        toolbarStart: {
            display: 'flex',
            alignItems: 'center',
        },
        title: {
            display: 'none',
            [theme.breakpoints.up('sm')]: {
                display: 'block',
            },
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: alpha(theme.palette.common.white, 0.15),
            '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
            },
            marginRight: theme.spacing(2),
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(3),
                width: 'auto',
            },
        },
        inputRoot: {
            color: 'inherit',
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 1),
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '65ch',
            },
        },
        toolbarEnd: {
            width: '130px',
        },
        appBarSpacer: theme.mixins.toolbar,
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        content: {
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
        },
        container: {
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
    }),
);

function Layout() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar className={classes.appBar} position="fixed">
                <Toolbar className={classes.toolbar}>
                    <div className={classes.toolbarStart}>
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="open drawer"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography className={classes.title} variant="h6" noWrap>
                            90's YouTube
                        </Typography>
                    </div>
                    <div className={classes.search}>
                        <InputBase
                            placeholder="https://www.youtube.com/watch?v=c7rarQiUmng"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{'aria-label': 'search'}}
                        />
                        <IconButton color="inherit" aria-label="convert from url">
                            <PlayCircleFilled/>
                        </IconButton>
                    </div>
                    <div className={classes.toolbarEnd}/>
                </Toolbar>
            </AppBar>
            <div className={classes.appBarSpacer}/>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.appBarSpacer}/>
            </Drawer>
            <div className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <Outlet />
                </Container>
            </div>
        </div>
    )
}

export default Layout;