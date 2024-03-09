import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { addgroupData } from '../redux-slice/ChatSlice';
import HorizontalScrollContainer from '../hooks/HorizontalScrollContainer'
import ShowMember from './ShowMember';

export default function GroupChats() {


  const socket = useMemo(() => io('http://localhost:5000'), []);
  const selectedGroup = useSelector(state => state.Chats.selectGdata);
  const currentUser = useSelector(state => state.Chats.currentUser);
  const [chatMessages, setChatMessages] = useState([]);
  const [emojiopen, setemojiopen] = useState(false);
  const [message, setMessage] = useState('');
  const currentG = useSelector(state => state.Chats.curretnG);
  const GroupMessage = useSelector(state => state.Chats.groupData)
  const dispatch = useDispatch();
  const oneGmessage = useSelector(state => state.Chats.oneGMessage);
  const [showMember, setShowMember] = useState(false);

  useEffect(() => {
    setChatMessages(GroupMessage)
    return () => {
      setChatMessages([]);
    };
  }, [GroupMessage])

  useEffect(() => {
    if (oneGmessage) {
      setChatMessages((pre) => [...pre, oneGmessage])
    }
  }, [oneGmessage]);


  // set selected emoji to input value
  const handleEmoji = (v) => {
    setMessage((pre) => pre += v)
  }
  //handle group messages
  const handleGroupMessage = async () => {
    if (selectedGroup.name && message) {
      let sender = currentUser.userName;
      let Id = selectedGroup._id;
      let res = await axios.post('/api/group/message', { message, sender, Id });
      if (res.data.message === 'done') {
        socket.emit('sendGroupMessage', { text: message, Gdata: res.data.group, sender: { userName: currentUser.userName } });
        // setChatMessages([...chatMessages, { text: message, sender: { userName: currentUser.userName }, groupId: selectedGroup._id }]);
        setMessage('');
      }
    }
  };

  const fetchGroupMessages = async () => {
    let res = await axios.get(`/api/group/message/${selectedGroup._id}`);
    dispatch(addgroupData(res.data));
    // return setChatMessages(res.data);
  }

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupMessages();
    }

    // Cleanup chat messages when a new group is selected
    return () => {
      setChatMessages([]);
    };
  }, [selectedGroup]);

  return (
    <>
      <div className="flex-grow flex flex-col justify-between rounded bg-sky-50 max-sm:p-2 p-4">
        {selectedGroup && (
          <div className="text-lg gap-2 relative shadow-sm bg-sky-900 text-white flex items-center p-2 rounded font-semibold mb-2">
            <h1 className="w-10 h-10 bg-sky-100 shadow-lg text-lg flex items-center justify-center text-sky-700 rounded"
            >{selectedGroup.profilePic}</h1>
            <div className='flex items-center w-full justify-between'>
              <div className="flex flex-col">
                <span className="text-lg max-sm:text-sm font-medium">{selectedGroup.name}</span>
                <span className="text-xs font-medium">created by {selectedGroup.owner.userName}</span>
              </div>
              <span className="text-sm mr-2 bg-sky-100 text-sky-900 p-2 rounded text-center font-medium cursor-pointer" onClick={() => setShowMember(!showMember)}>Members : {selectedGroup.member.length}</span>
            </div>
            {showMember && <ShowMember />}

          </div>
        )}

        {selectedGroup.name && (<div className="overflow-y-auto h-4/5"
          style={{
            position: "relative",
            overflowX: 'hidden',
            textWrap: 'wrap',
            padding: '1rem',
          }}>
          {chatMessages.map((chat, index) => {
            if (selectedGroup._id === chat.groupId) {
              return (
                <div key={index} className={`flex ${chat.sender.userName === currentUser.userName ? 'justify-end' : 'justify-start'} mb-2`}>
                  <div className={`bg-${chat.sender.userName === currentUser.userName ? 'sky-700 text-white' : 'sky-500 text-sky-900'}  p-2 rounded-tl-xl font-medium rounded-bl-xl rounded-br-xl max-w-xs`} >
                    <div className="flex justify-between">
                      <span className="text-xs text-sky-100">{chat.sender.userName === currentUser.userName ? "you" : chat.sender.userName}</span>
                    </div>
                    <p className="text-md">{chat.text}</p>
                  </div>
                </div>
              );
            }
          })}

          {/* Add more chat messages as needed */}
        </div>)}

        {/* Input and Send Button */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col" style={{ position: 'relative' }}>
            {emojiopen && <EmojiPicker className='bg-sky-50' style={{
              position: 'absolute',
              bottom: 60,
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
            }}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleGroupMessage();
              }
            }}
            className="flex-grow border focus:outline-none bg-sky-50 border-sky-900 rounded p-2"
          />
          <button onClick={handleGroupMessage} className="bg-sky-900 text-white p-2 rounded text-xl max-sm:text-md">
            Send
          </button>
        </div>

      </div>
    </>
  )
}
