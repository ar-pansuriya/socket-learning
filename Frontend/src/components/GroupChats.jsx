import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import EmojiPicker from 'emoji-picker-react';


export default function GroupChats() {

  const selectedGroup = useSelector(state => state.Chats.selectGdata);
  const currentUser = useSelector(state => state.Chats.currentUser);
  const [chatMessages, setChatMessages] = useState([
    { text: "hey", to: 'asd1212', sender: 'xyz1212' },
    { text: "how are you", to: 'asd1212', sender: 'qwe1212' },
  ]);
  const [emojiopen, setemojiopen] = useState(false);
  const [message, setMessage] = useState('');





  // set selected emoji to input value
  const handleEmoji = (v) => {
    console.log(v);
    setMessage((pre) => pre += v)
  }

  //handle group messages
  const handleGroupMessage = () => {

  }



  return (
    <>
      <div className="flex-grow flex flex-col justify-between rounded bg-lime-100 p-4">
        {selectedGroup && (
          <div className="text-lg gap-2 bg-lime-900 text-white flex items-center p-2 rounded font-semibold mb-2">
            <img
              src={selectedGroup.profilePic} // Replace with the actual path to your image
              alt="User 1 Profile"
              className="w-10 h-10 rounded mr-2"
            />
            <div className='flex items-center w-full justify-between'>
              <div className="flex flex-col">
                <span className="text-lg font-medium">{selectedGroup.name}</span>
                <span className="text-xs font-medium">created by {selectedGroup.owner.userName}</span>
              </div>
              <span className="text-sm mr-2 bg-lime-100 text-lime-900 p-2 rounded text-center font-medium">Members : {selectedGroup.member.length}</span>
            </div>
          </div>
        )}

        {selectedGroup.name && (<div className="overflow-y-auto h-4/5"
          style={{
            position: "relative",
            overflowX: 'hidden',
            textWrap: 'wrap',
            padding: '1rem',
          }}>
          {chatMessages.map((chat, index) => (
            <div key={index} className={`flex ${chat.sender === currentUser.userName ? 'justify-end' : 'justify-start'} mb-2`}>
              <div className={`bg-${chat.sender === currentUser.userName ? 'lime-700 text-white' : 'lime-500 text-lime-900'}  p-2 rounded-tl-xl font-medium rounded-bl-xl rounded-br-xl max-w-xs`} >
                <div className="flex justify-between">
                  <span className="text-xs text-lime-100">{chat.sender === currentUser.userName ? "you" : chat.sender}</span>
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
            }}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleGroupMessage();
              }
            }}
            className="flex-grow border focus:outline-none focus:border-lime-700 rounded p-2 mr-2"
          />
          <button onClick={handleGroupMessage} className="bg-lime-900 text-white p-2 rounded text-xl">
            Send
          </button>
        </div>

      </div>
    </>
  )
}
