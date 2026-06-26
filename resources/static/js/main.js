// ===== Main Application JavaScript =====
document.addEventListener('DOMContentLoaded', () => {

  // ===== Navigation =====
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  // Navbar scroll effect
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Check initial scroll position
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    }
  }

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ===== Smooth Scroll for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== Login Page =====
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');
  const loginButton = document.getElementById('loginButton');
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const demoLoginBtn = document.getElementById('demoLoginBtn');

  // Toggle password visibility
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });
  }

  // Show error
  function showError(message) {
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.classList.add('show');
      setTimeout(() => {
        errorMessage.classList.remove('show');
      }, 5000);
    }
  }

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      if (!username || !password) {
        showError('Silakan isi username dan password');
        return;
      }

      // Show loading state
      loginButton.classList.add('loading');
      loginButton.disabled = true;
      if (errorMessage) errorMessage.classList.remove('show');

      try {
        await Auth.signin(username, password);
        // Redirect to dashboard or home
        window.location.href = '/';
      } catch (err) {
        showError(err.message || 'Login gagal. Periksa username dan password Anda.');
      } finally {
        loginButton.classList.remove('loading');
        loginButton.disabled = false;
      }
    });
  }

  // Demo login button
  if (demoLoginBtn && loginForm) {
    demoLoginBtn.addEventListener('click', () => {
      // Fill the form with demo credentials
      Auth.fillDemoCredentials(loginForm);

      // Auto submit after brief delay
      setTimeout(() => {
        loginForm.dispatchEvent(new Event('submit', { cancelable: true }));
      }, 300);
    });
  }

  // ===== Intersection Observer for animations =====
  const animateElements = document.querySelectorAll('.feature-card');
  
  if (animateElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s both`;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animateElements.forEach(card => {
      observer.observe(card);
    });
  }
});
