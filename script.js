// Initialize GSAP plugins safely
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  if (typeof MotionPathPlugin !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
  } else {
    gsap.registerPlugin(ScrollTrigger);
  }
}

// Global error handler
window.addEventListener('error', function(e) {
  console.error('Global JS Error:', e.message, e.filename, e.lineno);
});
window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled Promise Rejection:', e.reason);
});

// Three.js Scene Setup
let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Initialize Three.js
function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas || typeof THREE === 'undefined') return;
    
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: false,
        alpha: true 
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Create particles
    createParticles();
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0x00d4ff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Event listeners
    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);
    
    animate();
}

// Create particle system
function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    const PARTICLE_COUNT = Math.max(600, Math.min(1400, Math.floor((window.innerWidth * window.innerHeight) / 2500)));
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        vertices.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0x00d4ff,
        size: 1.6,
        transparent: true,
        opacity: 0.8
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Mouse move handler
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
}

// Window resize handler
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (particles) {
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.002;
        
        particles.rotation.x += mouseY * 0.5;
        particles.rotation.y += mouseX * 0.5;
    }
    
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
}

// Loading screen
window.addEventListener('load', () => {
    // Simulate data loading (replace with real data fetch if needed)
    const loadingProfile = document.getElementById('loading-profile-data');
    if (loadingProfile) loadingProfile.style.display = 'block';
    setTimeout(() => {
        // Simulate data loaded
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000); // Simulate 2s data load
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initAnimations();
    initScrollIndicator();
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      addFloatingElements();
      addScrollTransformations();
      addParallaxEffect();
    }
});

// Initialize GSAP animations
function initAnimations() {
    // Hero section animations
    gsap.from('.hero-title', {
        duration: 1.5,
        y: 100,
        opacity: 0,
        ease: 'power3.out'
    });

    gsap.from('.hero-subtitle', {
        duration: 1.5,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.3
    });

    gsap.from('.hero-buttons', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.6
    });

    // Section animations with ScrollTrigger
    gsap.utils.toArray('.section').forEach((section, index) => {
        const sectionTitle = section.querySelector('.section-title');
        const sectionContent = section.querySelector('.about-grid, .services-grid, .projects-grid, .contact-container');

        if (sectionTitle) {
            gsap.from(sectionTitle, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                duration: 1,
                y: 50,
                opacity: 0,
                ease: 'power3.out'
            });
        }

        if (sectionContent) {
            gsap.from(sectionContent.children, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 70%',
                    end: 'bottom 30%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 30,
                opacity: 0,
                stagger: 0.2,
                ease: 'power3.out'
            });
        }
    });

    // Card hover animations
    gsap.utils.toArray('.about-card, .service-card, .project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                duration: 0.3,
                scale: 1.05,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.3,
                scale: 1,
                ease: 'power2.out'
            });
        });
    });

    // Motion path animations for sections
    createMotionPathAnimations();
}

// Create motion path animations
function createMotionPathAnimations() {
    // Create motion paths for each section
    const sections = document.querySelectorAll('.section');
    
    sections.forEach((section, index) => {
        // Create a curved motion path for camera movement
        const path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-5, 0, 0),
            new THREE.Vector3(0, 2, -3),
            new THREE.Vector3(5, 0, 0),
            new THREE.Vector3(0, -2, -3),
            new THREE.Vector3(-5, 0, 0)
        ]);

        // Animate camera along the path when section is in view
        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onUpdate: (self) => {
                const progress = self.progress;
                const point = path.getPointAt(progress);
                
                gsap.to(camera.position, {
                    duration: 0.5,
                    x: point.x,
                    y: point.y,
                    z: point.z + 5,
                    ease: 'power2.out'
                });
            }
        });
    });
}

// Initialize scroll indicator
function initScrollIndicator() {
    const scrollDots = document.querySelectorAll('.scroll-dot');
    const sections = document.querySelectorAll('.section');

    scrollDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            sections[index].scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Update active dot based on scroll position
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                scrollDots.forEach(dot => dot.classList.remove('active'));
                scrollDots[index].classList.add('active');
            }
        });
    }, { passive: true });
}

// Removed theme toggle functionality - keeping only dark mode

// Sound Effects using Web Audio API (no external files needed)
let audioContext;
let audioInitialized = false;

function initAudioContext() {
  if (!audioContext && !audioInitialized) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioInitialized = true;
    } catch (error) {
      console.log('Audio context not available:', error);
      audioInitialized = true; // Prevent repeated attempts
    }
  }
}

function playSound(type) {
  if (!soundEnabled) return;
  
  // Initialize audio context on first user interaction
  if (!audioInitialized) {
    initAudioContext();
  }
  
  // If audio context failed to initialize, just return silently
  if (!audioContext) return;
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different frequencies for different sound types
    let frequency = 800; // Default frequency
    if (type === 'toggle') frequency = 600;
    else if (type === 'click') frequency = 1000;
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (error) {
    console.log('Audio playback error:', error);
    // Silently fail - don't break the UI
  }
}

