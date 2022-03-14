import { useLocalStorageValue } from "@mantine/hooks";

export type PinnedItem = {
    id: number;
    title: string;
    created: string;
    hash: string;
    boardName: string;
};

export type BoardPins = {
    [key: number]: PinnedItem;
};

export type Pins = {
    [key: string]: BoardPins;
};

export const usePins = () => {
    const [pinsStr, setPinsStr] = useLocalStorageValue({
        key: "pins",
        defaultValue: JSON.stringify({}),
    });

    const pinsmap = JSON.parse(pinsStr) as Pins;

    const addPin = (pin: PinnedItem) => {
        const boardPins = pinsmap[pin.boardName] || {};
        boardPins[pin.id] = pin;
        pinsmap[pin.boardName] = boardPins;
        setPinsStr(JSON.stringify(pinsmap));
    };

    const getPin = (boardName: string, id: number) =>
        pinsmap[boardName] ? pinsmap[boardName][id] : undefined;

    const removePin = (boardName: string | undefined, id: number) => {
        if (boardName && pinsmap[boardName]) {
            delete pinsmap[boardName][id];
            setPinsStr(JSON.stringify(pinsmap));
        }
        else {
            delete pinsmap[id];
            setPinsStr(JSON.stringify(pinsmap));
        }
    };

    const hasPin = (boardName: string, id: number) =>
        pinsmap[boardName] && pinsmap[boardName][id];

    const pinsCount = Object.keys(pinsmap).reduce(
        (acc, key) => acc + Object.keys(pinsmap[key]).length,
        0
    );

    const pinsOf = (boardName: string) => Object.values(pinsmap[boardName]);

    // because of old data
    const pins = (Object.keys(pinsmap)
        .map((x) => pinsmap[x])
        .reduce<any>(
            (acc, boardPins: any) => boardPins.id ? acc.concat(boardPins) : acc.concat(Object.values(boardPins)),
            []
        ) as PinnedItem[])
        

    return { pins, pinsOf, pinsCount, addPin, getPin, removePin, hasPin };
};
