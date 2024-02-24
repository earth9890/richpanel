const connectToDatabase = require("../../Database/DB");
const userModel = require("../../Models/User");
const { sendError, sendResponse } = require("../../Utils/Response");

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const queryParams = event.queryStringParameters;
    if (queryParams) {
      const verifyToken = process.env.FB_TOKEN_VERIFY;
      let token = queryParams["hub.verify_token"];
      let challenge = queryParams["hub.challenge"];

      console.log(token);
      console.log(challenge);
      if (token && token === verifyToken) {
        // Respond with the challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        return {
          statusCode: 200,
          body: challenge,
        };
      }
    }
    return sendError(403, { message: "error" });
  } catch (error) {
    return sendError(error?.statusCode, error);
  }
};
