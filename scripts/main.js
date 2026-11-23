/**
 * MAIN.JS // Deep Sea Portfolio Engine
 * Particle Physics, Depth Gauge Telemetry, Filtering & Interactive Modal
 * Elijah Becerra // 10C F26
 */

document.addEventListener('DOMContentLoaded', () => {
  initOceanCanvas();
  initDepthHUD();
  initProjectFilters();
  initSpecimenModal();
  initMobileNav();
  initTransmissionForm();
  initActiveNavSpy();
});

/* ==========================================================================
   1. Marine Snow & Bioluminescent Plankton Canvas Simulation
   ========================================================================== */
function initOceanCanvas() {
  const canvas = document.getElementById('ocean-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Track mouse coordinates for gentle particle repulsion
  let mouse = { x: -1000, y: -1000, active: false };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });
  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Particle types: Marine Snow, Bioluminescent Plankton, Air Bubbles
  const PARTICLE_COUNT = Math.min(80, Math.floor((width * height) / 12000));
  const particles = [];

  class MarineParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      
      // Determine type: 70% Marine Snow, 20% Glowing Plankton, 10% Bubble
      const rand = Math.random();
      if (rand < 0.65) {
        this.type = 'snow';
        this.size = Math.random() * 2 + 0.8;
        this.vy = -(Math.random() * 0.4 + 0.15); // Gently sinks/drifts
        this.vx = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.color = '200, 230, 255';
      } else if (rand < 0.9) {
        this.type = 'biolum';
        this.size = Math.random() * 3 + 1.2;
        this.vy = -(Math.random() * 0.5 + 0.2);
        this.vx = (Math.random() - 0.5) * 0.4;
        this.alpha = Math.random() * 0.8 + 0.3;
        this.color = Math.random() > 0.5 ? '0, 242, 254' : '0, 255, 208';
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
        this.pulseVal = Math.random() * Math.PI;
      } else {
        this.type = 'bubble';
        this.size = Math.random() * 3.5 + 1.5;
        this.vy = -(Math.random() * 1.2 + 0.6); // Bubbles rise faster
        this.vx = (Math.random() - 0.5) * 0.5;
        this.alpha = Math.random() * 0.6 + 0.2;
        this.color = '160, 230, 255';
      }
      this.baseAlpha = this.alpha;
      this.wobble = Math.random() * Math.PI * 2;
    }

    update() {
      this.wobble += 0.02;
      this.x += this.vx + Math.sin(this.wobble) * 0.3;
      this.y += this.vy;

      // Bioluminescent pulsing glow
      if (this.type === 'biolum') {
        this.pulseVal += this.pulseSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.pulseVal) * 0.25;
      }

      // Mouse proximity interaction (soft repellent current)
      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          this.x += (dx / dist) * force * 2;
          this.y += (dy / dist) * force * 2;
        }
      }

      // Wrap around bounds
      if (this.y < -20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

      if (this.type === 'bubble') {
        // Hollow ring bubble
        ctx.strokeStyle = `rgba(${this.color}, ${Math.max(0.1, this.alpha)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (this.type === 'biolum') {
        // Glowing orb with subtle radial halo
        ctx.fillStyle = `rgba(${this.color}, ${Math.max(0.1, this.alpha)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${this.color}, 0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for performance
      } else {
        // Soft marine snow
        ctx.fillStyle = `rgba(${this.color}, ${Math.max(0.05, this.alpha)})`;
        ctx.fill();
      }
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new MarineParticle());
  }

  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    animationFrameId = requestAnimationFrame(animate);
  }
  animate();

  // Pause canvas when user switches tab to conserve battery & CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      animate();
    }
  });
}

/* ==========================================================================
   2. Submersible Depth HUD Telemetry
   ========================================================================== */
