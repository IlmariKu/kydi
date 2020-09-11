export function api_get(url) {
  const response = (async () => {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*",
        "Content-Type": "multipart/form-data",
      },
    });
    return await rawResponse.json();
  })();
  return response;
}

export function api_post(url, form, noHeaders = false) {
  const response = (async () => {
    const httpReq = {
      method: "POST",
      body: JSON.stringify(form),
    };
    if (noHeaders === false) {
      httpReq.headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
    }
    const rawResponse = await fetch(url, httpReq);
    return await rawResponse.json();
  })();
  return response;
}

export const SLACK_WEBHOOK =
  "http://INSERT_SLACKHOOK_URL_HERE";

const DEV = process.env["DEV_MODE"] === "true" ? true : false;

export const GET_PROFILE_INFO_URL = // SAME IN PROD
  "https://tqudkzwpaa.execute-api.eu-central-1.amazonaws.com/dev/get-user-profile"; // SAME IN PROD

export const UPDATE_PROFILE_INFO_URL = // SAME IN PROD
  "https://tqudkzwpaa.execute-api.eu-central-1.amazonaws.com/dev/post-userData"; // SAME IN PROD

export const S3_BASE_URL =
  "xxxxx";

export const SEARCH_RIDES_URL = DEV
  ? "https://daz7xbi25e.execute-api.eu-central-1.amazonaws.com/dev/get_rides"
  : "https://j2sslwb0y2.execute-api.eu-central-1.amazonaws.com/prod/get_rides";

export const POST_RIDE_UPDATE = DEV
  ? "https://daz7xbi25e.execute-api.eu-central-1.amazonaws.com/dev/post_ride_update"
  : "https://daz7xbi25e.execute-api.eu-central-1.amazonaws.com/dev/post_ride_update";

export const SEND_MESSAGE_URL =
  "https://psx3hujh9c.execute-api.eu-central-1.amazonaws.com/prod/post-chat-messages";

export const POLL_MESSAGE_URL =
  "https://psx3hujh9c.execute-api.eu-central-1.amazonaws.com/prod/get-chat-messages";

export const POST_REVIEW_URL =
  "https://kd77s0n4i2.execute-api.eu-central-1.amazonaws.com/prod/post-reviews";

export const GET_REVIEWS_URL =
  "https://kd77s0n4i2.execute-api.eu-central-1.amazonaws.com/prod/get-reviews";

export const POST_NEW_RIDE_URL = DEV
  ? "https://daz7xbi25e.execute-api.eu-central-1.amazonaws.com/dev/post_new_ride"
  : "https://j2sslwb0y2.execute-api.eu-central-1.amazonaws.com/prod/post_new_ride";

export const ACCEPTED_PASSENGERS_URL = DEV
  ? "https://daz7xbi25e.execute-api.eu-central-1.amazonaws.com/dev/post_accepted_passengers"
  : "https://j2sslwb0y2.execute-api.eu-central-1.amazonaws.com/prod/post_accepted_passengers";

export const GET_REQUESTS_URL = DEV
  ? "https://4wmd35b963.execute-api.eu-central-1.amazonaws.com/dev/get-requested-rides"
  : "https://4wmd35b963.execute-api.eu-central-1.amazonaws.com/dev/get-requested-rides"; // No prod address

export const POST_NEW_REQUEST_URL = DEV
  ? "https://4wmd35b963.execute-api.eu-central-1.amazonaws.com/dev/post-new-request"
  : "https://0q9sqv59c8.execute-api.eu-central-1.amazonaws.com/prod/post-new-request";
