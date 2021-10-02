import React from 'react';
import ReactDOM from 'react-dom';
import {
    Router,
  } from "react-router-dom";
import history from './utils/history';
import App from './app';

//Globals
declare global {
    interface Window {
        ethereum?: any;
        Buffer: any;
    }
}

global.Buffer = global.Buffer || require("buffer").Buffer;

ReactDOM.render(
    <Router history={history}>
        <App/>
    </Router>,
    document.getElementById('root')
);
