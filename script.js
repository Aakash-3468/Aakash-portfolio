/**
 * Aakash N - Data Science & AI Portfolio
 * Interactive Scripts & Visual Effects
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initNeuralCanvas();
  initTypingEffect();
  initMLPredictorDemo();
  initSkillsFilter();
  initNavigation();
  initThemeToggle();
  initResumeModal();
  initContactForm();
});

/* ==========================================================================
   1. Neural Network Particle Background Canvas
   ========================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
      this.color = Math.random() > 0.4 ? 'rgba(0, 240, 255, 0.7)' : 'rgba(139, 92, 246, 0.7)';
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off borders
      if (this.x > width || this.x < 0) this.speedX = -this.speedX;
      if (this.y > height || this.y < 0) this.speedY = -this.speedY;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= forceDirectionX * force * 1.5;
          this.y -= forceDirectionY * force * 1.5;
        }
      }

      this.draw();
    }
  }

  let particlesArray = [];
  function initParticles() {
    particlesArray = [];
    const numberOfParticles = Math.min(Math.floor((width * height) / 14000), 85);
    for (let i = 0; i < numberOfParticles; i++) {
      let x = Math.random() * width;
      let y = Math.random() * height;
      particlesArray.push(new Particle(x, y));
    }
  }

  function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a + 1; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          let opacityValue = 1 - distance / 110;
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacityValue * 0.18})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();
  }

  initParticles();
  animate();
}

/* ==========================================================================
   2. Typing Effect in Hero
   ========================================================================== */
function initTypingEffect() {
  const typedTextElement = document.getElementById('typedText');
  if (!typedTextElement) return;

  const phrases = [
    'Data Science & Analytics',
    'Machine Learning & AI Modeling',
    'Healthcare Predictive Diagnostics',
    'Power BI & SQL Business Insights',
    'Data Preprocessing & Feature Engineering'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 1800; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. Interactive AI Healthcare Disease Prediction Live Simulator
   ========================================================================== */
function initMLPredictorDemo() {
  const glucoseInput = document.getElementById('glucoseInput');
  const bpInput = document.getElementById('bpInput');
  const bmiInput = document.getElementById('bmiInput');
  const ageInput = document.getElementById('ageInput');
  const hrInput = document.getElementById('hrInput');

  const glucoseVal = document.getElementById('glucoseVal');
  const bpVal = document.getElementById('bpVal');
  const bmiVal = document.getElementById('bmiVal');
  const ageVal = document.getElementById('ageVal');
  const hrVal = document.getElementById('hrVal');

  const riskBadge = document.getElementById('riskBadge');
  const confidenceVal = document.getElementById('confidenceVal');
  const riskBarFill = document.getElementById('riskBarFill');
  const explanationText = document.getElementById('explanationText');
  const scrollToDemoBtn = document.getElementById('scrollToDemoBtn');
  const liveDemoWidget = document.getElementById('liveDemoWidget');

  if (!glucoseInput || !riskBadge) return;

  function calculateRisk() {
    const glucose = parseFloat(glucoseInput.value);
    const bp = parseFloat(bpInput.value);
    const bmi = parseFloat(bmiInput.value);
    const age = parseFloat(ageInput.value);
    const hr = parseFloat(hrInput.value);

    // Update labels
    glucoseVal.textContent = glucose;
    bpVal.textContent = bp;
    bmiVal.textContent = bmi.toFixed(1);
    ageVal.textContent = age;
    hrVal.textContent = hr;

    // Simulated Logistic / Random Forest Weighted Scoring
    // Baseline risk = 5%
    let rawScore = 5;

    // Glucose impact (optimal < 100, pre-diabetic 100-125, diabetic > 126)
    if (glucose > 140) rawScore += (glucose - 140) * 0.45 + 25;
    else if (glucose > 100) rawScore += (glucose - 100) * 0.35;

    // Blood pressure impact (optimal < 120, elevated 120-129, hypertension > 130)
    if (bp > 140) rawScore += (bp - 140) * 0.4 + 20;
    else if (bp > 120) rawScore += (bp - 120) * 0.3;

    // BMI impact (normal 18.5 - 24.9, overweight 25-29.9, obese > 30)
    if (bmi > 30) rawScore += (bmi - 30) * 1.8 + 15;
    else if (bmi > 25) rawScore += (bmi - 25) * 1.2;

    // Age vulnerability factor
    if (age > 50) rawScore += (age - 50) * 0.45 + 8;
    else if (age > 35) rawScore += (age - 35) * 0.2;

    // Resting Heart rate factor
    if (hr > 90) rawScore += (hr - 90) * 0.35;

    // Clamp score between 5% and 98%
    const riskPercentage = Math.min(Math.max(Math.round(rawScore), 5), 98);

    // Dynamic UI updates based on risk tiers
    let badgeText = 'LOW RISK';
    let badgeClass = 'risk-badge risk-low';
    let barColor = '#10b981';
    let confidence = (85 + (Math.abs(50 - riskPercentage) * 0.25)).toFixed(1);
    let explanation = '';

    const elevatedFactors = [];
    if (glucose >= 126) elevatedFactors.push('Elevated Fasting Glucose (>125 mg/dL)');
    if (bp >= 135) elevatedFactors.push('High Systolic Blood Pressure (≥135 mmHg)');
    if (bmi >= 30) elevatedFactors.push('Obesity Index (BMI ≥ 30)');
    if (age >= 55) elevatedFactors.push('Senior Age Group');
    if (hr >= 95) elevatedFactors.push('Tachycardia / Elevated HR');

    if (riskPercentage < 35) {
      badgeText = 'LOW RISK';
      badgeClass = 'risk-badge risk-low';
      barColor = '#10b981';
      explanation = 'All baseline indicators are within normal healthy ranges. Early detection algorithms assess minimal clinical risk.';
    } else if (riskPercentage < 65) {
      badgeText = 'MODERATE RISK';
      badgeClass = 'risk-badge risk-moderate';
      barColor = '#f59e0b';
      explanation = `Precautionary risk detected. Notable factors: ${elevatedFactors.length > 0 ? elevatedFactors.join(', ') : 'Borderline health metrics'}. Recommended for routine wellness follow-up.`;
    } else {
      badgeText = 'HIGH RISK';
      badgeClass = 'risk-badge risk-high';
      barColor = '#f43f5e';
      explanation = `High vulnerability pattern recognized by ML classifier. Primary risk drivers: ${elevatedFactors.join(', ')}. Priority medical consultation suggested.`;
    }

    // Update elements
    riskBadge.textContent = badgeText;
    riskBadge.className = badgeClass;
    confidenceVal.textContent = `${confidence}%`;
    riskBarFill.style.width = `${riskPercentage}%`;
    riskBarFill.style.background = barColor;
    explanationText.textContent = explanation;
  }

  // Bind input listeners
  [glucoseInput, bpInput, bmiInput, ageInput, hrInput].forEach(input => {
    input.addEventListener('input', calculateRisk);
  });

  // Smooth scroll to demo widget from button
  if (scrollToDemoBtn && liveDemoWidget) {
    scrollToDemoBtn.addEventListener('click', () => {
      liveDemoWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      liveDemoWidget.style.boxShadow = '0 0 35px rgba(0, 240, 255, 0.6)';
      setTimeout(() => {
        liveDemoWidget.style.boxShadow = '';
      }, 1500);
    });
  }

  // Initial calculation
  calculateRisk();
}

/* ==========================================================================
   4. Skills Matrix Category Filter
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   5. Navigation, Scroll Spy & Mobile Hamburger
   ========================================================================== */
function initNavigation() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const navbar = document.getElementById('navbar');

  // Hamburger Toggle
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburgerBtn.classList.toggle('open');
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburgerBtn.classList.remove('open');
      });
    });
  }

  // Navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.4)';
    } else {
      navbar.style.boxShadow = 'none';
    }

    // Scroll Spy for active nav link
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   6. Theme Toggle (Dark / Light)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggle');
  if (!themeToggleBtn) return;

  // Check saved preference
  const savedTheme = localStorage.getItem('agy-portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('agy-portfolio-theme', newTheme);
  });
}

