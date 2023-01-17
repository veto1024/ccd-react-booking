import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  createFilterOptions,
  FormLabel,
  Grid,
  Stack,
} from "@mui/material";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { MyFormikTextInput } from "../forms/MyFormikTextInput";
import {
  BandNamesType,
  CallerNamesType,
  EventType,
  HostNamesType,
  PeopleAndBandsAPIType,
  SoundTechNamesType,
} from "../types";
import { MyFormikCurrencyInput } from "../forms/MyFormikCurrencyInput";
import React, { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import MyFormikAutoComplete from "../forms/MyFormikAutoComplete";
import { API_URL, postEvent, useApi } from "../api/apiCalls";
import { MyFormikDateTimeInput } from "../forms/MyFormikDateTimeInput";
import {
  useDashboardContext,
  useUserContext,
} from "../components/authentication/AuthenticationWrapper";

export const BookingFormLayout = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validationSchema = Yup.object().shape({
    band: Yup.object().required("The band is required."),
    bandPay: Yup.string().required("The band pay is required"),
    bandTravel: Yup.string(),
    caller: Yup.object().required("The caller is required."),
    callerPay: Yup.string().required("The caller pay is required."),
    callerTravel: Yup.string(),
    soundTech: Yup.object().required("The Sound Tech is required."),
    soundTechPay: Yup.string().required("The sound tech pay is required."),
    host: Yup.object().required("The host is required."),
    eventTitle: Yup.string().required("The event title is required."),
    eventCost: Yup.string().required("The event cost is required"),
    eventDescription: Yup.string().required("The description is required."),
    eventStartTime: Yup.date()
      .min(new Date(), "The start date must be in the future.")
      .required("The start time is required."),
    eventEndTime: Yup.date()
      .min(new Date(), "The end date must be in the future.")
      .required("The end time is required."),
    eventLocationText: Yup.string().required("Enter the location text"),
    eventLocationURL: Yup.string()
      .url("Must be a valid URL.")
      .required("Provide a URL to the location."),
  });

  const { CsrfToken, roles } = useUserContext();
  const { setSpinnerStatus } = useDashboardContext();

  const initialValues = {
    eventStartTime: new Date(),
    eventEndTime: new Date(),
    eventDescription: "",
    eventLocationText: "Decatur Recreation Center",
    eventLocationURL: "https://www.contradance.org/locations",
    eventCost: "Pay as you can",
    eventTitle: "",
    band: "",
    bandPay: "",
    bandTravel: "",
    caller: "",
    callerPay: "",
    callerTravel: "",
    host: "",
    soundTech: "",
    soundTechPay: "",
  };

  const { data: autocompleteData, loading: autocompleteLoading } =
    useApi<PeopleAndBandsAPIType>(
      CsrfToken,
      `${API_URL}/api/booking/event/data/get?bands=1&callers=1&soundTechs=1&hosts=1&_format=json`
    );

  function handleSubmit(values: EventType, actions: FormikHelpers<any>) {
    postEvent(CsrfToken, JSON.stringify(values))
      .then((res) => {
        if (res.status === 200) {
          setSuccessMessage(`${values.eventTitle} created!`);
          actions.resetForm();
        } else {
          setErrorMessage(
            `There was an error communicating with the server: Error code: ${res.status}`
          );
        }
      })
      .then(() => {
        actions.setSubmitting(false);
      })
      .catch((reason) => {
        setErrorMessage(
          `There was an error communicating with the server: Error message: ${reason}`
        );
        actions.setSubmitting(false);
      });
  }

  const handleAutocompleteLoaded = (
    autocompleteData: PeopleAndBandsAPIType
  ) => {
    setSpinnerStatus(false);
    return (
      <PeopleAndBandsInput
        bandOptions={autocompleteData.bandOptions}
        callerOptions={autocompleteData.callerOptions}
        hostOptions={autocompleteData.hostOptions}
        soundTechOptions={autocompleteData.soundTechOptions}
      />
    );
  };

  return (
    <Container maxWidth="lg">
      <Formik
        enableReinitialize={false}
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(true);
          handleSubmit(values, actions);
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Card sx={{ backgroundColor: "#f5f5f5" }}>
              <CardHeader title="Event Booking Page" />
              {successMessage ? (
                <Alert
                  variant="standard"
                  severity="success"
                  onClose={() => setSuccessMessage("")}
                >
                  {successMessage}
                </Alert>
              ) : undefined}
              {errorMessage ? (
                <Alert
                  variant="standard"
                  severity="error"
                  onClose={() => setErrorMessage("")}
                >
                  {errorMessage}
                </Alert>
              ) : undefined}
              <CardContent>
                <Card>
                  <CardContent>
                    <Grid container>
                      <Stack direction="row" width="100%">
                        <Grid item lg={6}>
                          <Grid item lg={12} marginBottom={2}>
                            <MyFormikTextInput
                              name="eventTitle"
                              label="Title"
                              TextFieldProps={{
                                placeholder: "Band Name with Caller",
                                variant: "outlined",
                                fullWidth: true,
                              }}
                            />
                          </Grid>
                          <Grid item lg={12} marginBottom={2}>
                            <MyFormikTextInput
                              label="Event Description"
                              name="eventDescription"
                              TextFieldProps={{
                                placeholder:
                                  "Event details that will appear on the front page and event itself....",
                                variant: "outlined",
                                type: "text",
                                multiline: true,
                                rows: 3,
                                fullWidth: true,
                              }}
                            />
                          </Grid>
                          <Grid item lg={12} marginBottom={2}>
                            <MyFormikTextInput
                              label="Location"
                              name="eventLocationText"
                              clearOnFocus
                              TextFieldProps={{
                                variant: "outlined",
                                type: "text",
                                fullWidth: true,
                              }}
                            />
                          </Grid>
                          <Grid item lg={12} marginBottom={2}>
                            <MyFormikTextInput
                              name="eventLocationURL"
                              label="Location URL"
                              clearOnFocus
                              TextFieldProps={{
                                variant: "outlined",
                                type: "text",
                                fullWidth: true,
                              }}
                            />
                          </Grid>
                          <Grid item lg={12} marginBottom={2}>
                            <MyFormikTextInput
                              name="eventCost"
                              label="Event cost"
                              clearOnFocus
                              TextFieldProps={{
                                placeholder: "Pay as you can",
                                variant: "outlined",
                                type: "text",
                                fullWidth: true,
                              }}
                            />
                          </Grid>
                          <Grid item lg={12}>
                            <EventDateTimeInput />
                          </Grid>
                        </Grid>
                        <Grid item lg={4} marginLeft={2}>
                          {autocompleteLoading ? <p>Loading...</p> : null}
                          {!autocompleteLoading && autocompleteData
                            ? handleAutocompleteLoaded(autocompleteData)
                            : null}
                        </Grid>
                        <Grid item lg={4} marginLeft={4}>
                          <PaymentInput />
                        </Grid>
                      </Stack>
                    </Grid>
                  </CardContent>
                  <CardActions>
                    <Grid container justifyContent="center" columnGap={2}>
                      <Grid item lg={2}>
                        <Button
                          disabled
                          fullWidth
                          variant="contained"
                          color="secondary"
                        >
                          +1 Event (TODO)
                        </Button>
                      </Grid>
                      <Grid item lg={2}>
                        <Button
                          disabled
                          fullWidth
                          variant="contained"
                          color="error"
                        >
                          Delete (TODO)
                        </Button>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>
              </CardContent>
              <CardActions>
                <Grid container justifyContent="center">
                  <Grid item lg={3}>
                    <LoadingButton
                      fullWidth
                      size="medium"
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                    >
                      Submit
                    </LoadingButton>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

const EventDateTimeInput = () => {
  return (
    <>
      <Grid item lg={12} sx={{ marginBottom: 2 }}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Stack direction="row" justifyContent="left">
            {/*<Grid item lg={6}>*/}
            {/*    <MyFormikDateInput name="eventStartDate" label="Event Start Time" />*/}
            {/*</Grid>*/}
            <Grid item lg={9}>
              <MyFormikDateTimeInput
                label="Event Start Time"
                name="eventStartTime"
              />
            </Grid>
          </Stack>
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Stack direction="row" justifyContent="left">
            {/*<Grid item lg={6}>*/}
            {/*    <MyFormikDateInput name="eventEndDate" label="Event End Time" />*/}
            {/*</Grid>*/}
            <Grid item lg={9}>
              <MyFormikDateTimeInput
                label="Event End Time"
                name="eventEndTime"
              />
            </Grid>
          </Stack>
        </LocalizationProvider>
      </Grid>
    </>
  );
};

const PaymentInput = () => {
  const containerProps = {
    padding: 2,
    border: 1,

    borderRadius: 1,
    borderColor: "rgba(145, 158, 171, 0.32)",
  };

  const items = [
    { name: "bandPay", label: "Band Pay" },
    { name: "bandTravel", label: "Band Travel" },
    { name: "callerPay", label: "Caller Pay" },
    { name: "callerTravel", label: "Caller Travel" },
    { name: "soundTechPay", label: "Sound Tech Pay" },
  ];

  return (
    <>
      {items.map((item) => (
        <Grid item lg={12} key={item.name} marginBottom={2}>
          <MyFormikCurrencyInput
            clearOnFocus
            label={item.label}
            name={item.name}
            currencyWidth={12}
            defaultValue="0.00"
            placeholder={item.label}
            containerProps={containerProps}
          />
        </Grid>
      ))}
    </>
  );
};

const PeopleAndBandsInput = (apiData: PeopleAndBandsAPIType) => {
  const bandOptions = Object.values(apiData.bandOptions).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const soundTechOptions = Object.values(apiData.soundTechOptions).sort(
    (a, b) => a.name.localeCompare(b.name)
  );
  const callerOptions = Object.values(apiData.callerOptions).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const hostOptions = Object.values(apiData.hostOptions).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const bandFilter = createFilterOptions<BandNamesType>();
  const callerFilter = createFilterOptions<CallerNamesType>();
  const soundTechFilter = createFilterOptions<SoundTechNamesType>();
  const hostFilter = createFilterOptions<HostNamesType>();

  return (
    <>
      <FormLabel>Talent Selection</FormLabel>
      {/*Band Autocomplete */}
      <Grid item lg={12} marginBottom={2}>
        <MyFormikAutoComplete
          options={bandOptions}
          name="band"
          filter={bandFilter}
          label="Band"
        />
      </Grid>
      {/* Caller Autocomplete */}
      <Grid item lg={12} marginBottom={2}>
        <MyFormikAutoComplete
          options={callerOptions}
          name="caller"
          filter={callerFilter}
          label="Caller"
        />
      </Grid>
      {/* Sound Tech Autocomplete */}
      <Grid item lg={12} marginBottom={2}>
        <MyFormikAutoComplete
          options={soundTechOptions}
          name="soundTech"
          filter={soundTechFilter}
          label="Sound Tech"
        />
      </Grid>
      {/* Host Autocomplete */}
      <Grid item lg={12} marginBottom={2}>
        <MyFormikAutoComplete
          options={hostOptions}
          name="host"
          filter={hostFilter}
          label="Host"
          noSuggestAdd
        />
      </Grid>
    </>
  );
};
