import { MouseEventHandler, useState } from "react";
import { Container, Grid, Title, UnstyledButton } from "@mantine/core";
import FileMusic from "tabler-icons-react/dist/icons/file-music";

interface LibraryItemProps {
    name: string;
    filename: string;
    author: string;
    duration: number;
    active?: boolean;
    onClick: MouseEventHandler<HTMLButtonElement>;
}

const LibraryItem = (props: LibraryItemProps) => {
    const [duration, setDuration] = useState("");
    import("@comps/Player").then((player) =>
        setDuration(player.parseLength(props.duration))
    );

    return (
        <Container
            fluid
            sx={(t) => ({
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: props.active ? t.colors.dark[6] : "",
                border: `${t.colors.dark[3]} solid 1px`,
                "&:hover": {
                    backgroundColor: t.colors.dark[6],
                },
            })}
        >
            <UnstyledButton
                sx={(t) => ({ padding: t.spacing.xs })}
                onClick={props.onClick}
            >
                <Grid columns={12} align="center">
                    <Grid.Col span={1} p="xs">
                        <FileMusic size={50} />
                    </Grid.Col>
                    <Grid.Col span={10} p="xs">
                        <Title order={2}>{props.author} - {props.name}</Title>
                        <Title order={6}>{props.filename}</Title>
                    </Grid.Col>
                    <Grid.Col span={1} p="xs">
                        <Title order={5}>{duration}</Title>
                    </Grid.Col>
                </Grid>
            </UnstyledButton>
        </Container>
    );
};

export default LibraryItem;
