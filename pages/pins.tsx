import { Title, Text, Anchor, Timeline, Badge, Button } from "@mantine/core";
import { DrawingPinIcon, ReaderIcon, SewingPinIcon } from "@modulz/radix-icons";
import { useRouter } from "next/router";
import { formatDistance } from "date-fns";
import { usePins } from "../lib/pins";
import Head from "next/head";

export default function Pins() {
    const { pins, pinsCount, removePin } = usePins();
    const router = useRouter();
    return (
        <>
            <Head>
                <title>Forum :: Pinned Items</title>
            </Head>
            <Title mb={20}>Pins</Title>
            <Text mb={20}>
                {pinsCount === 0 ? (
                    "You haven't pinned any threads."
                ) : (
                    <>
                        You have pinned <Badge>{pinsCount}</Badge> pins
                    </>
                )}
            </Text>
            <Timeline mb={20} bulletSize={24} lineWidth={2}>
                {pins.map((p) => (
                    <Timeline.Item
                        style={{ cursor: "pointer" }}
                        className="comment-content"
                        sx={{ img: { maxWidth: "100%" } }}
                        key={p.id}
                        bullet={<ReaderIcon scale={2} />}
                        title={
                            <>
                                <Anchor
                                    mr={5}
                                    onClick={(e: any) => {
                                        e.preventDefault();
                                        router.push(`/thread/${p.id}`);
                                    }}
                                    href={`/thread/${p.id}`}
                                >
                                    {p.title}
                                </Anchor>
                                <Anchor
                                    size="xs"
                                    onClick={(e: any) => {
                                        e.preventDefault();
                                        removePin(p.id);
                                    }}
                                >
                                    (Unpin)
                                </Anchor>
                            </>
                        }
                    >
                        <Text
                            size="sm"
                            onClick={() => router.push(`/thread/${p.id}`)}
                        >
                            Created{" "}
                            {formatDistance(new Date(p.created), new Date(), {
                                addSuffix: true,
                            })}
                            ,&nbsp;
                            <Badge>{p.hash}</Badge>
                        </Text>
                    </Timeline.Item>
                ))}
            </Timeline>
        </>
    );
}
