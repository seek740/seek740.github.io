(function() {
  // ===== 1. 粒子星空背景 =====
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
  }

  function createParticles() {
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.documentElement.dataset.theme === 'dark';
    const color = isDark ? '178, 235, 242' : '0, 188, 212';

    particles.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + color + ', ' + p.opacity + ')';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = p.x - particles[j].x;
        const dy = p.y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(' + color + ', ' + (0.1 * (1 - dist / 120)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    animationId = requestAnimationFrame(drawParticles);
  }

  function initParticles() {
    resizeCanvas();
    createParticles();
    drawParticles();
  }

  // ===== 2. 鼠标光晕 =====
  const mouseGlow = document.getElementById('mouse-glow');
  if (mouseGlow) {
    let glowX = -300, glowY = -300;
    let targetX = -300, targetY = -300;

    document.addEventListener('mousemove', function(e) {
      targetX = e.clientX;
      targetY = e.clientY + window.scrollY;
    });

    function animateGlow() {
      glowX += (targetX - glowX) * 0.1;
      glowY += (targetY - glowY) * 0.1;
      mouseGlow.style.left = glowX + 'px';
      mouseGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }

    animateGlow();
  }

  // ===== 3. 滚动淡入 =====
  function initScrollAnimations() {
    const els = document.querySelectorAll('.post-entry, .home-info, .post-single .post-header, .post-content h2, .post-content h3');
    els.forEach(function(el) { el.classList.add('fade-in-up'); });

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-in-up').forEach(function(el) { observer.observe(el); });
  }

  // ===== 4. 进度条 =====
  var progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', function() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    });
  }

  // ===== 5. 卡片 3D 倾斜 =====
  function initTilt() {
    document.querySelectorAll('.post-entry').forEach(function(card) {
      card.classList.add('tilt-card');
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = (y - centerY) / centerY * -5;
        var rotateY = (x - centerX) / centerX * 5;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-2px)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // ===== 6. 首页打字机光标 =====
  function initTypewriter() {
    var homeTitle = document.querySelector('.home-info .entry-header h1');
    if (!homeTitle) return;
    var cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    homeTitle.appendChild(cursor);
  }

  // ===== 启动 =====
  initParticles();
  initScrollAnimations();
  initTilt();
  initTypewriter();

  window.addEventListener('resize', function() {
    resizeCanvas();
    createParticles();
  });

  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      setTimeout(function() {
        cancelAnimationFrame(animationId);
        initParticles();
      }, 200);
    });
  }
})();
