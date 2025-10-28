// ============================================
// CREATIVE RISING MINDS - AUTHENTICATION HELPER
// ============================================

// Your Supabase credentials
const SUPABASE_URL = 'https://hzjrxjhelpapvdmfidnu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6anJ4amhlbHBhcHZkbWZpZG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjIwOTEsImV4cCI6MjA3NTk5ODA5MX0.doszHhsbhUc6FCqZHav_Bny8UDy5ZTRUpKTRR1h_Z_o';

// Helper function to make API calls
async function supabaseFetch(endpoint, options = {}) {
  const url = `${SUPABASE_URL}${endpoint}`;
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.msg || 'Request failed');
  }
  
  return data;
}

// ============================================
// 1. SIGNUP - Register new user
// ============================================
async function signup(email, password, fullName = '') {
  try {
    const data = await supabaseFetch('/auth/v1/signup', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        data: {
          full_name: fullName
        }
      })
    });

    if (data.user) {
      // Store session
      storeSession(data);
      return {
        success: true,
        message: 'Account created successfully! Please check your email to verify.',
        user: data.user
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Signup failed. Please try again.'
    };
  }
}

// ============================================
// 1B. GOOGLE SIGN IN - OAuth
// ============================================
async function signInWithGoogle() {
  try {
    const redirectTo = window.location.origin + '/dashboard.html';
    const authUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
    
    // Redirect to Google OAuth
    window.location.href = authUrl;
    
    return {
      success: true,
      message: 'Redirecting to Google...'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Google sign-in failed.'
    };
  }
}

// ============================================
// 1C. HANDLE OAUTH CALLBACK
// ============================================
function handleOAuthCallback() {
  // Check if we have OAuth tokens in URL hash
  const hash = window.location.hash;
  
  if (hash && hash.includes('access_token')) {
    // Parse hash parameters
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const expiresIn = params.get('expires_in');
    
    if (accessToken) {
      // Store session
      storeSession({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: Math.floor(Date.now() / 1000) + parseInt(expiresIn)
      });
      
      // Fetch user data
      fetchCurrentUser(accessToken).then(user => {
        if (user) {
          storeSession({ user });
          // Clean URL and redirect
          window.location.href = '/dashboard.html';
        }
      });
      
      return true;
    }
  }
  
  return false;
}

// Fetch current user data with access token
async function fetchCurrentUser(token) {
  try {
    const data = await supabaseFetch('/auth/v1/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// ============================================
// 2. LOGIN - Authenticate existing user
// ============================================
async function login(email, password) {
  try {
    const data = await supabaseFetch('/auth/v1/token?grant_type=password', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      })
    });

    if (data.access_token) {
      // Store session
      storeSession(data);
      return {
        success: true,
        message: 'Login successful!',
        user: data.user
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Invalid email or password.'
    };
  }
}

// ============================================
// 3. LOGOUT - Clear session
// ============================================
function logout() {
  sessionStorage.removeItem('supabase_session');
  sessionStorage.removeItem('supabase_user');
  window.location.href = 'login.html';
}

// ============================================
// 4. GET CURRENT USER - Check if logged in
// ============================================
function getCurrentUser() {
  const sessionData = sessionStorage.getItem('supabase_session');
  const userData = sessionStorage.getItem('supabase_user');
  
  if (sessionData && userData) {
    const session = JSON.parse(sessionData);
    const user = JSON.parse(userData);
    
    // Check if session is expired
    if (session.expires_at && new Date(session.expires_at * 1000) > new Date()) {
      return user;
    }
  }
  
  return null;
}

// ============================================
// 5. GET ACCESS TOKEN - For authenticated requests
// ============================================
function getAccessToken() {
  const sessionData = sessionStorage.getItem('supabase_session');
  if (sessionData) {
    const session = JSON.parse(sessionData);
    return session.access_token;
  }
  return null;
}

// ============================================
// 6. REQUIRE AUTH - Protect pages (redirect if not logged in)
// ============================================
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// ============================================
// 7. PASSWORD RESET - Request password reset email
// ============================================
async function requestPasswordReset(email) {
  try {
    await supabaseFetch('/auth/v1/recover', {
      method: 'POST',
      body: JSON.stringify({
        email
      })
    });

    return {
      success: true,
      message: 'Password reset email sent! Check your inbox.'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to send reset email.'
    };
  }
}

// ============================================
// 8. STORE SESSION - Save user session data
// ============================================
function storeSession(data) {
  if (data.access_token) {
    sessionStorage.setItem('supabase_session', JSON.stringify({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at
    }));
  }
  
  if (data.user) {
    sessionStorage.setItem('supabase_user', JSON.stringify(data.user));
  }
}

// ============================================
// 9. FETCH USER DATA - Get user info with auth
// ============================================
async function fetchUserData(endpoint) {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  return await supabaseFetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

// ============================================
// 10. UPDATE USER PROFILE - Update user metadata
// ============================================
async function updateUserProfile(updates) {
  const token = getAccessToken();
  if (!token) {
    return { success: false, message: 'Not authenticated' };
  }

  try {
    const data = await supabaseFetch('/auth/v1/user', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        data: updates
      })
    });

    // Update stored user data
    sessionStorage.setItem('supabase_user', JSON.stringify(data));

    return {
      success: true,
      message: 'Profile updated successfully',
      user: data
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to update profile'
    };
  }
}