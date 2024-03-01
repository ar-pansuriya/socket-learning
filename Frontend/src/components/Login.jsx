import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';


const Login = () => {

  const socket = useMemo(() => io('http://localhost:5000'), []);
  const Navigate = useNavigate();
  const [data, setData] = useState({ userName: '', password: '' });

  const handleInputChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleClick = async () => {
    if (data.userName && data.password) {
      let res = await axios.post('api/auth/login', data);
      setData({ userName: '', password: '' });
      if (res.data.message === 'login successful') {
      Navigate('/profile', { replace: true });
      }
    }
  };



  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <input
        type="text"
        name="userName"
        onChange={handleInputChange}
        placeholder="User name"
        value={data.userName}
        className="border p-2 focus:outline-none focus:border-lime-600 focus:border-2  rounded-md"
      />
      <input
        type="password"
        name="password"
        onChange={handleInputChange}
        placeholder="Password"
        value={data.password}
        className="border p-2 focus:outline-none focus:border-lime-600 focus:border-2 rounded-md"
      />
      <button onClick={handleClick} className="bg-lime-600 text-white p-2 rounded-md hover:bg-lime-800">
        Login
      </button>
      <Link to="/signup" className="text-lime-900 underline">
        Create new account???
      </Link>
      <Link to="/profile" className="text-lime-900 hover:underline">
        Go to Chatapp
      </Link>
    </div>
  );
};

export default Login;
