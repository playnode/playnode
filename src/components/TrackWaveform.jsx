import React from "react";
import PropTypes from "prop-types";
import values from "object.values";
import clone from "lodash.clone";
import merge from "lodash.merge";
import pako from "pako";
import PlayState from "./PlayState";

const OfflineAudioContext = window.window.OfflineAudioContext
    || window.webkitOfflineAudioContext;

const height = 68;

TrackWaveform.propTypes = {
    playState: PropTypes.oneOf(values(PlayState)).isRequired,
    waveform: PropTypes.string,
    stream: PropTypes.string,
    barWidth: PropTypes.number,
    barGap: PropTypes.number,
    barColour: PropTypes.string,
    gapColour: PropTypes.string,
    position: PropTypes.number,
    duration: PropTypes.number,
    onSeek: PropTypes.func,
    onWaveform: PropTypes.func,
};

export default class TrackWaveform extends React.Component {

    constructor(props) {
        super(props);
        this.onResize = this.onResize.bind(this);
        this.onClick = this.onClick.bind(this);
        this.state = {
            width: 100,
            height: {height},
        };
    }

    render() {

        const canvasContainer = clone(styles.canvasContainer);
        merge(canvasContainer, {
            width: `${this.state.width}px`,
        });

        const progressContainer = clone(styles.progressContainer);
        merge(progressContainer, {
            width: `${this.state.width}px`,
        });

        const position = this.props.position || 0;
        const duration = this.props.duration;
        let percent = (position / duration) * 100;
        if (!duration) percent = 0;
        const progress = clone(styles.progress);
        merge(progress, {
            width: `${percent}%`,
        });

        if (!this.data && this.props.waveform) {
            const decoded = base64Decode(this.props.waveform);
            this.data = pako.inflate(decoded);
            setTimeout(() => this.paintCanvas(), 0);
        }

        return (
            <div style={styles.component} ref={(ref) => this.component = ref}>
                <div style={canvasContainer}>
                    <canvas
                        ref={(ref) => this.canvas = ref}
                        width={this.state.width}
                        height={this.state.height}
                    />
                </div>
                <div style={progressContainer}>
                    <div style={progress}/>
                </div>
            </div>
        );
    }

    onResize() {
        const cs = getComputedStyle(this.component);
        this.setState({
            width: parseInt(cs.getPropertyValue('width'), 10),
            height: parseInt(cs.getPropertyValue('height'), 10),
        });
        if (this.data) {
            this.paintCanvas();
        }
    }

