import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "@lo/App";

if (!localStorage.getItem("libraries")) localStorage.setItem("libraries", "[]")

ReactDOM.render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.getElementById("root")
);
