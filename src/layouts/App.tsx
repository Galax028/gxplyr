import { Suspense, lazy } from "react";
import { AppShell, MantineProvider, Title } from "@mantine/core";
import { useWindowEvent } from "@mantine/hooks";
import { Route } from "wouter";
import LoadingScreen from "@lo/LoadingScreen";
import Nav from "@lo/Nav";

const MainMenu = lazy(() => import("@lo/MainMenu"));
const Library = lazy(() => import("@lo/Library"));
const AddLibrary = lazy(() => import("@lo/AddLibrary"));

const App = () => {
    let libraries: [[string?, string?]?] = JSON.parse(
        localStorage.getItem("libraries")!
    );
    if (!libraries) libraries = [];

    useWindowEvent("contextmenu", (e) => {
        if (import.meta.env.MODE !== "development") e.preventDefault();
    });

    return (
        <MantineProvider
            withNormalizeCSS
            withGlobalStyles
            theme={{
                colorScheme: "dark",
                fontFamily: "Poppins",
                focusRing: "never",
                headings: {
                    fontFamily: "Poppins",
                    fontWeight: 700,
                },
            }}
            styles={{
                Title: { root: { userSelect: "none", color: "#fff" } },
                Text: { root: { userSelect: "none", color: "#fff" } },
            }}
        >
            <AppShell navbar={<Nav libraries={libraries} />}>
                <Route path="/loader">
                    <LoadingScreen />
                </Route>
                <Route path="/">
                    <Suspense fallback={<LoadingScreen />}>
                        <MainMenu />
                    </Suspense>
                </Route>
                {libraries.map((library, index) => (
                    <Route path={`/lib/${index}`} key={index}>
                        <Suspense fallback={<LoadingScreen />}>
                            <Library library={library!} />
                        </Suspense>
                    </Route>
                ))}
                <Route path="/add">
                    <Suspense fallback={<LoadingScreen />}>
                        <AddLibrary />
                    </Suspense>
                </Route>
            </AppShell>
        </MantineProvider>
    );
};

export default App;
