    // --- Custom Cursor ---
    const cur = document.getElementById('cur');
    const cur2 = document.getElementById('cur2');
    let mouseX = 0, mouseY = 0;
    let cur2X = 0, cur2Y = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cur.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    });

    function animateCursor() {
      cur2X += (mouseX - cur2X) * 0.15;
      cur2Y += (mouseY - cur2Y) * 0.15;
      cur2.style.transform = `translate(${cur2X - 16}px, ${cur2Y - 16}px)`;

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Magnetic buttons
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;

        // Expand cursor
        cur.style.width = '12px'; cur.style.height = '12px';
        cur2.style.width = '48px'; cur2.style.height = '48px';
        cur2.style.borderColor = 'rgba(255,77,0,.8)';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
        cur.style.width = '8px'; cur.style.height = '8px';
        cur2.style.width = '32px'; cur2.style.height = '32px';
        cur2.style.borderColor = 'rgba(255,255,255,.35)';
      });
    });

    // --- Theme Toggle ---
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      htmlEl.setAttribute('data-theme', 'light');
      themeBtn.textContent = '🌙';
    }

    themeBtn.addEventListener('click', () => {
      if (htmlEl.getAttribute('data-theme') === 'light') {
        htmlEl.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        themeBtn.textContent = '☀️';
      } else {
        htmlEl.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeBtn.textContent = '🌙';
      }
    });

    // Cursor expansion on interactive elements
    const interactives = document.querySelectorAll('a, button, .skill-tile, .tool-btn, .proj-card, .c-card');
    interactives.forEach(el => {
      if (!el.classList.contains('magnetic')) {
        el.addEventListener('mouseenter', () => {
          cur.style.width = '12px'; cur.style.height = '12px';
          cur2.style.width = '48px'; cur2.style.height = '48px';
          cur2.style.borderColor = 'rgba(var(--white-rgb),.5)';
        });
        el.addEventListener('mouseleave', () => {
          cur.style.width = '8px'; cur.style.height = '8px';
          cur2.style.width = '32px'; cur2.style.height = '32px';
          cur2.style.borderColor = 'rgba(var(--white-rgb),.35)';
        });
      }
    });

    // --- Scroll Reveal ---
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('vis');

          // Animate proficiency bars inside skill tiles
          if (entry.target.classList.contains('skill-tile')) {
            const bar = entry.target.querySelector('.prof-fill');
            if (bar) bar.style.width = bar.getAttribute('data-w');
          }
          // Animate proficiency bars inside arsenal
          if (entry.target.classList.contains('ars-skill')) {
            const bar = entry.target.querySelector('.ars-skill-fill');
            if (bar) bar.style.width = bar.getAttribute('data-w');
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll('.sr').forEach(el => observer.observe(el));

    // --- Hero 3D Parallax & Liquid Aura ---
    const heroSection = document.querySelector('.hero');
    const hero3DWrapper = document.querySelector('.hero-3d-wrapper');
    const heroAura = document.getElementById('hero-aura');

    if (heroSection && hero3DWrapper && heroAura) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Aura follows mouse
        heroAura.style.left = `${x}px`;
        heroAura.style.top = `${y}px`;

        // 3D Parallax calculation
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -15; // Max 15deg
        const rotateY = ((x - centerX) / centerX) * 15;

        hero3DWrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        // Glare effect
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        document.querySelectorAll('.hero-right .glare').forEach(glare => {
          glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)`;
          glare.style.opacity = 1;
        });
      });

      heroSection.addEventListener('mouseleave', () => {
        hero3DWrapper.style.transform = `rotateX(0deg) rotateY(0deg)`;
        document.querySelectorAll('.hero-right .glare').forEach(glare => {
          glare.style.opacity = 0;
        });
      });
    }

    document.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const cards = document.querySelectorAll('.ui-card');
      if (scrolled < 800) {
        cards.forEach((card, index) => {
          const speeds = [-0.15, -0.05, -0.12, -0.08];
          const depths = [60, 100, 140, 110];
          const speed = speeds[index % speeds.length];
          const z = depths[index % depths.length];
          card.style.transform = `translateY(${scrolled * speed}px) translateZ(${z}px)`;
        });
      }
    });

    // --- Auto-scroll Achievements & Certifications ---
    document.querySelectorAll('.ach-scroll').forEach(container => {
      let isHovered = false;
      
      // Pause on hover
      container.addEventListener('mouseenter', () => isHovered = true);
      container.addEventListener('mouseleave', () => isHovered = false);

      // Disable CSS scroll snapping so JS can smoothly scroll
      container.style.scrollSnapType = 'none';

      let scrollPos = 0;
      function smoothScroll() {
        if (!isHovered) {
          scrollPos += 0.5; // adjust speed here (lower is slower)
          
          // Reset to 0 when we reach the end to create an infinite loop effect
          if (scrollPos >= container.scrollWidth - container.clientWidth) {
            scrollPos = 0;
          }
          container.scrollLeft = scrollPos;
        } else {
          // Sync position so it doesn't jump if user manually scrolls while hovered
          scrollPos = container.scrollLeft;
        }
        requestAnimationFrame(smoothScroll);
      }
      
      requestAnimationFrame(smoothScroll);
    });

    // --- Slideshow Logic ---
    document.querySelectorAll('.slideshow-container').forEach(container => {
      const slides = container.querySelectorAll('.slide-img');
      if (slides.length <= 1) return; // Only animate if multiple images

      let currentSlide = 0;
      setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
      }, 3000); // Change image every 3 seconds
    });

    // --- Expandable Project Cards ---
    document.querySelectorAll('.proj-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Prevent toggle if clicking on the external link icon
        if (e.target.closest('.proj-link')) return;

        // If clicking the close button explicitly, close it
        if (e.target.closest('.proj-close')) {
          card.classList.remove('expanded');
          return;
        }
        
        // Otherwise, toggle expansion
        card.classList.toggle('expanded');
        
        // Optionally scroll into view if it expands out of screen
        if (card.classList.contains('expanded')) {
          setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 300);
        }
      });
    });
