import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HorizontalScrollContainer from '../hooks/HorizontalScrollContainer';
import { toast } from 'react-toastify';
import axios from 'axios';
import { addselectGdata } from '../redux-slice/ChatSlice';

export default function CreateGroup({isGslected}) {
    const [groups, setGroups] = useState([
        { name: 'Family Group', member: ['xyz1212,asd1212'], owner: 'qwert1212' },
    ]);
    const dispatch = useDispatch();
    const [member, setMember] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [isPopupOpen, setPopupOpen] = useState(false);
    const userlist = useSelector((state) => state.Chats.userlist);
    const currentUser = useSelector((state) => state.Chats.currentUser);
    const [isrender, setisrender] = useState(true);

    const handleAddUserGroup = (user) => {
        if (member.includes(user.userName)) {
            // If the user is already in the group, remove them
            setMember((prevMembers) => prevMembers.filter((memberName) => memberName !== user.userName));
        } else {
            // If the user is not in the group, add them
            setMember((prevMembers) => [...prevMembers, user.userName]);
        }
    };


    const handleCreateGroup = async () => {
        if (groupName.trim() !== '' && member.length >= 1) {
            // Create a new group object
            const newGroup = { name: groupName, member, owner: currentUser.userName };
            let res = await axios.post('/api/group', newGroup);
            setGroups((prevGroups) => [...prevGroups, newGroup]);
            console.log(res.data);
            setGroupName('');
            setPopupOpen(false);
            setisrender(true);
        } else {
            toast.warn('Enter Group Name And Add Atleast 1 Member');
        }
    };

    const selectGroup = (group) => {
        isGslected(true);
        dispatch(addselectGdata(group));
    }


    useEffect(() => {
        const getgroups = async () => {
            let res = await axios.get('/api/group');
            console.log(res.data);
            setGroups(res.data);
            setisrender(false);
        }
        if (isrender) getgroups();
    }, [isrender]);

    return (
        <>
            <div className="flex flex-col gap-2">
                <div className="cursor-pointer relative select-none">
                    <h2
                        onClick={() => setPopupOpen((prev) => !prev)}
                        className="font-semibold p-2 rounded bg-lime-100 flex items-center"
                    >
                        Create Group <span className="ml-2 ">+</span>
                    </h2>
                    <h2 className="text-white font-bold m-1">Group List</h2>
                    {isPopupOpen && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-lime-100 p-4 mt-2 flex flex-col gap-2 absolute cursor-default left-0 top-10 w-64 shadow-lg rounded-md"
                        >
                            <div className='flex justify-between'>
                                <label htmlFor="groupName">Group Name:</label>
                                <label htmlFor="member" className='bg-lime-900 text-white w-10 text-center rounded-full'>{member.length}</label>
                            </div>
                            <input
                                type="text"
                                id="groupName"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className="border border-lime-900 bg-lime-100 p-2 rounded-md w-full"
                                onClick={(e) => e.stopPropagation()}
                            />
                            {/* all user list to add in group */}
                            <HorizontalScrollContainer>
                                {userlist.map((user, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleAddUserGroup(user)}
                                        className={`mx-2 cursor-pointer flex flex-col ${member.includes(user.userName) ? 'opacity-30' : ''} justify-center items-center`}
                                    >
                                        <img
                                            src={user.profilePic} // Replace with the actual path to your image
                                            alt="User 1 Profile"
                                            className="w-10 h-10 border border-lime-900 rounded-full mr-2"
                                        />
                                        <span>{user.userName}</span>
                                    </div>
                                ))}
                            </HorizontalScrollContainer>
                            <button
                                onClick={handleCreateGroup}
                                className="bg-lime-900 text-white p-2 rounded-md"
                            >
                                Create Group
                            </button>
                        </div>
                    )}
                </div>
                <HorizontalScrollContainer>
                    {groups.map((group, index) => (
                        <div key={index} onClick={() => selectGroup(group)} className="mx-2 w-fit items-center flex flex-col">
                            <img
                                src={group.profilePic} // Replace with the actual path to your image
                                alt="group"
                                className="w-12 h-12 border border-lime-900 rounded-full"
                            />
                            <span className='text-white font-semibold'>{group.name}</span>
                        </div>
                    ))}
                </HorizontalScrollContainer>
            </div>
        </>
    );
}
