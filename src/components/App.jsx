import React from "react";
import PropTypes from "prop-types";
import Radium from "radium";
import KeyHandler, { KEYPRESS } from "react-key-handler";
import { Route, Routes } from "react-router-dom";
import TrackSound from "./TrackSound";
import Profile from "./Profile";
import PlayState from "./PlayState";

App.propTypes = {
    config: PropTypes.object.isRequired,
};

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playState: PlayState.Initial,
            currentTrack: undefined,
            startPosition: 0,
        };
    }

    render() {
        return (
            <Radium.StyleRoot>
                <Routes>
                    <Route exact path='/' element={(
                        <Profile
                            displayName={this.props.config.displayName}
                            firstName={this.props.config.firstName}
                            lastName={this.props.config.lastName}
                            city={this.props.config.city}
                            country={this.props.config.country}
                            avatar={this.props.config.avatar}
                            banner={this.props.config.banner}
                            description={this.props.config.description}
                            infoHtml={this.props.config.infoHtml}
                            links={this.props.config.links}
                            itunesUrl={this.props.config.itunesUrl}
                            feedUrl={this.props.config.feedUrl}
                            tracks={this.props.config.tracks}
                            spotlight={this.props.config.spotlight}
                            currentTrack={this.state.currentTrack}
                            playState={this.state.playState}
                            onPlayPause={(track) => {
                                this.playPause(track);
                            }}
                            onSeek={(track, percent) => {
                                this.seek(track, percent);
                            }}
                            onWaveform={(track) => {
                                console.log({
                                    artist: track.artist,
                                    title: track.title,
                                    duration: track.duration,
                                }, track.waveform);
                            }}
                        />
                    )}/>
                    <Route exact path="/stream" element={<div>Stream</div>}/>
                    <Route exact path="/playlist/:id" element={<div>Playlist: {/*{props.match.params.id}*/}</div>}/>
                    <Route exact path="/:id" element={<div>Track: {/*{props.match.params.id}*/}</div>}/>
                </Routes>
                <KeyHandler
                    keyEventName={KEYPRESS}
                    keyValue=" "
                    onKeyHandle={(e) => {
                        e.preventDefault();
                        this.playPauseCurrent();
                    }}
                />
                <KeyHandler
                    keyValue="ArrowLeft"
                    onKeyHandle={() => console.log('previous')}
                />
                <KeyHandler
                    keyValue="ArrowRight"
                    onKeyHandle={() => console.log('next')}
                />
                <TrackSound
                    playState={this.state.playState}
                    url={this.state.currentTrack && this.state.currentTrack.stream}
                    startPosition={this.state.startPosition}
                    onLoading={() => this.setState({
                        playState: PlayState.Loading,
                    })}
                    onCanPlay={(duration) => {
                        this.state.currentTrack.duration = duration * 1000;
                        this.setState({
                            playState: PlayState.Playing,
                        });
                    }}
                    onFinished={() => {
                        this.state.currentTrack.position = this.state.currentTrack.duration;
                        this.setState({
                            playState: PlayState.Finished,
                            currentTrack: this.state.currentTrack,
                        });
                    }}
                    onError={(e) => console.error('TrackSound.onError', e)}
                    onProgress={(time) => {
                        this.state.currentTrack.position = time * 1000;
                        this.setState({
                            currentTrack: this.state.currentTrack,
                        });
                    }}
                />
            </Radium.StyleRoot>
        );
    }

    playPauseCurrent() {
        switch (this.state.playState) {
            case PlayState.Playing:
                this.setState({
                    playState: PlayState.Paused,
                });
                break;

            case PlayState.Paused:
                this.setState({
                    playState: PlayState.Playing,
                });
                break;
        }
    }

    playPause(track) {
        if (!track.stream) {
            return;
        }

        if (this.state.currentTrack && this.state.currentTrack !== track) {
            this.setState({
                playState: PlayState.Changing,
                currentTrack: track,
                startPosition: track.position,
            });
            return;
        }

        switch (this.state.playState) {
            case PlayState.Initial:
            case PlayState.Finished:
                this.setState({
                    playState: PlayState.Loading,
                    currentTrack: track,
                    startPosition: track.position,
                });
                break;
            case PlayState.Playing:
                this.setState({
                    playState: PlayState.Paused,
                    currentTrack: track,
                    startPosition: track.position,
                });
                break;
            case PlayState.Paused:
                this.setState({
                    playState: PlayState.Playing,
                    currentTrack: track,
                    startPosition: track.position,
                });
                break;
        }
    }

    seek(track, percent) {
        if (track !== this.state.currentTrack) {
            this.playPause(track, percent);
            return;
        }
        this.setState({
            startPosition: track.duration * (percent / 100),
        })
    }
}
