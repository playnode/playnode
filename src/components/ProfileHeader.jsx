import React from "react";
import PropTypes from "prop-types";
import Radium from "radium";
import ProfileHeaderAvatar from "./ProfileHeaderAvatar";
import ProfileHeaderInfo from "./ProfileHeaderInfo";
import clone from "lodash.clone";
import merge from "lodash.merge";

class ProfileHeader extends React.Component {
    render() {
        const style = clone(styles.component);
        if (this.props.banner) {
            merge(style, {
                backgroundImage: `url(${this.props.banner})`,
            });
        }
        return (
            <div style={style}>
                <div style={styles.padding}>
                    <ProfileHeaderAvatar
                        avatar={this.props.avatar}
                    />
                    <ProfileHeaderInfo
                        displayName={this.props.displayName}
                        firstName={this.props.firstName}
                        lastName={this.props.lastName}
                        city={this.props.city}
                        country={this.props.country}
                    />
                </div>
            </div>
        );
    }
}

export default Radium(ProfileHeader);

ProfileHeader.propTypes = {
    banner: PropTypes.string,
    avatar: PropTypes.string,
    displayName: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
};

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
