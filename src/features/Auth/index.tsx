import * as authSelectors from './selectors';
import {asyncActions, slice} from './auth-reducer';

const authActions = {
    ...asyncActions,
    ...slice.actions
}

export {
    authSelectors,
    authActions
}