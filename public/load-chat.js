(function () {
  function loadChat() {
    if (window.__acaTawkLoaded) return;
    window.__acaTawkLoaded = true;
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/691a1246046312195650f28a/1ja6tepem";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.head.appendChild(script);
  }

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(loadChat, { timeout: 6000 });
  } else {
    window.addEventListener("load", function () { window.setTimeout(loadChat, 2500); }, { once: true });
  }
})();
