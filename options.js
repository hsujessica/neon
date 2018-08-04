let colors = document.getElementById('buttonDiv');

const colors = ['#ffff22', '#ccff00', '#39ff14', '#a8ff00', '#11ffee', '#32ffcc', '#31d0cf', '#cf0663'];

function constructOptions (colors) {
  for (let item of colors) {
    let button = document.createElement('button');
    button.style.backgroundColor = item;
    button.addEventListener('click', function() {
      chrome.storage.sync.set({color: item}, function() {
        console.log('color is ' + item);
      })
    });
    colors.appendChild(button);
  }
}
constructOptions(colors);

let saves = document.getElementById('saves');

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
