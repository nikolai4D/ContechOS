require('dotenv').config();

const allowedOrigins = [
    `${process.env.DEV_DOMAIN}:${process.env.PORT}`,
    `${process.env.PROD_DOMAIN}:${process.env.PROD_PORT}`
];

module.exports = allowedOrigins;