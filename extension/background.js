chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  if (message.action === "fetchToken") {
    chrome.storage.local.get("token", (data) => {
      sendResponse(data.token || null);
    });
    // Return true because we’re responding asynchronously.
    return true;
  }
  
  if (message.action === "AddToken") {
    chrome.storage.local.set({ token: message.token }, () => {
      console.log("Token is set");
      // Call sendResponse after setting the token.
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (message.action === "closeTab") {
    chrome.tabs.remove(sender.tab.id);
    sendResponse({ success: true });
  }
  
  if (message.action === "newTab") {
    chrome.tabs.create({ url: message.url, active: true });
    sendResponse({ success: true });
  }
  
  if (message.action === "getTabUrl") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse(tabs[0].url);
    });
    return true;
  }
});

chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    if (message.action === "AddToken") {
      chrome.storage.local.set({ token: message.token }, () => {
        console.log("Token is set");
      });
    }
    if (message.action === "fetchToken") {
      chrome.storage.local.get("token", (data) => {
        const token = data.token;
        if (token) {
          sendResponse(token);
        } else {
          sendResponse(null);
        }
      });
    }
  }
);
