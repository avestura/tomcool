import {
    Title,
    Text,
    Anchor,
    Alert,
    Skeleton,
    Timeline,
    Badge,
    Tooltip,
    Group,
    Button,
} from "@mantine/core";
import {
    Component2Icon,
    CrossCircledIcon,
    PlusIcon,
    ReaderIcon,
} from "@modulz/radix-icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import {
    BoradRecentThreadsResponse,
    RecentThreadResponse,
} from "../../../models/ThomasForumModels";
import { formatDistance } from "date-fns";
import { useThreadModificationDates } from "../../../lib/newThreads";
import ContentLoading from "../../../components/ContentLoading";
import { useSettings } from "../../../lib/settings";
import { Board, RecentThread } from "../../../models/ThomasForumModels";

const BoardView = ({
    board,
    threads,
}: {
    board: Board;
    threads: RecentThread[];
}) => {
    const { purgeOldThreads, isNewThread } = useThreadModificationDates();

    useEffect(() => {
        purgeOldThreads(
            board.name,
            threads.map((x) => x.id)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const router = useRouter();

    return (
        <>
            <Group direction="column">
                <Group spacing="xs">
                    <Button
                        color="green"
                        onClick={() => router.push(`/b/${board.name}/new`)}
                        leftIcon={<PlusIcon />}
                    >
                        Create new thread
                    </Button>
                    <Button
                        color="gray"
                        onClick={() => router.push(`/boards`)}
                        leftIcon={<Component2Icon />}
                    >
                        Browse other boards
                    </Button>
                </Group>
                <Timeline mb={20} bulletSize={24} lineWidth={2}>
                    {threads.map((th, i) => (
                        <Timeline.Item
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                                th.expired || router.push(`/b/${board.name}/${th.id}`)
                            }
                            className="comment-content"
                            sx={{ img: { maxWidth: "100%" } }}
                            key={i}
                            bullet={<ReaderIcon scale={2} />}
                            title={
                                <>
                                    {th.expired ? th.title : <Anchor
                                        onClick={(e: any) => {
                                            e.preventDefault();
                                        }}
                                        href={`/b/${board.name}/${th.id}`}
                                    >
                                        {th.title}
                                    </Anchor>}
                                    &nbsp;
                                    {isNewThread(
                                        board.name,
                                        th.id,
                                        th.modified
                                    ) && !th.expired && (
                                        <Badge
                                            sx={{
                                                verticalAlign: "middle",
                                            }}
                                            variant="dot"
                                            size="xs"
                                        >
                                            new
                                        </Badge>
                                    )}
                                    {th.expired && (
                                        <Badge
                                            sx={{
                                                verticalAlign: "middle",
                                            }}
                                            size="xs"
                                        >
                                            expired
                                        </Badge>
                                    )}
                                </>
                            }
                        >
                            <Text size="sm">
                                Created{" "}
                                <Tooltip withArrow label={th.modified}>
                                    {formatDistance(
                                        new Date(th.created),
                                        new Date(),
                                        { addSuffix: true }
                                    )}
                                </Tooltip>
                                {th.created !== th.modified && (
                                    <>
                                        , Modified{" "}
                                        <Tooltip withArrow label={th.modified}>
                                            {formatDistance(
                                                new Date(th.modified),
                                                new Date(),
                                                { addSuffix: true }
                                            )}
                                        </Tooltip>
                                    </>
                                )}
                                , {th.replies} replies&nbsp;
                                <Badge
                                    styles={{
                                        root: {
                                            textTransform: "none",
                                        },
                                    }}
                                >
                                    {th.hash}
                                </Badge>
                            </Text>
                        </Timeline.Item>
                    ))}
                </Timeline>
            </Group>
        </>
    );
};

export default function BoardPage() {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const router = useRouter();
    const { boardName } = router.query;
    const { defaultBoard } = useSettings();
    const { data, error, isValidating } = useSWR<BoradRecentThreadsResponse>(
        boardName && !Array.isArray(boardName)
            ? `https://forums.trgwii.com/api/${boardName}/thread/recent`
            : null,
        fetcher
    );

    return (
        <>
            <Title mb={5}>
                {data && data.ok ? data.board.name : boardName}
            </Title>
            <Text
                sx={(theme) => ({
                    color:
                        theme.colorScheme === "dark"
                            ? theme.colors.gray[5]
                            : theme.colors.gray[8],
                })}
                mb={20}
            >
                {data && data.ok ? data.board.description : "loading..."}&nbsp;
                {data && data.ok && data.board.name === defaultBoard && (
                    <Badge color="green">default board</Badge>
                )}
            </Text>
            {error && (
                <Alert
                    mb={20}
                    icon={<CrossCircledIcon />}
                    title="Error"
                    color="red"
                >
                    There was a problem fetching data, trying again...
                </Alert>
            )}
            {data ? (
                <>
                    {data.ok ? (
                        <BoardView board={data.board} threads={data.threads} />
                    ) : (
                        <Alert
                            icon={<CrossCircledIcon />}
                            title="Error"
                            color="red"
                        >
                            {data.error}
                        </Alert>
                    )}
                </>
            ) : (
                <ContentLoading />
            )}
        </>
    );
}
