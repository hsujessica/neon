let activeColor;
let text;

// need to override after initial load
// window.onload = () => {
//   chrome.tabs.query({
//     active: true,
//     currentWindow: true
//   }, function (tabs) {
//     chrome.tabs.executeScript(
//         tabs[0].id,
//         {code: `let style = document.createElement('style');
//           document.head.appendChild(style);
//           style.sheet.insertRule("::selection {background-color: ${newColor}}")
//           function getHighlightedText () {
//             let text = '';
//             if (window.getSelection()) {
//               text = window.getSelection().toString();
//             }
//             return text;
//           }
//           document.addEventListener('selectionchange', function () {
//               let text = getHighlightedText();
//               console.log(text);
//           });`}
//     );
//   });
// };

// chrome.runtime.sendMessage({msg: "color"}, function (response) {
//   console.log(response.color);
// });

chrome.storage.sync.get('color', function (data) {
  activeColor = data.color
  highlight();
});

function highlight ()  {
  let style = document.createElement('style');
  document.head.appendChild(style);
  style.sheet.insertRule(`::selection {background-color: ${activeColor}}`)
  function getHighlightedText () {
    let text = '';
    if (window.getSelection()) {
      text = window.getSelection().toString();
    }
    return text;
  }
  document.addEventListener('selectionchange', function () {
      let text = getHighlightedText();
      console.log(text);
  });
  document.addEventListener('keypress', function (event) {
    if (event.key === 'n') {
      let text = getHighlightedText();
      console.log(text);
      saveHighlight(text);
    }
  });
}

function saveHighlight (text) {
  let request = indexedDB.open('highlights', 3);
  request.onerror = function (event) {
    alert('IndexedDB?!');
  };
  request.onupgradeneeded = function (event) {
    db = event.target.result;
    let objectStore = db.createObjectStore('highlights', {keyPath: 'highlights', autoIncrement: true});
    // NEED TO HANDLE UPDATE
    // objectStore.transaction.oncomplete = function (event) {
    //   let highlightsObjectStore = db.transaction('highlights', 'readwrite').objectStore("highlights");
    //   let highlight =   {color: activeColor, text: text, url: window.location.href, timestamp: new Date()};
    //   highlightsObjectStore.add(highlight);
    // };
  };
  request.onsuccess = function (event) {
    db = event.target.result;
    let highlightsObjectStore = db.transaction('highlights', 'readwrite').objectStore("highlights");
    let highlight =   {color: activeColor, text: text, url: window.location.href, timestamp: new Date()};
    console.log(highlight)
    highlightsObjectStore.add(highlight);
  }
}
