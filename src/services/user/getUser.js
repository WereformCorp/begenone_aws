const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');

const getUser = catchAsync(async (userId) => {
  try {
    const user = await axios.get(
      `${process.env.LOCALHOST_USER_URL}/api/v1/users/${userId}`
    );

    const userData = user && user.data.data;

    return userData;
  } catch (err) {
    console.log(`GET USER | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getUser;
