import React, {ChangeEvent, memo} from 'react';
import styles from './Tasks.module.css'
import {TaskTitle} from "../../../../common/components/TaskTitle/TaskTitle";
import IconButton from '@mui/material/IconButton/IconButton';
import Delete from "@mui/icons-material/Delete";
import {Checkbox} from "@mui/material";
import {deleteTaskTC, TasksDomainType, updateTaskTC} from './tasks-reducer';
import {TASK_STATUS} from "../../../../api/api";
import {useAppDispatch} from "../../../../common/hooks/useAppDispatch";

type BodyListType = {
    tasks: TasksDomainType
    todoListID: string
}

export const Tasks = memo((props: BodyListType) => {

    const dispatch = useAppDispatch()

    const deleteTitleHandler = () => {
        dispatch(deleteTaskTC(props.todoListID, props.tasks.id))
    }

    const isDoneTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        const status = newIsDoneValue ? TASK_STATUS.Completed : TASK_STATUS.New
        dispatch(updateTaskTC(props.todoListID, props.tasks.id, {status}))
    }

    const taskNewTitleHandler = (title: string) => {
        dispatch(updateTaskTC(props.todoListID, props.tasks.id, {title}))
    }

    return (
        <div>
            <div className={styles.items}>
                <Checkbox
                    checked={props.tasks.status === TASK_STATUS.Completed}
                    onChange={isDoneTitleHandler}
                    disabled={props.tasks.entityStatus === 'loading'}
                />
                <TaskTitle
                    title={props.tasks.title}
                    titleValueCallBack={taskNewTitleHandler}
                    className={props.tasks.status === TASK_STATUS.Completed ? styles.isDone : ''}
                    disabled={props.tasks.entityStatus === 'loading'}
                />
                <IconButton
                    aria-label="delete"
                    disabled={props.tasks.entityStatus === 'loading'}
                >
                    <Delete onClick={deleteTitleHandler}/>
                </IconButton>
            </div>
        </div>
    )
})