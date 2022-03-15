import { Anchor, AnchorProps } from "@mantine/core"
import Link from "next/link";
import { useRouter } from "next/router";

const ContentRendereAnchor = (props: AnchorProps<"a">) => {
    const router = useRouter();
    return <Anchor  {...props} />
}

export default ContentRendereAnchor;