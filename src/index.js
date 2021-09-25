import React from "react";
import ReactDOM from "react-dom";
import { App } from "@playnode/music-website";

const xhr = new XMLHttpRequest();
xhr.open('GET', 'playnode.json', true);
xhr.onload = () => {
    if (xhr.status === 200) {
        ReactDOM.render(
            <App data={JSON.parse(xhr.responseText)}/>,
            document.getElementById('root'));
    }
};

xhr.send();
