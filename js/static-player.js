/* 用构建时抓取的静态歌单初始化 APlayer，避免第三方接口缓存导致歌单不同步 */
(function () {
  function init() {
    if (!window.APlayer || typeof window.__PLAYLIST === 'undefined') {
      setTimeout(init, 300);
      return;
    }

    var container = document.getElementById('my-aplayer');
    if (!container) return;

    var audio = window.__PLAYLIST.map(function (item) {
      return {
        name: item.name,
        artist: item.artist,
        url: item.url,
        cover: item.pic,
        lrc: item.lrc
      };
    });

    var ap = new APlayer({
      container: container,
      fixed: true,
      mini: true,
      autoplay: false,
      order: 'list',
      preload: 'none',
      theme: '#49b1f5',
      lrcType: 3,
      audio: audio
    });

    window.aplayers = window.aplayers || [];
    window.aplayers.push(ap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
