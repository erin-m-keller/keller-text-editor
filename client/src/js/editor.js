// import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb } from './database.js';
import { header } from './header';

export default class {
  constructor() {
    // initialize variables
    const localData = localStorage.getItem('content');
    // check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      // if not loaded, throw error
      throw new Error('CodeMirror is not loaded');
    }

    // create a separate HTML element for the header
    const headerElement = document.createElement('pre');
    headerElement.textContent = header; // set text
    headerElement.className = "text-header"; // set class name
    headerElement.style.fontFamily = 'monospace'; // set font style for ascii art
    document.querySelector('#main').before(headerElement); // append to the container

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: ' ', // set a non-empty default value (a space)
      mode: 'javascript', // editor mode is JavaScript
      theme: 'erlang-dark', // set the editor theme to erlang-dark
      lineNumbers: true, // enable line numbers
      lineWrapping: true, // enable line wrapping
      autofocus: true, // set the editor to autofocus
      indentUnit: 4, // set the indentation unit to 4 spaces
      tabSize: 4, // set the tab size to 4 spaces
      autoCloseBrackets: true, // auto close brackets when typing
      matchBrackets: true, // highlight matching brackets
    });

    /**
     * @getDb
     * retrieves the most recent data from 
     * the database and sets the editor value 
     * accordingly. If no data is found, it 
     * checks for local data and sets the 
     * value to the extracted data or an empty string
     */
    getDb().then((data) => {
      if (data && data.length > 0) {
        const mostRecentObject = data[data.length - 1]; // get the most recent object
        const content = mostRecentObject.content; // extract the content
        this.editor.setValue(content); // set the editor value to the content data
      } else {
        const content = localData ? localData : ''; // set the value of the editor to the local data or an empty string
        this.editor.setValue(content); // set the value of the editor to the content
      }
    });

    // save the content of the editor on change
    this.editor.on('change', () => {
      // save the content to localStorage
      localStorage.setItem('content', this.editor.getValue());
    });

    // save the content of the editor on blur
    this.editor.on('blur', () => {
      // log the message
      console.log('The editor has lost focus');
      // save the content to the database
      putDb(this.editor.getValue());
    });
  }
}