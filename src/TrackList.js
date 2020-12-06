import React from "react";
import PropTypes from "prop-types";
import {Waypoint} from "react-waypoint";
import Track from "./Track";
import values from "object.values";
import PlayState from "./PlayState";

export default class TrackList extends React.Component {
    render() {
        const onPlayPause = this.props.onPlayPause;
        const onSeek = this.props.onSeek;
        const onWaveform = this.props.onWaveform;

        // Build an array of track paths, and map path to track data.
        let paths = [];
        const pathMap = new Map();
        for (let i = 0; i < this.props.tracks.length; i++) {
            const track = this.props.tracks[i];
            pathMap.set(track.path, track);
            paths.push(track.path);
        }

        if (this.props.spotlight) {
            const sortedPaths = [];

            // Put the spotlight tracks at the top of the list.
            const addedPaths = new Set();
            for (let i = 0; i < this.props.spotlight.length; i++) {
                const path = this.props.spotlight[i];
                if (pathMap.has(path)) {
                    sortedPaths.push(path);
                    addedPaths.add(path);
                }
            }
            for (let i = 0; i < paths.length; i++) {
                const path = paths[i];
                if (!addedPaths.has(path)) {
                    sortedPaths.push(path);
                    addedPaths.add(path);
                }
            }

            paths = sortedPaths;
        }

        const trackElements = [];
        const current = this.props.currentTrack;
        for (let i = 0; i < paths.length; i++) {
            const track = pathMap.get(paths[i]);

            let playState = PlayState.Initial;
            if (current && track === current) {
                playState = this.props.playState;
            }

            trackElements.push(
                <Track
                    key={track.path}
                    artist={track.artist}
                    title={track.title}
                    cover={track.cover}
                    path={track.path}
                    stream={track.stream}
                    download={track.download}
                    downloadAs={track.downloadAs}
                    duration={track.duration}
                    position={track.position || 0}
                    waveform={track.waveform}
                    playState={playState}
                    onPlayPause={() => {
                        onPlayPause && onPlayPause(track);
                    }}
                    onSeek={(percent) => {
                        onSeek && onSeek(track, percent);
                    }}
                    onWaveform={(waveform, duration) => {
                        track.duration = duration;
                        track.waveform = waveform;
                        onWaveform && onWaveform(track);
                    }}
                />
            );
        }

        return (
            <div style={styles.component}>
                {trackElements}
                <Waypoint onEnter={() => {
                    console.log('Waypoint enter');
                }}/>
            </div>
        );
    }
}

TrackList.propTypes = {
    tracks: PropTypes.array.isRequired,
    spotlight: PropTypes.array,
    currentTrack: PropTypes.object,
    playState: PropTypes.oneOf(values(PlayState)).isRequired,
    onPlayPause: PropTypes.func,
    onSeek: PropTypes.func,
    onWaveform: PropTypes.func,
};

const styles = {
    component: {
        padding: '10px',
    }
};
