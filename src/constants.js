// noinspection JSUnresolvedVariable
const isProduction = STAGING_ENV === 'prod';

// noinspection JSUnresolvedVariable
console.assert(!isProduction && STAGING_ENV === 'dev', STAGING_ENV);

const config = {
    isProduction
};

export default config;
