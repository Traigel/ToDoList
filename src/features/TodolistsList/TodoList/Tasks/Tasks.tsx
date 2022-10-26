import React, {ChangeEvent, memo} from 'react';
import styles from './Tasks.module.css'
import {TaskTitle} from "../../../../common/components/TaskTitle/TaskTitle";
import IconButton from '@mui/material/IconButton/IconButton';
import Delete from "@mui/icons-material/Delete";
import {Checkbox} from "@mui/material";
import {TasksDomainType} from './tasks-reducer';
import {TASK_STATUS} from "../../../../api/api";
import {useActions} from '../../../../common/hooks/useActions';
import {tasksActions} from './index';

type BodyListType = {
    tasks: TasksDomainType
    todoListID: string
}

export const Tasks = memo((props: BodyListType) => {

    const {deleteTaskTC, updateTaskTC} = useActions(tasksActions)

    const deleteTitleHandler = () => {
        deleteTaskTC({todolistId: props.todoListID, taskId: props.tasks.id})
    }

    const isDoneTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        const status = newIsDoneValue ? TASK_STATUS.Completed : TASK_STATUS.New
        updateTaskTC({todolistId: props.todoListID, taskId: props.tasks.id, model: {status}})
    }

    const taskNewTitleHandler = (title: string) => {
        updateTaskTC({todolistId: props.todoListID, taskId: props.tasks.id, model: {title}})
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