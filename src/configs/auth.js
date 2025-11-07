export const authConfig = {
  // ...existing code...
  callbacks: {
    // ...existing code...
    redirect: async ({ url, baseUrl }) => {
      // Redirect to /en/dashboard after login
      return '/en/dashboard'
    }
  }
}
