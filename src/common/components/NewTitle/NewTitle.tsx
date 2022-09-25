import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import styles from './NewTitle.module.css'
import {Button, TextField} from "@mui/material";

export type ColorButtonType = "success" | "secondary" | "error"

type NewTitleType = {
    newTitleCallBack: (title: string) => void
    classNameButton?: string
    classNameInput?: string
    colorButton?: ColorButtonType
    backgroundColorButton?: string
    valueLabel?: string
    disabled?: boolean
}

export const NewTitle = memo((props: NewTitleType) => {

    const [title, setTitle] = useState<string>('')
    const [error, setError] = useState<boolean>(false)

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const titleValue = e.currentTarget.value
        if (titleValue !== ' ') {
            setTitle(titleValue)
            setError(false)
        } else setError(true)
    }

    const onClickButtonHandler = () => {
        const titleReplace = title.replace(/^ +| +$|( ) +/g, "$1")
        if (titleReplace !== '') {
            props.newTitleCallBack(titleReplace)
            setTitle('')
        } else setError(true)
    }

    const onKeyPressInputHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        e.key === 'Enter' && onClickButtonHandler()
    }

    const backgroundColorButton = props.backgroundColorButton ? {backgroundColor: props.backgroundColorButton} : {}

    const valueLabel = props.valueLabel ? error ? 'Error! Enter value.' : props.valueLabel : ''

    return (
        <div>
            <TextField
                value={title}
                error={error}
                label={valueLabel}
                size={"small"}
                id="outlined-basic"
                variant="outlined"
                onChange={onChangeInputHandler}
                onKeyPress={onKeyPressInputHandler}
                className={props.classNameInput}
                disabled={props.disabled}
            />
            <Button
                variant={'contained'}
                size={"small"}
                color={props.colorButton}
                onClick={onClickButtonHandler}
                className={props.classNameButton}
                style={backgroundColorButton}
                disabled={props.disabled}
            >+</Button>
        </div>
    )
})