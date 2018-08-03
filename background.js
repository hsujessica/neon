chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({color: '#ffff22'}, function() {
  });
});

// chrome.storage.local.get('signed_in', function(data) {
//   if (data.signed_in) {
//     chrome.browserAction.setPopup({popup: 'popup.html'});
//   } else {
//     chrome.browserAction.setPopup({popup: 'popup_sign_in.html'});
//   }
// });

// chrome.runtime.onMessage.addListener(function(message, callback) {
//     if (message === 'runContentScript'){
//       chrome.tabs.executeScript({
//         file: 'contentScript.js',
//       });
//     }
//  });

// chrome.commands.onCommand.addListener(function(command) {
//   chrome.tabs.query({currentWindow: true}, function(tabs) {
//     // Sort tabs according to their index in the window.
//     tabs.sort((a, b) => { return a.index < b.index; });
//     let activeIndex = tabs.findIndex((tab) => { return tab.active; });
//     let lastTab = tabs.length - 1;
//     let newIndex = -1;
//     if (command === 'flip-tabs-forward')
//       newIndex = activeIndex === 0 ? lastTab : activeIndex - 1;
//     else  // 'flip-tabs-backwards'
//       newIndex = activeIndex === lastTab ? 0 : activeIndex + 1;
//     chrome.tabs.update(tabs[newIndex].id, {active: true, highlighted: true});
//   });
// });

// chrome.omnibox.onInputEntered.addListener(function(text) {
//   // Encode user input for special characters , / ? : @ & = + $ #
//   var newURL = 'https://www.google.com/search?q=' + encodeURIComponent(text);
//   chrome.tabs.create({ url: newURL });
// });
