import { Code } from "@mantine/core";
import { Prism } from "@mantine/prism";
import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export const ContentRenderer = (props: { children: string }) => {
    return (
        <ReactMarkdown
            disallowedElements={["script", "media", "iframe"]}
            skipHtml={false}
            rehypePlugins={[rehypeRaw]}
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                        <Prism language={match[1] as any} {...props}>
                            {String(children).replace(/\n$/, "")}
                        </Prism>
                    ) : (
                        <Code className={className} {...props}>
                            {children}
                        </Code>
                    );
                },
            }}
        >
            {props.children}
        </ReactMarkdown>
    );
};
