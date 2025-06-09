import React from 'react';
import Login from "../Pages/Login";
import { useNavigate } from 'react-router-dom';


function SignInButton() {

  const navigate = useNavigate();
  const handleClick = () => {
    console.log('Sign In button clicked');
    navigate("/Login");
  };

  return (
    <div>
      <button title="Login" onClick={handleClick}>
        Login
      </button>
    </div>
  );
}

export default SignInButton;