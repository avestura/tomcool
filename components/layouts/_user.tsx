import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PersonIcon } from '@modulz/radix-icons';
import { UnstyledButton, Group, Avatar, Text, createStyles } from '@mantine/core';
import useSWR from 'swr';
import { useRouter } from 'next/router';

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '100%',
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },
}));

export function User() {
  const { classes, theme } = useStyles();
  const router = useRouter()

  const { data, error } = useSWR('https://forums.trgwii.com/api/self/hash', fetch)

  return (
    <div
      style={{
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${
          theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
      }}
    >
      <UnstyledButton onClick={() => router.push('/user')} className={classes.user}>
        <Group>
          <PersonIcon />
          <div style={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              Anonymous
            </Text>
            <Text color="dimmed" size="xs">
              User Hash: { error && <i>failed to fetch</i>} { !error && !data && <i>loading...</i>} { data && <>{JSON.stringify(data)}</>}
            </Text>
          </div>

          {theme.dir === 'ltr' ? (
            <ChevronRightIcon width={18} height={18} />
          ) : (
            <ChevronLeftIcon width={18} height={18} />
          )}
        </Group>
      </UnstyledButton>
    </div>
  );
}