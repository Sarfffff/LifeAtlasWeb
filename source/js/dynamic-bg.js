(function () {
  function createCanvas() {
    var header = document.getElementById("page-header");
    if (!header || document.getElementById("lifeatlas-dynamic-bg")) return;

    var canvas = document.createElement("canvas");
    canvas.id = "lifeatlas-dynamic-bg";
    header.appendChild(canvas);

    var cardImages = [
      "linear-gradient(135deg, rgba(86, 156, 255, .62), rgba(248, 189, 95, .3))",
      "linear-gradient(135deg, rgba(160, 217, 255, .58), rgba(72, 91, 124, .4))",
      "linear-gradient(135deg, rgba(255, 215, 124, .54), rgba(42, 95, 81, .42))",
      "linear-gradient(135deg, rgba(230, 240, 255, .38), rgba(183, 255, 46, .22))"
    ];

    if (!header.querySelector(".memory-float-card")) {
      for (var c = 0; c < 4; c += 1) {
        var card = document.createElement("i");
        card.className = "memory-float-card card-" + (c + 1);
        card.style.setProperty("--card-image", cardImages[c]);
        header.appendChild(card);
      }
    }

    var isHome = window.location.pathname === "/" || window.location.pathname === "/index.html";
    var siteInfo = header.querySelector("#site-info");
    if (isHome && siteInfo && !siteInfo.querySelector(".lifeatlas-hero-intro")) {
      var intro = document.createElement("div");
      intro.className = "lifeatlas-hero-intro";
      intro.innerHTML = [
        '<p class="lifeatlas-hero-kicker">GAME CLIENT DEV · KNOWLEDGE ATLAS</p>',
        '<p class="lifeatlas-hero-summary">整理 Unity 客户端开发、项目复盘与面试笔记，把零散经验沉淀成可检索的成长地图。</p>',
        '<div class="lifeatlas-hero-actions">',
        '<a class="primary" href="/notes-import-summary.html">浏览技术笔记</a>',
        '<a href="/projects/">查看项目作品</a>',
        '<a href="/learning-roadmap/">学习路线</a>',
        '</div>',
        '<a class="lifeatlas-scroll-cue" href="#content-inner" aria-label="继续浏览最新内容">向下浏览 <i class="fas fa-arrow-down" aria-hidden="true"></i></a>'
      ].join("");
      siteInfo.appendChild(intro);
    }

    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = 0;
    var height = 0;
    var frame = 0;
    var stars = [];
    var pins = [
      { x: 0.19, y: 0.68, phase: 0 },
      { x: 0.48, y: 0.45, phase: 1.4 },
      { x: 0.66, y: 0.68, phase: 2.5 },
      { x: 0.74, y: 0.26, phase: 3.6 }
    ];

    function resize() {
      var rect = header.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = [];
      for (var i = 0; i < 80; i += 1) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.68,
          r: Math.random() * 1.6 + 0.25,
          speed: Math.random() * 0.22 + 0.05,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function drawRoute(points, progress, color, dashed) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.72;
      if (dashed) ctx.setLineDash([6, 7]);
      ctx.beginPath();
      for (var i = 0; i < points.length; i += 1) {
        var p = points[i];
        var px = p[0] * width;
        var py = p[1] * height;
        if (i === 0) ctx.moveTo(px, py);
        else {
          var prev = points[i - 1];
          var cx = ((prev[0] + p[0]) / 2) * width;
          var cy = ((prev[1] + p[1]) / 2 - 0.08 * Math.sin(frame * 0.01 + i)) * height;
          ctx.quadraticCurveTo(cx, cy, px, py);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      var lastIndex = Math.min(points.length - 1, Math.max(0, Math.floor(progress * (points.length - 1))));
      var dot = points[lastIndex];
      var dotX = dot[0] * width;
      var dotY = dot[1] * height;
      var glow = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 42);
      glow.addColorStop(0, "rgba(198,255,61,.9)");
      glow.addColorStop(1, "rgba(198,255,61,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawPin(pin) {
      var x = pin.x * width;
      var y = pin.y * height;
      var pulse = 9 + Math.sin(frame * 0.045 + pin.phase) * 4;

      ctx.save();
      ctx.fillStyle = "rgba(198,255,61,.92)";
      ctx.shadowColor = "rgba(198,255,61,.8)";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(198,255,61,.42)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    function draw() {
      frame += 1;
      ctx.clearRect(0, 0, width, height);

      var shade = ctx.createLinearGradient(0, 0, width, height);
      shade.addColorStop(0, "rgba(3,9,16,.22)");
      shade.addColorStop(0.58, "rgba(7,11,16,0)");
      shade.addColorStop(1, "rgba(183,255,46,.08)");
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, width, height);

      stars.forEach(function (star) {
        star.x += star.speed;
        if (star.x > width + 8) star.x = -8;
        var alpha = 0.24 + Math.sin(frame * 0.025 + star.phase) * 0.18;
        ctx.fillStyle = "rgba(218,238,255," + alpha + ")";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      var routeA = [
        [0.08, 0.72],
        [0.2, 0.64],
        [0.33, 0.69],
        [0.48, 0.52],
        [0.62, 0.62],
        [0.78, 0.48],
        [0.9, 0.58]
      ];
      var routeB = [
        [0.26, 0.28],
        [0.4, 0.34],
        [0.54, 0.26],
        [0.66, 0.3],
        [0.76, 0.2]
      ];
      drawRoute(routeA, (frame * 0.006) % 1, "rgba(198,255,61,.46)", false);
      drawRoute(routeB, (frame * 0.004) % 1, "rgba(229,202,112,.38)", true);

      pins.forEach(drawPin);
      window.requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createCanvas);
  } else {
    createCanvas();
  }
})();
