import { useLocalStorageValue } from "@mantine/hooks"

export const useSettings = () => {
    const [colorizeReply, setColorizeReply] = useLocalStorageValue<"true" | "false">({
        key: 'colorize-reply',
        defaultValue: 'true'
    })

    return {
        colorizeReply,
        toggleColorizeReply: () => setColorizeReply(colorizeReply === 'true' ? 'false' : 'true')
    }
}