import React from "react";
import PropTypes from "prop-types";
import Radium from "radium";
import values from "object.values";
import PlayState from "./PlayState";

class TrackPlayButton extends React.Component {
    render() {
        const onPlayPause = this.props.onPlayPause;
        let img;
        switch (this.props.playState) {
            case PlayState.Initial:
            case PlayState.Paused:
            case PlayState.Finished:
                img = 'images/circle-play.svg';
                break;
            case PlayState.Playing:
                img = 'images/circle-pause.svg';
                break;
            case PlayState.Loading:
            case PlayState.Changing:
            default:
                img = 'images/circle-loading.svg';
                break;
        }
        return (
            <div style={styles.component}>
                <button style={styles.button}
                        onClick={() => onPlayPause && onPlayPause()}>
                    <img src={img}
                         width={`${buttonSize}px`}
                         height={`${buttonSize}px`}
                    />
                </button>
            </div>
        );
    }
}

export default Radium(TrackPlayButton);

TrackPlayButton.propTypes = {
    playState: React.PropTypes.oneOf(values(PlayState)).isRequired,
    onPlayPause: PropTypes.func,
};

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
