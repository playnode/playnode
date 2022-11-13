import React from "react";
import PropTypes from "prop-types";
import clone from "lodash.clone";
import merge from "lodash.merge";

export default class ProfileHeaderAvatar extends React.Component {
    render() {
        const style = clone(styles.component);
        if (this.props.avatar) {
            merge(style, {
                backgroundImage: `url(${this.props.avatar})`,
            });
        }
        return <div style={style}/>;
    }
}

ProfileHeaderAvatar.propTypes = {
    avatar: PropTypes.string,
};

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
