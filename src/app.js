// Main JavaScript File

// import Bootstrap 4 JavaScript
import 'bootstrap'
// import viewmodels
import './viewmodel'


// Immediately-Invoked Function Expression (IIFE)
(global => {

    // Google Maps API Error Handlers
    const gm_authFailure = () => {
        // alert that API failed to authorize
       alert('Something went wrong with Google Maps authorizing, please refresh page.');
    };

    const loadError = () => {
        // alert that API failed to load
        alert('Something went wrong with Google Maps loading, please refresh page.');
    }; // /Google Maps API Error Handlers

    // add loadError, and gm_authFailure to the Window (global) Object
    global.loadError = loadError;
    global.gm_authFailure = gm_authFailure;

})(window); // /iife