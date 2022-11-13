import React from "react";
import PropTypes from "prop-types";
import Radium from "radium";
import clone from "lodash.clone";
import merge from "lodash.merge";

// https://github.com/FormidableLabs/radium/tree/master/docs/faq#why-doesnt-radium-work-on-react-routers-link-or-react-bootstraps-button-or-someothercomponent
let Link = require('react-router-dom').Link;
Link = Radium(Link);

const showLinks = true;

TrackHeader.propTypes = {
    artist: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    cover: PropTypes.string,
    path: PropTypes.string.isRequired,
};

function TrackHeader(props) {
    const cover = clone(styles.cover);
    if (props.cover) {
        merge(cover, {
            backgroundImage: `url(${props.cover})`,
        });
    }

    return (
        <div style={styles.component}>
            {props.cover &&
                <div style={cover}/>
            }
            <div style={styles.info}>
                <div style={styles.title}>
                    {showLinks &&
                        <Link to={`${props.path}`} style={styles.link}>
                            {props.title}
                        </Link>
                    }
                    {!showLinks &&
                        <span>{props.title}</span>
                    }
                </div>
                <div style={styles.artist}>
                    {props.artist}
                </div>
            </div>
        </div>
    );
}

export default Radium(TrackHeader);

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
