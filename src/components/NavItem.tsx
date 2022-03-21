import { ReactNode, useEffect } from "react";
import { Menu, ThemeIcon, Title, UnstyledButton } from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { Link, useRoute } from "wouter";
import CursorText from "tabler-icons-react/dist/icons/cursor-text";
import Trash from "tabler-icons-react/dist/icons/trash";

interface NavItemProps {
    text: string;
    to: string;
    children: ReactNode;
}

const NavItem = (props: NavItemProps) => {
    const [match] = useRoute(props.to);
    const [opened, handlers] = useDisclosure(false);
    const btnRef = useClickOutside<HTMLDivElement>(() => handlers.close());

    useEffect(() => {
        btnRef.current!.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            handlers.open();
        });
        return () => {
            btnRef.current!.removeEventListener("contextmenu", () => {});
        };
    }, []);

    return (
        <Link href={props.to}>
            <UnstyledButton
                sx={(t) => ({
                    display: "flex",
                    width: "90%",
                    alignItems: "center",
                    gap: t.spacing.md,
                    padding: t.spacing.xs,
                    margin: t.spacing.xs,
                    border: `${
                        match ? t.colors.green[6] : t.colors.blue[6]
                    } solid 1px`,
                    borderRadius: t.radius.md,
                    cursor: "pointer",
                    "&:hover": {
                        backgroundColor: t.colors.dark[6],
                    },
                })}
            >
                <Menu
                    withArrow
                    opened={opened}
                    ref={btnRef}
                    control={
                        <ThemeIcon size="lg" color={match ? "green" : "blue"}>
                            {props.children}
                        </ThemeIcon>
                    }
                >
                    <Menu.Label>Modify Library</Menu.Label>
                    <Menu.Item icon={<CursorText size={14} />}>
                        Rename Library
                    </Menu.Item>
                    <Menu.Item color="red" icon={<Trash size={14} />}>
                        Remove Library
                    </Menu.Item>
                </Menu>
                <Title order={3}>{props.text}</Title>
            </UnstyledButton>
        </Link>
    );
};

export default NavItem;
