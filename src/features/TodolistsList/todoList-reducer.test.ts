import {v1} from "uuid";
import {
    addTodoListAC,
    changesFilterAC,
    deleteTodoListAC, ToDoListDomainType,
    todoListNewTitleAC,
    todoListReducer,
} from "./todoList-reducer";
import {ToDoListType} from "../../api/api";

const toDoListID_1 = v1();
const toDoListID_2 = v1();
const toDoListID_3 = v1();

let todoLists: ToDoListDomainType[];
let newTodoList: ToDoListType
beforeEach(() => {
    todoLists = [
        {
            id: toDoListID_1,
            title: 'HTML/CSS',
            filter: 'all',
            addedDate: '',
            order: 0,
            entityStatus: "idle"
        },
        {
            id: toDoListID_2,
            title: 'JS/TS',
            filter: 'all',
            addedDate: '',
            order: 0,
            entityStatus: "idle"
        },
    ]
    newTodoList = {
        id: toDoListID_3,
        title: 'New ToDoList',
        order: 0,
        addedDate: ''
    }
})

test('filter changes', () => {
    const todoListReducer1 = todoListReducer(todoLists, changesFilterAC({toDoListID: toDoListID_1, filterItem: "active"}))
    const todoListReducer2 = todoListReducer(todoLists, changesFilterAC({toDoListID: toDoListID_2, filterItem: "completed"}))
    expect(todoListReducer1[0].filter).toBe("active")
    expect(todoListReducer2[1].filter).toBe("completed")
})

test('add toDuList', () => {
    const todoListReducer1 = todoListReducer(todoLists, addTodoListAC({toDoList: newTodoList}))
    expect(todoListReducer1.length).toBe(3)
})

test('change toDoList new title', () => {
    const todoListReducer1 = todoListReducer(todoLists, todoListNewTitleAC({todolistId: toDoListID_1, title: "New Name ToDoList"}))
    expect(todoListReducer1[0].title).toBe('New Name ToDoList')
})

test('delete toDoList', () => {
    const todoListReducer1 = todoListReducer(todoLists, deleteTodoListAC({todolistId: toDoListID_1}))
    expect(todoListReducer1[0].id).not.toBe(toDoListID_1)
    expect(todoListReducer1.length).toBe(1)
})