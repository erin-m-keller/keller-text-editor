// import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb } from './database.js';
import { header } from './header';

export default class {
  constructor() {
    const localData = localStorage.getItem('content');

    // check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: ' ', // Set a non-empty default value (a space)
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    /**
     * @getDb
     * retrieves the most recent data from 
     * the database and sets the editor value 
     * accordingly. If no data is found, it 
     * checks for local data and sets the 
     * value to either the extracted data 
     * or the header
    */
    getDb().then((data) => {
      if (data && data.length > 0) {
        // initialize variables
        const mostRecentObject = data[data.length - 1], // get the most recent object
              extractedData = mostRecentObject.content, // extract the content
              content = this.prependHeader(extractedData),
              lineNum = content.length - 1; // get the line number
        this.editor.setValue(content); // set the editor value to the content data
        // set the cursor to line 15
        this.editor.setCursor(lineNum, 0);
      } else {
        // initialize variables
        const content = localData ? this.prependHeader(localData) : header;
        // set the value of the editor to the content
        this.editor.setValue(content);
        // set the cursor to line 15
        this.editor.setCursor(14, 0);
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
      putDb(localStorage.getItem('content')); 
    });
  }
  prependHeader(data) {
    if (!data.startsWith(header)) {
      return header + '\n' + data;
    }
    return data;
  }
  removeHeader(data) {
    if (data.startsWith(header)) {
      return data.replace(header + '\n', '');
    }
    return data;
  }
}