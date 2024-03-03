import axios from "axios";
import React from "react";
import { useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';


const ChatComponent = () => {

  const socket = useMemo(() => io('http://localhost:5000'), []);
  const navigate = useNavigate();
  const [usersList, setusersList] = useState([]);
  const [currentUser, setcurrentUser] = useState({});
  const [touser, settouser] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.emit('user connected', currentUser);
    socket.on('personal-chat', ({ sender, message, to }) => {
      setChatMessages((pre) => [...pre, { sender, text: message, to }]);
    })



    let LoginUser = document.cookie
      .split("; ")
      .find((row) => row.startsWith("LoginUser="));
    LoginUser = LoginUser.split("=")[1];
    // fetch users and set current loginuser
    const fetchusers = async () => {
      let res = await axios.get("/api/userslist");
      let adduser = res.data.filter((v) => v.userName !== LoginUser);
      setusersList(adduser);
      setcurrentUser(res.data.filter((v) => v.userName === LoginUser)[0]);
    };
    fetchusers();

    return () => {
      socket.disconnect();
    };

  }, [socket]);


  const handleSendMessage = async () => {
    if (touser) {
      console.log(touser);
      let to = touser.userName;
      let sender = currentUser.userName;
      let res = await axios.post('/api/message', { message, sender, to });
      if (res.data.message === 'done') {
        setChatMessages([...chatMessages, { text: message, sender, to }]);
        socket.emit('personal-chat', { message, sender, to });
        setMessage('');
      }
    }
  }


  const handleLogout = async () => {
    let res = await axios.get("/api/auth/logout");
    if (res.data.message === "success") {
      navigate("/login", { replace: true });
    }
    console.log(res.data);
  };

  const handleSelectUser = async (v) => {
    settouser(v);
    let res = await axios.get(`/api/message/${v.userName}`, { withCredentials: true });
    console.log(res.data);
    setChatMessages(res.data);
  };

  return (
    <div
      className="flex"
      style={{
        height: "100vh",
      }}
    >
      {/* Left Div */}
      <div className="flex-col flex justify-between w-1/4 border shadow-lg bg-lime-900 rounded p-4">
        <div>
          <div className="text-lg bg-lime-300 flex items-center p-2 rounded font-semibold mb-4">
            <img
              src={currentUser.profilePic} // Replace with the actual path to your image
              alt="User 1 Profile"
              className="w-10 h-10 rounded mr-2"
            />
            <span className="text-lg font-medium">{currentUser.userName}</span>
          </div>
          {/* Sample user list */}
          <ul className="flex flex-col gap-2 scroll-auto">
            {usersList.map((v, index) => (
              <div
                key={index}
                onClick={() => handleSelectUser(v)}
                className="border-lime-100 border-2 hover:bg-lime-700 text-white flex items-center p-2 cursor-pointer rounded"
              >
                <img
                  src={v.profilePic} // Replace with the actual path to your image
                  alt="User 1 Profile"
                  className="w-10 h-10 rounded mr-2"
                />
                <span className="text-lg font-medium">{v.userName}</span>
              </div>
            ))}
            {/* Add more users as needed */}
          </ul>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="bg-lime-100 p-2 rounded text-xl"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Right Div */}
      <div className="flex-grow flex flex-col justify-between rounded bg-lime-100 p-4">
        {touser ? (
          <div className="text-lg bg-lime-900 text-white flex items-center p-2 rounded font-semibold mb-4">
            <img
              src={touser.profilePic} // Replace with the actual path to your image
              alt="User 1 Profile"
              className="w-10 h-10 rounded mr-2"
            />
            <span className="text-lg font-medium">{touser.userName}</span>
          </div>
        ) : (
          <div className="text-lg py-3 bg-lime-900 text-white flex items-center p-2 rounded font-semibold">
            <h2>Select User To Chat</h2>
          </div>
        )}
        <div className="overflow-y-auto h-4/5"
          style={{
            maxHeight: "80vh",
            position: "relative",
            WebkitOverflowScrolling: "touch", // Enables smooth scrolling on Webkit browsers
            scrollbarWidth: "thin", // For Firefox
            scrollbarColor: "#2c3e50 #9cc100", // For Firefox
          }}>
          {chatMessages.map((chat, index) => (
            <div div key={index} className={`flex ${chat.sender === currentUser.userName ? 'justify-end' : 'justify-start'} mb-2`}>
              <div className={`bg-${chat.sender === currentUser.userName ? 'lime-700 text-white' : 'lime-300 text-lime-900'}  p-2 rounded-tl-xl font-medium rounded-bl-xl rounded-br-xl max-w-xs`}>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">{/* Add timestamp here */}</span>
                </div>
                <p className="text-sm">{chat.text}</p>
              </div>
            </div>
          ))}
          {/* Add more chat messages as needed */}
        </div>

        {/* Input and Send Button */}
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(v) => setMessage(v.target.value)}
            placeholder="Type your message..."
            className="flex-grow border focus:outline-none focus:border-lime-700 rounded p-2 mr-2"
          />
          <button onClick={handleSendMessage} className="bg-lime-900 text-white p-2 rounded text-xl">
            Send
          </button>
        </div>
      </div>
    </div >
  );
};

export default ChatComponent;
