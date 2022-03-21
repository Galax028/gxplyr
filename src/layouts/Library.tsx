import { Suspense, lazy, useEffect, useState } from "react";
import { Container, Loader, ScrollArea, Title } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { Dir, FileEntry, readBinaryFile, readDir } from "@tauri-apps/api/fs";
import { Command } from "@tauri-apps/api/shell";
import LibraryItem from "@comps/LibraryItem";
import mimes from "@assets/mimetypes.json";

const Player = lazy(() => import("@comps/Player"));

interface Entry {
    name: string;
    filename: string;
    author: string;
    duration: number;
    uri?: string;
    index: number;
}

interface LibraryProps {
    library: [string?, string?];
}

const Library = (props: LibraryProps) => {
    const libDir = props.library[1]!;
    const { height } = useViewportSize();
    const [currentEntry, setCurrentEntry] = useState<Entry>({
        name: "",
        filename: "",
        author: "",
        duration: 0,
        uri: undefined,
        index: 0,
    });
    const [entries, setEntries] = useState<Entry[]>([]);
    const [fetchedEntries, setFetchedEntries] = useState<FileEntry[]>([]);
    const [ready, setReady] = useState<boolean[]>([false, false]);

    useEffect(() => {
        readDir(libDir, { dir: Dir.Audio }).then((data) => {
            setFetchedEntries(data);
        });
    }, []);
    useEffect(() => {
        let cancelled = false;
        if (fetchedEntries.length !== 0 && !cancelled) {
            fetchedEntries.forEach((entry, index) => {
                const cmd = Command.sidecar("bin/backend", [
                    "parse",
                    entry.path,
                ]);
                let stdout = "";
                cmd.stdout.on("data", (d) => (stdout += d));
                cmd.on("close", () => {
                    const parsedEntry = JSON.parse(stdout);
                    setEntries((entries) => [
                        {
                            name: parsedEntry.title,
                            filename: parsedEntry.filename,
                            author: parsedEntry.author,
                            duration: parsedEntry.duration,
                            index: index,
                        },
                        ...entries,
                    ]);
                });
                cmd.execute();
            });
        }
        return () => {
            cancelled = true;
        };
    }, [fetchedEntries]);
    useEffect(() => {
        let cancelled = false;
        if (
            entries.length === fetchedEntries.length &&
            entries.length > 0 &&
            !cancelled
        ) {
            let firstEntry = entries.find((entry) => entry.index === 0)!;
            readBinaryFile(`${libDir}/${firstEntry.filename}`, {
                dir: Dir.Audio,
            }).then((arr) => {
                setCurrentEntry({
                    ...firstEntry,
                    uri: URL.createObjectURL(
                        new Blob([arr], {
                            type: mimes[
                                firstEntry.filename.slice(
                                    ((firstEntry.filename.lastIndexOf(".") -
                                        1) >>>
                                        0) +
                                        2
                                )
                            ],
                        })
                    ),
                });
            });
        }
        return () => {
            cancelled = true;
        };
    }, [entries]);
    useEffect(() => {
        if (fetchedEntries.length === entries.length) {
            setEntries(entries.sort((a, b) => a.index - b.index));
            setReady((ready) => [true, ready[1]]);
        }
    }, [entries]);
    useEffect(() => {
        if (currentEntry.uri !== undefined)
            setReady((ready) => [ready[0], true]);
    }, [currentEntry]);

    const switchEntry = (entry: Entry) => {
        setReady((ready) => [ready[0], false]);
        URL.revokeObjectURL(currentEntry.uri!);
        readBinaryFile(`${libDir}/${entry.filename}`, {
            dir: Dir.Audio,
        }).then((arr) => {
            setCurrentEntry({
                ...entry,
                uri: URL.createObjectURL(
                    new Blob([arr], {
                        type: mimes[
                            entry.filename.slice(
                                ((entry.filename.lastIndexOf(".") - 1) >>> 0) +
                                    2
                            )
                        ],
                    })
                ),
            });
        });
    };

    return (
        <Container fluid>
            <ScrollArea style={{ height: height - 232 }}>
                {ready[0] ? (
                    entries.map((entry, index) => (
                        <LibraryItem
                            onClick={() => {
                                switchEntry(
                                    entries.find((en) => en.index === index)!
                                );
                            }}
                            name={entry.name}
                            filename={entry.filename}
                            author={entry.author}
                            duration={entry.duration}
                            active={entry.name === currentEntry.name}
                            key={index}
                        />
                    ))
                ) : (
                    <Container
                        fluid
                        sx={(t) => ({
                            height: "200px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            border: `${t.colors.dark[3]} solid 1px`,
                        })}
                    >
                        <Loader />
                        <Title>Loading Library Entries</Title>
                    </Container>
                )}
            </ScrollArea>
            {ready[1] ? (
                <Suspense fallback={null}>
                    <Player
                        src={currentEntry.uri!}
                        title={currentEntry.name}
                        author={currentEntry.author}
                    />
                </Suspense>
            ) : (
                <Container
                    fluid
                    sx={(t) => ({
                        height: "200px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        border: `${t.colors.dark[3]} solid 1px`,
                    })}
                >
                    <Loader />
                    <Title order={5}>
                        Reading Audio File, Do Not Click Library Entries!
                    </Title>
                </Container>
            )}
        </Container>
    );
};

export default Library;
