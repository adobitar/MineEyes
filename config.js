const env = process.env;

const config = {
    listPerPage: env.LIST_PER_PAGE || 25,
    token: env.TOKEN || 'G4gRG9',
    alertWindow: env.ALERT_WINDOW || 90,
    alertTemp: env.ALERT_TEMP || 99
}

module.exports = config;