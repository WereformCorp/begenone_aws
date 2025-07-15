const axios = require('axios');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
  console.log(`REQUEST FROM Protect Middleware`, req.method, req.originalUrl);

  try {
    // 1) Get the token (similar to your middleware)
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    console.log(`Token from PROTECT MIDDLEWARE`, token);

    if (!token) return next(new Error('No token provided.'));

    // 2) Make the POST request to the authentication middleware in another microservice
    const response = await axios.post(
      `${process.env.AUTH_URL}/api/v1/authentication/route-auth/authenticate/`,
      {}, // BODY!
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log(`RESPONSE FROM PROTECT MIDDLEWARE`, response.data);

    // If successful, move to the next middleware
    req.user = response?.data?.user; // Assuming the response contains the user data

    return next();
  } catch (err) {
    // Handle errors (You can customize error handling)
    console.error(err);
    return new Error('Authentication failed.');
  }
});

module.exports = protect;
