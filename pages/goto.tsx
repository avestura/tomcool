import { Title, Text, Anchor, InputWrapper, Button, NumberInput } from '@mantine/core';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function HomePage() {
  const [val, setVal] = useState<number | undefined>(1)
  const router = useRouter()
  return (
    <>
      <Title mb={10}>Navigate to thread by id</Title>
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