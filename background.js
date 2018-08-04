chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({color: '#ffff22'}, function() {
  });
});

chrome.tabs.query({
  active: true,
  currentWindow: true
}, function (tabs) {
  chrome.tabs.executeScript({
    file: "./highlight.js",
    allFrames: true
  });
});

// chrome.storage.sync.get('color', function (data) {
//   activeColor.style.backgroundColor = data.color;
//   activeColor.setAttribute('value', data.color);
// });

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
  console.log(sender.tab ?
              "from a content script:" + sender.tab.url :
              "from the extension");
  if (request.msg == "color")
    sendResponse({color: 'active' + activeColor});
});

// chrome.omnibox.onInputEntered.addListener(function(text) {
//   // Encode user input for special characters , / ? : @ & = + $ #
//   var newURL = 'https://www.google.com/search?q=' + encodeURIComponent(text);
//   chrome.tabs.create({ url: newURL });
// });
