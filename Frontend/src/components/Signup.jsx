import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Signup = () => {
  const [data, setData] = useState({ fullName: '', userName: '', password: '', gender: '' });
  const navigate = useNavigate();
  const [isload, setisload] = useState(false);
  const handleInputChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleClick = async () => {
    setisload(true)
    let res = await axios.post('api/auth/signup', data);
    setisload(false)
    setData({ fullName: '', userName: '', password: '', gender: '' });
    if (res.data.message === 'account created') {
      navigate('/login');
    } else {
      toast.info(res.data.message)
    }

  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-screen gap-3">
      <img src="wavetalk.png" alt="" className='shadow-xl rounded-full' />
      <h1 className='text-3xl font-bold text-sky-600'>Welcome to WaveTalk</h1>
      <input
        type="text"
        name="fullName"
        onChange={handleInputChange}
        placeholder="Full name"
        value={data.fullName}
        className="border p-2 text-sky-700 focus:outline-none focus:border-sky-600 focus:border-2  rounded-md"
      />
      <input
        type="text"
        name="userName"
        onChange={handleInputChange}
        placeholder="User name"
        value={data.userName}
        className="border p-2 focus:outline-none text-sky-700 focus:border-sky-600 focus:border-2  rounded-md"
      />
      <input
        type="password"
        name="password"
        onChange={handleInputChange}
        placeholder="Password"
        value={data.password}
        className="border p-2 focus:outline-none text-sky-700 focus:border-sky-600 focus:border-2  rounded-md"
      />
      <div className='flex gap-2 text-sky-700'>
        <input
          type="radio"
          name="gender"
          value="male"
          id="male"
          onChange={handleInputChange}
          checked={data.gender === 'male'}
        />
        <label htmlFor="male">Male</label>
        <input
          type="radio"
          name="gender"
          value="female"
          id="female"
          onChange={handleInputChange}
          checked={data.gender === 'female'}
        />
        <label htmlFor="female">Female</label>
      </div>
      <button
        onClick={handleClick}
        className="bg-sky-600 text-white p-2 rounded-md hover:bg-sky-800 focus:outline-none focus:ring focus:border-sky-600"
      >
        Signup
      </button>
      <Link to="/login" className="text-sky-900 hover:underline focus:outline-none">
        Back to the Waves: Log In Here???
      </Link>
    </div>
  );
};

export default Signup;
