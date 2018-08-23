let colorDiv = document.getElementById('buttonDiv');

const colors = ['#ffff22', '#ccff00', '#39ff14', '#a8ff00', '#11ffee', '#32ffcc', '#f89902', '#57c1ff', '#ff00c3'];

function constructOptions (colors) {
  for (let item of colors) {
    let button = document.createElement('button');
    button.style.backgroundColor = item;
    button.addEventListener('click', function() {
      chrome.storage.sync.set({color: item}, function() {
        console.log('color is ' + item);
      })
    });
    colorDiv.appendChild(button);
  }
}
constructOptions(colors);

let savesTable = document.getElementById('saves');

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
    //   let highlight = {color: activeColor, text: text, url: window.location.href, timestamp: new Date()};
    //   highlightsObjectStore.add(highlight);
    // };
  };
  request.onsuccess = function (event) {
    // db = event.target.result;
    // db.transaction('highlights').objectStore('highlights').getAll().onsuccess = function (event) {
    //   const saves = event.target.result;
    //   for (let item of saves) {
    //     let save = document.createElement('tr');
    //     save.innerHTML = `<td style='background-color:${item.color}'>${item.text}</td><td><a href='${item.url}'>Link</a></td><td>${item.timestamp}</td>`;
    //     savesTable.appendChild(save);
    //   }
    // };
  }
