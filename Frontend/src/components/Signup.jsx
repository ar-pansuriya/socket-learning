import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [data, setData] = useState({ fullName: '', userName: '', password: '', gender: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleClick = async () => {
    let res = await axios.post('api/auth/signup', data);
    console.log(res.data);
    setData({ fullName: '', userName: '', password: '', gender: '' });
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <input
        type="text"
        name="fullName"
        onChange={handleInputChange}
        placeholder="Full name"
        value={data.fullName}
        className="border p-2 focus:outline-none focus:border-lime-600 focus:border-2  rounded-md"
      />
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
        className="border p-2 focus:outline-none focus:border-lime-600 focus:border-2  rounded-md"
      />
      <div className='flex gap-2'>
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
        className="bg-lime-600 text-white p-2 rounded-md hover:bg-lime-800 focus:outline-none focus:ring focus:border-lime-600"
      >
        Signup
      </button>
      <Link to="/login" className="text-lime-900 hover:underline focus:outline-none focus:ring focus:border-lime-600">
        Already have an account???
      </Link>
    </div>
  );
};

export default Signup;
