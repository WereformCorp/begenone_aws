const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');

const isProd = process.env.NODE_ENV === 'production';

const channelUrlPath = isProd
  ? process.env.PRODUCTION_APP_CHANNEL_API_URL_PRODUCTION
  : process.env.LOCALHOST_CHANNEL_URL;

const getAllChannels = catchAsync(async () => {
  try {
    const data = await axios.get(
      `${channelUrlPath}/api/v1/channels/channel-routes/`
    );

    return data;
  } catch (err) {
    return console.log(err.message);
  }
});

module.exports = { getAllChannels };
