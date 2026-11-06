/**
 * WeatherEffects - 실감 나는 날씨 라이브 애니메이션 엔진 (HTML5 Canvas)
 * 비(Rain), 눈(Snow), 해/햇살(Sun Rays), 별빛(Stars), 번개(Lightning)
 */

class WeatherEffectsManager {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.canvas = null;
    this.ctx = null;
    this.currentMode = 'none'; // 'clear-day', 'clear-night', 'rain', 'snow', 'thunder', 'clouds', 'fog'
    this.particles = [];
    this.animationFrameId = null;
    this.lastTime = performance.now();

    // 번개용 타이머
    this.flashAlpha = 0;
    this.nextFlashTime = 0;

    // 햇살용 각도
    this.sunAngle = 0;

    // 별똥별용
    this.shootingStars = [];
    this.nextShootingStarTime = performance.now() + 4000;

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    this.canvas = document.getElementById(this.canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    if (this.currentMode !== 'none') {
      this.initParticles(this.currentMode);
      if (!this.animationFrameId) {
        this.lastTime = performance.now();
        this.animate();
      }
    }
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.initParticles(this.currentMode);
  }

  setMode(mode) {
    if (this.currentMode === mode && this.particles.length > 0) return;
    this.currentMode = mode;
    if (!this.canvas) {
      this.init();
    }
    if (!this.canvas) return;

    this.initParticles(mode);

    if (!this.animationFrameId) {
      this.lastTime = performance.now();
      this.animate();
    }
  }

