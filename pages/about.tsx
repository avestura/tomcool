import { Title, Text, Anchor, List, Group } from "@mantine/core";

export default function AboutPage() {
    return (
        <Group direction="column" spacing="sm">
            <Title>About Project</Title>
            <Text>
                you can learn more about this project and contribute to it using
                these link:
            </Text>
            <List>
                <List.Item>
                    ImageBoard2 (backend and main ui):&nbsp;
                    <Anchor href="https://github.com/trgwii/imageboard2">
                        trgwii/imageboard2
                    </Anchor>
                </List.Item>
                <List.Item>
                    Alternative React UI (this app):&nbsp;
                    <Anchor href="https://github.com/avestura/tomcool">
                        avestura/tomcool
                    </Anchor>
                </List.Item>
            </List>
        </Group>
    );
}
