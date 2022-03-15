import {visitParents} from 'unist-util-visit-parents';
//@ts-ignore
import flatMap from 'unist-util-flatmap';
import { Plugin } from "unified";
import { Root, Content, Text, Link } from "mdast"
import { Node } from 'unist-util-visit';

function removeExtremes(regex: RegExp, optionalFlags?: string) {
  return new RegExp(
    regex.source.replace(/^\^/, '').replace(/\$$/, ''),
    optionalFlags || regex.flags,
  );
}

function notInMarkdownLink(regex: RegExp, optionalFlags?: string) {
  return new RegExp(
    regex.source + '(?! *\\))(?! *])',
    optionalFlags || regex.flags,
  );
}

function buildTextNode(props: {value: string}): Text {
  return {type: 'text', value: props.value};
}

function buildLinkNode(props: {title: string, url: string }, children: Link['children']): Link {
  return {
    type: 'link',
    title: props.title ? props.title : null,
    url: props.url,
    children,
  };
}

function h<T extends "text" | "link">(type: T, props: any, children?: Link["children"]) {
  if (type === 'text') return buildTextNode(props as any);
  if (type === 'link') return buildLinkNode(props as any, children!);
  throw new Error('mdast hyperscript not supported for type ' + type);
}

function splitTextNode(textNode: Text, inputRegex: RegExp, createUrl: (x: any) => any) {
  const oldText = textNode.value;
  const regex = notInMarkdownLink(removeExtremes(inputRegex), 'g');
  const newNodes = [];
  let startTextIdx = 0;
  let output;
  while ((output = regex.exec(oldText)) !== null) {
    const endTextIdx = output.index;
    if (startTextIdx !== endTextIdx) {
      newNodes.push(
        h('text', {value: oldText.slice(startTextIdx, endTextIdx)}),
      );
    }
    const feedId = output[0];
    newNodes.push(h('link', { url: createUrl(feedId) }, [
      h('text', { value: feedId }) as Text,
    ]));
    startTextIdx = regex.lastIndex;
  }
  const remainingText = oldText.slice(startTextIdx);
  if (remainingText.length > 0) {
    newNodes.push(h('text', {value: remainingText}));
  }
  return newNodes;
}

export function linkifyRegex(regex: RegExp, createUrl?: (x: any) => any): Plugin<void[], Root> {
  return () => ast => {
    visitParents(ast, 'text', (textNode, parents) => {
      if (parents.length > 0 && parents[parents.length - 1].type === 'link') {
        (textNode as any)._ignoreMe = true;
        return;
      }
    });

    flatMap(ast, (node: Node) => {
      if (node.type !== 'text') {
        return [node];
      }
      if ((node as any)._ignoreMe) {
        delete (node as any)._ignoreMe;
        return [node];
      }
      return splitTextNode(node as Text, regex, createUrl ? createUrl : (<T>(id: T) => id));
    });

    return ast;
  };
}