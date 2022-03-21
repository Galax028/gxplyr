import { useEffect, useState } from "react";
import { Box, Loader, Title } from "@mantine/core";

const LoadingScreen = () => {
    return (
        <Box
            sx={(t) => ({
                height: "100%",
                display: "flex",
                gap: t.spacing.xs,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            })}
        >
            <Loader size={116} />
            <Title>Loading</Title>
        </Box>
    );
};

export default LoadingScreen;
