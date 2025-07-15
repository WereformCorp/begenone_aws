const express = require('express');
// const multer = require('multer');

const s3UploadBanner = require('../../controllers/s3UploadBanner');
const s3UploadPFP = require('../../controllers/s3UploadPfp');
const s3UploadVideo = require('../../controllers/s3UploadVideo');

const {
  uploadContentToS3,
  uploadVideoToS3,
  generatePresignedUrl,
} = require('../../controllers/s3Controller');
// const protect = require('../../middlewares/protectMiddleware');

const router = express.Router({ mergeParams: true });

// Configure Multer for memory storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

router.post('/upload-banner', s3UploadBanner);
router.post('/upload-pfp', s3UploadPFP);
router.post('/upload-video', s3UploadVideo);

router.post('/s3-upload-content', uploadContentToS3);
router.post('/s3-upload-video', uploadVideoToS3);
router.post('/s3-generatePresignedUrl', generatePresignedUrl);

module.exports = router;
