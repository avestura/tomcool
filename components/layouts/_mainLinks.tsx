import React from "react";
import {
    ThemeIcon,
    UnstyledButton,
    Group,
    Text,
    createStyles,
} from "@mantine/core";
import {
    DrawingPinIcon,
    GearIcon,
    HomeIcon,
    InfoCircledIcon,
    MixIcon,
    PlusIcon,
    ThickArrowRightIcon,
} from "@modulz/radix-icons";
import { useRouter } from "next/router";
import { useSettings } from "../../lib/settings";

interface MainLinkProps {
    icon: React.ReactNode;
    color: string;
    label: string;
    path: string;
    closeCurtain?: () => void;
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

function MainLink({ icon, color, label, path, closeCurtain }: MainLinkProps) {
    const { classes } = useStyles();
    const router = useRouter();
    return (
        <UnstyledButton
            onClick={() => {
                router.push(path);
                if (closeCurtain) {
                    closeCurtain();
                }
            }}
            className={classes.button}
        >
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
    { icon: <MixIcon />, color: "cyan", label: "Boards", path: "/boards" },
    { icon: <DrawingPinIcon />, color: "violet", label: "Pins", path: "/pins" },
    {
        icon: <ThickArrowRightIcon />,
        color: "yellow",
        label: "Navigate",
        path: "/goto",
    },
    {
        icon: <GearIcon />,
        color: "teal",
        label: "Preferences",
        path: "/settings",
    },
    {
        icon: <InfoCircledIcon />,
        color: "gray",
        label: "About Project",
        path: "/about",
    },
];

export function MainLinks(props: { closeCurtain?: () => void }) {
    const { defaultBoard } = useSettings();
    const links = data.map((link) => (
        <MainLink
            {...link}
            key={link.label}
            path={link.path}
            closeCurtain={props.closeCurtain}
        />
    ));
    return (
        <div>
            <MainLink
                color="blue"
                icon={<HomeIcon />}
                label="Home"
                path={`/b/${defaultBoard}`}
                closeCurtain={props.closeCurtain}
            />
            {links}
        </div>
    );
}
