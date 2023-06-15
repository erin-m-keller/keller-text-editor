import { openDB } from 'idb';

/**
 * @initdb
 * sets up the initial state of the 
 * database, creating the object store 
 * if it doesn't already exist
 * @returns {IDBDatabase} the initialized indexedDB database object
 */
const initdb = async () => {
  // try to connect to the database
  try {
    // initializes the database with the name 'jate' and version 1
    const db = await openDB('jate', 1, {
      upgrade(db) {
        // check if the 'jate' object store already exists
        if (db.objectStoreNames.contains('jate')) {
          // log the message
          console.log('jate database already exists');
          // exit
          return;
        }
        // create a new object store named 'jate' 
        db.createObjectStore('jate', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        // log the message
        console.log('jate database created');
      },
    });
    // return the database
    return db;
  } 
  // catch the error
  catch (error) {
    // log the error
    console.error('Error initializing IndexedDB:', error);
  }
};

/**
 * @getDb
 * if the database contains records, it 
 * retrieves all the data from the object 
 * store. The function checks for browser 
 * compatibility and handles scenarios 
 * where no data is found
*/
export const getDb = async () => {
  // try to get the data from the database
  try {
    // initialize the variables
    const contactDb = await openDB('jate', 1), // create a connection to the database
          tx = contactDb.transaction('jate', 'readonly'), // create a new read-only transaction
          store = tx.objectStore('jate'); // open the desired object store
    // check if there are any records in the object store
    if ('getAllKeys' in store) {
      // initialize variables
      const keys = await store.getAllKeys();
      // if no keys found, return null
      if (keys.length === 0) {
        // log the message
        console.log('No data found in the database');
        // return null
        return null;
      }
    } 
    // else, fallback for browsers that don't support getAllKeys()
    else {
      // initialize variables
      const count = await store.count();
      // if no count, return null
      if (count === 0) {
        // log the message
        console.log('No data found in the database');
        // return null
        return null;
      }
    }
    // initialize variables
    const request = store.getAll(),
          result = await request;
    // log the message
    console.log('Data retrieved from the database', result);
    // return the data
    return result;
  } 
  // catch the error
  catch (error) {
    // log the error
    console.error('Error while retrieving data from the database', error);
    // return null
    return null;
  }
};

/**
 * @putDb
 * saves the provided content to 
 * the 'jate' object store in the 
 * indexedDB database
 */
export const putDb = async (content) => {
  // try to update the database
  try {
    // innitialize the variables
    const contactDb = await openDB('jate', 1), // create a connection to the database and version
          tx = contactDb.transaction('jate', 'readwrite'), // create a new transaction and specify readwrite privileges
          store = tx.objectStore('jate'), // open up the desired object store
          request = store.put({ content: content }), // use the .put() method on the store and pass in the content
          result = await request; // get confirmation of the request
    // log the updated text
    console.log('🚀 - Updated text saved to the database', result);
  } 
  // catch the error
  catch (error) {
    // log the error
    console.error('Error while saving data to the database', error);
  }
};

// initialize the database
initdb();
