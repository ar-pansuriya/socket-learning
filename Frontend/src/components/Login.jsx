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
    <div className="h-screen text-center flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-3 flex-col p-8">
        <img src="wavetalk.png" alt="" className='shadow-xl rounded-full' />
        <h1 className='text-3xl font-bold text-sky-600'>Welcome to WaveTalk</h1>
        <input
          type="text"
          name="userName"
          onChange={handleInputChange}
          placeholder="User name"
          value={data.userName}
          className="border p-2 focus:outline-none focus:border-sky-600 focus:border-2 rounded-md text-sky-700"
        />
        <input
          type="password"
          name="password"
          onChange={handleInputChange}
          placeholder="Password"
          value={data.password}
          className="border p-2 focus:outline-none focus:border-sky-600 focus:border-2 rounded-md text-sky-700"
        />
        <button
          onClick={handleClick}
          className="bg-sky-600 text-white p-2 rounded-md hover:bg-sky-800"
        >
          Login
        </button>
        <Link to="/signup" className="text-sky-900 underline mb-2">
          Join the WaveTalk Community???
        </Link>
        <Link to="/profile" className="text-sky-900 hover:underline">
          Enter WaveTalk
        </Link>
      </div>
    </div>
  );
};

export default Login;
