chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({color: '#ffff22'}, function() {
  });
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.active) {
    // do your things
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      chrome.tabs.executeScript({
        file: './highlight.js',
        allFrames: true
      });
    });

  }
})

// chrome.storage.sync.get('color', function (data) {
//   activeColor.style.backgroundColor = data.color;
//   activeColor.setAttribute('value', data.color);
// });

// chrome.omnibox.onInputEntered.addListener(function(text) {
//   // Encode user input for special characters , / ? : @ & = + $ #
//   var newURL = 'https://www.google.com/search?q=' + encodeURIComponent(text);
//   chrome.tabs.create({ url: newURL });
// });
