import axios from "axios";
import React from "react";
import { useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';
import { useRef } from "react";
import CreateGroup from "./CreateGroup";
import { useDispatch, useSelector } from "react-redux";
import { addCurrentUser, adduserList } from "../redux-slice/ChatSlice";
import GroupChats from "./GroupChats";

const ChatComponent = () => {

  const socket = useMemo(() => io('http://localhost:5000'), []);
  const navigate = useNavigate();
  const [usersList, setusersList] = useState([]);
  const [currentUser, setcurrentUser] = useState({});
  const [touser, settouser] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [emojiopen, setemojiopen] = useState(false)
  const [istyping, setistyping] = useState(false);
  const [onlineusers, setonlineusers] = useState([]);
  const [page, setPage] = useState(1);
  const chatdiv = useRef();
  const dispatch = useDispatch();
const [isgroupselected,setisgroupselected]=useState(false);
  //format date for created message
  const formated = (time) => {
    let timestamp = new Date(time);
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    const formattedDate = timestamp.toLocaleString('en-US', options);
    return formattedDate;
  }


  useEffect(() => {

    //get login user's usernaem from cookies
    var LoginUser = document.cookie
      .split("; ")
      .find((row) => row.startsWith("LoginUser="));
    LoginUser = LoginUser.split("=")[1];

    socket.emit('online', { user: LoginUser });
    // send event to socket user is connected
    socket.emit('user connected', LoginUser);
    // get event from socket for message received
    socket.on('personal-chat', ({ sender, message, to, createdAt }) => {
      setChatMessages((pre) => [...pre, { sender, text: message, to, createdAt }]);
    });

    //get event when user is online and which user is online
    socket.on('online', (onlineuserList) => {
      console.log(onlineuserList);
      setonlineusers(onlineuserList);
    });

    // fetch users and set current loginuser
    const fetchusers = async () => {
      let res = await axios.get("/api/userslist");
      let adduser = res.data.filter((v) => v.userName !== LoginUser);
      setusersList(adduser);
      setcurrentUser(res.data.filter((v) => v.userName === LoginUser)[0]);
      dispatch(addCurrentUser(res.data.filter((v) => v.userName === LoginUser)[0]));
      dispatch(adduserList(adduser));
      console.log('sdas');

    };
    fetchusers();
    //get event when user is typing...
    socket.on('typing', ({ istyping }) => {
      setistyping(istyping);
    })


    //to cleanup function in useEffect hook
    return () => {
      socket.disconnect();
    };
  }, [socket,dispatch]);

  // send message functionality 
  const handleSendMessage = async () => {
    if (touser.userName && message) {
      let to = touser.userName;
      let time = new Date();
      let sender = currentUser.userName;
      let res = await axios.post('/api/message', { message, sender, to, createdAt: formated(time) });
      if (res.data.message === 'done') {
        setChatMessages([...chatMessages, { text: message, sender, to, createdAt: formated(time) }]);
        console.log(chatMessages);
        socket.emit('personal-chat', { message, sender, to, createdAt: formated(time) });
        socket.emit('typing', { istyping: false, to: touser.userName });
        setMessage('');
      }
    }
  }

  //logout account and send api request to remove access and refhresh token form cookies
  const handleLogout = async () => {
    let res = await axios.get("/api/auth/logout");
    if (res.data.message === "success") {
      socket.emit('userdisconnect', { user: currentUser.userName });
      navigate("/login", { replace: true });
    }
  };


  // select uesr to send message functionality
  const handleSelectUser = async (v) => {
    setisgroupselected(false);
    if (touser.userName !== v.userName) {
      setPage(1);
    } else {
      return
    }
    settouser(v);
    fetchChats(v);
  };

  async function fetchChats(v = "") {
    let res = await axios.get(`/api/message?user=${touser.userName}&page=${page}`, { withCredentials: true });
    if (touser.userName === v.userName) {
      return setChatMessages(res.data);
    }
    setChatMessages(res.data);
  }

  // set selected emoji to input value
  const handleEmoji = (v) => {
    console.log(v);
    setMessage((pre) => pre += v)
  }

  //infinite scrolling features for chats

  const handleScroll = async (e) => {
    const { scrollHeight, clientHeight, scrollTop } = e.target;
    console.log(scrollHeight, clientHeight, scrollTop);
    console.log(page);
    console.log(chatMessages);

    let targetScrollPosition = null;

    // Check if user scrolled to the bottom
    if (Math.ceil(scrollHeight - scrollTop) === clientHeight + 1) {
      if ([15, 18].includes(chatMessages.length)) {
        console.log('asas');
        setPage((prevPage) => prevPage + 1);
        targetScrollPosition = scrollHeight - clientHeight; // Scroll to the bottom
      }
    }

    // Check if user scrolled to the top
    if (scrollTop === 0) {
      setPage((p) => Math.max(1, p - 1));
      targetScrollPosition = 20; // Scroll to the top
    }

    // Set the scroll position if a target position is defined
    if (targetScrollPosition !== null) {
      chatdiv.current.scrollTop = targetScrollPosition;
    }
  };

  useEffect(() => {
    fetchChats()
  }, [touser, page]);

const isGslected = (v)=>{
setisgroupselected(v);
}



  return (
    <>
      <div
        className="flex"
        style={{
          height: "100vh",
        }}
      >
        {/* Left Div */}
        <div className="flex-col flex justify-between w-72 border shadow-lg bg-lime-900 rounded p-4">
          <div>
            <div className="text-lg bg-lime-300 flex items-center p-2 rounded font-semibold mb-4">
              <img
                src={currentUser.profilePic} // Replace with the actual path to your image
                alt="User 1 Profile"
                className="w-10 h-10 rounded mr-2"
              />
              <span className="text-lg font-medium">{currentUser.userName}</span>
            </div>
            {/* create group component here */}
            <CreateGroup isGslected = {isGslected}/>
            {/* all users list here */}
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
                  <div className="flex flex-col">
                    <span className="text-lg font-medium">{v.userName}</span>
                    <span className="text-xs font-medium">{onlineusers.includes(v.userName) && 'online'}</span>
                  </div>
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
        {isgroupselected?<GroupChats/>:
        (<div className="flex-grow flex flex-col justify-between rounded bg-lime-100 p-4">
          {touser ? (
            <div className="text-lg bg-lime-900 text-white flex items-center p-2 rounded font-semibold mb-2">
              <img
                src={touser.profilePic} // Replace with the actual path to your image
                alt="User 1 Profile"
                className="w-10 h-10 rounded mr-2"
              />
              <div className="flex flex-col">
                <span className="text-lg font-medium">{touser.userName}</span>
                <span className="text-xs">{istyping ? 'typing...' : onlineusers.includes(touser.userName) && 'online'}</span>
              </div>
            </div>
          ) : (
            <div className="text-lg py-3 bg-lime-900 text-white flex items-center p-2 rounded font-semibold">
              <h2>Select User To Chat</h2>
            </div>
          )}
          {touser.userName && (<div className="overflow-y-auto h-4/5"
            style={{
              position: "relative",
              overflowX: 'hidden',
              textWrap: 'wrap',
              padding: '1rem',

            }}
            onScroll={handleScroll} ref={chatdiv}>
            {chatMessages.map((chat, index) => (
              <div key={index} className={`flex ${chat.sender === currentUser.userName ? 'justify-end' : 'justify-start'} mb-2`}>
                <div className={`bg-${chat.sender === currentUser.userName ? 'lime-700 text-white' : 'lime-500 text-lime-900'}  p-2 rounded-tl-xl font-medium rounded-bl-xl rounded-br-xl max-w-xs`} >
                  <div className="flex justify-between">
                    <span className="text-xs text-lime-100">{chat.createdAt}</span>
                  </div>
                  <p className="text-md">{chat.text}</p>
                </div>
              </div>
            ))}
            {/* Add more chat messages as needed */}
          </div>)}

          {/* Input and Send Button */}
          <div className="flex items-end gap-2">
            <div className="flex flex-col" style={{ position: 'relative' }}>
              {emojiopen && <EmojiPicker style={{
                position: 'absolute',
                bottom: 50
              }} open={emojiopen} onEmojiClick={(e) => handleEmoji(e.emoji)} />}
              <button onClick={() => setemojiopen(emojiopen ? false : true)} className="bg-lime-500 text-white p-2 rounded text-xl w-fit">
                😊
              </button>
            </div>
            <input
              type="text"
              value={message}
              onChange={(v) => {
                setMessage(v.target.value)
                if (v.target.value !== '') {
                  socket.emit('typing', { istyping: true, to: touser.userName });
                } else {
                  socket.emit('typing', { istyping: false, to: touser.userName });
                }
              }}
              placeholder="Type your message..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              className="flex-grow border focus:outline-none focus:border-lime-700 rounded p-2 mr-2"
            />
            <button onClick={handleSendMessage} className="bg-lime-900 text-white p-2 rounded text-xl">
              Send
            </button>
          </div>
        </div>)}
      </div >
    </>
  );
};

export default ChatComponent;
