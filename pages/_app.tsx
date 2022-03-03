import { AppProps } from "next/app";
import Head from "next/head";
import {
    ColorScheme,
    ColorSchemeProvider,
    MantineProvider,
} from "@mantine/core";
import MainLayout from "../components/layouts/MainLayout";
import { useState } from "react";
import { useColorScheme, useLocalStorageValue } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";

import NProgress from 'nprogress'
import Router from 'next/router'
import 'nprogress/nprogress.css'

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false,
})

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

process.env.FORUM = "https://forums.trgwii.com";

export default function App(props: AppProps) {
    const { Component, pageProps } = props;
    const preferredColorScheme = useColorScheme();
    const [colorScheme, setColorScheme] = useLocalStorageValue<ColorScheme>({
        key: "color-scheme",
        defaultValue: preferredColorScheme,
    });
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

    return (
        <>
            <Head>
                <title>Thomas&apos;s Cool Forum Software</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>

            <ColorSchemeProvider
                colorScheme={colorScheme}
                toggleColorScheme={toggleColorScheme}
            >
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{ colorScheme }}
                >
                    <NotificationsProvider>
                        <MainLayout>
                            <Component {...pageProps} />
                        </MainLayout>
                    </NotificationsProvider>
                </MantineProvider>
            </ColorSchemeProvider>
        </>
    );
}
