/* 专辑封面旋转（黑胶唱片效果）：播放时旋转，暂停时停住，切歌自动换图 */
(function () {
  function ensureImg(ap) {
    var pic = ap.template && ap.template.pic;
    if (!pic) return null;
    pic.classList.add('spin');
    var img = pic.querySelector('img.spin-cover');
    if (!img) {
      img = document.createElement('img');
      img.className = 'spin-cover';
      img.alt = '';
      img.draggable = false;
      pic.insertBefore(img, pic.firstChild);
    }
    return img;
  }

  function update(ap, retry) {
    var img = ensureImg(ap);
    if (!img) return;
    var music = ap.list && ap.list.music && ap.list.music[ap.list.index];
    var cover = music && (music.cover || music.pic || music.picture);
    // 兜底：直接读 APlayer 已设置好的封面背景图
    if (!cover) {
      var bg = ap.template.pic.style.backgroundImage || getComputedStyle(ap.template.pic).backgroundImage;
      var m = bg && bg.match(/url\(["']?([^"')]+)/);
      if (m) cover = m[1];
    }
    if (cover) {
      if (img.getAttribute('src') !== cover) img.src = cover;
    } else if (retry > 0) {
      // 歌单数据异步加载，尚未就绪时稍后重试
      setTimeout(function () { update(ap, retry - 1); }, 800);
    }
  }

  function setup() {
    // MetingJS v2：实例挂在 <meting-js> 元素的 .aplayer 上
    var el = document.querySelector('meting-js');
    var ap = (el && el.aplayer) || (window.aplayers && window.aplayers[0]);
    if (!ap) {
      setTimeout(setup, 400);
      return;
    }
    var pic = ap.template && ap.template.pic;
    if (!pic) {
      setTimeout(setup, 400);
      return;
    }

    ap.on('play', function () {
      pic.classList.add('playing');
      update(ap, 3);
    });
    ap.on('pause', function () {
      pic.classList.remove('playing');
    });
    ap.on('listswitch', function () {
      update(ap, 3);
    });

    update(ap, 5); // 首次加载，歌单未就绪时自动重试
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
