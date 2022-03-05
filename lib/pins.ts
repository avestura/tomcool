import { useLocalStorageValue } from "@mantine/hooks"

export type PinnedItem = {
    id: number
    title: string
    created: string
    hash: string
}

export type Pins = {
    [key: number]: PinnedItem
}

export const usePins = () => {
    const [pinsStr, setPinsStr] = useLocalStorageValue({
        key: 'pins',
        defaultValue: JSON.stringify({})
    })

    const pinsmap = JSON.parse(pinsStr) as Pins

    const addPin = (pin: PinnedItem) => {
        pinsmap[pin.id] = pin
        setPinsStr(JSON.stringify(pinsmap))
    }

    const getPin = (id: number) => pinsmap[id]

    const removePin = (id: number) => {
        delete pinsmap[id]
        setPinsStr(JSON.stringify(pinsmap))
    }

    const hasPin = (id: number) => !!pinsmap[id]

    const pinsCount = Object.keys(pinsmap).length

    const pins = Object.values(pinsmap)

    return { pins, pinsCount, addPin, getPin, removePin, hasPin }
}