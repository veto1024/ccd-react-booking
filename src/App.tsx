import ThemeConfig from "./theme/globalStyles";
import { Container } from "@mui/material";
import React from "react";
import { AuthenticationWrapper } from "./components/authentication/AuthenticationWrapper";
// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <Container maxWidth={false} disableGutters>
        <AuthenticationWrapper />
      </Container>
    </ThemeConfig>
  );
}
