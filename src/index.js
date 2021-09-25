import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import { App } from "@playnode/music-website";

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
