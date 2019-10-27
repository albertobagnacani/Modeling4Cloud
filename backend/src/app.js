var express = require('express');
var paginate = require('express-paginate');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');

var db = require('./db');
var Ping = require('../models/Ping');

var app = express();
var router = express.Router();

const UPLOAD_PATH = '../uploads/';
const upload = multer({ dest: UPLOAD_PATH });

app.use(paginate.middleware(100, 200));

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

// TODO remove and use cors module?
// To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like this
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

    // and remove cacheing so we get the most recent
    //res.setHeader('Cache-Control', 'no-cache');
    next();
});

router.get('/', function(req, res) {
    res.json({message: 'API Initialized!'});
});

router.route('/upload').post(upload.single('data'), function (req, res) {
    fs.rename(UPLOAD_PATH+req.file.filename, UPLOAD_PATH+req.file.originalname, function(err){
        if (err) return res.status(500).send("Problem in POST\n");
        res.status(200).send("File registered\n");

        const { exec } = require('child_process');
        exec('tail -n +2 '+ UPLOAD_PATH+req.file.originalname +' | mongoimport '+process.env.DBIMPORT+' --columnsHaveTypes --fields "provider.string\(\),from_zone.string\(\),to_zone.string\(\),from_host.string\(\),to_host.string\(\),icmp_seq.int32\(\),ttl.int32\(\),time.double\(\),timestamp.date\(2006-01-02T15:04:05-00:00\)"', (err, stdout, stderr) => {
            if (err) {
                // Handle error
                console.log(err)
                return;
            }
        });
    });
});

// TODO
// warnings;
// check better params;
// export code in a different file and refactor/improve it?;
// should unify threshold and range?
router.route('/pings').get(async function(req, res, next) {
    try {
        const [ results, itemCount ] = await Promise.all([
            Ping.find().limit(req.query.limit).skip(req.skip).lean().exec(),
            Ping.find().count({})
        ]);

        const pageCount = Math.ceil(itemCount / req.query.limit);

        if (req.accepts('json')) {
            res.json({
                object: 'list',
                numberOfItems: results.length,
                totalNumberOfItems: itemCount,
                totalNumberOfPages: pageCount,
                hasMorePages: paginate.hasNextPages(req)(pageCount),
                data: results
            });
        }
    } catch (err) {
        next(err);
    }
});

// TODO use aggregation everywhere
router.route('/pings/query/avgOfEveryPingOfSelectedDate').get(async (req, res, next) => {
    req.setTimeout(0);
    var start, end, sameRegion;

    start = new Date(req.query.start + "T00:00:00.0Z");
    end = new Date(req.query.end + "T23:59:59.0Z");
    sameRegion = parseInt(req.query.sameRegion);

    Ping.aggregate()
    //.project({sameRegion: {$cmp: ['$from_zone', '$to_zone']}, provider: "$provider", time: "$time", timestamp: "$timestamp"})
    //.match({$and: [{sameRegion: sameRegion}, {timestamp: {$gte: start, $lte: end}}]})
        .allowDiskUse(true)
        .project({sameRegion: {$cmp: ['$from_zone', '$to_zone']}, provider: "$provider", time: "$time", timestamp: "$timestamp"})
        .match({$and: [{sameRegion: sameRegion}, {timestamp: {$gte: new Date(start), $lte: new Date(end)}}]})
        .group({_id : "$provider", avg: {$avg: "$time"}})
        .exec(function (err, resp) {
            if (err) {
                // Handle error
                console.log(err);
            } else {
                res.json(resp);
            }
        })
});

router.route('/pings/query/avgOfEveryDayOfSelectedYear').get(async (req, res, next) => {
    req.setTimeout(0);
    var myMonth, myProvider, mySameRegion;

    myMonth = parseInt(req.query.year); // TODO req.query.month
    myProvider = req.query.provider;
    mySameRegion = parseInt(req.query.sameRegion);

    Ping.aggregate()
        .allowDiskUse(true)
        .match({provider: myProvider})
        .project({month: {$month: "$timestamp"}, sameRegion: {$cmp: ['$from_zone', '$to_zone']}, timestamp: "$timestamp", time: "$time"})
        .match({$and: [{month: myMonth}, {sameRegion: mySameRegion}]})
        .group({_id : {"$dayOfYear": "$timestamp"}, avg: {$avg: "$time"}})
        .sort({_id: 1})
        .exec(function (err, resp) {
            if (err) {
                // Handle error
                console.log(err);
            } else {
                res.json(resp);
            }
        })
});

