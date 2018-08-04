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

chrome.storage.sync.get('color', function (data) {
  // activeColor.style.backgroundColor = data.color;
  // activeColor.setAttribute('value', data.color);
  activeColor = data.color
});

chrome.runtime.sendMessage({msg: "color"}, function (response) {
  console.log(response.color);
});

let style = document.createElement('style');
document.head.appendChild(style);
style.sheet.insertRule(`::selection {background-color: blue}`)
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

// need to wrap this into a function savetoDB, which gets called on keypress ^


function saveHighlight (text) {

  let request = indexedDB.open('highlights', 3);
  request.onerror = function (event) {
    alert('IndexedDB?!');
  };
  request.onupgradeneeded = function (event) {
    db = event.target.result;
    let objectStore = db.createObjectStore('highlights', {keyPath: 'highlights', autoIncrement: true});
    objectStore.transaction.oncomplete = function (event) {
      let highlightsObjectStore = db.transaction('highlights', 'readwrite').objectStore("highlights");
      let highlight =   {color: activeColor, text: text, url: window.location.href, timestamp: new Date()};
      console.log(highlight)
      highlightsObjectStore.add(highlight);
    };
  };
  request.onsuccess = function (event) {
    db = event.target.result;
    let highlightsObjectStore = db.transaction('highlights', 'readwrite').objectStore("highlights");
    let highlight =   {color: activeColor, text: text, url: window.location.href, timestamp: new Date()};
    console.log(highlight)
    highlightsObjectStore.add(highlight);
  }

}


// const highlight = () => {
//   let style = document.createElement('style');
//   document.head.appendChild(style);
//   style.sheet.insertRule("::selection {background-color: ${newColor}}")
//   function getHighlightedText () {
//     let text = '';
//     if (window.getSelection()) {
//       text = window.getSelection().toString();
//     }
//     return text;
//   }
//   document.addEventListener('selectionchange', function () {
//       let text = getHighlightedText();
//       console.log(text);
//   });
//   document.addEventListener('keypress', function (event) {
//     if (event.key === 'n') {
//       let text = getHighlightedText();
//       console.log(text);
//     }
//   });
// }
