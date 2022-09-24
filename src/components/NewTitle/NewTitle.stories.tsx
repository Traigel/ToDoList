import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { NewTitle } from './NewTitle';
import {action} from "@storybook/addon-actions";

export default {                    //по дефолту создаётся компонент в StoryBook
    title: 'ToDoList/NewTitle',     //имя папки и в ней раздел
    component: NewTitle,            //компонента которую мы используем
    argTypes: {                     //описываем свойства нашей компоненты
        newTitleCallBack: {
            description: 'button clicked inside form',  //описание пропса
            table: {category: 'Events'}                 //раздел в котором буден настройка
        },
        backgroundColorButton: {
            description: 'style background color button',   //описание пропса
            control: 'color',                               //выбрать цвет кнопки
            table: {category: 'Styles'}                     //раздел в котором буден настройка
        },
        classNameButton: {table: {category: 'Styles'}},
        classNameInput: {table: {category: 'Styles'}},
        colorButton: {table: {category: 'Styles'}},
    }
} as ComponentMeta<typeof NewTitle>

const Template: ComponentStory<typeof NewTitle> = (args) => <NewTitle {...args}/>

export const TitlePrimary = Template.bind({});
TitlePrimary.args = {
    newTitleCallBack: action('Button clicked')
}