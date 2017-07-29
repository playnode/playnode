import React from "react";
import PropTypes from "prop-types";

export default class ProfileHeaderInfo extends React.Component {
    render() {

        const firstName = this.props.firstName;
        let lastName = this.props.lastName;
        const city = this.props.city;
        let country = this.props.country;

        if (lastName && firstName && firstName.length > 0) {
            lastName = ` ${lastName}`;
        }

        if (country && city && city.length > 0) {
            country = `, ${country}`;
        }

        const line2 = `${firstName?firstName:''}${lastName?lastName:''}`;
        const line3 = `${city?city:''}${country?country:''}`;

        return (
            <div style={{
                float: 'left',
            }}>
                <div>
                    <div style={styles.line1}>
                        {this.props.displayName}
                    </div>
                </div>
                {line2 &&
                    <div>
                        <div style={styles.line}>
                            {line2}
                        </div>
                    </div>
                }
                {line3 &&
                    <div>
                        <div style={styles.line}>
                            {line3}
                        </div>
                    </div>
                }
            </div>
        );
    }
}

ProfileHeaderInfo.propTypes = {
    displayName: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
};

const styles = {
    line1: {
        display: 'inline-block',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '8px 7px 0 7px',
        fontFamily: '"Overpass", sans-serif',
        fontSize: '24px',
        color: 'white',
        lineHeight: '34px',
    },
    line: {
        marginTop: '4px',
        display: 'inline-block',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '7px 7px 2px 7px',
        fontFamily: '"Overpass", sans-serif',
        fontSize: '16px',
        color: '#CCC',
    },
};
