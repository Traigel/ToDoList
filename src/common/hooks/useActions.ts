import {useMemo} from 'react';
import {ActionCreatorsMapObject, bindActionCreators} from 'redux';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../app/store';

export const useActions = <T extends ActionCreatorsMapObject<any>>(actions: T) => {
    const dispatch = useDispatch<AppDispatch>()

    const boundActions = useMemo(() => {
        return bindActionCreators(actions, dispatch)
    }, [])

    return boundActions
}