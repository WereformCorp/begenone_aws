const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');

const updateChannel = catchAsync(async (dataObj, id) => {
  try {
    const data = await axios.patch(
      `${process.env.LOCALHOST_CHANNEL_URL}/api/v1/channels/channel-routes/${id}`,
      { dataObj }
    );

    if (!data) throw new Error(`There was an Error! Update Channel API CALL`);

    return data;
  } catch (err) {
    return console.log(err.message);
  }
});

module.exports = updateChannel;