/* ==========================================================================
   7. Resume Modal Handling
   ========================================================================== */
function initResumeModal() {
  const viewResumeBtn = document.getElementById('viewResumeBtn');
  const resumeModal = document.getElementById('resumeModal');
  const closeResumeModalBtn = document.getElementById('closeResumeModalBtn');

  if (!viewResumeBtn || !resumeModal) return;

  function openModal() {
    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  viewResumeBtn.addEventListener('click', openModal);

  if (closeResumeModalBtn) {
    closeResumeModalBtn.addEventListener('click', closeModal);
  }

  // Close when clicking outside content
  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) {
      closeModal();
    }
  });

  // ESC key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. Contact Form & Toast Notifications
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toastNotification');
  const formStatusAlert = document.getElementById('formStatusAlert');

  if (!contactForm) return;

  function showToast(message, duration = 3500) {
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, duration);
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('senderName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const subject = document.getElementById('senderSubject').value.trim() || 'Portfolio Contact';
    const message = document.getElementById('senderMessage').value.trim();

    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    // Success response simulation & mailto preparation
    const mailtoUrl = `mailto:aakashebiofficial@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Aakash,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    
    // Provide instant in-app feedback
    if (formStatusAlert) {
      formStatusAlert.innerHTML = `<strong>Thank you, ${name}!</strong> Opening your email client to send your message to <em>aakashebiofficial@gmail.com</em>...`;
      formStatusAlert.className = 'form-status-alert success';
    }

    showToast(`✓ Message prepared for Aakash! Opening email client...`);

    // Reset form
    contactForm.reset();

    // Trigger mail client after brief delay
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 1200);
  });
}
