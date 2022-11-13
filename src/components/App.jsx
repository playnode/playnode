import React, {useState} from "react";
import PropTypes from "prop-types";
import Radium from "radium";
import { Route, Routes } from "react-router-dom";
import TrackSound from "./TrackSound";
import Profile from "./Profile";
import PlayState from "./PlayState";

App.propTypes = {
    config: PropTypes.object.isRequired,
};

export default function App(props) {
    const [playState, setPlayState] = useState(PlayState.Initial);
    const [currentTrack, setCurrentTrack] = useState(undefined);
    const [startPosition, setStartPosition] = useState(0);

    function playPauseCurrent() {
        switch (playState) {
            case PlayState.Playing:
                setPlayState(PlayState.Paused);
                break;

            case PlayState.Paused:
                setPlayState(PlayState.Playing);
                break;
        }
    }

    function playPause(track) {
        if (!track.stream) {
            return;
        }

        if (currentTrack && currentTrack !== track) {
            setPlayState(PlayState.Changing);
            setCurrentTrack(track);
            setStartPosition(track.position);
            return;
        }

        switch (playState) {
            case PlayState.Initial:
            case PlayState.Finished:
                setPlayState(PlayState.Loading);
                setCurrentTrack(track);
                setStartPosition(track.position);
                break;
            case PlayState.Playing:
                setPlayState(PlayState.Paused);
                setCurrentTrack(track);
                setStartPosition(track.position);
                break;
            case PlayState.Paused:
                setPlayState(PlayState.Playing);
                setCurrentTrack(track);
                setStartPosition(track.position);
                break;
        }
    }

    function seek(track, percent) {
        if (track !== currentTrack) {
            playPause(track, percent);
            return;
        }

        setStartPosition(track.duration * (percent / 100));
    }

    return (
        <Radium.StyleRoot>
            <Routes>
                <Route exact path='/' element={(
                    <Profile
                        displayName={props.config.displayName}
                        firstName={props.config.firstName}
                        lastName={props.config.lastName}
                        city={props.config.city}
                        country={props.config.country}
                        avatar={props.config.avatar}
                        banner={props.config.banner}
                        description={props.config.description}
                        infoHtml={props.config.infoHtml}
                        links={props.config.links}
                        itunesUrl={props.config.itunesUrl}
                        feedUrl={props.config.feedUrl}
                        tracks={props.config.tracks}
                        spotlight={props.config.spotlight}
                        currentTrack={currentTrack}
                        playState={playState}
                        onPlayPause={(track) => playPause(track)}
                        onSeek={(track, percent) => seek(track, percent)}
                        onWaveform={(track) => {
/*
                            console.log({
                                artist: track.artist,
                                title: track.title,
                                duration: track.duration,
                            }, track.waveform);
*/
                        }}
                    />
                )}/>
                <Route exact path="/stream" element={<div>Stream</div>}/>
                <Route exact path="/playlist/:id" element={<div>Playlist: {/*{props.match.params.id}*/}</div>}/>
                <Route exact path="/:id" element={<div>Track: {/*{props.match.params.id}*/}</div>}/>
            </Routes>
            <TrackSound
                playState={playState}
                url={currentTrack && currentTrack.stream}
                startPosition={startPosition}
                onLoading={() => setPlayState(PlayState.Loading)}
                onCanPlay={(duration) => {
                    currentTrack.duration = duration * 1000;
                    setPlayState(PlayState.Playing);
                }}
                onFinished={() => {
                    currentTrack.position = currentTrack.duration;
                    setPlayState(PlayState.Finished);
                    setCurrentTrack(currentTrack); // TODO: Check if this triggers a state change
                }}
                onError={(e) => console.error('TrackSound.onError', e)}
                onProgress={(time) => {
                    currentTrack.position = time * 1000;
                    setCurrentTrack(currentTrack); // TODO: Check if this triggers a state change
                }}
            />
        </Radium.StyleRoot>
    );
}
