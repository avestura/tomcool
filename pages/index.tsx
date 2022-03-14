import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSettings } from "../lib/settings";
import { Text } from "@mantine/core"

export default function HomePage() {
   
    const router = useRouter();
    const { defaultBoard  } = useSettings();
    useEffect(() => {
        router.push(`/b/${defaultBoard}`)
    })

    return <Text>Redirecting to your default board...</Text>
}
