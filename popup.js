let activeColor = document.getElementById('activeColor');
let colors = document.getElementsByClassName('color');

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
  activeColor.style.backgroundColor = data.color;
  activeColor.setAttribute('value', data.color);
});

const getUrl = () => {
  chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
    return tabs[0].url;
  });
}

let btnDiv = document.getElementById('color-btns');

const palette = ['#ffff22', '#ccff00', '#39ff14', '#a8ff00', '#11ffee', '#32ffcc', '#f89902', '#57c1ff', '#ff4492'];

function constructOptions (palette) {
  for (let color of palette) {
    let button = document.createElement('button');
    button.className = 'color';
    button.style.backgroundColor = color;
    button.value = color;
    button.addEventListener('click', switchColor);
    btnDiv.appendChild(button);
  }
}

constructOptions(palette);

function switchColor(event) {
  let newColor = event.target.value;
  chrome.storage.sync.set({color: newColor}, function () {
    activeColor.setAttribute('value', newColor);
    activeColor.style.backgroundColor = newColor;
  });
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: `let style = document.createElement('style');
          document.head.appendChild(style);
          style.sheet.insertRule("::selection {background-color: ${newColor}}")
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
            }
          });
          let request = indexedDB.open('highlights', 3);
          request.onerror = function (event) {
            alert('IndexedDB?!');
          };
          request.onupgradeneeded = function (event) {
            db = event.target.result;
            let objectStore = db.createObjectStore('highlights', {keyPath: 'highlights', autoIncrement: true});
            objectStore.transaction.oncomplete = function (event) {
              let highlightsObjectStore = db.transaction('highlights', 'readwrite');
              let highlight =   {color: '#ffff22', text: text, url: getUrl(), timestamp: new Date()};
              console.log(highlight)
              highlightsObjectStore.add(highlight);
            };
          };
          request.onsuccess = function (event) {
            db = event.target.result;
            let highlightsObjectStore = db.transaction('highlights', 'readwrite');
            let highlight =   {color: '#ffff22', text: text, url: getUrl(), timestamp: new Date()};
            console.log(highlight)
            highlightsObjectStore.add(highlight);
          }
          `}
    );
  });
}

const highlight = () => {
  let style = document.createElement('style');
  document.head.appendChild(style);
  style.sheet.insertRule("::selection {background-color: ${newColor}}")
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
    }
  });
}

function saveHighlight (text) {

}

chrome.runtime.sendMessage({greeting: "hello"}, function (response) {
  console.log(response.farewell);
});