function initDepthHUD() {
  const depthValueEl = document.getElementById('depth-counter');
  const zoneTagEl = document.getElementById('zone-tag');
  const depthBarFill = document.getElementById('depth-fill');
  const header = document.querySelector('.site-header');

  const MAX_DEPTH = 11034; // Mariana Trench / Challenger Deep in meters

  function updateTelemetry() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollRatio = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;

    // Depth calculation: Starts at -120m and reaches -11,034m
    const currentDepth = Math.round(120 + scrollRatio * (MAX_DEPTH - 120));

    if (depthValueEl) {
      depthValueEl.textContent = `-${currentDepth.toLocaleString()}m`;
    }

    if (depthBarFill) {
      depthBarFill.style.width = `${Math.max(4, scrollRatio * 100)}%`;
    }

    // Determine Oceanographic Zone
    if (zoneTagEl) {
      let zoneName = 'EPIPELAGIC';
      if (scrollRatio >= 0.85) {
        zoneName = 'HADAL TRENCH';
      } else if (scrollRatio >= 0.65) {
        zoneName = 'ABYSSOPELAGIC';
      } else if (scrollRatio >= 0.35) {
        zoneName = 'BATHYPELAGIC';
      } else if (scrollRatio >= 0.15) {
        zoneName = 'MESOPELAGIC';
      }
      zoneTagEl.textContent = zoneName;
    }

    // Header transparency effect
    if (header) {
      if (scrollTop > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', updateTelemetry, { passive: true });
  updateTelemetry();
}

/* ==========================================================================
   3. Projects Category Filter
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card:not(.add-card)');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   4. Specimen Lightbox / Detail Modal
   ========================================================================== */
function initSpecimenModal() {
  const modal = document.getElementById('specimen-modal');
  if (!modal) return;

  const modalImg = modal.querySelector('.modal-img');
  const modalTitle = modal.querySelector('.modal-title');
  const modalDesc = modal.querySelector('.modal-desc');
  const modalTags = modal.querySelector('.modal-tags');
  const modalLink = modal.querySelector('.modal-link-btn');
  const closeBtn = modal.querySelector('.modal-close-btn');

  function openModal(data) {
    if (modalImg) modalImg.src = data.imgSrc || '';
    if (modalTitle) modalTitle.textContent = data.title || 'Project Specimen';
    if (modalDesc) modalDesc.textContent = data.desc || 'No description provided.';
    if (modalLink) modalLink.href = data.link || '#';

    if (modalTags && data.tags) {
      modalTags.innerHTML = '';
      data.tags.forEach((tagText) => {
        const tag = document.createElement('span');
        tag.className = 'project-tag';
        tag.textContent = tagText;
        modalTags.appendChild(tag);
      });
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Bind click handlers to inspect buttons
  document.querySelectorAll('.btn-inspect').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.project-card');
      if (!card) return;

      const img = card.querySelector('.project-thumb');
      const title = card.querySelector('.project-title');
      const desc = card.querySelector('.project-desc');
      const tags = Array.from(card.querySelectorAll('.project-tag')).map((t) => t.textContent.trim());
      const demoLink = card.querySelector('.btn-link-icon[title="Live Demo"]')?.getAttribute('href') || '#';

      openModal({
        imgSrc: img ? img.src : '',
        title: title ? title.textContent : 'Project Specimen',
        desc: desc ? desc.textContent : '',
        tags: tags,
        link: demoLink,
      });
    });
  });

  // Close triggers
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. Mobile Navigation
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      const isOpen = navLinks.classList.contains('mobile-open');
      toggleBtn.textContent = isOpen ? '✕' : '☰';
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        toggleBtn.textContent = '☰';
      });
    });
  }
}

/* ==========================================================================
   6. Contact / Sonar Transmission Simulation
   ========================================================================== */
function initTransmissionForm() {
  const form = document.getElementById('sonar-form');
  const feedback = document.querySelector('.transmission-feedback');

  if (form && feedback) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const origText = btn.innerHTML;

      btn.disabled = true;
      btn.innerHTML = `📡 Pinging Sonar...`;

      setTimeout(() => {
        feedback.style.display = 'block';
        feedback.innerHTML = `✓ TRANSMISSION DELIVERED // Depth confirmed! Thank you.`;
        feedback.style.color = 'var(--bio-teal)';
        form.reset();
        btn.disabled = false;
        btn.innerHTML = origText;

        setTimeout(() => {
          feedback.style.display = 'none';
        }, 5000);
      }, 1200);
    });
  }
}

/* ==========================================================================
   7. Active Section Spy
   ========================================================================== */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}
