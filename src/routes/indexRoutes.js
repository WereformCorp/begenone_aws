const express = require('express');

const s3Router = require('./s3/s3Routes');

const router = express.Router({ mergeParams: true });

router.use('/s3', s3Router);

module.exports = router;
