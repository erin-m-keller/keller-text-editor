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
     * value to either the extracted data 
     * or the header
    */
    getDb().then((data) => {
      if (data && data.length > 0) {
        // initialize variables
        const mostRecentObject = data[data.length - 1], // get the most recent object
          extractedData = mostRecentObject.content; // extract the content
        const content = this.prependHeader(extractedData); // prepend the header to the extracted data
        this.editor.setValue(content); // set the editor value to the content data
      } else {
        // initialize variables
        const content = localData ? this.prependHeader(localData) : header; // prepend the header if local data exists
        this.editor.setValue(content); // set the value of the editor to the content
      }
    });
    // save the content of the editor on change
    this.editor.on('change', () => {
      // remove the header from the content before saving to localStorage
      const contentWithoutHeader = this.removeHeader(this.editor.getValue());
      // save the content to localStorage
      localStorage.setItem('content', contentWithoutHeader);
    });
    // save the content of the editor on blur
    this.editor.on('blur', () => {
      // log the message
      console.log('The editor has lost focus');
      // prepend the header to the content before saving to the database
      const contentWithHeader = this.prependHeader(localStorage.getItem('content'));
      // save the content to the database
      putDb(contentWithHeader);
    });
  }
  /**
   * @prependHeader
   * prepend the header to the data
  */
  prependHeader(data) {
    // if data does not start with header
    if (!data.startsWith(header)) {
      // prepend the header with the data
      return header + '\n' + data;
    }
    // return the data
    return data;
  }
  /**
   * @removeHeader
   * removes the header from the data
  */
  removeHeader(data) {
    // if data starts with header
    if (data.startsWith(header)) {
      // remove header from the data if already present
      return data.replace(header + '\n', '');
    }
    // return the data
    return data;
  }
}