// A promise-based alternative to d3.json
// Blatantly copied from http://www.html5rocks.com/en/tutorials/es6/promises/#toc-promisifying-xmlhttprequest

function get(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        resolve(req.response);
      }
      else {
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}

function getJSON(url) {
  return get(url).then(JSON.parse);
}



// Get the height of the window.
function getHeight() {
  var viewportheight;

  // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight

  if (typeof window.innerHeight != 'undefined')
  {
      viewportheight = window.innerHeight
  }

  // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)

  else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientHeight !=
     'undefined' && document.documentElement.clientHeight != 0)
  {
       viewportheight = document.documentElement.clientHeight
  }

  // older versions of IE

  else
  {
       viewportheight = document.getElementsByTagName('body')[0].clientHeight;
  }
  return viewportheight;
}

function zeroedArray(len) {
    var rv = new Array(len);
    while (--len >= 0) {
        rv[len] = 0;
    }
    return rv;
}