// Initialize audio on first user interaction
document.addEventListener('click', function initAudioOnInteraction() {
  if (!audioInitialized) {
    initAudioContext();
  }
  document.removeEventListener('click', initAudioOnInteraction);
}, { once: true });

// Sound toggle functionality
const soundToggle = document.getElementById('sound-toggle');
let soundEnabled = true;
const SOUND_KEY = 'sound';
if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
    localStorage.setItem(SOUND_KEY, soundEnabled ? 'on' : 'off');
    playSound('toggle');
  });
}
(function initSound() {
  const saved = localStorage.getItem(SOUND_KEY);
  if (saved === 'off' && soundToggle) {
    soundEnabled = false;
    soundToggle.textContent = '🔇';
  }
})();

// Add sound to all buttons
Array.from(document.querySelectorAll('[data-sound="click"]')).forEach(btn => {
  btn.addEventListener('click', () => playSound('click'));
});

// GSAP Motion Path Animations
window.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const mascot = document.getElementById('mascot-octopus');
  if (!mascot) return;
  const sections = document.querySelectorAll('.section[data-section]');
  // Define mascot motion path (relative to viewport)
  const path = [
    {x: '10vw', y: '15vh'}, // home
    {x: '30vw', y: '30vh'}, // profile
    {x: '80vw', y: '40vh'}, // about
    {x: '20vw', y: '55vh'}, // services
    {x: '70vw', y: '70vh'}, // projects
    {x: '50vw', y: '85vh'}  // end
  ];
  // Animate mascot along path as user scrolls
  if (typeof MotionPathPlugin !== 'undefined') {
    gsap.to(mascot, {
      motionPath: {
        path: path,
        autoRotate: false,
        curviness: 1.5
      },
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    });
  }
  // Section reactions
  sections.forEach((section, i) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => mascotReact(section.dataset.section),
      onEnterBack: () => mascotReact(section.dataset.section)
    });
  });
  function mascotReact(section) {
    mascot.classList.remove('hide', 'wave', 'color-projects', 'color-services', 'color-home');
    if (section === 'about') mascot.classList.add('hide');
    else if (section === 'services') mascot.classList.add('wave', 'color-services');
    else if (section === 'projects') mascot.classList.add('color-projects');
    else if (section === 'home') mascot.classList.add('color-home');
    // contact: default
  }
  // Animate section elements with creative 3D motion paths
  document.querySelectorAll('[data-animate="motion-path"]').forEach((el, i) => {
    let path3d = [
      {x: -200, y: -100, z: -200},
      {x: 0, y: 0, z: 0}
    ];
    if (i % 3 === 1) path3d = [{x: 200, y: 120, z: -150}, {x: 0, y: 0, z: 0}];
    if (i % 3 === 2) path3d = [{x: 0, y: 200, z: -100}, {x: 0, y: 0, z: 0}];
    gsap.fromTo(el,
      {opacity: 0, x: path3d[0].x, y: path3d[0].y, z: path3d[0].z, rotateY: 0},
      {
        opacity: 1,
        x: path3d[1].x, y: path3d[1].y, z: path3d[1].z, rotateY: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  });
});

// Ensure mascot is visible when Rive loads
document.addEventListener('DOMContentLoaded', () => {
  const mascot = document.getElementById('mascot-octopus');
  if (mascot) mascot.style.display = 'block';
});

// Smooth scrolling for navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Removed contact-form event listener because the form no longer exists.

// Add floating elements
function addFloatingElements() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        for (let i = 0; i < 3; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.style.left = Math.random() * 100 + '%';
            element.style.top = Math.random() * 100 + '%';
            element.style.animationDelay = Math.random() * 6 + 's';
            section.appendChild(element);
        }
    });
}

// Initialize floating elements
addFloatingElements();

// Add scroll-triggered 3D transformations
function addScrollTransformations() {
    const cards = document.querySelectorAll('.about-card, .service-card, .project-card');
    
    cards.forEach((card, index) => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top 90%',
            end: 'bottom 10%',
            onEnter: () => {
                gsap.to(card, {
                    duration: 0.8,
                    scale: 1.05,
                    ease: 'power2.out'
                });
            },
            onLeave: () => {
                gsap.to(card, {
                    duration: 0.8,
                    scale: 1,
                    ease: 'power2.out'
                });
            }
        });
    });
}

// Initialize scroll transformations
addScrollTransformations();

// Add parallax effect to background
function addParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('#three-canvas');
        
        if (parallax) {
            const speed = scrolled * 0.5;
            gsap.to(parallax, {
                duration: 0.1,
                y: speed,
                ease: 'none'
            });
        }
    }, { passive: true });
}

