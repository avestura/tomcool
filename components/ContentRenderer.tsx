import { Anchor, Blockquote, Code, Divider } from "@mantine/core";
import { Prism } from "@mantine/prism";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGemoji from "remark-gemoji";
import remarkBreaks from "remark-breaks";
import rehypeExternalLinks from "rehype-external-links";
import {linkifyRegex} from "../lib/remark/regex-linkify"
import "katex/dist/katex.min.css";
import ContentRendereAnchor from "./layouts/ContentRendererAnchor";

export const ContentRenderer = (props: { children: string }) => {
    const linkifyUrls = linkifyRegex(/^(https?):\/\/[^\s$.?#].[^\s]*$/)
    const linkifyThreadLinks = linkifyRegex(/([\w]+)?#(\d+)/, path => {
        const result = (/([\w]+)?#(\d+)/).exec(path);
        const board = result ? result[1] : undefined
        const id = result ? result[2] : undefined
        if(board && id) {
            return `/b/${board}/${id}`
        }
        return path
    })
    return (
        <ReactMarkdown
            disallowedElements={["script", "media", "iframe"]}
            skipHtml={false}
            rehypePlugins={[
                rehypeRaw,
                rehypeKatex,
                rehypeExternalLinks,
            ]}
            remarkPlugins={[remarkMath, remarkGemoji, remarkBreaks, linkifyUrls, linkifyThreadLinks]}
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
                a: ContentRendereAnchor,
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
