import React from "react";
import PropTypes from "prop-types";
import Radium from "radium";
import values from "object.values";
import DOMPurify from "dompurify";
import ProfileHeader from "./ProfileHeader";
import TrackList from "./TrackList";
import PlayState from "./PlayState";

class Profile extends React.Component {
    render() {
        const onPlayPause = this.props.onPlayPause;
        const onSeek = this.props.onSeek;
        const onWaveform = this.props.onWaveform;
        return (
            <div style={styles.component}>
                <ProfileHeader
                    banner={this.props.banner}
                    avatar={this.props.avatar}
                    displayName={this.props.displayName}
                    firstName={this.props.firstName}
                    lastName={this.props.lastName}
                    city={this.props.city}
                    country={this.props.country}
                />
                <div style={styles.content}>
                    <div style={styles.side}>
                        {(this.props.feedUrl || this.props.itunesUrl) &&
                            <div style={styles.feedLinks}>
                                {this.props.feedUrl &&
                                    <a href={this.props.feedUrl}
                                       target="_blank"><img
                                       src="images/feed-icon.svg"
                                       width="34" height="34"/></a>
                                    }
                                {this.props.feedUrl && this.props.itunesUrl &&
                                    <span> &nbsp;</span>
                                }
                                {this.props.itunesUrl &&
                                    <a href={this.props.itunesUrl}
                                       style={styles.itunes}
                                       target="_blank"/>
                                }
                            </div>
                        }
                        {this.props.description &&
                            <div style={styles.description}>
                                {this.props.description}
                            </div>
                        }
                        {this.props.infoHtml &&
                            <div dangerouslySetInnerHTML={{
                                __html: sanitize(this.props.infoHtml)
                            }}/>
                        }
                        {this.props.links &&
                            <div style={styles.links}>
                                <ul>
                                    {this.props.links.map((link) =>
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
                            tracks={this.props.tracks}
                            spotlight={this.props.spotlight}
                            currentTrack={this.props.currentTrack}
                            playState={this.props.playState}
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
}

export default Radium(Profile);

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
