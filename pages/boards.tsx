import { Title, Text, Anchor, Alert, Group, SimpleGrid } from "@mantine/core";
import { useLocalStorageValue } from "@mantine/hooks";
import { CrossCircledIcon } from "@modulz/radix-icons";
import Head from "next/head";
import { useEffect } from "react";
import useSWR from "swr";
import { BoardItemViewer } from "../components/BoardItemView";
import ContentLoading from "../components/ContentLoading";
import { useThreadModificationDates } from "../lib/newThreads";
import { useSettings } from "../lib/settings";
import { Board, BoardsResponse } from "../models/ThomasForumModels";

const BoardsViewer = ({ boards }: { boards: Board[] }) => {
    const { purgeOldBoards } = useThreadModificationDates();
    useEffect(() => {
        purgeOldBoards(boards.map((x) => x.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const { defaultBoard, setDefaultBoard } = useSettings();
    return (
        <Group direction="column">
            <Text>
                Set a Board as your default and it will be shown in your
                homepage
            </Text>
            <Group spacing="xs" mt={15} grow>
                {boards.map((b) => (
                    <BoardItemViewer
                        key={b.name}
                        board={b}
                        isDefaultBoard={defaultBoard === b.name}
                        setDefaultBoard={() => setDefaultBoard(b.name)}
                    />
                ))}
            </Group>
        </Group>
    );
};

export default function Boards() {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR<BoardsResponse>(
        "https://forums.trgwii.com/api/boards",
        fetcher
    );

    return (
        <>
            <Head>
                <title>Forum :: Boards</title>
            </Head>
            <Title mb={20}>Boards</Title>
            {error && (
                <Alert
                    mb={20}
                    icon={<CrossCircledIcon />}
                    title="Error"
                    color="red"
                >
                    There was a problem fetching boards, trying again...
                </Alert>
            )}
            {data ? (
                <>
                    {data.ok ? (
                        <BoardsViewer boards={data.boards} />
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
