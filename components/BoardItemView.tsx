import React from "react";
import {
    createStyles,
    Card,
    Image,
    Text,
    Group,
    Center,
    Button,
    SimpleGrid,
    Badge,
    Tooltip,
} from "@mantine/core";
import { Board } from "../models/ThomasForumModels";
import { StarFilledIcon, StarIcon } from "@modulz/radix-icons";
import { formatDistance } from "date-fns";
import { FcCalculator, FcCollaboration, FcGlobe, FcSupport } from "react-icons/fc";
import { useRouter } from "next/router";
const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    },

    footer: {
        display: "flex",
        justifyContent: "space-between",
        padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
        borderTop: `1px solid ${
            theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[2]
        }`,
    },

    title: {
        lineHeight: 1,
    },
}));

interface BoardItemViewerProps {
    board: Board;
    isDefaultBoard: boolean;
    setDefaultBoard: () => void;
}

const icons = new Map([
    ["main", <FcGlobe key={1} size={24} />],
    ["dev", <FcSupport key={2} size={24} />],
    ["math", <FcCalculator key={1} size={24} />]
]);

export function BoardItemViewer(props: BoardItemViewerProps) {
    const { classes } = useStyles();
    const { board, isDefaultBoard, setDefaultBoard } = props;
    const { name, description, expiry } = board;
    const router = useRouter();
    const BoardIcon = icons.has(name) ? (
        icons.get(name)
    ) : (
        <FcCollaboration size={24} />
    );

    const BoardInfoViewer = (props: { title: string; value: string }) => (
        <div key={props.title} style={{marginRight: 5}}>
            <Text size="xs" color="dimmed">
                {props.title}
            </Text>
            <Text weight={500} size="sm">
                {props.value}
            </Text>
        </div>
    );

    return (
        <Card style={{minWidth: "250px"}} withBorder padding="lg" shadow="sm" className={classes.card}>
            <Group  position="left">
                <Center>
                    <div>{BoardIcon}</div>
                </Center>
                <Text size="sm" style={{flexGrow: 1}} weight={700} className={classes.title}>
                    {name}
                </Text>
                <Badge color={isDefaultBoard ? "green" : "gray"} size="xs">
                    {isDefaultBoard ? "default" : ""}
                </Badge>
            </Group>
            <Text mt="sm" mb="md" color="dimmed" size="xs">
                {description}
            </Text>
            <Card.Section className={classes.footer}>
                <BoardInfoViewer
                    title="expiry"
                    value={formatDistance(0, props.board.expiry * 1000)}
                />
                <BoardInfoViewer title="anon" value="?" />
                <BoardInfoViewer title="tripcode" value="?" />
            </Card.Section>
            <Group spacing="xs" style={{ marginTop: 14 }}>
                <Tooltip label={isDefaultBoard ? "This is your default board" : "Set as default board"} withArrow>
                <Button
                    variant="light"
                    color={isDefaultBoard ? "green" : "gray"}
                    onClick={setDefaultBoard}
                >
                    {isDefaultBoard ? <StarFilledIcon /> : <StarIcon />}
                </Button>
                </Tooltip>
                <Button
                    variant="light"
                    color="blue"
                    style={{flexGrow: 1}}
                    onClick={() => router.push(`/b/${name}`)}
                >
                    View
                </Button>
            </Group>
        </Card>
    );
}
