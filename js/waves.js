/* 横幅底部浮动波浪：插入在 #page-header 之后，PJAX 切换时自动重建 */
(function () {
  var SVG_BACK =
    '<svg class="wave-back" viewBox="0 0 1200 120" preserveAspectRatio="none">' +
    '<path d="M0,70 C300,10 900,110 1200,50 L1200,120 L0,120 Z"></path></svg>';
  var SVG_FRONT =
    '<svg class="wave-front" viewBox="0 0 1200 120" preserveAspectRatio="none">' +
    '<path d="M0,60 C300,120 900,10 1200,70 L1200,120 L0,120 Z"></path></svg>';

  function addWaves() {
    var header = document.getElementById('page-header');
    if (!header) return;
    // 已存在则不重复添加
    if (header.nextElementSibling && header.nextElementSibling.classList.contains('waves-wrap')) return;
    var wrap = document.createElement('div');
    wrap.className = 'waves-wrap';
    wrap.innerHTML = SVG_BACK + SVG_FRONT;
    header.insertAdjacentElement('afterend', wrap);
  }

  function init() {
    addWaves();
    // PJAX 页面切换后重新插入
    if (window.btf && btf.addGlobalFn) {
      btf.addGlobalFn('pjaxComplete', addWaves, 'addWaves');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
