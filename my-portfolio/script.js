document.addEventListener("DOMContentLoaded", function () {
  // キャンバスアニメーションの初期化
  initCanvasAnimation();

  // ナビゲーション
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
    });
  }

  // スムーススクロール
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href") === "#") return;

      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // モバイルメニューを閉じる
        if (hamburger && navLinks) {
          hamburger.classList.remove("active");
          navLinks.classList.remove("active");
        }
      }
    });
  });

  // スクロール時のヘッダースタイル変更
  const header = document.querySelector(".header");
  if (header) {
    let lastScroll = 0;

    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = "translateY(-100%)";
      } else {
        header.style.transform = "translateY(0)";
      }

      if (currentScroll < 50) {
        header.style.background = "rgba(10, 10, 10, 0.5)";
      } else {
        header.style.background = "rgba(10, 10, 10, 0.95)";
      }

      lastScroll = currentScroll;
    });
  }

  // ソリューションカードのアニメーション
  const solutionCards = document.querySelectorAll(".solution-card");
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  solutionCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = `opacity 0.5s ease ${
      index * 0.1
    }s, transform 0.5s ease ${index * 0.1}s`;
    observer.observe(card);
  });
});

// キャンバスアニメーション
function initCanvasAnimation() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = window.innerWidth;
  let height = window.innerHeight;

  // キャンバスのサイズを設定
  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  // 初期化
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // パーティクルの設定
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
      this.color = `rgba(108, 99, 255, ${Math.random() * 0.5})`;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // 画面端で跳ね返る
      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 線でつなぐ関数
  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.strokeStyle = `rgba(108, 99, 255, ${1 - distance / 100})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // パーティクルを生成
  const particles = [];
  const particleCount = Math.floor((width * height) / 15000); // 画面サイズに応じてパーティクル数を調整

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // アニメーションループ
  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    connect();
    requestAnimationFrame(animate);
  }

  animate();
}
