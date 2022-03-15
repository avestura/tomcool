// import { Root, Content } from "mdast";
// import { Node, Data } from "unist";
// import { BuildVisitor } from "unist-util-visit/complex-types";

// export function flatMap<Tree extends Root = Root>(
//     ast: Tree,
//     fn: BuildVisitor<Tree, string>
// ) {
//     const transform: BuildVisitor<Tree, string> = (node, index, parent) => {
        
//         if (node.children) {
//             const out = [];
//             for (var i = 0, n = node.children.length; i < n; i++) {
//                 const xs = transform(node.children[i], i, node);
//                 if (xs) {
//                     for (var j = 0, m = xs.length; j < m; j++) {
//                         out.push(xs[j]);
//                     }
//                 }
//             }
//             node.children = out;
//         }

//         return fn(node, index, parent);
//     };

//     return transform(ast, 0, null)[0];
// }
const dummy = {}
export default dummy