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
import { useEffect, useState } from "react";
import {
    ChatBubbleIcon,
    Cross1Icon,
    CrossCircledIcon,
} from "@modulz/radix-icons";
import useSWR from "swr";
import { Thread, ThreadResponse } from "../../models/ThomasForumModels";
import axios from "axios";
import { useForm } from "@mantine/hooks";
import { useNotifications } from "@mantine/notifications";
import RichTextEditor from "../../components/RichTextEditor";
import ReactMarkdown from "react-markdown";
import { ContentRenderer } from "../../components/ContentRenderer";

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
                    setLoading(false)
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
    return (
        <>
            <Title order={2} mb={10}>
                {t.title}
            </Title>
            <Paper className="thread-content" sx={{'img': {maxWidth: "100%"}}} padding="md" shadow="sm" mb={20}>
            <ContentRenderer>{t.text}</ContentRenderer>
            </Paper>
            <Divider mb={20} variant="dashed" />
            {t.replies.length === 0 && <Text>No replies. Be first to reply!</Text>}
            <Timeline mb={20} bulletSize={24} lineWidth={2}>
                {t.replies.map((r, id) => (
                    <Timeline.Item
                        className="comment-content"
                        sx={{'img': {maxWidth: "100%"}}}
                        key={r.hash}
                        bullet={<ChatBubbleIcon scale={2} />}
                        title={r.hash}
                    >
                        <ContentRenderer>{r.text}</ContentRenderer>
                    </Timeline.Item>
                ))}
            </Timeline>
            <Divider mb={20} variant="dashed" />
            <Title order={3} mb={5}>
                Post a reply
            </Title>
            <form onSubmit={submit}>
                <InputWrapper mb={10} required label="Content">
                    <RichTextEditor
                        readOnly={loading}
                        value=""
                        controls={[
                            ["bold", "italic", "underline", "link", "image"],
                            ["unorderedList", "h1", "h2", "h3"],
                            ["blockquote", "code", "codeBlock"],
                            ["sup", "sub"],
                        ]}
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
                <Alert icon={<CrossCircledIcon />} title="Error" color="red">
                    There was a problem fetching data, trying again...
                </Alert>
            )}
            {data ? (
                <>
                    {data.ok ? (
                        <ThreadViewer
                            id={parseInt(id as string, 10)}
                            thread={data.thread}
                            reeval={() => mutate()}
                        />
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
};

export default Post;
