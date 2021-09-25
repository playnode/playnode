import React from 'react';
import ReactDOM from 'react-dom';
import { App } from "@playnode/react-music-components";
import reportWebVitals from './reportWebVitals';

const xhr = new XMLHttpRequest();
xhr.open('GET', 'playnode.json', true);
xhr.onload = () => {
    if (xhr.status === 200) {
        ReactDOM.render(
            // <React.StrictMode>
                <App data={JSON.parse(xhr.responseText)}/>,
            // </React.StrictMode>,
            document.getElementById('root')
        );

        // If you want to start measuring performance in your app, pass a function
        // to log results (for example: reportWebVitals(console.log))
        // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
        reportWebVitals();
    }
};

xhr.send();
