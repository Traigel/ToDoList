import {ToDoListType} from "../../api/api";
import {RequestStatusType} from "../../app/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createToDoListTC, deleteToDoListTC, getTodoListTC, updateToDoListTC} from './todoLists-actions';

// Slice
export const slice = createSlice({
    name: 'todo',
    initialState: [] as ToDoListDomainType[],
    reducers: {
        changesFilter(state, action: PayloadAction<{ toDoListID: string, filterItem: FilterType }>) {
            const index = state.findIndex(el => el.id === action.payload.toDoListID)
            state[index].filter = action.payload.filterItem
        },
        changesTodoStatus(state, action: PayloadAction<{ todolistId: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(el => el.id === action.payload.todolistId)
            state[index].entityStatus = action.payload.entityStatus
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTodoListTC.fulfilled, (state, action) => {
                return action.payload.map(el => ({...el, filter: 'all', entityStatus: "idle"}))
            })
            .addCase(deleteToDoListTC.fulfilled, (state, action) => {
                const index = state.findIndex(el => el.id === action.payload.todolistId)
                if (index > -1) {
                    state.splice(index, 1)
                }
            })
            .addCase(createToDoListTC.fulfilled, (state, action) => {
                state.unshift({...action.payload, filter: 'all', entityStatus: "idle"})
            })
            .addCase(updateToDoListTC.fulfilled, (state, action) => {
                const index = state.findIndex(el => el.id === action.payload.todolistId)
                state[index].title = action.payload.title
            });
    }
})

export const todoListReducer = slice.reducer
export const changesFilterAC = slice.actions.changesFilter
export const changesTodoStatusAC = slice.actions.changesTodoStatus

// types
export type ToDoListDomainType = ToDoListType & {
    filter: FilterType
    entityStatus: RequestStatusType
}
export type FilterType = 'all' | 'active' | 'completed'