if (!window.indexedDB) {
    window.alert('Your browser doesn\'t support a stable version of IndexedDB.');
}

const highlights = [
  {color: '#ffff22', text: 'Billasrfgbjyhngfedvjatwedfv', url: 'google.com', timestamp: new Date()},
  {color: '#ffff22', text: 'asdgaerdvjatwedfv', url: 'fb.com', timestamp: new Date()},
];

let db;
let request = indexedDB.open('highlights', 3); //request to open db
request.onerror = function (event) {
  alert('IndexedDB?!');
};
request.onupgradeneeded = function (event) {
  // Save the IDBDatabase interface
  db = event.target.result;
  // Create objectStore for this database to store user's highlights
  let objectStore = db.createObjectStore('highlights', {keyPath: 'highlights', autoIncrement: true});
  // Transaction oncomplete ensures creating objectStore is done before trying to add data
  objectStore.transaction.oncomplete = function (event) {
    let highlightsObjectStore = db.transaction('highlights', 'readwrite').objectStore('highlights');
    highlights.forEach(function (highlight) {
      highlightsObjectStore.add(highlight);
    });
  };
};
request.onsuccess = function (event) {
  db = event.target.result;



  db.onerror = function (event) {
    // Generic error handler for all errors targeted at this database's requests!
    alert('Database error: ' + event.target.errorCode);
  };
};

