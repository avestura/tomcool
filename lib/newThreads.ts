import { useLocalStorageValue } from "@mantine/hooks"
import { RecentThread } from "../models/ThomasForumModels"

export type ThreadModificationDates = {
    [id: string]: string
}

export const useThreadModificationDates = () => {
    const [modsDatesStr, setModsDatesStr] = useLocalStorageValue({
        key: 'modificationDates',
        defaultValue: JSON.stringify({})
    })

    const modDates = JSON.parse(modsDatesStr) as ThreadModificationDates

    const purgeOldData = (threadIds: number[]) => {
        const newModsDates: ThreadModificationDates = {}
        Object.keys(modDates).forEach(id => {
            if (threadIds.includes(parseInt(id))) {
                newModsDates[id] = modDates[id]
            }
        })
        setModsDatesStr(JSON.stringify(newModsDates))
    }

    const isNewThread = (threadId: number, currentModDate: string) => {
        return !modDates[threadId.toString()] || (modDates[threadId.toString()] !== currentModDate)
    }

    const visitNewThread = (threadId: number, modDate: string) => {
        modDates[threadId.toString()] = modDate
        setModsDatesStr(JSON.stringify(modDates))
    }

    return { purgeOldData, isNewThread, visitNewThread }
}