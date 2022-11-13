import React from "react";
import PropTypes from "prop-types";
import values from "object.values";
import TrackHeader from "./TrackHeader";
import TrackPlayButton from "./TrackPlayButton";
import TrackButtonBar from "./TrackButtonBar";
import TrackTime from "./TrackTime";
import TrackWaveform from "./TrackWaveform";
import PlayState from "./PlayState";

Track.propTypes = {
    artist: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    cover: PropTypes.string,
    path: PropTypes.string.isRequired,
    stream: PropTypes.string,
    download: PropTypes.string,
    downloadAs: PropTypes.string,
    duration: PropTypes.number,
    position: PropTypes.number,
    waveform: PropTypes.string,
    playState: PropTypes.oneOf(values(PlayState)).isRequired,
    onPlayPause: PropTypes.func,
    onSeek: PropTypes.func,
    onWaveform: PropTypes.func,
};

export default class Track extends React.Component {
    render() {
        const onPlayPause = this.props.onPlayPause;
        const onSeek = this.props.onSeek;
        const onWaveform = this.props.onWaveform;
        return (
            <div style={styles.component}>
                <TrackHeader
                    artist={this.props.artist}
                    title={this.props.title}
                    cover={this.props.cover}
                    path={this.props.path}
                />
                <div style={styles.trackBox}>
                    <div style={styles.buttonBox}>
                        <div style={styles.time}>
                            <TrackTime
                                duration={this.props.duration}
                                position={this.props.position}
                            />
                        </div>
                        <TrackPlayButton
                            playState={this.props.playState}
                            onPlayPause={() => {
                                onPlayPause && onPlayPause();
                            }}
                        />
                    </div>
                    <div style={styles.waveformBox}>
                        <TrackWaveform
                            playState={this.props.playState}
                            waveform={this.props.waveform}
                            stream={this.props.stream}
                            position={this.props.position}
                            duration={this.props.duration}
                            onSeek={(percent) => {
                                onSeek && onSeek(percent);
                            }}
                            onWaveform={(waveform) => {
                                const duration = Math.floor(this.props.duration);
                                onWaveform && onWaveform(waveform, duration);
                            }}
                        />
                        <TrackButtonBar
                            download={this.props.download}
                            downloadAs={this.props.downloadAs}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    component: {
        padding: '10px',
        height: '145px',
    },
    trackBox: {
        border: '1px solid #ccc',
        borderRadius: '2px',
        backgroundColor: '#f5f5f5',
        height: '89px',
    },
    buttonBox: {
        width: '74px',
        height: '89px',
        float: 'left',
        align: 'middle',
        verticalAlign: 'middle',
        position: 'relative',
        borderRight: '1px solid #ccc',
        background: 'radial-gradient(#f5f5f5, #f5f5f5, #f5f5f5, #eaeaea)',
    },
    time: {
        position: 'absolute',
        top: '73px',
        width: '100%',
        textAlign: 'center',
        color: '#666',
        fontFamily: 'monospace',
        fontSize: '0.81em',
    },
    waveformBox: {
        height: '89px',
    },
};
