import {v1} from "uuid";
import {
    addTitleTaskAC, deleteTaskTC,
    getTasksTC,
    tasksReducer, TasksTodoListType, updateTaskAC
} from "./tasks-reducer";
import {deleteTodoListAC} from "../../todoList-reducer";
import {TASK_PRIORITIES, TASK_STATUS, TasksType} from "../../../../api/api";

const toDoListID_1 = v1();
const toDoListID_2 = v1();
const toDoListID_3 = v1();
const taskID_1 = v1()

let tasks: TasksTodoListType;
let newTask: TasksType
let updateTask: TasksType
beforeEach(() => {
    tasks = {
        [toDoListID_1]: [
            {
                id: '0',
                todoListId: toDoListID_1,
                title: 'HTML/CSS',
                status: TASK_STATUS.New,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TASK_PRIORITIES.Low,
                description: '',
                entityStatus: 'succeeded'
            },
            {
                id: '1',
                todoListId: toDoListID_1,
                title: 'HTML/CSS',
                status: TASK_STATUS.New,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TASK_PRIORITIES.Low,
                description: '',
                entityStatus: 'succeeded'
            }
        ],
        [toDoListID_2]: [
            {
                id: '0',
                todoListId: toDoListID_2,
                title: 'HTML/CSS',
                status: TASK_STATUS.New,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TASK_PRIORITIES.Low,
                description: '',
                entityStatus: 'succeeded'
            }
        ],
    }
    newTask = {
        id: taskID_1,
        todoListId: toDoListID_1,
        title: 'Hello',
        status: TASK_STATUS.New,
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TASK_PRIORITIES.Low,
        description: ''
    }
    updateTask = {...tasks[toDoListID_1][0], title: 'Update task'}
})

test('get tasks', () => {
    const action = getTasksTC.fulfilled({todolistId: toDoListID_3, tasks: [newTask, newTask]}, 'requestId', toDoListID_3)
    const tasksReducerTest = tasksReducer(tasks, action)
    expect(tasksReducerTest[toDoListID_3].length).toBe(2)
})
test('add title task', () => {
    const tasksReducer1 = tasksReducer(tasks, addTitleTaskAC({task: newTask}))
    expect(tasksReducer1[toDoListID_1][0].title).toBe("Hello")
})
test('delete title task', () => {
    const action = deleteTaskTC.fulfilled({todolistId: toDoListID_1, taskId: '0'}, 'requestId', {todolistId: toDoListID_1, taskId: '0'})
    const tasksReducerTest = tasksReducer(tasks, action)
    expect(tasksReducerTest[toDoListID_1][0].id).not.toBe('0')
    expect(tasksReducerTest[toDoListID_1].length).toBe(1)
})
test('update task', () => {
    const tasksReducer1 = tasksReducer(tasks, updateTaskAC({task: updateTask}))
    expect(tasksReducer1[toDoListID_1][0].title).toBe('Update task')
})
test('delete todo list task', () => {
    const tasksReducer1 = tasksReducer(tasks, deleteTodoListAC({todolistId: toDoListID_1}))
    const keys = Object.keys(tasksReducer1)
    expect(tasksReducer1[toDoListID_1]).toBeUndefined()
    expect(keys.length).toBe(1)
    expect(keys[0]).toBe(toDoListID_2)
})