import { useEffect, useRef, useState } from "react";
import {
    Button,
    Center,
    Container,
    Divider,
    Grid,
    Group,
    LoadingOverlay,
    Slider,
    Title,
    Tooltip,
} from "@mantine/core";
import PlayerPlay from "tabler-icons-react/dist/icons/player-play";
import PlayerPause from "tabler-icons-react/dist/icons/player-pause";
import PlayerSkipBack from "tabler-icons-react/dist/icons/player-skip-back";
import PlayerSkipForward from "tabler-icons-react/dist/icons/player-skip-forward";

export const parseLength = (seconds: number): string => {
    seconds = Math.round(seconds);
    const m = String(Math.floor((seconds % 3600) / 60));
    const s = String(Math.floor(seconds % 60));
    return `${m.padStart(2, "0")}:${s.padStart(2, "0")}`;
};

interface PlayerProps {
    src: string;
    title: string;
    author: string;
}

const Player = (props: PlayerProps) => {
    const player = useRef<HTMLAudioElement>(null);
    const [ready, setReady] = useState(false);
    const [paused, setPause] = useState(true);
    const [playTime, setPlayTime] = useState(0);

    useEffect(() => {
        player.current!.src = props.src;
    }, []);

    useEffect(() => {
        switch (paused) {
            case true:
                player.current!.pause();
                break;
            case false:
                player.current!.play();
                break;
        }
    }, [paused]);

    return (
        <Container
            fluid
            sx={(t) => ({
                height: "200px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
                padding: t.spacing.md,
                border: `${t.colors.dark[3]} solid 1px`,
            })}
        >
            <LoadingOverlay visible={!ready} />
            <audio
                ref={player}
                onCanPlay={() => setReady(true)}
                onTimeUpdate={() => setPlayTime(player.current!.currentTime)}
            ></audio>
            {ready && (
                <>
                    <Group position="center" mb="xs">
                        <Title order={3}>{props.author} - {props.title}</Title>
                    </Group>
                    <Grid gutter={0}>
                        <Grid.Col span={1}>
                            <Center>
                                <Title order={5}>{parseLength(playTime)}</Title>
                            </Center>
                        </Grid.Col>
                        <Grid.Col span={10} mt="3px">
                            <Center>
                                <Slider
                                    max={player.current!.duration}
                                    value={playTime}
                                    label={(value) => parseLength(value)}
                                    styles={(t) => ({
                                        root: { width: "100%" },
                                        bar: { background: t.colors.green[6] },
                                        thumb: {
                                            width: 1,
                                            height: 1,
                                            borderColor: t.colors.green[6],
                                        },
                                        label: {
                                            background: t.colors.gray[3],
                                            color: t.black,
                                        },
                                    })}
                                />
                            </Center>
                        </Grid.Col>
                        <Grid.Col span={1}>
                            <Center>
                                <Title order={5}>
                                    {parseLength(player.current!.duration)}
                                </Title>
                            </Center>
                        </Grid.Col>
                    </Grid>
                </>
            )}
            <Divider mt="xs" mb="md" />
            <Group position="center">
                <Tooltip label="Rewind 10s" withArrow>
                    <Button
                        compact
                        variant="outline"
                        size="md"
                        onClickCapture={() => {
                            player.current!.currentTime -= 10;
                            setPause(false);
                        }}
                    >
                        <PlayerSkipBack />
                    </Button>
                </Tooltip>
                <Tooltip label={paused ? "Play" : "Pause"} withArrow>
                    <Button
                        compact
                        variant="outline"
                        size="md"
                        onClickCapture={() => setPause(!paused)}
                    >
                        {paused ? <PlayerPlay /> : <PlayerPause />}
                    </Button>
                </Tooltip>
                <Tooltip label="Forward 10s" withArrow>
                    <Button
                        compact
                        variant="outline"
                        size="md"
                        onClickCapture={() => {
                            player.current!.currentTime += 10;
                            setPause(false);
                        }}
                    >
                        <PlayerSkipForward />
                    </Button>
                </Tooltip>
            </Group>
        </Container>
    );
};

export default Player;
