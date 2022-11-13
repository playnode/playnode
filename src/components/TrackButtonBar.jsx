import React from "react";
import PropTypes from "prop-types";

class TrackButtonBar extends React.Component {
    render() {
        return (
            <div style={styles.component}>
                <ul style={styles.list}>
                    {this.props.download &&
                        <li style={styles.right}>
                            <a style={styles.link}
                               download={this.props.downloadAs || ""}
                               href={this.props.download}>Download</a>
                        </li>
                    }
                </ul>
            </div>
        );
    }
}

export default TrackButtonBar;

TrackButtonBar.propTypes = {
    download: PropTypes.string,
    downloadAs: PropTypes.string,
};

const styles = {
    component: {
        backgroundColor: '#eee',
        borderTop: '1px solid #ccc',
        height: '20px',
        color: '#666',
    },
    list: {
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        height: '20px',
        overflow: 'hidden',
    },
    left: {
        float: 'left',
        borderRight: '1px solid #ccc',
        height: '20px',
        verticalAlign: 'middle',
    },
    right: {
        float: 'right',
        borderLeft: '1px solid #ccc',
        height: '20px',
        verticalAlign: 'middle',
    },
    link: {
        display: 'block',
        color: '#666',
        textAlign: 'center',
        textDecoration: 'none',
        fontSize: '0.65em',
        padding: '6px 8px 6px 8px',
        cursor: 'pointer',
        ':hover': {
            background: '#f5f5f5',
            color: 'black',
        },
    },
};
