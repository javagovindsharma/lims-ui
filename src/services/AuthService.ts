// services/AuthService.ts

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    // Add other user properties as needed
  };
}

class AuthService {
  async login(username: string, password: string): Promise<boolean> {
    try {
      // Make an API request to your authentication endpoint
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data: LoginResponse = await response.json();
        
        // Save the token to local storage or a secure storage mechanism
        localStorage.setItem('authToken', data.token);

        // You may want to store user information in the Redux store
        // or another global state management solution
        // dispatch(setUser(data.user));

        return true; // Authentication successful
      } else {
        // Handle authentication failure (e.g., display error message)
        console.error('Authentication failed');
        return false;
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error during authentication', error);
      return false;
    }
  }

  logout(): void {
    // Clear the authentication token from storage
    localStorage.removeItem('authToken');

    // You may also want to clear user information from the global state
    // dispatch(logoutUser());
  }

  isAuthenticated(): boolean {
    // Check if the authentication token exists
    return !!localStorage.getItem('authToken');
  }
}

export default new AuthService();
