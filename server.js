/**
 * Required External Modules
 */
const express = require('express');
const path = require("path");

/**
 * App Variables
 */
const app = express();
const port = 3000 || process.env.PORT;
const quotesRouter = require('./routes/quotes');
const snapsRouter = require('./routes/snaps');

/**
 *  App Configuration
 */

app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

/**
 * Routes Definitions
 */

app.get('/', (req, res) => {
    //res.json({ message: 'alive' });
    //res.status(200).send("MineEyes~! Alive.");
    res.render("index", { title: "Home" });
});

app.get('/report', (req, res) => {
    res.render("report", { title: "Report", reportParams: { rigName: "NotSet" } });
});

app.get('/report/:rigname', (req, res) => {
    /*
    var rig = req.params.rigname;
    if (!req.params.rigname)
        rig = "Ado3090";

    */
    //res.render("report", { title: "Report", reportParams: { rigName: "NoLikey" } });
    res.send('rig: ' + rig);
});

app.use('/quotes', quotesRouter);
app.use('/snaps', snapsRouter);

/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});