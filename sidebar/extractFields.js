/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__siteSpecific__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__formatting__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__extractors__ = __webpack_require__(4);




(function(){

function sendFields() {
  console.log('sendFields');
  let envelope = {
    _context: 'fields',
    fields: {
      author: getAuthor(),
      url: window.location.href,
      title: document.title
    }
  };
  let handler = Object(__WEBPACK_IMPORTED_MODULE_0__siteSpecific__["a" /* getSiteSpecific */])(envelope.fields);
  if(handler && handler.get) {
    console.log('Calling site specific handler');
    let handlerFields = handler.get(envelope.fields);
    if(handlerFields.author) {
      handlerFields.author = Object(__WEBPACK_IMPORTED_MODULE_1__formatting__["a" /* formatAuthor */])(handlerFields.author);
    }
    envelope.fields = handlerFields;
  }
  console.log(`got handler ${handler}`);
  browser.runtime.sendMessage(envelope);
}


function getAuthor() {
  const result = Object(__WEBPACK_IMPORTED_MODULE_1__formatting__["a" /* formatAuthor */])(Object(__WEBPACK_IMPORTED_MODULE_2__extractors__["a" /* extractAuthor */])());
  if(!result) {
    return '';
  }
  return result;
}

function run() {
  try {
    console.log({
      what: 'loaded'
    });
    sendFields();
  }
  catch(e) {
    console.log(e);
    log({
      what: 'Problem running',
      error: e
    });
  }
}

document.addEventListener("DOMContentLoaded", run);
run();

})();



/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export SiteSpecificHandlers */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getSiteSpecific; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__formatting__ = __webpack_require__(3);


function getMetaTag(name) {
  const metas = document.querySelectorAll(`meta[name=${name}]`);
  if(metas && metas.length > 0) {
    return metas[0];
  }
  return null;
}

function coalesceFns(firstFn, ...rest) {
  try {
    let result = firstFn()
    if(result) return result;
  } catch(e) {
    console.log(e);
  }

  if(rest.length == 0) return null;

  return coalesceFns(...rest);
}

function getFirstBySelector(selector) {
  const els = document.querySelectorAll(selector);
  if(els && els.length > 0) {
    return els[0];
  }
  return null;
}

class Wikipedia {
  is(data) {
    return /wikipedia\.org\//i.test(data.url);
  }

  get(data) {
    let siteData = {
      author: this.getAuthor(data),
      title: this.getTitle(data)
    };
    return Object.assign({}, data, siteData);
  }

  getAuthor() {
    console.log('wikipedia author');
    return '';
  }

  getTitle(tab) {
    if(! tab || ! tab.title) return null;

    return tab.title.replace(/ - Wikipedia.+/, '');
  }
};

class CNN {
  is(data) {
    return /cnn\.com\//i.test(data.url);
  }

  get(data){
    let siteData = {
      author: this.getAuthor(data),
      title: this.getTitle(data)
    };
    return Object.assign(data, siteData);
  }

  getAuthor(tab) {
    var els = document.getElementsByClassName('cnn_strycbftrtxt');
    if (els && els.length > 0 ) {
      var e = els[0],
        matches = /^cnn's(.+) contributed.+/ig.exec(e.innerHTML);
      if (matches && matches.length > 1 ) {
        return matches[1];
      }
    }
    var metaAuthor = getMetaTag ( "author" );
    if ( metaAuthor ) {
      return metaAuthor.getAttribute('content');
    }

    return '';
  }

  getTitle(tab) {
    if(!tab || ! tab.title) return null;
    return tab.title.replace(/ - CNN.+/, '');
  }
};

class Huffington {
  is(data) {
    return /huffingtonpost\.com/i.test ( data.url );
  }

  get(data) {
    let siteData = {
      author: this.getAuthor(data)
    };
    return Object.assign(data, siteData);
  }

  getAuthor(tab) {
    console.log('huffington author');
    const fns = 'author-card__link bn-author-name yr-author-name'.split(' ')
      .map((className) => {
        return () => {
          let result = getFirstBySelector(`.${className}`).textContent.trim();
          if(result === '') return null;
          return result;
        };
      });
    return coalesceFns(...fns, () => '');
  }
};

class ABCNews {
  is(data) {
    return /abcnews\.go\.com/i.test (data.url);
  }

  get(data){
    let siteData = {
      author: this.getAuthor(data)
    };
    return Object.assign(data, siteData);
  }

  getAuthor(tab) {
    var el = getFirstBySelector('[rel=author]');
    if(el) return el.textContent;
    return null;
  }
};

class FoxNews{
  is(data) {
    return /fox\w+\.com/i.test(data.url);
  }

  get(data) {
    let siteData = {
      title: this.getTitle(data),
      author: this.getAuthor(data)
    };
    return Object.assign(data, siteData);
  }

  getAuthor(data) {
    let extract8 = document.querySelectorAll('.author-byline');
    if(extract8 && extract8.length > 0) {
      return extract8[0].textContent.replace(/ \| .*/, '');
    }
  }

