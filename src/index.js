import React from 'react';
import ReactDOM from 'react-dom';
import { App } from '@playnode/react-music-components';
import reportWebVitals from './reportWebVitals';
import config from './playnode.json';
import 'github-fork-ribbon-css/gh-fork-ribbon.css';
import './index.css';

ReactDOM.render(
    <React.StrictMode>
        <App data={config}/>
        <a className="github-fork-ribbon right-bottom fixed"
           href="https://github.com/playnode/react-music-website"
           data-ribbon="Fork me on GitHub"
           title="Fork me on GitHub">Fork me on GitHub</a>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
