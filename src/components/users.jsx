import React, {useContext, useState} from 'react';
import { DataStore } from 'aws-amplify';
import { DataContext } from '../App';
import { User } from '../models';

const Users = () =>{
    const [newUserName, setNewUserName] = useState("")
    const dataContext = useContext(DataContext)

    const addUser = async() => {
        try{
            const savedUser = await DataStore.save(
            new User({
                name:newUserName
            })
            )
            setNewUserName("")
            //append saved user to state after model is saved
            dataContext.setUsers(prevUsers => [...prevUsers, savedUser]);

        }
        catch (err){
            console.log("error saving user: "+err)
        }
    }

    const deleteUser = async(user)=>{
        try{
            const deletedUser = await DataStore.delete(user)      
            //delete user from state after model is deleted
            dataContext.setUsers(prevUsers => prevUsers.filter(user => user.id !== deletedUser.id));
            dataContext.setCurrentUser(prevState=>prevState-1)
        }
        catch (err){
            console.log("error deleting user: "+err)
        }
    }

    return(
        <div className='flex flex-col items-center my-10 ml-10 rounded-l-lg overflow-hidden border border-gray-300 h-[800px]'>
            <p className='text-3xl bg-gray-100 w-full text-let px-4 py-3 border-b border-gray-300'>Users</p>
                <div className='flex flex-row items-center justify-center w-full border-b'>
                {!newUserName&&<p className='text-xl text-gray-600 mr-2 absolute left-16'>Name</p>}
                <input value={newUserName} onChange={(e)=>setNewUserName(e.target.value)} className='w-[250px] ml-4 my-2 p-2 text-xl border border-gray-400 rounded focus:outline-none focus:border-gray-600' />          
                {!newUserName&&<div className='m-4 px-5 py-2 bg-gray-100 rounded text-gray-500 cursor-default font-semibold text-lg'>Add new user</div>}
                {newUserName&&<div className='m-4 px-5 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold text-lg cursor-pointer' onClick={()=>addUser()}>Add new user</div>}
            </div>
            {dataContext.users.map((user,index)=>(
            <div style={{backgroundColor:dataContext.currentUser==index?"rgb(245, 245, 245)":""}} onClick={()=>dataContext.setCurrentUser(index)} key={index} className="flex flex-row justify-between items-center my-4 py-1 px-5 w-[300px] border border-gray-300 rounded cursor-pointer">
                <p className='text-2xl font-semibold text-gray-700 mb-1'>{user.name}</p>
                <div className=' mx-4 my-2 py-1 px-2 rounded text-red-500 hover:bg-gray-100 cursor-pointer' onClick={()=>deleteUser(user)}>Delete user</div>
            </div>
            ))}
        </div>
    )
}

export default Users