import React from 'react';
import ReactDOM from "react-dom";
import {HashRouter as Router} from "react-router-dom";
import App from './components/App';

const config = {
    "displayName": "Playnode Music Website",
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
            "title": "Playnode.org",
            "href": "http://playnode.org/"
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

ReactDOM.render(
    <Router>
        <App config={config}/>
    </Router>,
    document.getElementById('root'));
