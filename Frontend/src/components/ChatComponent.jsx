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
import HorizontalScrollContainer from "../hooks/HorizontalScrollContainer";
import AnimatedHeader from '../components/AnimatedHeader'
import '../App.css'


const ChatComponent = () => {

  const socket = useMemo(() => io('http://localhost:5000'), []);
  const navigate = useNavigate();
  const [usersList, setusersList] = useState([]);
  const [currentUser, setcurrentUser] = useState({});
  console.log(currentUser);
  const [touser, settouser] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [emojiopen, setemojiopen] = useState(false)
  const [istyping, setistyping] = useState(false);
  const [onlineusers, setonlineusers] = useState([]);
  const [page, setPage] = useState(1);
  const chatdiv = useRef();
  const dispatch = useDispatch();
  const [isgroupselected, setisgroupselected] = useState(false);
  const [isLeftbarOpen, setisLeftBarOpen] = useState(false)
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
      setonlineusers(onlineuserList);
    });

    // fetch users and set current loginuser
    const fetchusers = async () => {
      let res = await axios.get("/api/userslist",{
        withCredentials: true, // Include credentials in the request
      });
      let adduser = res.data.filter((v) => v.userName !== LoginUser);
      setusersList(adduser);
      setcurrentUser(res.data.filter((v) => v.userName === LoginUser)[0]);
      dispatch(addCurrentUser(res.data.filter((v) => v.userName === LoginUser)[0]));
      dispatch(adduserList(adduser));

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
  }, [socket, dispatch]);

  // send message functionality 
  const handleSendMessage = async () => {
    if (touser.userName && message) {
      let to = touser.userName;
      let time = new Date();
      let sender = currentUser.userName;
      let res = await axios.post('/api/message', { message, sender, to, createdAt: formated(time) },{
        withCredentials: true, // Include credentials in the request
      });
      if (res.data.message === 'done') {
        setChatMessages([...chatMessages, { text: message, sender, to, createdAt: formated(time) }]);
        socket.emit('personal-chat', { message, sender, to, createdAt: formated(time) });
        socket.emit('typing', { istyping: false, to: touser.userName });
        setMessage('');
      }
    }
  }

  //logout account and send api request to remove access and refhresh token form cookies
  const handleLogout = async () => {
    let res = await axios.get("/api/auth/logout",{
      withCredentials: true, // Include credentials in the request
    });
    if (res.data.message === "success") {
      socket.emit('userdisconnect', { user: currentUser.userName });
      navigate("/login", { replace: true });
    }
  };


  // select uesr to send message functionality
  const handleSelectUser = async (v) => {
    try {
      // Assuming fetchChats is an asynchronous function, await it

      setisgroupselected(false);
      // Check if the selected user is different from the current user
      if (touser.userName !== v.userName) {
        setPage(1);
      } else {
        return;
      }
      settouser(v);
      let data = await fetchChats(v);
      setChatMessages(data);
    } catch (error) {
      console.error("Error fetching chats:", error.message);
      // Handle error if necessary
    }
  };

  async function fetchChats(v) {
    let res = await axios.get(`/api/message?user=${v ? v.userName : touser.userName}&page=${page}`, { withCredentials: true });
    console.log(res.data);
    return res.data
  }

  // set selected emoji to input value
  const handleEmoji = (v) => {
    setMessage((pre) => pre += v)
  }

  //infinite scrolling features for chats

  const handleScroll = async (e) => {
    const { scrollHeight, clientHeight, scrollTop } = e.target;
    // Check if user scrolled to the bottom
    if (scrollHeight - scrollTop === clientHeight) {
      setPage((prevPage) => prevPage + 1);
      let data = await fetchChats() // Scroll to the bottom
      setChatMessages((pre) => [...pre, ...data]);
    }
  };

  const isGslected = (v) => {
    setisgroupselected(v);
  }



  return (
    <>
      <div
        className="flex w-full bg-sky-50 relative text-sky-700"
        style={{
          height: "100vh",
        }}
      >
        {/* Left Div */}
        <div style={{ width: `${isLeftbarOpen ? '0' : '288'}px`, visibility: `${isLeftbarOpen ? 'hidden' : 'visible'}` }} className={`flex-col left-0 flex z-10 bg-white shadow-2xl gap-4 border max-sm:absolute max-sm:h-full p-4 overflow-y-auto`}>
          <div className="flex items-center justify-center gap-2">
            <img src="wavetalk.png" alt="" className='w-14 h-14 rounded' />
            <h1 className='text-3xl font-bold text-sky-600'>WaveTalk</h1></div>
          <div>
            <div className="text-lg shadow-xl bg-sky-900 text-white flex items-center p-2 rounded font-semibold mb-4">
              {/* <img
                src={currentUser.profilePic} // Replace with the actual path to your image
                alt="User 1 Profile"
                className="w-10 h-10 mr-2"
              /> */}
              <span className="text-lg font-medium">{currentUser.userName}</span>
            </div>
            {/* create group component here */}
            <CreateGroup isGslected={isGslected} />
            {/* all users list here */}
            <HorizontalScrollContainer direction={"col"} height={'h-64'}>
              {usersList.map((v, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectUser(v)}
                  className="border-sky-900 border w-full hover:bg-sky-100 text-sky-700 flex items-center p-2 cursor-pointer rounded"
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
            </HorizontalScrollContainer>
          </div>

          <div>
            <button
              onClick={handleLogout}
              className="bg-sky-900 text-white p-2 rounded text-xl"
            >
              Logout
            </button>
          </div>
        </div>

        <img onTouchStart={() => setisLeftBarOpen(!isLeftbarOpen)} onClick={() => setisLeftBarOpen(!isLeftbarOpen)} className="w-6 h-6 cursor-pointer hover:w-8 hover:h-8 -right-0 absolute left-0 top-1/2 z-40  my-auto" src="arrow.png" alt=""
          style={{ transform: `translateX(${isLeftbarOpen ? '0' : '290'}px) translateY(-50%) rotate(${isLeftbarOpen ? '180' : '0'}deg) translateZ(0px)`, transition: '0.5s' }} />

        {/* Right Div */}
        {isgroupselected ? <GroupChats /> :
          (<div className="flex-grow flex flex-col justify-between rounded bg-sky-50 max-sm:p-2 p-4">
            {touser && (
              <div className="text-lg bg-sky-900 text-white flex items-center p-2 rounded font-semibold mb-2">
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
            )}
            {touser.userName && (<div className="overflow-y-auto"
              style={{
                position: "relative",
                overflowX: 'hidden',
                textWrap: 'wrap',
                padding: '1rem',
              }}
              onScroll={handleScroll} ref={chatdiv}>
              {chatMessages.map((chat, index) => (
                <div key={index} className={`flex ${chat.sender === currentUser.userName ? 'justify-end' : 'justify-start'} text-wrap mb-4`}>
                  <div className={`bg-${chat.sender === currentUser.userName ? 'sky-700 text-white' : 'sky-200 text-sky-900'} w-56 shadow-lg p-2 rounded font-medium wave`} >
                    <div className="flex justify-between">
                      <span className={`text-xs ${chat.sender === currentUser.userName ? 'text-white' : 'text-sky-700'}`}>{chat.createdAt}</span>
                    </div>
                    <p className="text-md">{chat.text}</p>
                  </div>
                </div>
              ))}
              {/* Add more chat messages as needed */}
            </div>)}

            {/* Input and Send Button */}
            {touser ? <div className="flex items-center pt-4 gap-2">
              <div className="flex flex-col" style={{ position: 'relative' }}>
                {emojiopen && <EmojiPicker style={{
                  position: 'absolute',
                  bottom: 50
                }} open={emojiopen} onEmojiClick={(e) => handleEmoji(e.emoji)} />}
                <button onClick={() => setemojiopen(emojiopen ? false : true)} className=" text-white p-2 rounded max-sm:hidden text-xl w-fit">
                  <img className="w-10 h-10" src="wavetalk.png" alt="" />
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
                className="flex-grow border focus:outline-none bg-sky-50 border-sky-900 rounded p-2"
              />
              <button onClick={handleSendMessage} className="bg-sky-900 text-white p-2 rounded text-xl max-sm:text-md">
                Send
              </button>
            </div> : (<AnimatedHeader />)}
          </div>)}
      </div >
    </>
  );
};

export default ChatComponent;
