import React, {useEffect, useState} from 'react';
import {toDoListAPI} from "../api/api";

export default {                    //по дефолту создаётся компонент в StoryBook
    title: 'Api/ToDoLists'     //имя папки и в ней раздел
}

export const GetToDoList = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        toDoListAPI.getToDoList()
            .then(res => {
                setState(res.data)
            })

    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const PostToDoList = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        toDoListAPI.createToDoList('New ToDo List')
            .then(res => {
                setState(res.data.data.item)
            })

    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const DeleteToDoList = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        toDoListAPI.deleteToDoList('4e64bc02-91bd-4438-95c6-a0c461d2ade2')
            .then(res => {
                setState(res.data)
            })

    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const PutToDoList = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        toDoListAPI.updateToDoLists('532b6c39-dc5a-4c81-afc8-55bc5be0bd90', 'New ToDo List')
            .then(res => {
                setState(res.data)
            })

    }, [])
    return <div>{JSON.stringify(state)}</div>
}