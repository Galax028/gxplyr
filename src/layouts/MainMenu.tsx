import { Container, Title } from "@mantine/core";
import Music from "tabler-icons-react/dist/icons/music";

const MainMenu = () => {
    return (
        <Container
            fluid
            sx={(t) => ({
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontSize: t.fontSizes.lg,
                color: t.colors.dark[3],
                userSelect: "none",
            })}
        >
            <Music size={384} />
            <Title
                mb="xl"
                sx={(t) => ({ fontSize: "72px", color: t.colors.dark[3] })}
            >
                GXPlyr
            </Title>
        </Container>
    );
};

export default MainMenu;
