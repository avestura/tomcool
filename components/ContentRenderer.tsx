import { Anchor, Blockquote, Code } from "@mantine/core";
import { Prism } from "@mantine/prism";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeKatex from 'rehype-katex'
import remarkMath  from 'remark-math';

import 'katex/dist/katex.min.css'

export const ContentRenderer = (props: { children: string }) => {
    return (
        <ReactMarkdown
            disallowedElements={["script", "media", "iframe"]}
            skipHtml={false}
            rehypePlugins={[rehypeRaw, rehypeKatex]}
            remarkPlugins={[remarkMath]}
            
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                        <Prism withLineNumbers language={match[1] as any} {...props}>
                            {String(children).replace(/\n$/, "")}
                        </Prism>
                    ) : (
                        <Code className={className} {...props}>
                            {children}
                        </Code>
                    );
                },
                "a": Anchor,
                blockquote({children, node}) {
                    return <Blockquote>{children}</Blockquote>
                },

            }}
        >
            {props.children}
        </ReactMarkdown>
    );
};
