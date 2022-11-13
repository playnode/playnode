import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import clone from "lodash.clone";
import merge from "lodash.merge";

const showLinks = true;

class TrackHeader extends React.Component {
    render() {

        const cover = clone(styles.cover);
        if (this.props.cover) {
            merge(cover, {
                backgroundImage: `url(${this.props.cover})`,
            });
        }

        return (
            <div style={styles.component}>
                {this.props.cover &&
                    <div style={cover}/>
                }
                <div style={styles.info}>
                    <div style={styles.title}>
                        {showLinks &&
                            <Link to={`${this.props.path}`} style={styles.link}>
                                {this.props.title}
                            </Link>
                        }
                        {!showLinks &&
                            <span>{this.props.title}</span>
                        }
                    </div>
                    <div style={styles.artist}>
                        {this.props.artist}
                    </div>
                </div>
            </div>
        );
    }
}

export default TrackHeader;

TrackHeader.propTypes = {
    artist: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    cover: PropTypes.string,
    path: PropTypes.string.isRequired,
};

const styles = {
    component: {
        height: '40px',
        overflow: 'hidden',
        marginBottom: '5px',
    },
    cover: {
        borderRadius: '2px',
        width: '40px',
        height: '40px',
        float: 'left',
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        backgroundRepeat: 'no-repeat',
        marginRight: '10px',
    },
    info: {
        float: 'left',
        margin: '2px 0 0 0',
    },
    title: {
        fontSize: '1.2em',
        lineHeight: '1em',
    },
    link: {
        color: 'black',
        textDecoration: 'none',
        ':hover': {
            textDecoration: 'underline',
        }
    },
    artist: {
        fontSize: '0.8em',
        lineHeight: '1.5em',
        color: '#444'
    },
};
