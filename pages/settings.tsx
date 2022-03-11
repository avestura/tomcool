import { Title, Text, Anchor, Group, Accordion, Switch } from "@mantine/core";
import { useLocalStorageValue } from "@mantine/hooks";
import { ShadowIcon } from "@modulz/radix-icons";
import { useSettings } from "../lib/settings";

export default function Settings() {
    const {colorizeReply, toggleColorizeReply} = useSettings()
    return (
        <Group grow direction="column" spacing="sm">
            <Title>Settings</Title>
            <Accordion multiple initialItem={0}>
                <Accordion.Item label="Appearence">
                    <Switch checked={colorizeReply === "true" ? true : false} onChange={toggleColorizeReply} label="Colorize reply hashes (unique color per user hash)" />
                </Accordion.Item>
                <Accordion.Item label="Behaviour">
                    <Switch checked disabled label="Enable developer mode features" />
                </Accordion.Item> 
            </Accordion>
        </Group>
    );
}
