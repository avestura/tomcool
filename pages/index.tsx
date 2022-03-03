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
    return (
        <>
            <Title mb={20}>Home Page</Title>
            {error && (
                <Alert
                    mb={10}
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
                            {data.threads.map((th, id) => (
                                <Timeline.Item
                                    className="comment-content"
                                    sx={{ img: { maxWidth: "100%" } }}
                                    key={id}
                                    bullet={<ReaderIcon scale={2} />}
                                    title={<Anchor href="#">{th.title}</Anchor>}
                                >
                                    <Text size="sm">
                                        Created{" "}
                                        {formatDistance(
                                            new Date(th.created),
                                            new Date(),
                                            { addSuffix: true }
                                        )}
                                        , Modified{" "}
                                        {formatDistance(
                                            new Date(th.modified),
                                            new Date(),
                                            { addSuffix: true }
                                        )},&nbsp;
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
