chrome.storage.sync.get('color', function (data) {
  let activeColor = data.color;
  highlight(activeColor);
});

function loadNotes () {
  if (!document.getElementsByClassName('neon-highlights').length) {
    let indexdb = indexedDB.open('highlights', 3);
    indexdb.onerror = function (event) {
      alert('IndexedDB?!');
    };
    indexdb.onupgradeneeded = function (event) {
      db = event.target.result;
      let objectStore = db.createObjectStore('highlights', {keyPath: 'highlights', autoIncrement: true});
      // NEED TO HANDLE UPDATE
      // objectStore.transaction.oncomplete = function (event) {
      //   let highlightsObjectStore = db.transaction('highlights', 'readwrite').objectStore("highlights");
      //   let highlight =   {color: activeColor, text: text, note: note, url: window.location.href, timestamp: new Date()};
      //   highlightsObjectStore.add(highlight);
      // };
    };
    indexdb.onsuccess = function (event) {
      db = event.target.result;
      db.transaction('highlights').objectStore('highlights').getAll().onsuccess = function (event) { //retrieving all past stored highlights / notes
        const saves = event.target.result;
        let table = document.createElement('table');
        table.className = 'neon-highlights';
        if (saves.length) {
          let download = createDownloadButton(saves);
          table.appendChild(download);
          let clearNotes = createClearButton();
          table.appendChild(clearNotes);
          for (let item of saves) {
            table.appendChild(createNoteRow(item));
            // console.log(`<td style='background-color:${item.color}'>${item.text}</td><td><a href='${item.url}'>Link</a></td><td>${item.timestamp}</td>`);
          }
        }
        else {
          let notification = document.createElement('p');
          notification.innerHTML = 'No past highlights';
          notification.className = 'neon-notification-no-highlights';
          table.appendChild(notification);
        }
        table.style.cssText = 'display:block; font-size:10px; position:fixed; rows:5; top:10px; right:5px; width:300px; height:200px; z-index:1000000; background-color: rgba(243,243,243,.9); overflow:scroll';
        let body = document.getElementsByTagName('body')[0];
        body.appendChild(table);
      };
    }
  }
}
loadNotes();

function createDownloadButton (saves) {
  let blob = new Blob([JSON.stringify(saves)]);
  let download = document.createElement('a');
  download.innerHTML = 'download';
  download.href = window.URL.createObjectURL(blob);
  download.download = 'neon-highlights.json';
  download.style.padding = '5px';
  return download;
}

function createClearButton() {
  let clearNotes = document.createElement('a');
  clearNotes.innerHTML = 'clear';
  clearNotes.style.padding = '5px';
  clearNotes.addEventListener('click', function () {
    let userConfirm = confirm('are you sure?');
    if (userConfirm) {
      deleteAll();
    }
  });
  return clearNotes;
}

function deleteAll () {
  db.transaction('highlights', 'readwrite').objectStore('highlights').getAll().onsuccess = function (event) { //retrieving all past stored highlights / notes
    let saves = event.target.result;
    let objectStore = db.transaction('highlights', 'readwrite').objectStore('highlights');
    while (saves.length > 0) {
      let key = saves.shift()['highlights'];
      let request = objectStore.delete(key);
      request.onsuccess = function (event) {
        console.log(key + ' deleted');
      }
      request.onerror = function (event) {
        console.log(key + ' delete failed!!!');
      }
    }
  }
  let body = document.getElementsByTagName('body')[0];
  let table = document.getElementsByClassName('neon-highlights')[0];
  body.removeChild(table);
  loadNotes();
}

function createNoteRow (item) {
  let save = document.createElement('tr');
  save.innerHTML = `<td style='background-color:${item.color}'>${item.text}</td><td>${item.timestamp}<br />${item.note}</td>`;
  return save;
}

function getHighlightedText () {
  let text;
  if (window.getSelection()) {
    text = window.getSelection().toString();
  }
  return text;
}

function highlight (color) {
  let style;
  if (!style) {
    style = document.createElement('style');
    document.head.appendChild(style);
    style.sheet.insertRule(`::selection {background-color: ${color}}`);
  }
  else {
    style.sheet.deleteRule(0);
    style.sheet.insertRule(`::selection {background-color: ${color}}`);
  }
  // document.addEventListener('selectionchange', function () {
  //     text = getHighlightedText();
  //     console.log(text);
  // });
  document.addEventListener('keypress', function handleKeypress (event) {
    if (event.key === 'n') {
      let text = '';
      text = getHighlightedText();
      if (text.length) {
        let note = takeNote();
        note.addEventListener('keypress', function (event) {
          if (event.key === 'Enter') {
            saveHighlight(text, color, note.value);
            let body = document.getElementsByTagName('body')[0];
            let notes = document.getElementsByClassName('neon-highlight-note');
            [...notes].forEach(n => {
              body.removeChild(n);
            })
          }
        });
      }
    }
  });
}

function takeNote () {
  let note = document.createElement('textarea');
  note.autofocus = '';
  note.className = 'neon-highlight-note';
  note.style.cssText = 'position:fixed; rows:5; top:10px; left: 5px; width:200px; height:200px; z-index: 1000000; background-color: rgba(243,243,243,.9)';
  let body = document.getElementsByTagName('body')[0];
  body.appendChild(note);
  return note;
}

function saveHighlight (text, color, note) {
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
    //   let highlight =   {color: color, text: text, note: note, url: window.location.href, timestamp: new Date().toLocaleString()};
    //   highlightsObjectStore.add(highlight);
    // };
  };
  request.onsuccess = function (event) {
    db = event.target.result;
    let highlightsObjectStore = db.transaction('highlights', 'readwrite').objectStore('highlights');
    let newHighlight = {color: color, text: text, note: note, url: window.location.href, timestamp: new Date().toLocaleString()};
    highlightsObjectStore.add(newHighlight);
    db.transaction('highlights').objectStore('highlights').getAll().onsuccess = function (event) { //retrieving all past stored highlights / notes
      const saves = event.target.result;
      // let table = document.createElement('table');
      // table.className = 'neon-highlights';
      let table = document.getElementsByClassName('neon-highlights')[0];
      if (saves.length === 1) {
        let notification = document.getElementsByClassName('neon-notification-no-highlights')[0];
        table.removeChild(notification);
        let download = createDownloadButton(saves);
        table.appendChild(download);
        let clearNotes = createClearButton(saves);
        table.appendChild(clearNotes);
      }
      table.appendChild(createNoteRow(newHighlight));
    }
  }
}
