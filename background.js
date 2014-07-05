function getParams(url) {
  var match,
      pl     = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      isearch = url.indexOf("?");
  if (isearch == -1) {
    return;
  }
  var query  = url.substring(isearch+1);

  var urlParams = {};
  while (match = search.exec(query)) {
    urlParams[decode(match[1])] = decode(match[2]);
  }
  return urlParams;
}

chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    var params = getParams(info.url);
    var newurl;
    if (params == undefined) {
      newurl = info.url + '?sk=h_chr';
    } else if (params.sk != 'h_chr') {
      newurl = info.url + '&sk=h_chr';
    } else {
      return {};
    }
    return {redirectUrl: newurl};
  },
  // filters
  {
    urls: [
      "*://www.facebook.com/",
      "*://www.facebook.com/?*"
    ],
    types: ["main_frame"] // Facebook is AJAXy, so we might need to expand this
  },
  ["blocking"] // Block so the request can be modified
);
