const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');

const createVideo = catchAsync(async (body) => {
  try {
    const data = await axios.post(
      `${process.env.LOCALHOST_VIDEO_URL}/api/v1/videos`,
      {
        body,
      }
    );

    return data;
  } catch (err) {
    return console.log(err.message);
  }
});

module.exports = { createVideo };
