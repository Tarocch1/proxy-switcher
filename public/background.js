const MAX_TRIES = 5;
const MESSAGE_TYPE = {
  SET_HTTP_AUTH: 'SET_HTTP_AUTH',
  UNSET_HTTP_AUTH: 'UNSET_HTTP_AUTH',
};
const requests = {};
let authCredentials = null;

chrome.webRequest.onAuthRequired.addListener(
  function(details) {
    if (details.isProxy && authCredentials) {
      if (!(details.requestId in requests)) {
        requests[details.requestId] = {
          tries: 0,
        };
      }
      requests[details.requestId].tries++;
      if (requests[details.requestId].tries > MAX_TRIES) {
        delete requests[details.requestId];
        return {
          cancel: true,
        };
      }
      return { authCredentials };
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking'],
);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.type) {
    case MESSAGE_TYPE.SET_HTTP_AUTH:
      authCredentials = message.payload;
      break;
    case MESSAGE_TYPE.UNSET_HTTP_AUTH:
      authCredentials = null;
      break;
    default:
      break;
  }
});
