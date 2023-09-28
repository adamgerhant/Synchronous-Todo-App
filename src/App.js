import React, {createContext, useEffect, useState} from 'react';
import { DataStore } from 'aws-amplify';
import { Tag, Todo, TodoTags, User } from './models';
import Todos from './components/todos';
import Users from './components/users';
import Tags from './components/tags';

export const DataContext = createContext(null)

const App = () => {
  const [users, setUsers] = useState([])
  const [todos, setTodos] = useState([])
  const [tags, setTags] = useState([])
  const [todoTags, setTodoTags] = useState([])
  const [currentUser, setCurrentUser] = useState(-1)
  
  useEffect(()=>{
    const sub = DataStore.observeQuery(User).subscribe(({ items }) => {
      setUsers(items);
    });
    return(()=>{
      sub.unsubscribe()
    })
  }, [])

  useEffect(()=>{
    const sub = DataStore.observeQuery(Todo).subscribe(({ items }) => {
      setTodos(items);
    });
    return(()=>{
      sub.unsubscribe()
    })
  }, [])

  useEffect(()=>{
    const sub = DataStore.observeQuery(Tag).subscribe(({ items }) => {
      setTags(items);
    });
    return(()=>{
      sub.unsubscribe()
    })
  }, [])

  useEffect(()=>{
    const sub = DataStore.observeQuery(TodoTags).subscribe(({ items }) => {
      setTodoTags(items);
    });
    return(()=>{
      sub.unsubscribe()
    })
  }, [])

  useEffect(()=>{
    if(users.length>0&&currentUser==-1){
      setCurrentUser(0)
    }
  },[users])
  return (
    <DataContext.Provider value={{users, setUsers, todos, setTodos, tags, setTags, todoTags, setTodoTags, currentUser, setCurrentUser}}>
      <div className='flex flex-row' >
        <Users/>
        <Todos/>
        <Tags/>
      </div>
    </DataContext.Provider>
    
  );
};

export default App;

