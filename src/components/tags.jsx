import React, {useState, useContext, useEffect} from "react";
import { DataContext } from "../App";
import { DataStore } from "aws-amplify";
import { RxCross2 } from "react-icons/rx";
import TodoComponent from "./todo";

const Tags = () =>{
    const [currentTag, setCurrentTag] = useState()
    const dataContext = useContext(DataContext)
    useEffect(()=>{
        if(!currentTag&&dataContext.tags.length>0){
            setCurrentTag(dataContext.tags[0])
        }
    },[dataContext.tags])
    const deleteTag = async(tag) =>{
        dataContext.todoTags.forEach(todoTag=>{
            if(todoTag.tagId==tag.id){
                DataStore.delete(todoTag)
            }
        })
        DataStore.delete(tag)
        dataContext.setTodoTags(prevState=>prevState.filter(filteredTodoTag=>filteredTodoTag.tagId!=tag.id))
        dataContext.setTags(prevState=>prevState.filter(filteredTag=>filteredTag.id!=tag.id))
    }

    return(
        <div className='flex flex-col items-center my-10 rounded-r-lg overflow-hidden border-y border-r border-gray-300 h-[800px]'>
            <p className='text-3xl bg-gray-100 w-full text-let px-4 py-3 border-b border-gray-300'>Todos by Tag</p>
            <div className='flex flex-col items-center justify-center w-full border-b'>
               <p className="mt-4 text-2xl">Select a tag</p>
               <div className="flex flex-row flex-wrap px-10 py-4 w-[600px] min-h-[50px]">
                {dataContext.tags.map(tag=>(
                    <p onClick={()=>setCurrentTag(tag)} className={`${tag.id==currentTag.id?"bg-blue-300 text-black border border-blue-900":"bg-blue-200 text-blue-900 border border-blue-500  "} cursor-pointer relative flex flex-row items-center pb-[5px] pt-1 pr-12 mr-3 mb-1 font-semibold  text-xl rounded px-2 py-[1px]`}>
                        {tag.name}
                        <RxCross2 className="cursor-pointer absolute right-1 top-2 w-6 h-6 p-[2px] ml-2 rounded-full hover:bg-[rgba(0,0,0,0.1)]" onClick={()=>deleteTag(tag)}/>
                    </p>
                ))}
               </div>
            </div>
            <p className="py-4 text-2xl">Todos with tag: {currentTag.name}</p>
            {dataContext.todoTags.map((todoTag, index)=>{
                if(todoTag.tagId==currentTag.id){
                    return(
                        <TodoComponent key={index} todo={dataContext.todos.find(todo=>todo.id==todoTag.todoId)}/>
                    )
                }
                
            })}
        </div>
    )
}

export default Tags