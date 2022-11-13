import React, {useEffect} from "react";
import PropTypes from "prop-types";
import values from "object.values";
import PlayState from "./PlayState";

const requestAnimationFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame;

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

let lastProps;
let media;

export default function TrackSound(props) {
    const prevProps = lastProps;
    lastProps = props;

    function load(url, start) {
        console.log('load', {url, start});
        media = document.createElement('audio');
        media.controls = false;
        media.autoplay = false;
        media.preload = 'auto';
        media.src = url;
        media.currentTime = start;

        const onError = props.onError;
        const onCanPlay = props.onCanPlay;
        const onFinished = props.onFinished;

        media.addEventListener('error', (e) => onError && onError(e));
        media.addEventListener('canplay', () => onCanPlay && onCanPlay(media.duration));
        media.addEventListener('ended', () => onFinished && onFinished());
    }

    function monitorProgress() {
        const f = () => {
            if (isPaused()) return;

            const onProgress = props.onProgress;
            onProgress && onProgress(getCurrentTime());

            // Call again in the next frame
            requestAnimationFrame(f);
        };

        f();
    }

    function getCurrentTime() {
        return media && media.currentTime;
    }

    function isPaused() {
        return !media || media.paused;
    }

    useEffect(() => {
        console.log('useEffect', {props, prevProps});
        if (props.playState !== prevProps?.playState) {
            switch (props.playState) {

                case PlayState.Loading:
                    const position = props.startPosition;
                    const start = position ? position / 1000 : 0;
                    load(props.url, start);
                    break;

                case PlayState.Playing:
                    media.play();
                    monitorProgress();
                    break;

                case PlayState.Paused:
                    media.pause();
                    break;

                case PlayState.Changing:
                    media.pause();
                    media = null;
                    const onLoading = props.onLoading;
                    onLoading && onLoading();
                    break;
            }
        } else {

            // Change track start position.
            if (props.startPosition !== prevProps.startPosition) {
                const position = props.startPosition;
                media.currentTime = position ? position / 1000 : 0; // Start
            }
        }

        return () => {
            console.log('TrackSound unload');
            // media = null;
        }
    })

    return null;
}
