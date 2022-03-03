import {
    Title,
    Text,
    Anchor,
    TextInput,
    Button,
    InputWrapper,
    Notification,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { useNotifications } from "@mantine/notifications";
import { Cross1Icon } from "@modulz/radix-icons";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import RichTextEditor from "../components/RichTextEditor";

export default function HomePage() {
    const notifications = useNotifications();
    const router = useRouter();
    const form = useForm({
        initialValues: {
            title: "",
            content: "",
        },
    });

    const [loading, setLoading] = useState(false);

    const submit = form.onSubmit((values) => {
        setLoading(true);
        axios
            .post("https://forums.trgwii.com/api/thread/create.json", {
                title: values.title,
                text: values.content,
            })
            .then((req) => {
                if (req.data.ok) {
                    form.reset();
                    router.push(`/thread/${req.data.id}`);
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
                    message: err.message ? err.message : "Failed to submit" ,
                    color: "red",
                    icon: <Cross1Icon />,
                });
            });
    });

    return (
        <>
            <form onSubmit={submit}>
                <Title mb={20}>New Thread</Title>
                <TextInput
                    required
                    label="Title"
                    placeholder="Thread Title"
                    disabled={loading}
                    mb={10}
                    {...form.getInputProps("title")}
                />

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
}
