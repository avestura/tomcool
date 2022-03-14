import { Anchor, Blockquote, Code, Divider } from "@mantine/core";
import { Prism } from "@mantine/prism";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGemoji from "remark-gemoji";
import remarkBreaks from "remark-breaks";
import rehypeExternalLinks from "rehype-external-links";

import "katex/dist/katex.min.css";

export const ContentRenderer = (props: { children: string }) => {
    return (
        <ReactMarkdown
            disallowedElements={["script", "media", "iframe"]}
            skipHtml={false}
            rehypePlugins={[
                rehypeRaw,
                rehypeKatex,
                rehypeExternalLinks,
            ]}
            remarkPlugins={[remarkMath, remarkGemoji, remarkBreaks]}
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline ? (
                        <Prism
                            withLineNumbers
                            language={match ? (match[1] as any) : undefined}
                            {...props}
                        >
                            {String(children).replace(/\n$/, "")}
                        </Prism>
                    ) : (
                        <Code className={className} {...props}>
                            {children}
                        </Code>
                    );
                },
                a: Anchor,
                blockquote({ children, node }) {
                    return <Blockquote>{children}</Blockquote>;
                },
                hr({}) {
                    return <Divider mb={5} variant="dotted" />
                }

            }}
        >
            {props.children}
        </ReactMarkdown>
    );
};
