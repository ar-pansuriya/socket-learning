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
  const [chatMessages, setChatMessages] = useState([
    { text: 'Hello!', sender: 'user' },
    { text: 'Hi there!', sender: 'other' },
    { text: 'How are you?', sender: 'user' },
    { text: 'I\'m good, thanks!', sender: 'other' },
  ]);
  const [message, setMessage] = useState('');


  useEffect(() => {
    // socket event for private messages
    socket.on('private-message', ({ sender, message }) => {
      console.log(message);
      setChatMessages((previous) => [
        ...previous, { text: message, sender }
      ]);
    });

socket.on('check',(v)=>{
console.log('dsad');
  // setChatMessages((previous) => [
  //   ...previous, { text: message, sender }
  // ]);
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

    socket.emit('user connected', currentUser);

    return () => {
      socket.disconnect();
    };

  }, [socket]);


  const handleSendMessage = () => {
    if (touser) {
      setChatMessages((pre) => [...pre, { text: message, sender: 'user' }]);
      let to = touser.userName;
      let sender = currentUser.userName;
      socket.emit('private-message', { message, sender, to })
      setMessage('');
    }
  }


  const handleLogout = async () => {
    let res = await axios.get("/api/auth/logout");
    if (res.data.message === "success") {
      navigate("/login", { replace: true });
    }
    console.log(res.data);
  };

  const handleSelectUser = (v) => {
    settouser(v);
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
        <div className="overflow-y-auto h-4/5">
          {chatMessages.map((chat, index) => (
            <div key={index} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
              <div className={`bg-${chat.sender === 'user' ? 'lime-900' : 'lime-300 text-lime-900'} text-white p-2 rounded-tl-xl rounded-bl-xl rounded-br-xl max-w-xs`}>
                <div className="flex justify-between">
                  <span className="text-sm font-bold">{chat.sender === 'user' ? 'You' : chat.sender}</span>
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
    </div>
  );
};

export default ChatComponent;
