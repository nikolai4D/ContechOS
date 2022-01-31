require('dotenv').config();

const allowedOrigins = [
    `${process.env.DEV_DOMAIN}:${process.env.PORT}`,
    `${process.env.PROD_DOMAIN}`
];

module.exports = allowedOrigins;
