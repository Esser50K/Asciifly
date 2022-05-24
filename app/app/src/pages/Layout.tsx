import React, {FormEvent, useEffect, useState} from "react";
import {Outlet, useNavigate, useSearchParams} from "react-router-dom";
import {
    AppBar, Button,
    Container, createStyles,
    CssBaseline,
    Drawer,
    IconButton,
    InputBase,
    makeStyles, Theme,
    ThemeProvider,
    Toolbar,
    Typography
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import Box from "@material-ui/core/Box";
import DonateButton from "../components/DonateButton";
import {createTheme} from "@material-ui/core/styles";

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
        videoUrl: {
            display: 'flex',
            alignItems: 'center',
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
                cursor: 'pointer',
            },
        },
        form: {
            display: 'flex',
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            marginRight: theme.spacing(2),
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(3),
                width: 'auto',
            },
        },
        inputRoot: {
            color: theme.palette.text.primary,
            background: theme.palette.background.paper,
            border: '4px ridge white',
        },
        inputInput: {
            padding: theme.spacing(0.5, 1, 0.5, 1),
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '65ch',
            },
        },
        toolbarEnd: {
            width: '290px',
        },
        appBarSpacer: theme.mixins.toolbar,
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
            paddingTop: theme.spacing(2.5),
        },
        introBox: {
            margin: theme.spacing(2),
            padding: theme.spacing(2),
            background: theme.palette.info.main,
        },
        donateContainer: {
            marginTop: theme.spacing(4),
            display: 'grid',
            justifyContent: 'center',
            justifyItems: 'center',
        },
        donateButton: {
            margin: theme.spacing(2, 0, 2, 0)
        },
        content: {
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
        },
        container: {
            padding: theme.spacing(4, 2, 4, 2),
        },
        convertButton: {
            margin: 0,
            height: '48px',
            width: '40px',
            borderWidth: '4px',
            borderStyle: 'outset',
            borderColors: theme.palette.secondary.main,
            background: theme.palette.secondary.main,
            color: theme.palette.primary.main,
            '&:hover': {
                background: theme.palette.secondary.main,
            },
        },
        convertButtonPlaceholder: {
            paddingLeft: theme.spacing(1),
            display: 'inline-flex',
            width: '64px',
        }
    }),
);

const darkTheme = createTheme({
    palette: {
        type: 'dark',
        background: {
            default: '#000',
            paper: '#000',
        },
    },
    typography: {
        fontFamily: "'Pixelated Times New Roman', 'Times New Roman'",
        fontSize: 24,
        allVariants: {
            lineHeight: 0.74,
        }
    },
});

function Layout({drawerCollapsed = false}) {
    let [searchParams] = useSearchParams();
    let navigate = useNavigate();
    const [inputUrl, setInputUrl] = useState("")
    const [youtubeUrl, setYoutubeUrl] = useState("")
    const classes = useStyles();

    const navigateToHome = () => navigate('/');

    const onYTUrlSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setYoutubeUrl(inputUrl)
        const regexp = `https:\/\/www\.youtube\.com\/watch\?v=`;

        const path = inputUrl.replace(regexp, '/watch?v=');
        setInputUrl('')
        navigate(path)
    }

    const onYTUrlChange = (e: any) => setInputUrl(e.target.value)

    useEffect(() => {
        setYoutubeUrl(`https://www.youtube.com/watch?v=${searchParams.get('v') || 'c7rarQiUmng'}`)
    }, [searchParams])

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
                        <Typography onClick={navigateToHome} className={classes.title} variant="h6" noWrap>
                            90's YouTube
                        </Typography>
                    </div>
                    <Box className={classes.videoUrl}>
                        <Typography>YouTube video link:</Typography>
                        <div className={classes.search}>
                            <form className={classes.form} onSubmit={onYTUrlSubmit}>
                                <InputBase
                                    placeholder={youtubeUrl}
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    inputProps={{'aria-label': 'search'}}
                                    onChange={onYTUrlChange}
                                    value={inputUrl}
                                />
                                { inputUrl ?
                                    <Button className={classes.convertButton} variant="outlined" size="small" color="inherit" aria-label="convert from url" type="submit">
                                        <PlayCircleFilled/>
                                    </Button> : <Box className={classes.convertButtonPlaceholder} />
                                }
                            </form>
                        </div>
                    </Box>
                    <div className={classes.toolbarEnd}/>
                </Toolbar>
            </AppBar>
            <div className={classes.appBarSpacer}/>
            { !drawerCollapsed &&
                <ThemeProvider theme={darkTheme}>
                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        <div className={classes.appBarSpacer}/>
                        <Box className={classes.introBox}>
                            <Typography variant="body2">Paste a YouTube video link to ASCIIfy it on the fly!</Typography>
                        </Box>
                        <Container>
                            <Typography variant="subtitle1">- or -</Typography>
                        </Container>
                        <Box className={classes.introBox}>
                            <Typography variant="body2">Click to select or drag an image on this box to ASCIIfy
                                it</Typography>
                        </Box>
                        <Container className={classes.donateContainer}>
                            <img src="/images/moneyfall.gif" alt="Money falling" />
                            <Box className={classes.donateButton}>
                                <DonateButton/>
                            </Box>
                            <Typography variant="body2">To support my server costs <br/> and development efforts
                                C:</Typography>
                        </Container>
                    </Drawer>
                </ThemeProvider>
            }
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