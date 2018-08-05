let activeColor;
// need to override highlight color after initial page load
// window.onload = () => {
// };

// chrome.runtime.sendMessage({msg: "color"}, function (response) {
//   console.log(response.color);
// });

chrome.storage.sync.get('color', function (data) {
  activeColor = data.color
  highlight();
});

function highlight ()  {
  let text = '';
  let style = document.createElement('style');
  document.head.appendChild(style);
  style.sheet.insertRule(`::selection {background-color: ${activeColor}}`)
  function getHighlightedText () {
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
      let note = createNote();
      note.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
          saveHighlight(text, note.value);
          let body = document.getElementsByTagName('body')[0];
          body.removeChild(note);
        }
      });
    }
  });
}

function createNote () {
  let note = document.createElement('textarea');
  note.style.cssText = 'position:fixed; rows:5; top:10px; left: 5px; width:200px; height:200px; background-color: rgba(243,243,243,.7)';
  let body = document.getElementsByTagName('body')[0];
  body.appendChild(note);
  return note;
}

function saveHighlight (text, note) {
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
    //   let highlight =   {color: activeColor, text: text, note: note, url: window.location.href, timestamp: new Date()};
    //   highlightsObjectStore.add(highlight);
    // };
  };
  request.onsuccess = function (event) {
    db = event.target.result;
    let highlightsObjectStore = db.transaction('highlights', 'readwrite').objectStore('highlights');
    let highlight = {color: activeColor, text: text, note: note, url: window.location.href, timestamp: new Date()};
    highlightsObjectStore.add(highlight);
  }
}
