import { Title, Text, Anchor, InputWrapper, Button, NumberInput } from '@mantine/core';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function HomePage() {
  const [val, setVal] = useState<number | undefined>(1)
  const router = useRouter()
  return (
    <>
      <p>Thomas still doesn&apos;t have a main page api!</p>
      <p>for now, try browsing using `/thread/:id` urls</p>

      <InputWrapper mb={10} required label="Thread Id to visit">
        <NumberInput value={val} onChange={setVal}></NumberInput>
      </InputWrapper>
      <Button onClick={() => {
        if(val) {
          router.push(`/thread/${val}`)
        }
      }}>Visit</Button>
    </>
  );
}