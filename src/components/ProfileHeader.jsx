import React from "react";
import PropTypes from "prop-types";
import Radium from "radium";
import ProfileHeaderAvatar from "./ProfileHeaderAvatar";
import ProfileHeaderInfo from "./ProfileHeaderInfo";
import clone from "lodash.clone";
import merge from "lodash.merge";

ProfileHeader.propTypes = {
    banner: PropTypes.string,
    avatar: PropTypes.string,
    displayName: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
};

function ProfileHeader(props) {
    const style = clone(styles.component);
    if (props.banner) {
        merge(style, {
            backgroundImage: `url(${props.banner})`,
        });
    }
    return (
        <div style={style}>
            <div style={styles.padding}>
                <ProfileHeaderAvatar
                    avatar={props.avatar}
                />
                <ProfileHeaderInfo
                    displayName={props.displayName}
                    firstName={props.firstName}
                    lastName={props.lastName}
                    city={props.city}
                    country={props.country}
                />
            </div>
        </div>
    );
}

export default Radium(ProfileHeader);

const styles = {
    component: {
        height: '260px',
        backgroundColor: '#333',
        backgroundSize: 'auto 100%',
        backgroundPosition: 'top left',
        backgroundRepeat: 'no-repeat',
    },
    padding: {
        padding: '30px 20px',
        '@media (min-width: 1080px)': {
            padding: '30px'
        },
    },
};
