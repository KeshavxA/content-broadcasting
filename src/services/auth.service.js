export const authService = {
  login: async (credentials) => {

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === 'teacher@test.com' && credentials.password === 'password') {
          resolve({
            user: { id: '1', name: 'Teacher User', email: 'teacher@test.com', role: 'teacher' },
            token: 'mock-teacher-token'
          });
        } else if (credentials.email === 'principal@test.com' && credentials.password === 'password') {
          resolve({
            user: { id: '2', name: 'Principal User', email: 'principal@test.com', role: 'principal' },
            token: 'mock-principal-token'
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },

  logout: async () => {

    return new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