  getTitle(tab) {
    if(! tab.title) return;

    return tab.title.
      replace(/.*FOXNews.com\s+-\s+/i, '').
      replace(/ - FOX.+/i, '');
  }
};

const SiteSpecificHandlers = [new Wikipedia(), new CNN(), new Huffington(), new ABCNews(), new FoxNews()];


const getSiteSpecific = function(data) {
  let handlers = SiteSpecificHandlers;
  // run site specific functions
  for(let i = 0; i < handlers.length; i++){
    var handler = handlers[i]; // set of functions
    if ( handler && handler.is && handler.is (data) ) { // if func is exists
      return handler;
    }
  }
  return null;
};






/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return formatAuthor; });
/**
 * Will remove whitespace from either side of the string.
 * will also remove non-word characters at end of string.
 */
function trim(str) {
  return str.replace(/^\s+/g, '').replace(/[\s\W]+$/, ''); //trim
}

function reduceWhitespace( str ) {
  return str.replace (/\s+/g, ' ');
}

function formatAuthor( author ) {
  console.log('formatAuthor');

  if(! author) return '';

  author = reduceWhitespace (author);

  author = author.replace(/^\s*by */i, ''); // remove "by"

  // deal with associated press?
  author = author.replace(/,\s*Associated Press[.\s\S]*$/ig, '');
  author = author.replace(/,\s*AP[.\s\S]*$/g, '');

  author = trim (author);
  author = capitalize (author);
  return author;
}

function capitalize(str) {
  return str.toLowerCase().replace(/\b\w/g,
    function(capture){
      return capture.toUpperCase();
    }
  );
}





/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getAuthorHasBylineElement */
/* unused harmony export getMetaTag */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return extractAuthor; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__formatting__ = __webpack_require__(3);


function getAuthorHasBylineElement(__doc) {
  const doc = __doc || document;

  var els = doc.querySelectorAll('byline');

  if (!els || els.length == 0) return;

  let el = els[0];

  var val = el.value || el.innerHTML;
  if (! val) return;
  if (val == '') return;

  return val;
}

function getMetaTag( metaTagName, __doc ) {
  const doc = __doc || document;

  metaTagName = metaTagName.toLowerCase();

  try {
    var meta = doc.querySelectorAll("meta");
    for (var i = 0; i < meta.length; i++) {
      if (meta[i].name && meta[i].name.toLowerCase() == metaTagName) {
        return meta[i];
      }
    }
  }
  catch ( e ) {
    console.log({
      what: 'Problem getting meta tag',
      error: error
    });
  }
  return null;
}

function extractAuthor(__doc) {
  const doc = __doc || document;

  var author = "Last, First",
    metaByl = getMetaTag ( "byl", doc ),
    metaAuthor = getMetaTag ( "author", doc ),
    siteSpec = null;

  try {
    console.log('extractAuthor 1');
    var first = getAuthorHasBylineElement(doc);
    if(first) return first;

    console.log('extractAuthor 2');
    if ( metaAuthor ) {
      const content = metaAuthor.getAttribute('content');
      console.log(`content: ${content}`);
      return content;
    }

    console.log('extractAuthor 3');
    if ( metaByl && metaByl.content != '' ) {
      // check for a byline meta element
      return metaByl.content;
    }

    console.log('extractAuthor 4');
    // see if there are any elements marked byline
    let elByl = doc.querySelectorAll( "byline" );
    if ( elByl && elByl.length > 0 ) {
      // strip and stripTags functions from prototypejs
      author = elByl[0].
        textContent.
        replace(/^\s+/, '').replace(/\s+$/, '');

      return author;
    }

    console.log('extractAuthor 5');
    // see if there are any elements with a byline class
    let elsBylineClass = doc.querySelectorAll('.byline-author');
    if(elsBylineClass && elsBylineClass.length > 0) {
      let el = elsBylineClass[0];
      if(el.dataset) {
        return el.dataset['byline-name'];
      }
      const attr = el.getAttribute('data-byline-name')
      if(attr) {
        return attr;
      }
    }

    console.log('extractAuthor 6');
    // check for author elements
    let els = doc.querySelectorAll('author');
    if(els && els.length > 0) {
      return els[0].textContent;
    }

    console.log('extractAuthor 7');
    var parts = doc.body ? doc.body.textContent.match ( /by (([A-Z\.'-]+ ?){2,3})/i ) : null;
    //console.log ( "parts: " + parts );
    if ( parts && parts[0] ) {
      return Object(__WEBPACK_IMPORTED_MODULE_0__formatting__["a" /* formatAuthor */]) ( parts[0] );
    }

    let extract8 = doc.querySelectorAll('.author-byline');
    if(extract8 && extract8.length > 0) {
      return extract8[0].textContent;
    }
  }
  catch(e){
    console.log ( e.message );
  }

  return Object(__WEBPACK_IMPORTED_MODULE_0__formatting__["a" /* formatAuthor */])(author);
}





/***/ })
/******/ ]);