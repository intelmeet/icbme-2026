// CloudFront Function (viewer request) for Vite + prerendered route folders.
// Publish this function and associate it with the distribution's Viewer Request event.
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Let root, assets, public files, and already-file-like URLs pass through.
  if (uri === "/") return request;
  if (uri.charAt(uri.length - 1) === "/") {
    request.uri = uri + "index.html";
    return request;
  }

  var lastSegment = uri.substring(uri.lastIndexOf("/") + 1);
  if (lastSegment.indexOf(".") === -1) request.uri = uri + "/index.html";
  return request;
}
