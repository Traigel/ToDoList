import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import {App} from "./App";
import { StoreProviderDecorator } from '../redux/StoreProviderDecorator';

export default {                                    //по дефолту создаётся компонент в StoryBook
    title: 'ToDoList/App',                        //имя папки и в ней раздел
    component: App,                               //компонента которую мы используем
    decorators: [StoreProviderDecorator]        //тут хок который вернёт компоненту
} as ComponentMeta<typeof App>

const Template: ComponentStory<typeof App> = (args) => <App/>

export const AppPrimary = Template.bind({});
AppPrimary.args = {

}