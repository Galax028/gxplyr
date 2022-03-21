import { useEffect, useRef, useState } from "react";
import {
    Button,
    Divider,
    Group,
    Select,
    TextInput,
    Title,
} from "@mantine/core";
import { useLocation } from "wouter";
import CursorText from "tabler-icons-react/dist/icons/cursor-text";
import Folder from "tabler-icons-react/dist/icons/folder";
import { Dir, readDir } from "@tauri-apps/api/fs";
import { audioDir } from "@tauri-apps/api/path";

const AddLibrary = () => {
    const libraries: [[string, string]] = JSON.parse(
        localStorage.getItem("libraries")!
    );
    const [_location, setLocation] = useLocation();
    const [validDir, setValidDir] = useState<string>();
    const [folders, setFolders] = useState<string[]>([]);
    const [errors, setErrors] = useState<(string | boolean)[]>([false, false]);
    const nameInput = useRef<HTMLInputElement>(null);
    const folderInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        audioDir().then((dir) => setValidDir(dir));
        readDir(".", { dir: Dir.Audio, recursive: false }).then((data) => {
            data.forEach((folder) => {
                if (!folder.children) return;
                if (
                    libraries.length &&
                    libraries.find((library) =>
                        library[1].includes(folder.name!)
                    )
                )
                    return;
                setFolders((folders) => [...folders, folder.name!]);
            });
        });
    }, []);

    const validateInput = () => {
        !nameInput.current!.value
            ? setErrors((errors) => ["This field is required", errors[1]])
            : setErrors((errors) => [false, errors[1]]);
        !folderInput.current!.value
            ? setErrors((errors) => [errors[0], "This field is required"])
            : setErrors((errors) => [errors[0], false]);
        if (nameInput.current!.value && folderInput.current!.value) {
            localStorage.setItem(
                "libraries",
                JSON.stringify([
                    ...libraries,
                    [nameInput.current!.value, folderInput.current!.value],
                ])
            );
            setLocation("/");
            window.location.reload();
        }
    };

    return (
        <Group direction="column" m={96} grow>
            <Title>Add a Library</Title>
            <Divider />
            <TextInput
                required
                label="Library Name"
                description="Name to be shown on the navbar"
                placeholder="Jazz Music"
                icon={<CursorText />}
                error={errors[0]}
                ref={nameInput}
            />
            <Select
                required
                label="Library Folder"
                description={`A valid folder name in the ${validDir} directory`}
                placeholder="My Jazz Folder"
                data={folders}
                icon={<Folder />}
                error={errors[1]}
                ref={folderInput}
            />
            <Button onClick={validateInput}>Add</Button>
        </Group>
    );
};

export default AddLibrary;
