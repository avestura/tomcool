import { Avatar, AvatarProps, MantineColor } from "@mantine/core"
import { ShapeMap, ShapeProps } from "./AvatarShapes"

type UniqueAvatarProps = {
    value: string,
    color?: string
}

const shapeMap = ShapeMap()

export const shapeIndexOfString = (stringInput: string) => {
    const stringUniqueHash = Array.from(stringInput).reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return (stringUniqueHash % 30) + 31;
}

const UniqueAvatar = ({value, color, ...props}: UniqueAvatarProps & AvatarProps<"div">) => {
    const shapeIndex = shapeIndexOfString(value);
    const Component = (shapeMap as any)[shapeIndex] as (props: ShapeProps) => JSX.Element;
    return <Avatar {...props} >
        <Component shapeColor={color} width={24} />
    </Avatar>
}

export default UniqueAvatar;