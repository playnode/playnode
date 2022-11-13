import React from "react";
import PropTypes from "prop-types";
import Radium from "radium";
import values from "object.values";
import PlayState from "./PlayState";
import PlayIcon from "../assets/circle-play.svg";
import PauseIcon from "../assets/circle-pause.svg";
import LoadingIcon from "../assets/circle-loading.svg";

TrackPlayButton.propTypes = {
    playState: PropTypes.oneOf(values(PlayState)).isRequired,
    onPlayPause: PropTypes.func,
};

class TrackPlayButton extends React.Component {
    render() {
        const onPlayPause = this.props.onPlayPause;
        let img;
        switch (this.props.playState) {
            case PlayState.Initial:
            case PlayState.Paused:
            case PlayState.Finished:
                img = PlayIcon;
                break;
            case PlayState.Playing:
                img = PauseIcon;
                break;
            case PlayState.Loading:
            case PlayState.Changing:
            default:
                img = LoadingIcon;
                break;
        }
        return (
            <div style={styles.component}>
                <img src={img}
                     style={styles.button}
                     width={`${buttonSize}px`}
                     height={`${buttonSize}px`}
                     onClick={() => onPlayPause && onPlayPause()}
                />
            </div>
        );
    }
}

export default Radium(TrackPlayButton);

const buttonSize = '60';

const styles = {
    component: {
        backgroundColor: 'white',
        borderRadius: '50%',
        width: `${buttonSize}px`,
        height: `${buttonSize}px`,
        top: '50%',
        left: '50%',
        position: 'absolute',
        margin: `-${buttonSize/2+9}px 0 0 -${buttonSize/2}px`,
    },
    button: {
        cursor: 'pointer',
        border: 'none',
        background: 'transparent',
        margin: 0,
        padding: 0,
        ':focus': {
            outline: 0,
        }
    },
};
