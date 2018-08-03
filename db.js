if (!window.indexedDB) {
    window.alert('Your browser doesn\'t support a stable version of IndexedDB.');
}

const customerData = [
  { ssn: '444-44-4444', name: 'Bill', age: 35, email: 'bill@company.com' },
  { ssn: '555-55-5555', name: 'Donna', age: 32, email: 'donna@home.org' }
];

let db;
let request = indexedDB.open('highlights', 3); //request to open db
request.onerror = function (event) {
  alert('IndexedDB?!');
};
request.onupgradeneeded = function (event) {
  // Save the IDBDatabase interface
  let db = event.target.result;
  // Create objectStore for this database to store user's highlights
  let objectStore = db.createObjectStore('saves', {keyPath: 'text', autoIncrement: true});
  // Create an index to search customers by name. We may have duplicates
  // so we can't use a unique index.
  objectStore.createIndex('name', 'name', { unique: false });
  // Use transaction oncomplete to make sure the objectStore creation is
  // finished before adding data into it.
  objectStore.transaction.oncomplete = function (event) {
    // Store values in the newly created objectStore.
    let customerObjectStore = db.transaction('customers', 'readwrite').objectStore('customers');
    customerData.forEach(function (customer) {
      customerObjectStore.add(customer);
    });
  };

};
request.onsuccess = function (event) {
  db = event.target.result;
};
db.onerror = function (event) {
  // Generic error handler for all errors targeted at this database's requests!
  alert('Database error: ' + event.target.errorCode);
};

