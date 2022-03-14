import { Title, Text, Anchor } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function B() {
    const router = useRouter();
    useEffect(() => {
        router.push("/boards");
    }, [router]);
    return <>Redirecting to boards...</>;
}
