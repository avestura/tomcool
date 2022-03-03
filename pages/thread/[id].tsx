import {
    Alert,
    Divider,
    Loader,
    Text,
    Paper,
    Skeleton,
    Timeline,
    Title,
    TextInput,
    InputWrapper,
    Code,
    Button,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
    ChatBubbleIcon,
    Cross1Icon,
    CrossCircledIcon,
} from "@modulz/radix-icons";
import useSWR from "swr";
import { Thread, ThreadResponse } from "../../models/ThomasForumModels";
import axios from "axios";
import { useNotifications } from "@mantine/notifications";
import RichTextEditor from "../../components/RichTextEditor";
import { ContentRenderer } from "../../components/ContentRenderer";
import { useForm } from "@mantine/hooks";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ThreadViewer = (props: {
    id: number;
    thread: Thread;
    reeval?: () => void;
}) => {
    const t = props.thread;
    const notifications = useNotifications();
    const form = useForm({
        initialValues: {
            content: "",
        },
    });

    const [loading, setLoading] = useState(false);
    

    const submit = form.onSubmit((values) => {
        setLoading(true);
        axios
            .post("https://forums.trgwii.com/api/thread/post.json", {
                id: props.id,
                text: values.content,
            })
            .then((req) => {
                if (req.data.ok) {
                    form.reset();
                    setLoading(false);
                    if (props.reeval) {
                        props.reeval();
                    }
                } else {
                    setLoading(false);
                    notifications.showNotification({
                        title: "Error",
                        message: req.data.error,
                        color: "red",
                        icon: <Cross1Icon />,
                    });
                }
            })
            .catch((err) => {
                setLoading(false);
                notifications.showNotification({
                    title: "Error",
                    message: err.message ? err.message : "Failed to submit",
                    color: "red",
                    icon: <Cross1Icon />,
                });
            });
    });

    const mentions = useMemo(
        () => ({
          allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
          mentionDenotationChars: ['@'],
          source: (searchTerm: string, renderList: Function, mentionChar: string) => {
            const list = t.replies.map((r, i) => ({ id: i+1, value: r.hash}));
            const includesSearchTerm = list.filter((item) =>
              item.value.toLowerCase().includes(searchTerm.toLowerCase())
            );
            renderList(includesSearchTerm);
          },
        }),
        [t]
      );

    const replyMemos = useMemo(() => {
        return t.replies.map((r) => (
            <Timeline.Item
                className="comment-content"
                sx={{ img: { maxWidth: "100%" } }}
                key={r.hash}
                bullet={<ChatBubbleIcon scale={2} />}
                title={r.hash}
            >
                <ContentRenderer>{r.text}</ContentRenderer>
            </Timeline.Item>
        ))
    }, [t])

    return (
        <>
            <Title order={2} mb={10}>
                {t.title}
            </Title>
            <Paper
                className="thread-content"
                sx={{ img: { maxWidth: "100%" } }}
                padding="md"
                shadow="sm"
                mb={20}
            >
                <ContentRenderer>{t.text}</ContentRenderer>
            </Paper>
            <Divider mb={20} variant="dashed" />
            {t.replies.length === 0 && (
                <Text>No replies. Be first to reply!</Text>
            )}
            <Timeline mb={20} bulletSize={24} lineWidth={2}>
                {replyMemos}
            </Timeline>
            <Divider mb={20} variant="dashed" />
            <Title order={3} mb={5}>
                Post a reply
            </Title>
            <form onSubmit={submit}>
                <InputWrapper mb={10} required label="Content (markdown is supported)" sx={{
                    ".ql-mention-list-container,.ql-container": {zIndex: 99999}
                }}>
                    <RichTextEditor
                        readOnly={loading}
                        value={form.values.content}
                        controls={[
                            ["bold", "italic", "underline", "clean"],
                            ["h1", "h2", "h3", "h4", "h5", "h6"],
                            ["unorderedList", "orderedList"],
                            ["link", "video", "image", "blockquote"],
                            ["code", "codeBlock"],
                            ["sup", "sub"],
                        ]}
                        mentions={mentions}
                        {...form.getInputProps("content")}
                    ></RichTextEditor>
                </InputWrapper>

                <Button loading={loading} type="submit">
                    Submit
                </Button>
            </form>
        </>
    );
};

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

const Post = () => {
    const router = useRouter();
    const { id } = router.query;
    const { data, error, mutate } = useSWR<ThreadResponse>(
        id && !Array.isArray(id)
            ? `https://forums.trgwii.com/api/thread/${id}`
            : null,
        fetcher
    );
    return (
        <>
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
                    {!data.ok && (
                        <Alert
                            icon={<CrossCircledIcon />}
                            title="Error"
                            color="red"
                            mb={10}
                        >
                            {data.error}
                        </Alert>
                    )}
                    {data.ok && (
                        <ThreadViewer
                            id={parseInt(id as string, 10)}
                            thread={data.thread}
                            reeval={() => mutate()}
                        />
                    )}
                </>
            ) : (
                <ContentLoading />
            )}
        </>
    );
};

export default Post;
