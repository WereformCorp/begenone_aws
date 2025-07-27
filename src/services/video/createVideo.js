const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');

const isProd = process.env.NODE_ENV === 'production';

const videoUrlPath = isProd
  ? process.env.PRODUCTION_APP_VIDEO_API_URL_PRODUCTION
  : process.env.LOCALHOST_VIDEO_URL;

const createVideo = catchAsync(async (body) => {
  try {
    const data = await axios.post(`${videoUrlPath}/api/v1/videos`, {
      body,
    });

    return data;
  } catch (err) {
    return console.log(err.message);
  }
});

module.exports = { createVideo };
