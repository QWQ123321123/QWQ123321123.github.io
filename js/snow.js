/* 全屏雪花飘落粒子动画（轻量 canvas 实现，无依赖） */
(function () {
  // 尊重用户的"减少动态效果"系统设置
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'snow-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var W, H, flakes = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // 根据屏幕宽度决定雪花数量，避免小屏过多
  var COUNT = Math.min(90, Math.floor(window.innerWidth / 18));

  function makeFlake(top) {
    return {
      x: Math.random() * W,
      y: top ? -5 : Math.random() * H,
      r: 1 + Math.random() * 2.2,        // 半径
      speed: 0.4 + Math.random() * 0.9,  // 下落速度
      drift: Math.random() * 1.6 - 0.8,  // 横向漂移
      phase: Math.random() * Math.PI * 2,
      opacity: 0.35 + Math.random() * 0.45
    };
  }

  for (var i = 0; i < COUNT; i++) flakes.push(makeFlake(false));

  var raf = null;

  function tick() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.phase += 0.01;
      f.x += Math.sin(f.phase) * f.drift + 0.15;
      f.y += f.speed + f.r * 0.25;
      if (f.y > H + 5) { flakes[i] = makeFlake(true); continue; }
      if (f.x > W + 5) f.x = -5;
      if (f.x < -5) f.x = W + 5;
      ctx.globalAlpha = f.opacity;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  }

  tick();

  // 标签页切走时暂停，省电省性能
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    } else if (!raf) {
      tick();
    }
  });
})();
