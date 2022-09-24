import TextField from '@mui/material/TextField/TextField';
import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';

type TaskTitlePropsType = {
    title: string
    titleValueCallBack: (newTitle: string) => void
    className?: string
    disabled?: boolean
}

export const TaskTitle = memo((props: TaskTitlePropsType) => {

    const [visibility, setVisibility] = useState<boolean>(false)
    const [titleValue, setTitleValue] = useState<string>(props.title)
    const [error, setError] = useState<boolean>(false)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value !== ' ') {
            setTitleValue(e.currentTarget.value)
            setError(false)
        } else setError(true)
    }

    const offVisibilityHandler = () => {
        if (props.disabled) {
            return
        } else {
            const titleReplace = titleValue.replace(/^ +| +$|( ) +/g, "$1")
            if (titleReplace !== '') {
                props.titleValueCallBack(titleValue)
                setVisibility(false)
            } else setError(true)
        }

    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && offVisibilityHandler()

    const onVisibilityHandler = () => {
        if (props.disabled) {
            return
        } else {
            setVisibility(true)
        }
    }

    return (
        visibility
            ?
            <TextField
                value={titleValue}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
                onBlur={offVisibilityHandler}
                label={error ? 'Error! Enter value.' : ''}
                error={error}
                autoFocus
                id="standard-multiline-flexible"
                maxRows={4}
                variant="standard"
            />
            :
            <span onDoubleClick={onVisibilityHandler} className={props.className}>{props.title}</span>
    )
})