// ===== Authentication Module =====
const Auth = {
  // Demo account credentials
  DEMO_ACCOUNT: {
    username: 'demo',
    password: 'demo123',
    name: 'Akun Demo',
    email: 'demo@evoting.com'
  },

  // API base URL
  API_URL: window.location.origin,

  /**
   * Sign in with username and password
   */
  async signin(username, password) {
    const response = await fetch(`${this.API_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login gagal');
    }

    // Store token and user data
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      name: data.name,
      username: data.username,
      email: data.email,
      roles: data.roles,
      status: data.status
    }));

    return data;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Get current user data
   */
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Sign out
   */
  signout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/resources/static/login.html';
  },

  /**
   * Fill demo credentials into the form
   */
  fillDemoCredentials(form) {
    if (!form) return;
    const usernameInput = form.querySelector('#username');
    const passwordInput = form.querySelector('#password');

    if (usernameInput && passwordInput) {
      usernameInput.value = this.DEMO_ACCOUNT.username;
      passwordInput.value = this.DEMO_ACCOUNT.password;

      // Trigger input events for any listeners
      usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

      // Add a flash effect
      usernameInput.style.borderColor = '#00D9A6';
      passwordInput.style.borderColor = '#00D9A6';
      setTimeout(() => {
        usernameInput.style.borderColor = '';
        passwordInput.style.borderColor = '';
      }, 1000);
    }
  }
};
