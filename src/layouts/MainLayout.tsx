import { Container, styled } from "@mui/material";
import CCDNavbar from "../components/CCDNavbar";
import React from "react";
import { BookingFormLayout } from "./BookingFormLayout";

export const MainLayout = () => {
  const StyledMainContainer = styled(Container)({
    backgroundImage: `url("https://www.contradance.org/themes/custom/ccd_bs/images/layout/bgimages/wood.jpg")`,
    backgroundRepeat: "repeat",
    zIndex: -99,
    backgroundAttachment: "fixed",
    minHeight: "100vh",
  });

  return (
    <StyledMainContainer maxWidth={false}>
      <>
        <CCDNavbar />
        <Container maxWidth="lg">
          <BookingFormLayout />
        </Container>
      </>
    </StyledMainContainer>
  );
};
