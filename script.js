/* ==========================================================================
   SAMIKSHA PEDENEKAR PORTFOLIO CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Element selections
  const envelopeStage = document.getElementById('envelopeStage');
  const dossierStage = document.getElementById('dossierStage');
  const waxSeal = document.getElementById('waxSeal');
  const body = document.body;

  /* ==========================================================================
     ENVELOPE OPENING TRANSITIONS (Sequenced Interaction)
     ========================================================================== */
  let isOpening = false;

  const openDossier = () => {
    if (isOpening) return;
    isOpening = true;

    // Sequenced Opening Animation (Click -> split seal -> flap opens -> paper slides -> paper unfolds -> content fades)
    if (envelopeStage && dossierStage) {
      
      // Step 1: Click seal -> seal cracks and splits into halves immediately
      envelopeStage.classList.add('seal-broken');
      
      // Step 2: Flap opens (350ms delay)
      setTimeout(() => {
        envelopeStage.classList.add('flap-open');
        
        // Step 3: Paper slides out from inside the envelope (750ms delay)
        setTimeout(() => {
          dossierStage.classList.add('active');
          dossierStage.classList.add('paper-slide');
          
          // Step 4: Paper unfolds and settles to fullscreen (1150ms delay)
          // Envelope stage fades out simultaneously
          setTimeout(() => {
            dossierStage.classList.add('paper-unfold');
            envelopeStage.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            envelopeStage.style.opacity = '0';
            envelopeStage.style.transform = 'translateY(-60px) scale(0.95)';
            
            // Step 5: Content fades in smoothly, scroll is enabled, envelope is hidden (1650ms delay)
            setTimeout(() => {
              envelopeStage.style.display = 'none';
              dossierStage.classList.add('content-fade');
              body.style.overflowY = 'auto'; // allow scrolling
              initializeRevealAnimations();
            }, 500);

          }, 400);

        }, 400);

      }, 350);
    }
  };

  // Hook up click event listener to wax seal wrapper
  if (waxSeal) {
    waxSeal.addEventListener('click', openDossier);
  }

  /* ==========================================================================
     INTERSECTION OBSERVER (Scroll Reveals)
     ========================================================================== */
  const initializeRevealAnimations = () => {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Unobserve once revealed
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => {
      revealObserver.observe(reveal);
    });
  };

  /* ==========================================================================
     CANVAS DUST PARTICLES (Luxury Ambient Backdrop)
     ========================================================================== */
  const canvas = document.getElementById('dustCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const maxParticles = 45;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Dust Speck Class
    class DustSpeck {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5; // Tiny specks
        this.speedX = (Math.random() - 0.5) * 0.15; // Slow drift
        this.speedY = -(Math.random() * 0.15 + 0.05); // Drift upward slowly
        this.opacity = Math.random() * 0.4 + 0.1;
        this.alphaStep = 0.002 + Math.random() * 0.003;
        this.direction = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Oscilate opacity for glimmering effect
        this.opacity += this.alphaStep * this.direction;
        if (this.opacity > 0.65 || this.opacity < 0.05) {
          this.direction *= -1;
        }

        // Reset particle if it drifts off screen
        if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
          this.reset();
          this.y = canvas.height; // reappear at bottom
        }
      }

      draw() {
        ctx.beginPath();
        // Warm gold-tinted dust particles
        ctx.fillStyle = `rgba(224, 197, 143, ${this.opacity})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize Particle Stack
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new DustSpeck());
    }

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      requestAnimationFrame(animate);
    };

    animate();
  }
});
