import React, {useContext, useEffect, useState} from 'react';
import { DataStore } from 'aws-amplify';
import { DataContext } from '../App';
import { Tag, Todo, TodoTags } from '../models';
import {RxCross2} from 'react-icons/rx'
import TodoComponent from './todo';
const Todos = () =>{
    const [newTodoName, setNewTodoName] = useState("")
    const [newTodoDescription, setNewTodoDescription] = useState("")
    const dataContext = useContext(DataContext)
    const addTodo = async() =>{
      try{
        const newTodo = await DataStore.save(
          new Todo({
            name: newTodoName,
            description: newTodoDescription,
            assignedTo: dataContext.users[dataContext.currentUser],
            completed: false,
          })
        );
        setNewTodoDescription("")
        setNewTodoName("")
        dataContext.setTodos(prevState=>[...prevState, newTodo])
      }
      catch(err){
        console.log("error saving todo: "+err)
      }
    }
    
    if(dataContext.currentUser>-1){   
        return (
            <div className='w-[600px] flex flex-col items-center my-10 overflow-hidden border-y border-r border-gray-300 h-[800px]'>
                <p className='text-3xl bg-gray-100 w-full text-let px-4 py-3 border-b border-gray-300 '>{dataContext.users[dataContext.currentUser].name}'s Todos</p>
                <div className='flex flex-row items-center justify-center relative pb-3 mb-2 border-b w-full'>
                    <div className='flex flex-col relative mt-2'>
                        {!newTodoName&&<p className='text-xl text-gray-600 mr-2 absolute left-8 top-4 pointer-events-none'>Todo name</p>}
                        <input value={newTodoName} onChange={(e)=>setNewTodoName(e.target.value)} className='w-[250px] ml-4 my-2 p-2 px-4 text-xl border border-gray-400 rounded focus:outline-none focus:border-gray-600' />                  
                        
                        {!newTodoDescription&&<p className='text-xl text-gray-600 mr-2 absolute left-8 top-[78px] pointer-events-none'>Description</p>}
                        <input value={newTodoDescription} onChange={(e)=>setNewTodoDescription(e.target.value)} className='w-[250px] px-4 ml-4 my-2 p-2 text-xl border border-gray-400 rounded focus:outline-none focus:border-gray-600' />          
                    </div>
                    
                    
                    {(!newTodoName)&&<div className='m-4 px-5 py-2 bg-gray-100 rounded text-gray-500 cursor-default font-semibold text-lg'>Add new todo</div>}
                    {newTodoName&&<div className='m-4 px-5 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold text-lg cursor-pointer' onClick={()=>addTodo()}>Add new todo</div>}
                </div>
                {dataContext.todos.map((todo,index)=>{
                    if(todo.userTodosId==dataContext.users[dataContext.currentUser].id){
                        return(
                            <TodoComponent todo={todo} key={index}/>
                        )
                    }
                })}
            </div>
        )
    }
}

export default Todos