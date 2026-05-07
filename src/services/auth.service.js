/**
 * Mock Auth Service
 * Simulates backend authentication with hardcoded responses.
 */

const MOCK_USERS = {
  TEACHER: {
    id: 'usr_teacher_01',
    name: 'Prof. Alexander Wright',
    email: 'teacher@test.com',
    role: 'teacher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander',
    department: 'Mathematics',
    school: 'Greenwood High'
  },
  PRINCIPAL: {
    id: 'usr_principal_01',
    name: 'Dr. Sarah Jenkins',
    email: 'principal@test.com',
    role: 'principal',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    school: 'Greenwood High',
    yearsInService: 12
  }
};

/**
 * Log in a user with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{token: string, role: string, user: object}>}
 */
export const loginUser = async (email, password) => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  if (email === 'teacher@test.com' && password === 'password') {
    return {
      token: 'mock_jwt_teacher_token_xyz123',
      role: 'teacher',
      user: MOCK_USERS.TEACHER
    };
  }

  if (email === 'principal@test.com' && password === 'password') {
    return {
      token: 'mock_jwt_principal_token_abc789',
      role: 'principal',
      user: MOCK_USERS.PRINCIPAL
    };
  }

  throw new Error('Invalid credentials. Use teacher@test.com or principal@test.com with password: password');
};

/**
 * Logout the current user
 */
export const logoutUser = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return { success: true };
};

/**
 * Get current user from local storage
 */
export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
