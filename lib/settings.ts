import { useLocalStorageValue } from "@mantine/hooks"

export const useSettings = () => {
    const [colorizeReply, setColorizeReply] = useLocalStorageValue<"true" | "false">({
        key: 'colorize-reply',
        defaultValue: 'true'
    })

    const [editor, setEditor] = useLocalStorageValue<"plain" | "rich">({
        key: "editor",
        defaultValue: "rich",
    });

    return {
        colorizeReply,
        toggleColorizeReply: () => setColorizeReply(colorizeReply === 'true' ? 'false' : 'true'),
        editor,
        toggleEditor: () => setEditor(ed => ed === "rich" ? "plain" : "rich"),
        setEditor
    }
}