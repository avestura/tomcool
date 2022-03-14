import { useLocalStorageValue } from "@mantine/hooks";
import { RecentThread } from "../models/ThomasForumModels";

export type ThreadModificationDates = {
    [threadId: string]: string;
};

export type BoardsModificationDates = {
    [boardName: string]: ThreadModificationDates;
};

export const useThreadModificationDates = () => {
    const [modsDatesStr, setModsDatesStr] = useLocalStorageValue({
        key: "modificationDates",
        defaultValue: JSON.stringify({}),
    });

    const boardModDates = JSON.parse(modsDatesStr) as BoardsModificationDates;

    const purgeOldThreads = (boardName: string, threadIds: number[]) => {
        const newModsDates: ThreadModificationDates = {};
        const modDatesForThisBoard = boardModDates[boardName];
        Object.keys(modDatesForThisBoard || {}).forEach((id) => {
            if (threadIds.includes(parseInt(id))) {
                newModsDates[id] = modDatesForThisBoard[id];
            }
        });
        boardModDates[boardName] = newModsDates;
        setModsDatesStr(JSON.stringify(boardModDates));
    };

    const isNewThread = (
        boardName: string,
        threadId: number,
        currentModDate: string
    ) => {
        const modDates = boardModDates[boardName];
        return (
            modDates &&
            (!modDates[threadId.toString()] ||
                modDates[threadId.toString()] !== currentModDate)
        );
    };

    const visitNewThread = (
        boardName: string,
        threadId: number,
        modDate: string
    ) => {
        const modDates = boardModDates[boardName] || {};
        modDates[threadId.toString()] = modDate;
        boardModDates[boardName] = modDates;
        setModsDatesStr(JSON.stringify(boardModDates));
    };

    const purgeOldBoards = (boardNames: string[]) => {
        const newBoardModsDates: BoardsModificationDates = {};
        Object.keys(boardModDates).forEach((boardName) => {
            if (boardNames.includes(boardName)) {
                newBoardModsDates[boardName] = boardModDates[boardName];
            }
        });
        setModsDatesStr(JSON.stringify(newBoardModsDates));
    };

    return {
        purgeOldThreads,
        isNewThread,
        visitNewThread,
        purgeOldBoards,
    };
};
