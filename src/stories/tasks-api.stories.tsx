import React, {useEffect, useState} from 'react';
import {TASK_PRIORITIES, TASK_STATUS, tasksAPI, UpdateTaskModelType} from "../api/api";

export default {                    //по дефолту создаётся компонент в StoryBook
    title: 'Api/Tasks'     //имя папки и в ней раздел
}

export const GetTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        tasksAPI.getTask('e85b39c5-c325-4647-8b71-787910c25158')
            .then(res => {
                setState(res.data.items)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const PostTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        tasksAPI.createTask('e85b39c5-c325-4647-8b71-787910c25158', 'New Task')
            .then(res => {
                setState(res.data.data.item)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        tasksAPI.deleteTask('e85b39c5-c325-4647-8b71-787910c25158', '079709ef-bc20-49ac-8087-cc25969f77c4')
            .then(res => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const PutToTask = () => {
    const [state, setState] = useState<any>(null)
    const model: UpdateTaskModelType = {
        title: 'Task name',
        description: '',
        status: TASK_STATUS.New,
        priority: TASK_PRIORITIES.Low,
        startDate: '',
        deadline: ''
    }
    useEffect(() => {
        tasksAPI.updateTask('e85b39c5-c325-4647-8b71-787910c25158', '2c0cbb80-bd26-4266-bbcf-a39ab274a766', model)
            .then(res => {
                setState(res.data.data.item)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}