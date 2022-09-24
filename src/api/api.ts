import axios, {AxiosResponse} from 'axios'


const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        'API-KEY': 'fe0bde16-910d-49bc-94ec-281d4e7919c5'
    }
})

//api
export const toDoListAPI = {
    getToDoList() {
        return instance.get<ToDoListType[]>('/todo-lists')
    },
    createToDoList(title: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: ToDoListType }>>>('/todo-lists', {title})
    },
    deleteToDoList(todolistId: string) {
        return instance.delete<ResponseType>(`/todo-lists/${todolistId}`)
    },
    updateToDoLists(todolistId: string, title: string) {
        return instance.put<{ title: string }, AxiosResponse<ResponseType>>(`/todo-lists/${todolistId}`, {title})
    }
}

export const tasksAPI = {
    getTask(todolistId: string) {
        return instance.get<GetTaskType>(`/todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TasksType }>>>(`/todo-lists/${todolistId}/tasks`, {title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<UpdateTaskModelType, AxiosResponse<ResponseType<{ item: TasksType }>>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
    }
}

export const authAPI = {
    login(data: LoginParamsType) {
        return instance.post<LoginParamsType, AxiosResponse<ResponseType<{ userId: number }>>>('/auth/login', data)
    },
    me() {
        return instance.get<ResponseType<MeType>>('/auth/me')
    },
    logout() {
        return instance.delete<ResponseType>('/auth/login')
    }
}

// types
export type ResponseType<T = {}> = {
    messages: string[];
    fieldsErrors: string[];
    resultCode: number;
    data: T;
}

export type ToDoListType = {
    id: string;
    title: string;
    addedDate: string;
    order: number;
}

export type GetTaskType = {
    items: TasksType[];
    totalCount: number;
    error?: string | null;
}
export type TasksType = {
    id: string;
    title: string;
    description?: any;
    todoListId: string;
    order: number;
    status: TASK_STATUS;
    priority: TASK_PRIORITIES;
    startDate?: any;
    deadline?: any;
    addedDate: string;
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TASK_STATUS
    priority: TASK_PRIORITIES
    startDate: string
    deadline: string
}

export type LoginParamsType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: string
}

export type MeType = {
    id: number | null
    email: string | null
    login: string | null
}

// enum
export enum TASK_STATUS {
    New = 0,
    InPProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TASK_PRIORITIES {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export enum RESULT_CODES {
    succeeded = 0,
    error = 1,
    bad_captcha = 10
}

