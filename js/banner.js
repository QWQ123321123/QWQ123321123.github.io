/* 首页横幅轮播：每 6 秒交叉淡入淡出切换 */
(function () {
  var OSS = 'https://myblogimage123.oss-cn-hongkong.aliyuncs.com/';
  var PROC = '?x-oss-process=image/resize,w_1920/quality,q_85';
  var IMGS = [
    OSS + 'banner.jpg' + PROC,
    OSS + 'banner2.jpg' + PROC,
    OSS + 'banner3.jpg' + PROC,
    OSS + 'banner4.jpg' + PROC,
    OSS + 'banner5.jpg' + PROC,
    OSS + 'banner6.png' + PROC
  ];
  var INTERVAL = 6000;

  // 预加载，避免切换瞬间白屏
  IMGS.forEach(function (src) { new Image().src = src; });

  var idx = 0;

  function swap(header) {
    var ghost = header.querySelector('.banner-ghost');
    if (!ghost) {
      ghost = document.createElement('div');
      ghost.className = 'banner-ghost';
      header.appendChild(ghost);
    }
    // 旧图放在 ghost 层，header 直接换新图，再淡出 ghost，形成交叉渐变
    ghost.style.backgroundImage = getComputedStyle(header).backgroundImage;
    ghost.style.opacity = '1';
    idx = (idx + 1) % IMGS.length;
    header.style.backgroundImage = 'url("' + IMGS[idx] + '")';
    void ghost.offsetWidth; // 强制重绘，确保过渡生效
    ghost.style.opacity = '0';
  }

  setInterval(function () {
    var header = document.querySelector('#page-header.full_page'); // 只作用于首页横幅
    if (header) swap(header);
  }, INTERVAL);
})();
