import { RxCross2 } from "react-icons/rx"
import React, {useState, useContext} from "react"
import { DataStore } from "aws-amplify"
import { Tag, TodoTags } from "../models"
import { DataContext } from "../App"
const TodoComponent = ({todo}) =>{

    const [newTagName, setNewTagName] = useState("")
    const [showNewTagInput, setShowNewTagInput] = useState(false)

    const dataContext = useContext(DataContext)

    const deleteTodo = async(todoToDelete)=>{
        try{
            console.log(todoToDelete)
            const deletedTodo = await DataStore.delete(todoToDelete)
            dataContext.setTodos(prevState=>prevState.filter(todo=>todo.id !== deletedTodo.id))
        }
        catch(err){
            console.log("error deleting todo: "+err)
        }
    }
      
      
    const addTag = async (todo) =>{
        let tag = dataContext.tags.find(tag=>tag.name==newTagName)
        if(!tag){
            tag = new Tag({
                name: newTagName
            })
        }

        
        const savedTag = await DataStore.save(tag)
        dataContext.setTags(prevState=>[...prevState, tag])

        const newTodoTag = new TodoTags({
            todo: todo,
            tag: savedTag
        })
        const savedTodoTag = await DataStore.save(newTodoTag)
        dataContext.setTodoTags(prevState=>[...prevState, savedTodoTag])
        setNewTagName("")
    }

    const deleteTag = async(todoTag, tag) =>{
        DataStore.delete(todoTag)
        DataStore.delete(tag)
        dataContext.setTodoTags(prevState=>prevState.filter(filteredTodoTag=>filteredTodoTag.id!=todoTag.id))
        dataContext.setTags(prevState=>prevState.filter(filteredTag=>filteredTag.id!=tag.id))
    }

    return(
        <div  className="flex flex-col justify-between items-center my-4 py-2 px-5 w-[400px] border border-gray-300 rounded cursor-pointer">
            <div className='flex flex-row w-full justify-between'>
            <div className='flex flex-col w-[250px]'>
                <p className='text-2xl font-semibold text-gray-700 mb-1'>{todo.name}</p>
                <p className='text-lg text-gray-700 mb-1'>{todo.description}</p>                 
            </div>
            <div className='self-center py-1 px-2 rounded text-red-500 hover:bg-gray-100 cursor-pointer' onClick={()=>deleteTodo(todo)}>Delete todo</div>
            </div>
            <div className='flex flex-row w-full relative items-end mb-1'>
            <div className='flex flex-row flex-wrap overflow-hidden w-[250px] min-h-[36px] mt-1'>
                {dataContext.todoTags.map((todoTag,index)=>{
                if(todoTag.todoId==todo.id){
                    const tag = dataContext.tags.find(tag=>tag.id==todoTag.tagId)
                    return(
                    <div key={index} className='relative flex flex-row items-center pr-8 mr-3 mb-1 border border-blue-500 bg-blue-200 font-semibold text-blue-900 text-lg rounded px-2 py-[1px]'>
                        {tag?.name || ""}
                        <RxCross2 className="cursor-pointer absolute right-1 w-6 h-6 p-[2px] ml-2 rounded-full hover:bg-[rgba(0,0,0,0.1)]" onClick={()=>deleteTag(todoTag, tag)}/>
                    </div>
                    )
                }
                
                })}
            </div>
            {!showNewTagInput&&<div onClick={()=>setShowNewTagInput(true)} className='absolute right-0 px-3 py-1 rounded text-white text-center bg-green-600 hover:bg-green-700'>Add tag</div>}
            {showNewTagInput&&<div onClick={()=>setShowNewTagInput(false)} className='absolute right-0 px-3 py-1 rounded text-white text-center bg-red-600 hover:bg-red-700'>Close</div>}
            </div>
            {showNewTagInput&&<div className='relative flex flex-row items-center gap-2 mt-2 self-end'>
            {!newTagName&&<p className='text-gray-600 absolute left-2 pointer-events-none'>Tag name</p>}
            <input value={newTagName} onChange={(e)=>setNewTagName(e.target.value)} className='px-2 py-1 border rounded focus:outline-none focus:border-gray-600 w-[120px]'></input>
            {!newTagName&&<div className='self-end px-3 py-1 rounded text-gray-400 text-center bg-gray-200'>Save tag</div>}
            {newTagName&&<div onClick={()=>{setShowNewTagInput(false);addTag(todo)}} className='self-end px-3 py-1 rounded text-white text-center bg-blue-600 hover:bg-blue-700'>Save tag</div>}
            </div>}
        </div> 
    )
}
export default TodoComponent