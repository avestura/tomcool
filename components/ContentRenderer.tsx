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

const getNavigatorLinkifiers = () => {

    const full = /([\w]+)\/([\w]+)(#(\d+))?/
    const linkifyBoardThreadReply = linkifyRegex(full, path => {
        const result = (full).exec(path);
        const board = result ? result[1] : undefined
        const thread = result ? result[2] : undefined
        const reply = result ? result[3] : undefined
        if(board && thread && reply) {
            return `/b/${board}/${thread}${reply}`
        }
        if(board && thread) {
            return `/b/${board}/${thread}`
        }
        return path
    })

    const threadAndReply = /([\w]+)?#(\d+)/
    const linkifyThreadReply = (currentBoard: string | false) => linkifyRegex(threadAndReply, path => {
        const result = (threadAndReply).exec(path);
        const thread = result ? result[1] : undefined
        const reply = result ? result[2] : undefined
        if(thread && reply && currentBoard) {
            return `/b/${currentBoard}/${thread}#${reply}`
        }
        return path
    })

    return { linkifyBoardThreadReply, linkifyThreadReply }
}

export const ContentRenderer = (props: { children: string, boardName: string | false }) => {
    const linkifyUrls = linkifyRegex(/^(https?):\/\/[^\s$.?#].[^\s]*$/)
    const {linkifyBoardThreadReply, linkifyThreadReply} = getNavigatorLinkifiers()
    return (
        <ReactMarkdown
            disallowedElements={["script", "media", "iframe"]}
            skipHtml={false}
            rehypePlugins={[
                rehypeRaw,
                rehypeKatex,
                rehypeExternalLinks,
            ]}
            remarkPlugins={[remarkMath, remarkGemoji, remarkBreaks, linkifyUrls, linkifyBoardThreadReply, linkifyThreadReply(props.boardName)]}
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
