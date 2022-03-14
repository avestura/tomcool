import { useLocalStorageValue } from "@mantine/hooks"
import React, { useContext } from 'react';

type DefaultSettingValues = {
    colorizeReply: 'true' | 'false',
    editor: 'plain' | 'rich',
    replyOrder: 'newer-first' | 'older-first',
    board: string
}

const defaults: DefaultSettingValues = {
    colorizeReply: 'true',
    editor: 'rich',
    replyOrder: 'older-first',
    board: 'main'
}

export const __useSettingValues = () => {
    const [colorizeReply, setColorizeReply] = useLocalStorageValue<DefaultSettingValues['colorizeReply']>({
        key: 'colorize-reply',
        defaultValue: defaults.colorizeReply
    })

    const [editor, setEditor] = useLocalStorageValue<DefaultSettingValues['editor']>({
        key: "editor",
        defaultValue: defaults.editor,
    });

    const [replyOrder, setReplyOrder] = useLocalStorageValue<DefaultSettingValues['replyOrder']>({
        key: "replyOrder",
        defaultValue: defaults.replyOrder,
    });

    const [defaultBoard, setDefaultBoard] = useLocalStorageValue<string>({
        key: "defaultBoard",
        defaultValue: "main",
    });

    return  {
        colorizeReply,
        toggleColorizeReply: () => setColorizeReply(colorizeReply === 'true' ? 'false' : 'true'),
        editor,
        toggleEditor: () => setEditor(ed => ed === "rich" ? "plain" : "rich"),
        setEditor,
        replyOrder,
        setReplyOrder,
        defaultBoard,
        setDefaultBoard
    }
}

const nop = () => {}

export const SettingsContext = React.createContext<ReturnType< typeof __useSettingValues>>({
    colorizeReply: defaults.colorizeReply,
    defaultBoard: defaults.board,
    editor: defaults.editor,
    replyOrder: defaults.replyOrder,
    setDefaultBoard: nop,
    setEditor: nop,
    setReplyOrder: nop,
    toggleColorizeReply: nop,
    toggleEditor: nop
})

export const useSettings = () => useContext(SettingsContext)