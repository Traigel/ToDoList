import {TASK_PRIORITIES, TASK_STATUS, TasksType} from "../../../../api/api";
import {RequestStatusType} from "../../../../app/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createTaskTC, deleteTaskTC, getTasksTC, updateTaskTC} from './tasks-actions';
import {createToDoListTC, deleteToDoListTC, getTodoListTC} from '../../todoLists-actions';

const initialState: TasksTodoListType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        changesTaskStatus(state, action: PayloadAction<{ todolistId: string, taskId: string, entityStatus: RequestStatusType }>) {
            const index = state[action.payload.todolistId].findIndex(el => el.id === action.payload.taskId)
            state[action.payload.todolistId][index].entityStatus = action.payload.entityStatus
        },

    },
    extraReducers: (builder) => {  // не генерируют action creator
        builder
            .addCase(createToDoListTC.fulfilled, (state, action) => {
                state[action.payload.id] = []
            })
            .addCase(deleteToDoListTC.fulfilled, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(getTodoListTC.fulfilled, (state, action) => {
                action.payload.forEach((el => {
                    state[el.id] = []
                }))
            })
            .addCase(getTasksTC.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks.map(el => ({...el, entityStatus: 'idle'}))
            })
            .addCase(deleteTaskTC.fulfilled, (state, action) => {
                const index = state[action.payload.todolistId].findIndex(el => el.id === action.payload.taskId)
                if (index > -1) {
                    state[action.payload.todolistId].splice(index, 1)
                }
            })
            .addCase(createTaskTC.fulfilled, (state, action) => {
                state[action.payload.todoListId].unshift({...action.payload, entityStatus: 'idle'})
            })
            .addCase(updateTaskTC.fulfilled, (state, action) => {
                const index = state[action.payload.todoListId].findIndex(el => el.id === action.payload.id)
                if (index > -1) {
                    state[action.payload.todoListId][index] = {...action.payload, entityStatus: 'idle'}
                }
            })
    }
})

export const tasksReducer = slice.reducer
export const changesTaskStatusAC = slice.actions.changesTaskStatus

// types
export type TasksTodoListType = {
    [toDoListID: string]: TasksDomainType[]
}

export type TasksDomainType = TasksType & {
    entityStatus: RequestStatusType
}