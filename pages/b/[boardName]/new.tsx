import {
    Title,
    Text,
    Anchor,
    TextInput,
    Button,
    InputWrapper,
    Notification,
    Textarea,
    Tabs,
    Alert,
} from "@mantine/core";
import { useForm, useLocalStorageValue } from "@mantine/hooks";
import { useNotifications } from "@mantine/notifications";
import { Cross1Icon, CrossCircledIcon } from "@modulz/radix-icons";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ContentRenderer } from "../../../components/ContentRenderer";
import RichTextEditor from "../../../components/RichTextEditor";

export default function ThreadCreator() {
    const notifications = useNotifications();
    const router = useRouter();
    const { query } = router;
    const { boardName } = query;
    const form = useForm({
        initialValues: {
            title: "",
            content: "",
        },
    });

    const [editor, setEditor] = useLocalStorageValue<"plain" | "rich">({
        key: "editor",
        defaultValue: "rich",
    });

    const [loading, setLoading] = useState(false);

    const submit = form.onSubmit((values) => {
        setLoading(true);
        axios
            .post(
                `https://forums.trgwii.com/api/${boardName}/thread/create.json`,
                {
                    title: values.title,
                    text: values.content,
                }
            )
            .then((req) => {
                if (req.data.ok) {
                    form.reset();
                    router.push(`/b/${boardName}/${req.data.id}`);
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
                    message: err.response?.data?.error
                        ? err.response.data.error
                        : err.message
                        ? err.message
                        : "Failed to submit",
                    color: "red",
                    icon: <Cross1Icon />,
                });
            });
    });

    const validBoardName = boardName && !Array.isArray(boardName);

    return (
        <>
            <Head>
                <title>Forum :: Submit Thread</title>
            </Head>
            {validBoardName && (
                <form onSubmit={submit}>
                    <Title order={4} mb={20}>
                        New Thread
                    </Title>
                    <Text mb={10}>Board Name: {boardName}</Text>
                    <TextInput
                        required
                        label="Title"
                        placeholder="Thread Title"
                        disabled={loading}
                        mb={10}
                        {...form.getInputProps("title")}
                    />

                    <InputWrapper
                        mb={10}
                        required
                        label={
                            editor === "rich"
                                ? "Content"
                                : "Content (markdown is supported)"
                        }
                    >
                        <Tabs>
                            <Tabs.Tab label="Editor">
                                {editor === "rich" && (
                                    <RichTextEditor
                                        readOnly={loading}
                                        value=""
                                        controls={[
                                            [
                                                "bold",
                                                "italic",
                                                "underline",
                                                "clean",
                                            ],
                                            [
                                                "h1",
                                                "h2",
                                                "h3",
                                                "h4",
                                                "h5",
                                                "h6",
                                            ],
                                            ["unorderedList", "orderedList"],
                                            [
                                                "link",
                                                "video",
                                                "image",
                                                "blockquote",
                                            ],
                                            ["code", "codeBlock"],
                                            ["sup", "sub"],
                                        ]}
                                        {...form.getInputProps("content")}
                                    ></RichTextEditor>
                                )}

                                {editor === "plain" && (
                                    <Textarea
                                        autosize
                                        {...form.getInputProps("content")}
                                    />
                                )}
                            </Tabs.Tab>
                            <Tabs.Tab label="Preview">
                                <ContentRenderer boardName={boardName}>
                                    {form.values.content}
                                </ContentRenderer>
                            </Tabs.Tab>
                        </Tabs>
                    </InputWrapper>

                    <Button mr={10} loading={loading} type="submit">
                        Submit
                    </Button>

                    <Button
                        color="gray"
                        onClick={() =>
                            setEditor((s) => {
                                if (
                                    s === "rich" &&
                                    form.values.content === "<p><br></p>"
                                ) {
                                    form.setValues({
                                        ...form.values,
                                        content: "",
                                    });
                                }
                                return s === "plain" ? "rich" : "plain";
                            })
                        }
                    >
                        Use {editor === "plain" ? "Rich" : "Simple"} Editor
                    </Button>
                </form>
            )}
            {!validBoardName && (
                <Alert
                    icon={<CrossCircledIcon />}
                    title="Error"
                    color="red"
                    mb={10}
                >
                    Board name is not valid
                </Alert>
            )}
        </>
    );
}
