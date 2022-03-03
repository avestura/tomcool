import { ReactElement } from "react";
import { useState } from "react";
import {
    ActionIcon,
    AppShell,
    Burger,
    Group,
    Header,
    MediaQuery,
    Navbar,
    Text,
    useMantineColorScheme,
    useMantineTheme,
} from "@mantine/core";
import { MoonIcon, SunIcon } from "@modulz/radix-icons";
import { MainLinks } from "./_mainLinks";
import { User } from "./_user";

export default function MainLayout(props: { children: React.ReactNode }) {
    const [opened, setOpened] = useState(false);
    const theme = useMantineTheme();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    const closeCurtain = () => setOpened(false)
    return (
        <AppShell
            // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
            navbarOffsetBreakpoint="sm"
            // fixed prop on AppShell will be automatically added to Header and Navbar
            fixed
            navbar={
                <Navbar
                    padding="md"
                    // Breakpoint at which navbar will be hidden if hidden prop is true
                    hiddenBreakpoint="sm"
                    // Hides navbar when viewport size is less than value specified in hiddenBreakpoint
                    hidden={!opened}
                    // when viewport size is less than theme.breakpoints.sm navbar width is 100%
                    // viewport size > theme.breakpoints.sm – width is 300px
                    // viewport size > theme.breakpoints.lg – width is 400px
                    width={{ sm: 250, lg: 250 }}
                >
                    <Navbar.Section grow mt="xs">
                        <MainLinks closeCurtain={closeCurtain} />
                    </Navbar.Section>
                    <Navbar.Section>
                        <User closeCuratin={closeCurtain} />
                    </Navbar.Section>
                </Navbar>
            }
            header={
                <Header height={70} padding="md">
                        <Group
                            style={{
                                height: "100%",
                                marginTop: 0,
                                marginBottom: 0,
                                paddingLeft: 20,
                                paddingRight: 20,
                            }}
                            position="apart"
                        >
                            <MediaQuery
                                largerThan="sm"
                                styles={{ display: "none" }}
                            >
                                <Burger
                                    opened={opened}
                                    onClick={() => setOpened((o) => !o)}
                                    size="sm"
                                    color={theme.colors.gray[6]}
                                    mr="xl"
                                />
                            </MediaQuery>
                            <Text>Thomas&apos;s Cool Forum Software</Text>
                            <ActionIcon
                                variant="default"
                                onClick={() => toggleColorScheme()}
                                size={30}
                            >
                                {colorScheme === "dark" ? (
                                    <SunIcon />
                                ) : (
                                    <MoonIcon />
                                )}
                            </ActionIcon>
                        </Group>
                </Header>
            }
        >
            {props.children}
        </AppShell>
    );
}
