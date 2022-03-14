import {
    Title,
    Text,
    Anchor,
    InputWrapper,
    Button,
    NumberInput,
} from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSettings } from "../lib/settings";

export default function HomePage() {
    const [val, setVal] = useState<number | undefined>(1);
    const {defaultBoard} = useSettings()
    const router = useRouter();
    return (
        <>
            <Head>
                <title>Forum :: Goto</title>
            </Head>
            <Title mb={10}>Navigate to thread by id</Title>
            <InputWrapper mb={10} required label="Thread Id to visit">
                <NumberInput value={val} onChange={setVal}></NumberInput>
            </InputWrapper>
            <Button
                onClick={() => {
                    if (val) {
                        router.push(`/b/${defaultBoard}/${val}`);
                    }
                }}
            >
                Visit
            </Button>
        </>
    );
}
