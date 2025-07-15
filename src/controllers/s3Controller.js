const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
// const AWS = require('aws-sdk'); // Older AWS SDK v2
const dotenv = require('dotenv');

dotenv.config({
  path: './config.env',
  // path.join(__dirname, './config.env')
});

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION, // Replace with your region
// });

console.log(
  `-- ENVIRONMENT  LOCALHOST_AD_URL --: `,
  process.env.LOCALHOST_AD_URL
);

// console.log(`-- ENVIRONMENT PROCESSES --: `, process.env);
console.log(`-- AWS REGION --: `, process.env.AWS_REGION);
console.log(`-- S3 BUCKET NAME --: `, process.env.S3_BUCKET_NAME);
console.log(`Credentials -- ACCESS KEY ID --: `, process.env.AWS_ACCESS_KEY_ID);
console.log(
  `Credentials -- SECRET ACCESS KEY --: `,
  process.env.AWS_SECRET_ACCESS_KEY
);

// Initialize the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// File upload function
const uploadVideoToS3 = async (
  // file, channelId
  req,
  res
) => {
  const { file, channelId } = req.body;

  const ext = file.mimetype.split('/')[1];
  const filename = `video-${channelId}-${Date.now().toString()}.${ext}`;
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename,
      Body: file.buffer,
    },
  });

  try {
    const result = await upload.done();
    console.log(`RESULTS FROM AWS_S3_CONTROLLER:`, result.Location);
    // return result;
    return res.status(200).json({
      result: result.Location, // S3 URL
      key: filename, // Filename used in S3
    });
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
};

const uploadContentToS3 = async (
  // file, channelId, filetype
  req,
  res
) => {
  const { file, channelId, filetype } = req.body;

  console.log(`File from upload Content To S3: `, file);
  console.log(`Channel Id from upload Content To S3: `, channelId);
  console.log(`File Type from upload Content To S3: `, filetype);

  if (!file || !file.mimetype) {
    console.error('Invalid file object:', file);
    throw new Error('Invalid file object: mimetype is missing');
  }

  console.log(`UPLOAD VIDEO TO S3 FILE:`, file);
  const ext = file.mimetype.split('/')[1];
  const filename = `${filetype}-${channelId}-${Date.now().toString()}.${ext}`;

  console.log(`File name: `, filename);

  // Determine ContentType based on fileType or mimetype
  const contentType = file.mimetype;

  console.log(`Content Type: `, contentType);
  console.log(`Buffer: `, file.buffer);

  const body = Buffer.isBuffer(file.buffer)
    ? file.buffer
    : Buffer.from(file.buffer.data);

  console.log('Buffer Type:', Buffer.isBuffer(body)); // Should be true
  console.log('Buffer Length:', body.length); // Should not be zero

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename,
      Body: body,
      ContentType: contentType, // Set appropriate content type for each file
    },
  });

  console.log(`Upload from upload Const: `, upload);

  try {
    const result = await upload.done();

    console.log(`RESULTS FROM AWS_S3_CONTROLLER:`, result);
    console.log(`RESULTS LOCATION FROM AWS_S3_CONTROLLER:`, result.Location);
    // return result;
    return res.status(200).json({
      result: result.Location, // S3 URL
      key: filename, // Filename used in S3
    });
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
};

const generatePresignedUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // URL expiration time in seconds
    return url;
  } catch (err) {
    console.log(
      `S3 CONTROLLER | CHANNELS CONTROLLER | ERROR ⭕⭕⭕ | ⭕⭕⭕ Error generating pre-signed URL:`,
      err
    );
    throw err;
  }
};

// Export the function
module.exports = {
  uploadContentToS3,
  uploadVideoToS3,
  generatePresignedUrl,
};
