import * as Yup from "yup";
import React, { useEffect } from "react";
import { useState } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Typography,
  Grid,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Paper from "@mui/material/Paper";
import { loginUser, logoutUser } from "../../api/apiCalls";
import { useDashboardContext } from "./AuthenticationWrapper";

// ----------------------------------------------------------------------

export default function LoginForm({
  onLoginSuccess,
  emailOnly,
}: {
  onLoginSuccess: (
    uid: number,
    CsrfToken: string,
    logoutToken: string,
    roles: string[]
  ) => void;
  emailOnly: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginErrorText, changeLoginErrorText] = useState("");
  const [loginError, changeLoginError] = useState(false);

  const paperStyle = { padding: 20, height: "70vh", margin: "auto" };
  const { setSpinnerStatus } = useDashboardContext();

  const LoginSchema = Yup.object().shape({
    emailOnly: Yup.boolean(),
    username: Yup.string().when("emailOnly", {
      is: true,
      then: Yup.string()
        .email("Email must be a valid email address")
        .required("Email is required"),
      otherwise: Yup.string().required("A username is required"),
    }),
    pass: Yup.string().required("Password is required"),
  });

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  async function handleLogin(
    credentials: { username: string; pass: string },
    actions: FormikHelpers<{
      username: string;
      pass: string;
      remember: boolean;
    }>
  ) {
    const drupalCreds = { name: credentials.username, pass: credentials.pass };
    loginUser(drupalCreds).then((res) => {
      if (res.status === 403) {
        logoutUser().then((res) => {
          if (res.status === 200 || res.status === 302) {
            loginUser(drupalCreds).then((res) => {
              if (res.status === 200) {
                res.json().then((json) => {
                  actions.setSubmitting(false);
                  onLoginSuccess(
                    parseInt(json.current_user.uid, 10),
                    json.csrf_token,
                    json.logout_token,
                    json.current_user.roles
                  );
                });
              } else if (res.status === 400) {
                changeLoginError(true);
                changeLoginErrorText("Unrecognized e-mail or password.");
                actions.setSubmitting(false);
              } else {
                changeLoginError(true);
                changeLoginErrorText(
                  "An unknown error has occurred. Please try again later."
                );
                actions.setSubmitting(false);
              }
            });
          }
        });
      } else if (res.status === 200) {
        res.json().then((json) => {
          actions.setSubmitting(false);
          onLoginSuccess(
            parseInt(json.current_user.uid, 10),
            json.csrf_token,
            json.logout_token,
            json.current_user.roles
          );
        });
      } else if (res.status === 400) {
        changeLoginError(true);
        changeLoginErrorText("Unrecognized e-mail or password.");
        actions.setSubmitting(false);
      } else {
        changeLoginError(true);
        changeLoginErrorText(
          "An unknown error has occurred. Please try again later."
        );
        actions.setSubmitting(false);
      }
    });
  }

  useEffect(() => {
    setSpinnerStatus(false);
  });

  return (
    <Formik
      initialValues={{
        username: "",
        pass: "",
        remember: true,
      }}
      validationSchema={LoginSchema}
      onSubmit={(values, actions) => {
        const creds = { username: values.username, pass: values.pass };
        handleLogin(creds, actions);
      }}
    >
      {({
        touched,
        getFieldProps,
        isSubmitting,
        errors,
        handleSubmit,
        values,
      }) => (
        <Grid container justifyContent="space-around" alignItems="center">
          <Grid item xs={10} lg={4}>
            <Form
              autoComplete="off"
              noValidate
              onSubmit={handleSubmit}
              id="ccd-login-form"
            >
              <Paper elevation={10} style={paperStyle}>
                <Grid item justifyContent="center">
                  <img
                    alt="Internal Login"
                    src="https://ccds3bucket.s3.us-east-2.amazonaws.com/s3fs-public/styles/thumbnail/public/icons/default_person.png"
                  ></img>
                  <h2>Login</h2>
                </Grid>
                <Stack spacing={3}>
                  {loginError && loginErrorText ? (
                    <Typography color="red">{loginErrorText}</Typography>
                  ) : (
                    ""
                  )}
                  <TextField
                    fullWidth
                    autoComplete="username"
                    type="username"
                    label={emailOnly ? "Email address" : "Username"}
                    {...getFieldProps("username")}
                    error={Boolean(touched.username && errors.username)}
                    helperText={touched.username && errors.username}
                  />

                  <TextField
                    fullWidth
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    {...getFieldProps("pass")}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPassword} edge="end">
                            <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={Boolean(touched.pass && errors.pass)}
                    helperText={touched.pass && errors.pass}
                  />
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ my: 2 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...getFieldProps("remember")}
                        checked={values.remember}
                      />
                    }
                    label="Remember me"
                  />

                  {/*<Link component={RouterLink} variant="subtitle2" to="#">*/}
                  {/*  Forgot password?*/}
                  {/*</Link>*/}
                </Stack>

                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Login
                </LoadingButton>
              </Paper>
            </Form>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
}
