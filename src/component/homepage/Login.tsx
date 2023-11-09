// components/Login.tsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../actions/authActions"; // Replace with your actual actions
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const history = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Perform authentication logic (you may want to use async/await here)
    const isAuthenticated = await AuthService.login(username, password);

    if (isAuthenticated) {
      // Dispatch an action to update the authentication state
     // dispatch(loginUser(username));

      // Redirect to the home page or another desired page
      history("/");
    } else {
      // Handle authentication failure (show an error message, etc.)
      console.log("Authentication failed");
         history("/home1");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
