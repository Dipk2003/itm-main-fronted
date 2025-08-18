// Run this in browser console to clear all authentication data
(function clearAllAuthData() {
  const keysToRemove = [
    'authToken',
    'user',
    'token',
    'userRole',
    'userData',
    'vendorId',
    'userId',
    'refreshToken',
    'access_token',
    'id_token',
    'state'
  ];

  console.log('🧹 Clearing all authentication data...');
  
  // Clear localStorage
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      console.log(`Removing from localStorage: ${key}`);
      localStorage.removeItem(key);
    }
  });
  
  // Clear sessionStorage
  keysToRemove.forEach(key => {
    if (sessionStorage.getItem(key)) {
      console.log(`Removing from sessionStorage: ${key}`);
      sessionStorage.removeItem(key);
    }
  });
  
  // Clear all cookies (if any)
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
  
  console.log('✅ All authentication data cleared. Please refresh the page.');
  
  // Optionally refresh the page
  if (confirm('All auth data cleared. Refresh the page now?')) {
    window.location.reload();
  }
})();