    onClick(e) {
        const width = this.component.offsetWidth;
        const left = this.component.offsetLeft;
        const pos = Math.floor(e.pageX - left);
        const percent = Math.floor((pos / width) * 100);
        this.props.onSeek && this.props.onSeek(percent);
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
        this.component.addEventListener('click', this.onClick);
        this.onResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
        this.component.removeEventListener('click', this.onClick);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        // This method is only here to load waveform when loading,
        // when waveform data is not supplied as a prop initially.
        if (this.data || this.props.playState !== PlayState.Loading) {
            return;
        }

        console.log('Fetching data to build waveform data');
        this.data = 1; // Temporary value to be overwritten.

        // Fetch the data for the stream to build the waveform.
        const xhr = new XMLHttpRequest();
        xhr.open('GET', this.props.stream, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = () => {
            if (xhr.status === 200) {
                this.decodeAudioData(xhr.response);
            }
        };
        xhr.send();
    }

    decodeAudioData(data) {
        const oac = new OfflineAudioContext(1, 2, 44100);
        oac.decodeAudioData(data, (decoded) => {
            const channelData = decoded.getChannelData(0);
            this.data = prepareWaveData(channelData);
            this.paintCanvas();
            const onWaveform = this.props.onWaveform;
            onWaveform && onWaveform(base64Encode(pako.deflate(this.data)));
        });
    }

    paintCanvas() {
        if (!this.canvasContext) {
            this.canvasContext = this.canvas.getContext('2d');
        }

        const barWidth = this.props.barWidth || 1;
        const barGap = this.props.barGap || 0;
        const barColour = this.props.barColour || '#949494';
        const gapColour = this.props.gapColour || '#ccc';
        const width = this.state.width;

        const vals = [];
        const size = this.data.length / width;
        const step = barWidth + barGap;

        for (let i = 0; i < width - 1; i += step) {
            vals.push(sample(i * size, size, this.data));
        }

        const max = Math.max.apply(null, vals);
        const scale = (height / 2) / max;

        for (let i = 0; i < vals.length; i++) {
            let val = Math.floor(vals[i] * scale + 1);

            const x = i * step;
            const y = height / 2 - val;

            this.canvasContext.fillStyle = barColour;
            this.canvasContext.fillRect(x, y, barWidth, val * 2);

            this.canvasContext.fillStyle = gapColour;
            this.canvasContext.fillRect(x + barWidth, y, barGap, val * 2);
        }
    }
}

const styles = {
    component: {
        position: 'relative',
        height: `${height}px`,
        overflow: 'hidden',
    },
    progressContainer: {
        position: 'absolute',
        height: `${height}px`,
        opacity: 0.5,
    },
    progress: {
        height: `${height}px`,
        backgroundColor: 'orange',
    },
    canvasContainer: {
        position: 'absolute',
        height: `${height}px`,
    },
};

/**
 * Provides an average sample from a section of audio data.
 * @param pos Start of section to average.
 * @param len Length of section to average.
 * @param data Array to read section from and provide average value.
 * @return {number} Average value for a section of the data.
 */
function sample(pos, len, data) {
    let sum = 0.0;
    for (let i = Math.floor(pos); i < pos + len; i++) {
        sum += Math.pow(data[i], 2);
    }
    return Math.sqrt(sum / data.length);
}

/**
 * Prepares audio data used by waveform renderer.
 * @param {Float32Array} data - Data from OfflineAudioContext.
 * @return {Uint8Array} Data used to generate waveform.
 */
function prepareWaveData(data) {
    const limit = 1024 * 25; // 25K
    const width = data.length < limit ? data.length : limit;

    const vals = [];
    const size = Math.floor(data.length / width);
    for (let i = 0; i < width; i++) {
        vals.push(sample(i * size, size, data) * 10000);
    }

    return Uint8Array.from(vals);
}

/**
 * Decode a base64 encoded string to unsigned-byte array.
 * @param {string} str - Base64 encoded string.
 * @returns {Uint8Array} Array of unsigned-bytes.
 */
function base64Decode(str) {
    // Contents of this function based on code from tab64:
    // https://github.com/hughsk/tab64

    /*
     MIT LICENSE
     Copyright 2013 Hugh Kennedy
     Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
     The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */

    const intb64 = function (c) {
        return c > 64 && c < 91 ? c - 65
             : c > 96 && c < 123 ? c - 71
             : c > 47 && c < 58 ? c + 4
             : c === 43 ? 62
             : c === 47 ? 63
             : 0;
    };

    str = str.replace(/[^A-Za-z0-9\+\/]/g, "");

    const inputLength = str.length;
    let outputLength = inputLength * 3 + 1 >> 2;
    let outidx = 0;
    let inidx = 0;

    const output = new Uint8Array(outputLength);

    for (let value = 0; inidx < inputLength; inidx++) {
        const bit = inidx & 3;

        value |= intb64(str.charCodeAt(inidx)) << (18 - 6 * bit);

        if (bit === 3 || inputLength - inidx === 1) {
            for (let sbit = 0; sbit < 3 && outidx < outputLength; sbit++) {
                output[outidx++] = value >>> (16 >>> sbit & 24) & 255;
            }
            value = 0;
        }
    }

    return output;
}

/**
 * Base64 encode a unsigned-byte array.
 * @param {Uint8Array} bytes - Array of unsigned-bytes.
 * @returns {string} Base64 encoded string.
 */
function base64Encode(bytes) {
    // Contents of this function based on following gist:
    // https://gist.github.com/jonleighton/958841

    /*
    MIT LICENSE
    Copyright 2011 Jon Leighton
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    */

    // Converts an ArrayBuffer directly to base64, without any intermediate 'convert to string then
    // use window.btoa' step. According to my tests, this appears to be a faster approach:
    // http://jsperf.com/encoding-xhr-image-data/5

    const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    const byteLength = bytes.byteLength;
    const byteRemainder = byteLength % 3;
    const mainLength = byteLength - byteRemainder;

    let a, b, c, d;
    let chunk;

    let base64 = '';

    // Main loop deals with bytes in chunks of 3
    for (let i = 0; i < mainLength; i = i + 3) {

        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048)   >> 12; // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032)     >>  6; // 4032     = (2^6 - 1) << 6
        d = chunk & 63;               // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder === 1) {
        chunk = bytes[mainLength];

        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3)   << 4; // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '==';

    } else if (byteRemainder === 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008)  >>  4; // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15)    <<  2; // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    }

    return base64;
}
