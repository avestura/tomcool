import {
    Title,
    Text,
    Anchor,
    InputWrapper,
    Button,
    NumberInput,
    Alert,
    Skeleton,
    Timeline,
    Badge,
} from "@mantine/core";
import {
    ChatBubbleIcon,
    CrossCircledIcon,
    ReaderIcon,
} from "@modulz/radix-icons";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import { RecentThreadResponse } from "../models/ThomasForumModels";
import { formatDistance } from "date-fns";

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
                                        <Anchor
                                            onClick={(e: any) => {
                                                e.preventDefault();
                                            }}
                                            href={`/thread/${th.id}`}
                                        >
                                            {th.title}
                                        </Anchor>
                                    }
                                >
                                    <Text size="sm">
                                        Created{" "}
                                        {formatDistance(
                                            new Date(th.created),
                                            new Date(),
                                            { addSuffix: true }
                                        )}
                                        {th.created !== th.modified && (
                                            <>
                                                , Modified{" "}
                                                {formatDistance(
                                                    new Date(th.modified),
                                                    new Date(),
                                                    { addSuffix: true }
                                                )}
                                            </>
                                        )}
                                        ,&nbsp;
                                        <Badge>{th.hash}</Badge>
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
