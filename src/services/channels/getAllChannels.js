const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');

const getAllChannels = catchAsync(async () => {
  try {
    const data = await axios.get(
      `${process.env.LOCALHOST_CHANNEL_URL}/api/v1/channels/channel-routes/`
    );

    return data;
  } catch (err) {
    return console.log(err.message);
  }
});

module.exports = { getAllChannels };
