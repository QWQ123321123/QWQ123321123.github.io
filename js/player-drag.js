/* 悬浮播放器可拖动：按住封面/空白区域拖拽移动，按钮和进度条不受影响 */
(function () {
  function init(retry) {
    var box = document.querySelector('.aplayer.aplayer-fixed');
    if (!box) {
      // 播放器由 MetingJS 异步创建，尚未就绪时重试
      if (retry > 0) setTimeout(function () { init(retry - 1); }, 400);
      return;
    }

    var dragging = false;
    var moved = false;
    var startX = 0, startY = 0;
    var baseX = 0, baseY = 0; // 已累积的位移
    var deltaX = 0, deltaY = 0;

    box.style.willChange = 'transform';
    box.style.touchAction = 'none';

    box.addEventListener('pointerdown', function (e) {
      // 只在进度条、音量、歌单、展开箭头上不触发拖动；
      // 播放按钮区域允许按下，只有真的移动才算拖动（不影响点击播放）
      if (e.target.closest('.aplayer-bar, .aplayer-bar-wrap, .aplayer-list, .aplayer-miniswitcher, .aplayer-volume-wrap')) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startY = e.clientY;
      // 注意：不使用 setPointerCapture，否则会劫持按钮的 click 事件
    });

    // 移动/抬起监听挂在 window 上，指针移出播放器也能继续拖动
    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      deltaX = e.clientX - startX;
      deltaY = e.clientY - startY;
      if (Math.abs(deltaX) + Math.abs(deltaY) > 6) moved = true;
      if (moved) {
        // 给容器加 transform 后，内部 position:fixed 的播放条会随容器一起移动
        box.style.transform = 'translate(' + (baseX + deltaX) + 'px,' + (baseY + deltaY) + 'px)';
      }
    });

    window.addEventListener('pointerup', function () {
      if (!dragging) return;
      dragging = false;
      if (moved) {
        baseX += deltaX;
        baseY += deltaY;
        // 拖动后抑制紧随的 click，避免误触播放/暂停
        var stop = function (ev) {
          ev.stopPropagation();
          ev.preventDefault();
          box.removeEventListener('click', stop, true);
        };
        box.addEventListener('click', stop, true);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(15); });
  } else {
    init(15);
  }
})();
