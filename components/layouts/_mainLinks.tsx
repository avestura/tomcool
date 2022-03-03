import React from "react";
import {
    ThemeIcon,
    UnstyledButton,
    Group,
    Text,
    createStyles,
} from "@mantine/core";
import { DrawingPinIcon, HomeIcon, PlusIcon, ThickArrowRightIcon } from "@modulz/radix-icons";
import { useRouter } from "next/router";

interface MainLinkProps {
    icon: React.ReactNode;
    color: string;
    label: string;
    path: string;
}

const useStyles = createStyles((theme) => ({
    button: {
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
        },
    },
}));

function MainLink({ icon, color, label, path }: MainLinkProps) {
    const { classes } = useStyles();
    const router = useRouter();
    return (
        <UnstyledButton onClick={() => router.push(path)} className={classes.button}>
            <Group>
                <ThemeIcon color={color} variant="light">
                    {icon}
                </ThemeIcon>

                <Text size="sm">{label}</Text>
            </Group>
        </UnstyledButton>
    );
}

const data = [
    { icon: <HomeIcon />, color: "blue", label: "Home", path: '/' },
    { icon: <PlusIcon />, color: "lime", label: "New Thread", path: '/new' },
    { icon: <DrawingPinIcon />, color: "violet", label: "Pins", path: '/pins' },
    { icon: <ThickArrowRightIcon />, color: "yellow", label: "Navigate", path: '/goto' },
];

export function MainLinks() {
    const links = data.map((link) => <MainLink {...link} key={link.label} path={link.path} />);
    return <div>{links}</div>;
}
