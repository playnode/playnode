import React from "react";
import PropTypes from "prop-types";

export default class TrackTime extends React.Component {
    render() {
        return (
            <div>
                <div style={styles.element}>
                    {formatTime(this.props.position)}
                </div>
                /
                <div style={styles.element}>
                    {formatTime(this.props.duration)}
                </div>
            </div>
        );
    }
}

TrackTime.propTypes = {
    duration: PropTypes.number,
    position: PropTypes.number,
};

const styles = {
    element: {
        display: 'inline-block',
    }
};

function formatTime(ms) {
    if (!ms) return '0:00';

    // Convert ms to total seconds and divide between h/m/s
    const total = Math.round(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor(total / 60);
    const s = total - m * 60;

    const pad = (digits, len) => {
        const str = new Array(1 + len).join('0');
        return (str + digits).slice(-str.length);
    };

    const a = [];
    if (h > 0) a.push(pad(h, 2));
    if (h > 0) a.push(pad(m, 2));
    else a.push(m.toString());
    a.push(pad(s, 2));

    return a.join(':');
}
