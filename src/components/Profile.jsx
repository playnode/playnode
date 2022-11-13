import React from "react";
import PropTypes from "prop-types";
import Radium from "radium";
import values from "object.values";
import DOMPurify from "dompurify";
import ProfileHeader from "./ProfileHeader";
import TrackList from "./TrackList";
import PlayState from "./PlayState";

Profile.propTypes = {
    displayName: PropTypes.string.isRequired,
    tracks: PropTypes.array.isRequired,
    spotlight: PropTypes.array,
    banner: PropTypes.string,
    avatar: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
    description: PropTypes.string,
    feedUrl: PropTypes.string,
    itunesUrl: PropTypes.string,
    infoHtml: PropTypes.string,
    links: PropTypes.array,
    currentTrack: PropTypes.object,
    playState: PropTypes.oneOf(values(PlayState)).isRequired,
    onPlayPause: PropTypes.func,
    onSeek: PropTypes.func,
    onWaveform: PropTypes.func,
};

export function Profile(props) {
    const onPlayPause = props.onPlayPause;
    const onSeek = props.onSeek;
    const onWaveform = props.onWaveform;
    return (
        <div style={styles.component}>
            <ProfileHeader
                banner={props.banner}
                avatar={props.avatar}
                displayName={props.displayName}
                firstName={props.firstName}
                lastName={props.lastName}
                city={props.city}
                country={props.country}
            />
            <div style={styles.content}>
                <div style={styles.side}>
                    {(props.feedUrl || props.itunesUrl) &&
                        <div style={styles.feedLinks}>
                            {props.feedUrl &&
                                <a href={props.feedUrl}
                                   target="_blank"><img
                                    src="images/feed-icon.svg"
                                    width="34" height="34"/></a>
                            }
                            {props.feedUrl && props.itunesUrl &&
                                <span> &nbsp;</span>
                            }
                            {props.itunesUrl &&
                                <a href={props.itunesUrl}
                                   style={styles.itunes}
                                   target="_blank"/>
                            }
                        </div>
                    }
                    {props.description &&
                        <div style={styles.description}>
                            {props.description}
                        </div>
                    }
                    {props.infoHtml &&
                        <div dangerouslySetInnerHTML={{
                            __html: sanitize(props.infoHtml)
                        }}/>
                    }
                    {props.links &&
                        <div style={styles.links}>
                            <ul>
                                {props.links.map((link) =>
                                    <li key={link.href}>
                                        <a href={link.href}
                                           target="_blank">{link.title}</a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    }
                </div>
                <div style={styles.tracks}>
                    <TrackList
                        tracks={props.tracks}
                        spotlight={props.spotlight}
                        currentTrack={props.currentTrack}
                        playState={props.playState}
                        onPlayPause={(track) => {
                            onPlayPause && onPlayPause(track);
                        }}
                        onSeek={(track, percent) => {
                            onSeek && onSeek(track, percent);
                        }}
                        onWaveform={(track) => {
                            onWaveform && onWaveform(track);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Radium(Profile);

const styles = {
    component: {
        margin: 'auto',
        maxWidth: '960px',
        '@media (min-width: 1080px)': {
            maxWidth: '1080px'
        },
        '@media (min-width: 1240px)': {
            maxWidth: '1240px'
        },
    },
    content: {
        backgroundColor: '#fff',
        minHeight: 'calc(100vh - 260px)',
    },
    side: {
        padding: '20px',
        fontSize: '0.85em',
        '@media (min-width: 900px)': {
            float: 'right',
            width: '300px',
        },
    },
    description: {
        paddingBottom: '1em',
    },
    tracks: {
        '@media (min-width: 900px)': {
            marginRight: '320px',
        },
    },
    itunes: {
        display: 'inline-block',
        overflow: 'hidden',
        backgroundImage: 'url(//linkmaker.itunes.apple.com/assets/shared/badges/en-us/podcast-lrg.svg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        width: '133px',
        height: '34px',
    },
    feedLinks: {
        paddingBottom: '1em',
    },
    links: {

    },
};

function sanitize(info) {
    info = info.replace(/(?:\r\n|\r|\n)/g, '<br/>');

    DOMPurify.addHook('afterSanitizeAttributes', function (node) {
        // set all elements owning target to target=_blank
        if ('target' in node) {
            node.setAttribute('target','_blank');
        }
    });

    return DOMPurify.sanitize(info);
}
