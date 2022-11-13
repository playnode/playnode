import React from "react";
import ReactDOM from "react-dom/client";
import {Provider as ReduxProvider} from "react-redux";
import {ReduxRouter as Router} from "@lagunovsky/redux-react-router";
import {store, history} from "./redux/store";
import App from "./components/App";

const config = {
    "displayName": "React Music Website",
    "firstName": "",
    "lastName": "",
    "city": "",
    "country": "",
    "avatar": "images/profile-avatar-200x200.png",
    "banner": "images/profile-banner-1240x260.jpg",
    "description": "Plain-text info",
    "infoHtml": "<i>HTML-formatted info</i>",
    "links": [
        {
            "title": "Source Code",
            "href": "https://stever.dev/react-music-website/"
        }
    ],
    "itunesUrl": "",
    "feedUrl": "",
    "podcastData": {
        "siteUrl": "",
        "feedImage": "",
        "ownerName": "",
        "ownerEmail": "",
        "copyright": "",
        "language": "",
        "category": "",
        "explicit": ""
    },
    "spotlight": [],
    "tracks": [
        {
            "artist": "Steven Robertson",
            "title": "Test",
            "pubDate": "Sat, 24 Jun 2017 13:21:15 GMT",
            "path": "test",
            "stream": "test.mp3",
            "duration": 0,
            "waveform": ""
        }
    ]
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ReduxProvider store={store}>
        <Router history={history}>
            <App config={config}/>
        </Router>
    </ReduxProvider>
);
