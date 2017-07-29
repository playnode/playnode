import React from "react";
import PropTypes from "prop-types";
import values from "object.values";
import PlayState from "./PlayState";

const requestAnimationFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame;

export default class TrackSound extends React.Component {

    render() {
        return null;
    }

    componentDidUpdate(prevProps) {
        if (this.props.playState !== prevProps.playState) {
            switch (this.props.playState) {

                case PlayState.Loading:
                    const position = this.props.startPosition;
                    const start = position ? position / 1000 : 0;
                    this.load(this.props.url, start);
                    break;

                case PlayState.Playing:
                    this.media.play();
                    this.monitorProgress();
                    break;

                case PlayState.Paused:
                    this.media.pause();
                    break;

                case PlayState.Changing:
                    this.media.pause();
                    this.media = null;
                    const onLoading = this.props.onLoading;
                    onLoading && onLoading();
                    break;
            }
        } else {

            // Change track start position.
            if (this.props.startPosition !== prevProps.startPosition) {
                const position = this.props.startPosition;
                const start = position ? position / 1000 : 0;
                this.media.currentTime = start;
            }
        }
    }

    componentWillUnmount() {
        this.media = null;
    }

    load(url, start) {
        const media = this.media = document.createElement('audio');
        media.controls = false;
        media.autoplay = false;
        media.preload = 'auto';
        media.src = url;
        media.currentTime = start;

        const onError = this.props.onError;
        const onCanPlay = this.props.onCanPlay;
        const onFinished = this.props.onFinished;

        media.addEventListener('error', (e) => onError && onError(e));
        media.addEventListener('canplay', () => onCanPlay && onCanPlay(media.duration));
        media.addEventListener('ended', () => onFinished && onFinished());
    }

    monitorProgress() {
        const f = () => {
            if (this.isPaused()) return;

            const onProgress = this.props.onProgress;
            onProgress && onProgress(this.getCurrentTime());

            // Call again in the next frame
            requestAnimationFrame(f);
        };

        f();
    }

    getCurrentTime() {
        return this.media && this.media.currentTime;
    }

    isPaused() {
        return !this.media || this.media.paused;
    }
}

TrackSound.propTypes = {
    playState: PropTypes.oneOf(values(PlayState)).isRequired,
    url: PropTypes.string,
    startPosition: PropTypes.number,
    // volume: PropTypes.number,
    onLoading: PropTypes.func,
    onCanPlay: PropTypes.func,
    onFinished: PropTypes.func,
    onError: PropTypes.func,
    onProgress: PropTypes.func,
};
