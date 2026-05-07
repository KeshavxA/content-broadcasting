// Mock auth service for development
// In production, this would make actual API calls to your backend

/**
 * Log in a user with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{token: string, role: string, user: object}>}
 */
export const loginUser = async (email, password) => {
  // Mock API call delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock validation logic
      if (email === 'teacher@test.com' && password === 'password') {
        resolve({
          token: 'mock-teacher-jwt-token',
          role: 'teacher',
          user: {
            id: '1',
            name: 'John Doe',
            email: 'teacher@test.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
          }
        });
      } else if (email === 'principal@test.com' && password === 'password') {
        resolve({
          token: 'mock-principal-jwt-token',
          role: 'principal',
          user: {
            id: '2',
            name: 'Jane Smith',
            email: 'principal@test.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
          }
        });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 1000);
  });
};

/**
 * Logout the current user
 */
export const logoutUser = async () => {
  // Clear any server-side sessions if necessary
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
};

/**
 * Get current user from local storage
 */
export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
