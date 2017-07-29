import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Radium from "radium";
import KeyHandler, { KEYPRESS } from "react-key-handler";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import TrackSound from "./TrackSound";
import Profile from "./Profile";
import PlayState from "./PlayState";

class App extends React.Component {

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
                <Switch>
                    <Route exact path='/' render={(props) => (
                        <Profile
                            banner={this.props.data.banner}
                            avatar={this.props.data.avatar}
                            displayName={this.props.data.displayName}
                            firstName={this.props.data.firstName}
                            lastName={this.props.data.lastName}
                            city={this.props.data.city}
                            country={this.props.data.country}
                            description={this.props.data.description}
                            feedUrl={this.props.data.feedUrl}
                            itunesUrl={this.props.data.itunesUrl}
                            infoHtml={this.props.data.infoHtml}
                            links={this.props.data.links}
                            spotlight={this.props.data.spotlight}
                            tracks={this.props.data.tracks}
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
                    <Route exact path="/stream" render={(props) => (
                        <div>Stream</div>
                    )}/>
                    <Route exact path="/playlist/:id" render={(props) => (
                        <div>Playlist: {props.match.params.id}</div>
                    )}/>
                    <Route exact path="/:id" render={(props) => (
                        <div>Track: {props.match.params.id}</div>
                    )}/>
                </Switch>
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

App.propTypes = {
    data: PropTypes.object.isRequired,
};

const xhr = new XMLHttpRequest();
xhr.open('GET', 'playnode.json', true);
xhr.onload = () => {
    if (xhr.status === 200) {
        ReactDOM.render(
            <Router>
                <App data={JSON.parse(xhr.responseText)}/>
            </Router>,
            document.getElementById('root'));
    }
};
xhr.send();
