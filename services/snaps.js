const db = require('../services/db');
const config = require('../config');

function getPaged(rigname, page = 1) {
    const sql = 'SELECT * FROM snapshot ';
    const params = [];

    if (rigname) {
        sql += 'where rig = ? '
        params[0] = rigname;
    }

    sql += ' order by snapped_at LIMIT ?,?'

    params[1] = (page - 1) * config.listPerPage;
    params[2] = config.listPerPage;

    console.log(sql);
    console.log(params);

    const data = db.query(sql, params);
    const meta = { page };

    return {
        data,
        meta
    }
}

function get(count) {
    const data = db.query('SELECT * FROM snapshot order by snapped_at desc LIMIT ?', [count]);
    const meta = { count };

    return {
        data,
        meta
    }
}

function getCount() {
    const data = db.query('SELECT count(*) FROM snapshot');

    return {
        data
    }
}

function getStatus(rigname) {
    // see if a snap has been created in the last bit (use a config for window)
    // see if temp has exceeded config value in last bit
    const sql = "select count(*) snaps, max(temp_vram) maxvramtemp from snapshot where rig = '" + rigname + "' and snapped_at >= strftime('%Y-%m-%dT%H:%M:%S', datetime('now', '-" + config.alertWindow + " Second'))";
    const data = db.query(sql,[]);

    var status;
    const temp = data[0].maxvramtemp;
    const snapcount = data[0].snaps;
    const window = config.alertWindow;
    const alertTemp = config.alertTemp;

    ((snapcount > 0) && (temp < alertTemp)) ? status = 200 : status = 500;

    return {
        status,
        temp,
        alertTemp,
        snapcount,
        window
    }
}

// In a more real-world application, the Joi NPM package can be used for better validation.
function validateCreate(snap) {
    let messages = [];

    console.log(snap);

    if (!snap) {
        messages.push('No object is provided');
    }

    if (!snap.token) {
        messages.push('No auth provided.');
    }

    if (snap.token != config.token) {
        messages.push('Invalid auth.');
    }

    if (messages.length) {
        let error = new Error(messages.join());
        error.statusCode = 400;

        throw error;
    }
}

function create(snapObj) {
    validateCreate(snapObj);
    const { pool, snapped_at, gpuid, rate, temp_core, temp_vram, power, fan_rate, efficiency_rating, shares_accepted, shares_total, rig } = snapObj;
    const result = db.run(
        'INSERT INTO snapshot (' +
        'pool, snapped_at, gpuid, rate, temp_core, temp_vram, power, fan_rate, efficiency_rating, shares_accepted, shares_total, rig' +
        ') VALUES (' +
        '@pool, @snapped_at, @gpuid, @rate, @temp_core, @temp_vram, @power, @fan_rate, @efficiency_rating, @shares_accepted, @shares_total, @rig' +
        ') ', { pool, snapped_at, gpuid, rate, temp_core, temp_vram, power, fan_rate, efficiency_rating, shares_accepted, shares_total, rig });

    let message = 'Error in creating snap';
    if (result.changes) {
        message = 'Snap created successfully';
    }

    return { message };
}

module.exports = {
    get,
    getStatus,
    getPaged,
    create
}