import {
    Button,
    Center,
    Divider,
    Grid,
    Navbar,
    ThemeIcon,
    Title,
} from "@mantine/core";
import Disc from "tabler-icons-react/dist/icons/disc";
import Home from "tabler-icons-react/dist/icons/home";
import Music from "tabler-icons-react/dist/icons/music";
import Plus from "tabler-icons-react/dist/icons/plus";
import { Link, useRoute } from "wouter";
import NavItem from "@comps/NavItem";

interface NavProps {
    libraries: [[string?, string?]?];
}

const Nav = (props: NavProps) => {
    return (
        <Navbar width={{ base: 300 }}>
            <Navbar.Section m="md" mb="xs">
                <Center>
                    <ThemeIcon
                        variant="gradient"
                        gradient={{ from: "orange", to: "grape" }}
                        size="xl"
                        radius="xl"
                    >
                        <Music size={30} />
                    </ThemeIcon>
                    <Title ml="xs">GXPlyr</Title>
                </Center>
            </Navbar.Section>
            <Divider my="xs" />
            <Navbar.Section mt="xs" grow>
                <Grid mx="xs">
                    <Grid.Col span={6}>
                        <Title order={5}>My Libraries</Title>
                    </Grid.Col>
                    <Grid.Col span={2} offset={4}>
                        <Link href="/">
                            <Button
                                variant="outline"
                                color={useRoute("/")[0] ? "green" : "blue"}
                                compact
                            >
                                <Home size={18} />
                            </Button>
                        </Link>
                    </Grid.Col>
                </Grid>
                {props.libraries.map((lib, index) => (
                    <NavItem
                        text={lib![0]!}
                        to={`/lib/${index}`}
                        key={index}
                    >
                        <Disc />
                    </NavItem>
                ))}
                <NavItem text="Add Library" to="/add">
                    <Plus />
                </NavItem>
            </Navbar.Section>
        </Navbar>
    );
};

export default Nav;