router.route('/pings/query/threshold').get(async (req, res, next) => { // Threshold is in us
    try{
        var query = {}, sortQuery = {};

        var field = (req.query.field) ? req.query.field : 'time';
        var threshold = (req.query.threshold) ? ((req.query.field == 'time') ? req.query.threshold / 1000 : req.query.threshold) : 0.5;
        var operator = (req.query.operator) ? req.query.operator : 'lte';
        (req.query.sort) ? sortQuery[field] = req.query.sort : sortQuery[field] = 1;

        switch(operator){
            case 'lt':
                query[field] = {$lt : threshold}
                break;
            case 'lte':
                query[field] = {$lte : threshold}
                break;
            case 'gt':
                query[field] = {$gt : threshold}
                break;
            case 'gte':
                query[field] = {$gte : threshold}
                break;
            case 'eq':
                query[field] = {$eq : threshold}
                break;
            case 'ne':
                query[field] = {$ne : threshold}
                break;
            default:
                query[field] = {$lt : threshold}
        }

        var [ results, itemCount ] = await Promise.all([
            Ping.find(query).sort(sortQuery).limit(req.query.limit).skip(req.skip).lean().exec(),
            Ping.find(query).count({})
        ]);

        const pageCount = Math.ceil(itemCount / req.query.limit);

        if (req.accepts('json')) {
            res.json({
                object: 'list',
                numberOfItems: results.length,
                totalNumberOfItems: itemCount,
                totalNumberOfPages: pageCount,
                hasMorePages: paginate.hasNextPages(req)(pageCount),
                data: results
            });
        }
    } catch (err) {
        next(err);
    }
});

router.route('/pings/query/range').get(async (req, res, next) => {
    try{
        var query = {}, sortQuery = {};

        var field = req.query.field ? req.query.field : 'timestamp';
        var start, end;

        switch(field){
            case 'timestamp':
                start = new Date(req.query.start+"T00:00:00-00:00");
                end = new Date(req.query.end+"T23:59:59-00:00");
                break;
            case 'time':
                start = req.query.start / 1000;
                end = req.query.end / 1000;
                break;
            case 'ttl':
                start = req.query.start;
                end = req.query.end;
                break;
            default:
                start = new Date(req.query.start+"T00:00:00-00:00");
                end = new Date(req.query.end+"T23:59:59-00:00");
        }

        (req.query.sort) ? sortQuery[field] = req.query.sort : sortQuery[field] = 1;

        query[field] = { $gte : start, $lte : end};

        var [ results, itemCount ] = await Promise.all([
            Ping.find(query).sort(sortQuery).limit(req.query.limit).skip(req.skip).lean().exec(),
            Ping.find(query).count({})
        ]);

        const pageCount = Math.ceil(itemCount / req.query.limit);

        if (req.accepts('json')) {
            res.json({
                object: 'list',
                numberOfItems: results.length,
                totalNumberOfItems: itemCount,
                totalNumberOfPages: pageCount,
                hasMorePages: paginate.hasNextPages(req)(pageCount),
                data: results
            });
        }
    } catch (err) {
        next(err);
    }
});

router.route('/pings/query/zone').get(async (req, res, next) => { // TODO
    try{
        var query = {}, sortQuery = {};

        var zone = req.query.zone ? req.query.zone : 'same';

        (req.query.sort) ? sortQuery['time'] = req.query.sort : sortQuery['time'] = 1;

        (zone == 'same') ? query = {$where : "this.from_zone == this.to_zone"} : query = {$where : "this.from_zone != this.to_zone"};

        var [ results, itemCount ] = await Promise.all([
            Ping.find(query).sort(sortQuery).limit(req.query.limit).skip(req.skip).lean().exec(),
            Ping.find(query).count({})
        ]);

        const pageCount = Math.ceil(itemCount / req.query.limit);

        if (req.accepts('json')) {
            res.json({
                object: 'list',
                numberOfItems: results.length,
                totalNumberOfItems: itemCount,
                totalNumberOfPages: pageCount,
                hasMorePages: paginate.hasNextPages(req)(pageCount),
                data: results
            });
        }
    } catch (err) {
        next(err);
    }
});

router.route('/pings/query/provider').get(async (req, res, next) => {
    try {
        var provider = (req.query.provider) ? req.query.provider : 'AWS';

        const [ results, itemCount ] = await Promise.all([
            Ping.find({ provider: provider}).limit(req.query.limit).skip(req.skip).lean().exec(),
            Ping.find({ provider: provider}).count({})
        ]);

        const pageCount = Math.ceil(itemCount / req.query.limit);

        if (req.accepts('json')) {
            res.json({
                object: 'list',
                numberOfItems: results.length,
                totalNumberOfItems: itemCount,
                totalNumberOfPages: pageCount,
                hasMorePages: paginate.hasNextPages(req)(pageCount),
                data: results
            });
        }
    } catch (err) {
        next(err);

    }
});

app.use('/api', router);

module.exports = app;