  initParticles(mode) {
    this.particles = [];
    const w = this.width || window.innerWidth;
    const h = this.height || window.innerHeight;

    if (mode === 'rain' || mode === 'thunder') {
      const count = mode === 'thunder' ? 140 : 100;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          length: Math.random() * 20 + 15,
          speed: Math.random() * 12 + 18,
          thickness: Math.random() * 1.5 + 0.8,
          opacity: Math.random() * 0.4 + 0.3
        });
      }
      if (mode === 'thunder') {
        this.nextFlashTime = performance.now() + (Math.random() * 4000 + 3000);
      }
    } else if (mode === 'snow') {
      const count = 90;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 3 + 1,
          speed: Math.random() * 1.2 + 0.8,
          wind: Math.random() * 1.5 - 0.75,
          swingAngle: Math.random() * Math.PI * 2,
          swingSpeed: Math.random() * 0.03 + 0.01,
          opacity: Math.random() * 0.6 + 0.3
        });
      }
    } else if (mode === 'clear-day') {
      // 햇살 파티클 (부유하는 따뜻한 빛 먼지)
      const count = 40;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 3 + 1,
          speedY: -(Math.random() * 0.4 + 0.1),
          speedX: Math.random() * 0.4 - 0.2,
          pulse: Math.random() * Math.PI,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    } else if (mode === 'clear-night') {
      // 반짝이는 별빛
      const count = 90;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * w,
          y: Math.random() * (h * 0.75), // 주로 하늘 위쪽에 배치
          radius: Math.random() * 2 + 0.6,
          blinkSpeed: Math.random() * 0.03 + 0.01,
          phase: Math.random() * Math.PI * 2,
          baseOpacity: Math.random() * 0.6 + 0.2
        });
      }
      this.shootingStars = [];
      this.nextShootingStarTime = performance.now() + 3000;
    } else if (mode === 'clouds' || mode === 'fog') {
      // 안개/구름 부유 파티클
      const count = 25;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 140 + 80,
          speedX: (Math.random() * 0.25 + 0.1) * (mode === 'fog' ? 0.5 : 1),
          opacity: Math.random() * 0.08 + 0.04
        });
      }
    }
  }

  animate() {
    const now = performance.now();
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.ctx.clearRect(0, 0, this.width, this.height);

    switch (this.currentMode) {
      case 'rain':
      case 'thunder':
        this.drawRain(dt);
        break;
      case 'snow':
        this.drawSnow(dt);
        break;
      case 'clear-day':
        this.drawSun(dt, now);
        break;
      case 'clear-night':
        this.drawNight(dt, now);
        break;
      case 'clouds':
      case 'fog':
        this.drawClouds(dt);
        break;
      default:
        break;
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  /* 비(Rain) 그리기 */
  drawRain(dt) {
    const ctx = this.ctx;
    ctx.strokeStyle = 'rgba(215, 235, 255, 0.65)';
    ctx.lineCap = 'round';

    const windAngle = 0.2; // 약간 사선 낙하

    for (let p of this.particles) {
      ctx.lineWidth = p.thickness;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.length * windAngle, p.y + p.length);
      ctx.stroke();

      p.y += p.speed;
      p.x -= p.speed * windAngle;

      if (p.y > this.height) {
        p.y = -p.length;
        p.x = Math.random() * (this.width + 100);
      }
    }

    // 뇌우(Thunder) 섬광 효과
    if (this.currentMode === 'thunder') {
      const now = performance.now();
      if (now > this.nextFlashTime) {
        this.flashAlpha = 0.85;
        this.nextFlashTime = now + (Math.random() * 5000 + 4000);
      }
      if (this.flashAlpha > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.flashAlpha})`;
        ctx.fillRect(0, 0, this.width, this.height);
        this.flashAlpha -= dt * 2.8;
        if (this.flashAlpha < 0) this.flashAlpha = 0;
      }
    }
  }

  /* 눈(Snow) 그리기 */
  drawSnow(dt) {
    const ctx = this.ctx;
    ctx.fillStyle = '#ffffff';

    for (let p of this.particles) {
      p.swingAngle += p.swingSpeed;
      p.x += Math.sin(p.swingAngle) * p.wind;
      p.y += p.speed;

      if (p.y > this.height) {
        p.y = -p.radius;
        p.x = Math.random() * this.width;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.fill();
    }
  }

  /* 맑은 날(Sun Rays & Warm Glow) 그리기 */
  drawSun(dt, now) {
    const ctx = this.ctx;
    const sunX = this.width * 0.85; // 우상단 태양 위치
    const sunY = this.height * 0.12;

    this.sunAngle += dt * 0.08;

    // 1. 거대한 황금빛 렌즈 플레어 & 웜 글로우
    const pulse = (Math.sin(now * 0.0015) + 1) * 0.5; // 0 ~ 1
    const glowRadius = 350 + pulse * 60;
    const radialGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, glowRadius);
    radialGrad.addColorStop(0, 'rgba(255, 245, 180, 0.45)');
    radialGrad.addColorStop(0.3, 'rgba(255, 200, 100, 0.22)');
    radialGrad.addColorStop(0.7, 'rgba(255, 170, 50, 0.08)');
    radialGrad.addColorStop(1, 'rgba(255, 150, 0, 0)');

    ctx.fillStyle = radialGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // 2. 부드럽게 회전하는 부챗살 햇살 광선 (God Rays)
    ctx.save();
    ctx.translate(sunX, sunY);
    ctx.rotate(this.sunAngle);
    const numRays = 12;
    for (let i = 0; i < numRays; i++) {
      ctx.rotate((Math.PI * 2) / numRays);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-40, this.height * 1.2);
      ctx.lineTo(40, this.height * 1.2);
      ctx.closePath();
      const rayGrad = ctx.createLinearGradient(0, 0, 0, this.height * 1.2);
      rayGrad.addColorStop(0, 'rgba(255, 250, 200, 0.12)');
      rayGrad.addColorStop(0.5, 'rgba(255, 230, 150, 0.04)');
      rayGrad.addColorStop(1, 'rgba(255, 210, 100, 0)');
      ctx.fillStyle = rayGrad;
      ctx.fill();
    }
    ctx.restore();

    // 3. 공기 중에 떠다니는 반짝이는 미세 빛가루(Sun Dust)
    for (let p of this.particles) {
      p.pulse += p.pulseSpeed;
      p.y += p.speedY;
      p.x += p.speedX;

      if (p.y < 0) p.y = this.height;
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;

      const alpha = p.opacity * (0.6 + Math.sin(p.pulse) * 0.4);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 248, 200, ${alpha})`;
      ctx.fill();
    }
  }

  /* 맑은 밤(Twinkling Stars & Shooting Star) 그리기 */
  drawNight(dt, now) {
    const ctx = this.ctx;

    // 1. 은은한 밤하늘 별빛 반짝임
    for (let p of this.particles) {
      p.phase += p.blinkSpeed;
      const alpha = p.baseOpacity * (0.4 + Math.sin(p.phase) * 0.6);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, alpha)})`;
      ctx.fill();
    }

    // 2. 가끔 떨어지는 별똥별 (Shooting Star)
    if (now > this.nextShootingStarTime) {
      this.shootingStars.push({
        x: Math.random() * (this.width * 0.7),
        y: Math.random() * (this.height * 0.3),
        length: Math.random() * 80 + 60,
        speed: Math.random() * 12 + 16,
        alpha: 1.0,
        angle: Math.PI / 4 // 45도 각도
      });
      this.nextShootingStarTime = now + (Math.random() * 5000 + 4000);
    }

    // 별똥별 그리기 & 업데이트
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      const tailX = s.x - Math.cos(s.angle) * s.length;
      const tailY = s.y - Math.sin(s.angle) * s.length;

      const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(1, `rgba(255, 255, 255, ${s.alpha})`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();

      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.alpha -= dt * 0.7;

      if (s.alpha <= 0 || s.x > this.width || s.y > this.height) {
        this.shootingStars.splice(i, 1);
      }
    }
  }

  /* 흐림 / 안개(Fog & Clouds) 그리기 */
  drawClouds(dt) {
    const ctx = this.ctx;
    for (let p of this.particles) {
      p.x += p.speedX;
      if (p.x - p.radius > this.width) {
        p.x = -p.radius;
        p.y = Math.random() * this.height;
      }

      const grad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.1, p.x, p.y, p.radius);
      grad.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
      grad.addColorStop(0.6, `rgba(240, 245, 255, ${p.opacity * 0.5})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// 싱글톤 인스턴스 전역 생성
window.weatherEffects = new WeatherEffectsManager('weather-canvas');
