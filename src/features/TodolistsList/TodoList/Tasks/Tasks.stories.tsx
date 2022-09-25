import {ComponentMeta, ComponentStory} from '@storybook/react';
import React from 'react';
import {Tasks} from "./Tasks";
import {StoreProviderDecorator} from "../../../../app/StoreProviderDecorator";
import {TASK_PRIORITIES, TASK_STATUS} from "../../../../api/api";

export default {                                    //по дефолту создаётся компонент в StoryBook
    title: 'ToDoList/Tasks',                        //имя папки и в ней раздел
    component: Tasks,                               //компонента которую мы используем
    argTypes: {                                     //описываем свойства нашей компоненты
        tasks: {
            description: 'tasks props',    //описание пропса
            table: {category: 'Main'}       //раздел в котором будет настройка
        },
        todoListID: {
            description: 'todoLst ID',    //описание пропса
            table: {category: 'Main'}       //раздел в котором будет настройка
        },
    },
    args: {                     //значение (пропсы) будет пренадлежать всем историям по умолчанию
        todolistID: '1',
    },
    decorators: [StoreProviderDecorator]        //тут хок который вернёт компоненту
} as ComponentMeta<typeof Tasks>

const Template: ComponentStory<typeof Tasks> = (args) => <Tasks {...args}/>

export const TaskPrimaryIsDoneFalse = Template.bind({});
TaskPrimaryIsDoneFalse.args = {
    tasks: {
        id: '1',
        todoListId: '2',
        title: 'HTML/CSS',
        status: TASK_STATUS.New,
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TASK_PRIORITIES.Low,
        description: '',
        entityStatus: "succeeded"
    }
}

export const TaskPrimaryIsDoneTrue = Template.bind({});
TaskPrimaryIsDoneTrue.args = {
    tasks: {
        id: '1',
        todoListId: '2',
        title: 'JS/TS',
        status: TASK_STATUS.New,
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TASK_PRIORITIES.Low,
        description: '',
        entityStatus: "succeeded"
    }
}