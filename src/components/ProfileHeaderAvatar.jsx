import React from "react";
import PropTypes from "prop-types";
import clone from "lodash.clone";
import merge from "lodash.merge";

ProfileHeaderAvatar.propTypes = {
    avatar: PropTypes.string,
};

export default function ProfileHeaderAvatar(props) {
    const style = clone(styles.component);
    if (props.avatar) {
        merge(style, {
            backgroundImage: `url(${props.avatar})`,
        });
    }
    return <div style={style}/>;
}

const styles = {
    component: {
        float: 'left',
        marginRight: '30px',
        borderRadius: '50%',
        height: '200px',
        width: '200px',
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        backgroundRepeat: 'no-repeat',
    },
};
