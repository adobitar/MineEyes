const express = require('express');
const router = express.Router();
const snaps = require('../services/snaps');

/* ============================================================================
 * GET snap listing. 
 * ============================================================================
 * Params:
 *      count: specify how many snaps to return (last ${count} snaps)
 * ========================================================================= */
router.get('/:rigname', function (req, res, next) {
    try {
        if (req.query.page)
            res.json(snaps.getPaged(req.params.rigname, req.query.page));
        else
        {
            var count = req.query.count;

            if (!count)
                count = 10;

            res.json(snaps.get(count));
        }
    } catch (err) {
        console.error(`Error while getting snaps `, err.message);
        next(err);
    }
});

router.get('/status/:rigname', function (req, res, next) {
    try {
        const ret = snaps.getStatus(req.params.rigname);

        res.status(ret.status).json({
            status: ret.status,
            snaps: ret.snapcount,
            vramtemp: ret.temp,
            alertTemp: ret.alertTemp,
            windowConf: ret.window
        });
    } catch (err) {
        console.error(`Error getting status `, err.message);
        next(err);
    }
})

/* POST quote */
router.post('/', function (req, res, next) {
    try {
        res.json(snaps.create(req.body));
    } catch (err) {
        console.error('Error while adding snapshot ', err.message);
        next(err);
    }
});

module.exports = router;