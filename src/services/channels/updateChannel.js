const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');

const isProd = process.env.NODE_ENV === 'production';

const channelUrlPath = isProd
  ? process.env.PRODUCTION_APP_CHANNEL_API_URL_PRODUCTION
  : process.env.LOCALHOST_CHANNEL_URL;

const updateChannel = catchAsync(async (dataObj, id) => {
  try {
    const data = await axios.patch(
      `${channelUrlPath}/api/v1/channels/channel-routes/${id}`,
      { dataObj }
    );

    if (!data) throw new Error(`There was an Error! Update Channel API CALL`);

    return data;
  } catch (err) {
    return console.log(err.message);
  }
});

module.exports = updateChannel;
