import { visit } from "unist-util-visit";
import { Plugin } from "unified";
import { Root, Content } from "mdast"
import { Node, Data, Parent, Literal } from "unist"
type Settings = {
    mapping: Map<RegExp, Content>
}

export const regexReplacer : Plugin<[Settings], Root> = (settings) => {
    return (tree) => {
        visit(tree, "text", (node, index, parent) => {
            if (node.value) {
                
            }
        });
    };
};