// Initialize parallax effect
addParallaxEffect(); 

// Removed dynamic profile upload logic (static image only)

// --- Rive Octopus Mascot ---
document.addEventListener('DOMContentLoaded', () => {
  if (window.rive) {
    const riveInstance = new rive.Rive({
      src: 'octopus_loop.riv',
      canvas: document.getElementById('rive-octopus'),
      autoplay: true,
      stateMachines: ['State Machine 1'], // Use the correct state machine
      onLoad: () => {
        riveInstance.resizeDrawingSurfaceToCanvas();
        const mascot = document.getElementById('mascot-octopus');
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        let originalPosition = { left: mascot.offsetLeft, top: mascot.offsetTop };

        mascot.style.position = 'fixed';
        mascot.style.left = originalPosition.left + 'px';
        mascot.style.top = originalPosition.top + 'px';
        mascot.style.cursor = 'grab';

        mascot.addEventListener('mousedown', (e) => {
          isDragging = true;
          const rect = mascot.getBoundingClientRect();
          dragOffset.x = e.clientX - rect.left;
          dragOffset.y = e.clientY - rect.top;
          mascot.style.cursor = 'grabbing';
          riveInstance.pause();
          console.log('Mascot drag started');
        });
        mascot.addEventListener('touchstart', (e) => {
          const t = e.touches[0];
          isDragging = true;
          const rect = mascot.getBoundingClientRect();
          dragOffset.x = t.clientX - rect.left;
          dragOffset.y = t.clientY - rect.top;
          mascot.style.cursor = 'grabbing';
          riveInstance.pause();
        }, { passive: true });

        document.addEventListener('mousemove', (e) => {
          if (isDragging) {
            mascot.style.left = (e.clientX - dragOffset.x) + 'px';
            mascot.style.top = (e.clientY - dragOffset.y) + 'px';
          }
        });
        document.addEventListener('touchmove', (e) => {
          if (isDragging) {
            const t = e.touches[0];
            mascot.style.left = (t.clientX - dragOffset.x) + 'px';
            mascot.style.top = (t.clientY - dragOffset.y) + 'px';
          }
        }, { passive: true });

        document.addEventListener('mouseup', () => {
          if (isDragging) {
            isDragging = false;
            mascot.style.cursor = 'grab';
            mascot.style.transition = 'left 0.4s cubic-bezier(0.4,2,0.6,1), top 0.4s cubic-bezier(0.4,2,0.6,1)';
            mascot.style.left = originalPosition.left + 'px';
            mascot.style.top = originalPosition.top + 'px';
            setTimeout(() => {
              mascot.style.transition = '';
            }, 400);
            riveInstance.play();
            console.log('Mascot drag ended');
          }
        });
        document.addEventListener('touchend', () => {
          if (isDragging) {
            isDragging = false;
            mascot.style.cursor = 'grab';
            mascot.style.transition = 'left 0.4s cubic-bezier(0.4,2,0.6,1), top 0.4s cubic-bezier(0.4,2,0.6,1)';
            mascot.style.left = originalPosition.left + 'px';
            mascot.style.top = originalPosition.top + 'px';
            setTimeout(() => { mascot.style.transition = ''; }, 400);
            riveInstance.play();
          }
        });

        // Playful interactions
        mascot.addEventListener('mouseenter', () => {
          mascot.classList.add('wave');
        });
        mascot.addEventListener('mouseleave', () => {
          mascot.classList.remove('wave');
        });
      }
    });
    window.addEventListener('resize', () => {
      riveInstance.resizeDrawingSurfaceToCanvas();
    });
  }
});

// --- Animate All Cards, Buttons, and Section Backgrounds ---
window.addEventListener('DOMContentLoaded', () => {
  // Floating cards
  document.querySelectorAll('.about-card, .service-card, .project-card').forEach((card, i) => {
    gsap.to(card, {
      y: '+=18',
      duration: 2.5 + Math.random(),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: Math.random()
    });
  });
  // Pulsing buttons
  document.querySelectorAll('.btn').forEach((btn, i) => {
    gsap.to(btn, {
      scale: 1.04,
      duration: 1.5 + Math.random(),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: Math.random()
    });
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { scale: 1.12, boxShadow: '0 8px 32px #00d4ff55', duration: 0.3 });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1.04, boxShadow: '0 2px 12px #00d4ff22', duration: 0.3 });
    });
  });
  // Animated section backgrounds
  document.querySelectorAll('.section').forEach((section, i) => {
    gsap.to(section, {
      backgroundPosition: `${50+Math.random()*10}% ${50+Math.random()*10}%`,
      duration: 6 + Math.random()*2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: Math.random()
    });
  });
}); 