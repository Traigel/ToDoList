import * as todoListSelectors from './selectors';
import * as todoListsAsyncActions from './todoLists-actions';
import {slice} from './todoList-reducer'

const todoListsActions = {
    ...todoListsAsyncActions,
    ...slice.actions
}

export {
    todoListSelectors,
    todoListsActions
}