import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HorizontalScrollContainer from '../hooks/HorizontalScrollContainer';
import { toast } from 'react-toastify';
import axios from 'axios';
import { addcurretnG, addselectGdata, addOneGmessage } from '../redux-slice/ChatSlice';
import { io } from 'socket.io-client';

export default function CreateGroup({ isGslected }) {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.Chats.currentUser);
    const userlist = useSelector((state) => state.Chats.userlist);
    const socket = useMemo(() => io('http://localhost:5000'), []);
    const [groups, setGroups] = useState([]);
    const [member, setMember] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [isRender, setIsRender] = useState(true);



    useEffect(() => {

        socket.on('groupCreated', ({ groupName }) => {
            toast.success(`Group created with name ${groupName}`);
        })
        socket.on('groupError', async ({ groupId }) => {
            toast.error('Sorry he or she is no more')
            toast.warn('please refresh the page')
            let res = await axios.delete(`/api/group/${groupId}`,{
                withCredentials: true, // Include credentials in the request
              });
            if (res.data.message === 'done') {
                getGroups();
            }
        })

    }, [socket]);

    useEffect(() => {
        socket.on('group message', ({ groupId, sender, text }) => {
            dispatch(addOneGmessage({ groupId, sender, text }));
        })

    }, [socket]);

    const handleAddUserGroup = (user) => {
        if (member.includes(user.userName)) {
            setMember((prevMembers) => prevMembers.filter((memberName) => memberName !== user.userName));
        } else {
            setMember((prevMembers) => [...prevMembers, user.userName]);
        }
    };

    const handleCreateGroup = async () => {
        if (groupName.trim() !== '' && member.length >= 1) {
            const newGroup = { name: groupName, member, owner: currentUser.userName };
            try {
                const res = await axios.post('/api/group', newGroup,{
                    withCredentials: true, // Include credentials in the request
                  });
                if (res.data.message) {
                    setGroups((prevGroups) => [...prevGroups, newGroup]);
                    socket.emit('createGroup', { data: res.data.group });
                    setGroupName('');
                    setPopupOpen(false);
                    setIsRender(true);
                }
            } catch (error) {
                toast.error('Error creating group. Please try again.');
            }
        } else {
            toast.warn('Enter Group Name And Add At Least 1 Member');
        }
    };

    const selectGroup = (group) => {
        isGslected(true);
        socket.emit('joinGroup', { group });
        dispatch(addselectGdata(group));
        dispatch(addcurretnG(group._id));
    };

    const getGroups = async () => {
        try {
            const res = await axios.get('/api/group',{
                withCredentials: true, // Include credentials in the request
              });
            setGroups(res.data);
            setIsRender(false);
        } catch (error) {
            console.error('Error fetching groups:', error.message);
        }
    };

    useEffect(() => {


        if (isRender) {
            getGroups();
        }
    }, [isRender]);

    return (
        <>
            <div className="flex flex-col gap-2">
                <div className="cursor-pointer relative select-none">
                    <h2
                        onClick={() => setPopupOpen((prev) => !prev)}
                        className="font-semibold p-2 rounded border-sky-900 shadow-sm bg-sky-100 border flex items-center"
                    >
                        Create Group <span className="ml-2">+</span>
                    </h2>
                    <h2 className="text-sky-700 font-bold m-1">Group List</h2>
                    {isPopupOpen && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-sky-100 p-4 mt-2 flex flex-col gap-2 absolute cursor-default left-0 top-10 w-64 border border-sky-900 rounded-md"
                        >
                            <div className="flex justify-between">
                                <label className='text-sky-700'>Group Name:</label>
                                <label className="bg-sky-900 text-white w-10 text-center rounded-full">
                                    {member.length}
                                </label>
                            </div>
                            <input
                                type="text"
                                id="groupName"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className="border p-2 bg-sky-100 border-sky-900 focus:outline-none rounded-md font-medium text-sky-700"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <HorizontalScrollContainer direction={"row"}>
                                {userlist.map((user, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleAddUserGroup(user)}
                                        className={`cursor-pointer flex flex-col ${member.includes(user.userName) ? 'opacity-30' : ''
                                            } justify-center items-center`}
                                    >
                                        <img
                                            src={user.profilePic}
                                            alt="User Profile"
                                            className="w-12 h-12 border-2 border-sky-900 rounded-full"
                                        />
                                        <span className='text-sky-700'>{user.userName}</span>
                                    </div>
                                ))}
                            </HorizontalScrollContainer>
                            <button onClick={handleCreateGroup} className="bg-sky-900 text-white p-2 rounded-md">
                                Create Group
                            </button>
                        </div>
                    )}
                </div>
                <HorizontalScrollContainer direction={'row'}>
                    {groups.map((group, index) => {
                        const isMemberOrOwner =
                            group.member.some((member) => member.userName === currentUser.userName) ||
                            group.owner.userName === currentUser.userName;

                        if (isMemberOrOwner) {
                            return (
                                <div
                                    key={index}
                                    onClick={() => selectGroup(group)}
                                    className="mx-2 w-fit items-center flex flex-col"
                                >
                                    <h1 className="w-12 h-12 bg-sky-100 shadow-lg text-lg flex items-center justify-center text-sky-700 rounded"
                                    >{group.profilePic}</h1>
                                    <span className="text-sky-700 font-medium text-lg">{group.name}</span>
                                </div>
                            );
                        } else {
                            return null;
                        }
                    })}
                </HorizontalScrollContainer>
            </div>
        </>
    );
}
