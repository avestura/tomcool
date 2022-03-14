import {
    Title,
    Text,
    Anchor,
    Alert,
    Skeleton,
    Timeline,
    Badge,
    Tooltip,
} from "@mantine/core";
import {
    CrossCircledIcon,
    ReaderIcon,
} from "@modulz/radix-icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { RecentThreadResponse } from "../models/ThomasForumModels";
import { formatDistance } from "date-fns";
import { useThreadModificationDates } from "../lib/newThreads";

const ContentLoading = (props: {}) => {
    return (
        <>
            <Skeleton height={50} circle mb="xl" />
            <Skeleton height={8} radius="xl" />
            <Skeleton height={8} mt={6} radius="xl" />
            <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </>
    );
};

export default function HomePage() {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR<RecentThreadResponse>(
        "https://forums.trgwii.com/api/thread/recent",
        fetcher
    );
    const { purgeOldData, isNewThread } = useThreadModificationDates();
    useEffect(() => {
        if (data && data.ok) {
            purgeOldData(data.threads.map((x) => x.id));
        }
    }, [data, purgeOldData]);
    const router = useRouter();
    return (
        <>
            <Title mb={20}>Home Page</Title>
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
                        <Timeline mb={20} bulletSize={24} lineWidth={2}>
                            {data.threads.map((th, i) => (
                                <Timeline.Item
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        router.push(`/thread/${th.id}`)
                                    }
                                    className="comment-content"
                                    sx={{ img: { maxWidth: "100%" } }}
                                    key={i}
                                    bullet={<ReaderIcon scale={2} />}
                                    title={
                                        <>
                                            <Anchor
                                                onClick={(e: any) => {
                                                    e.preventDefault();
                                                }}
                                                href={`/thread/${th.id}`}
                                            >
                                                {th.title}
                                            </Anchor>
                                            &nbsp;
                                            {isNewThread(
                                                th.id,
                                                th.modified
                                            ) && (
                                                <Badge sx={{verticalAlign: "middle"}} variant="dot" size="xs">
                                                    new
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
                                                <Tooltip
                                                    withArrow
                                                    label={th.modified}
                                                >
                                                    {formatDistance(
                                                        new Date(th.modified),
                                                        new Date(),
                                                        { addSuffix: true }
                                                    )}
                                                </Tooltip>
                                            </>
                                        )}, {th.replies} replies&nbsp;
                                        <Badge
                                            styles={{
                                                root: { textTransform: "none" },
                                            }}
                                        >
                                            {th.hash}
                                        </Badge>
                                    </Text>
                                </Timeline.Item>
                            ))}
                        </Timeline>
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
