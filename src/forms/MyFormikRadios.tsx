import { ErrorMessage, FieldHookConfig, useField } from "formik";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import React from "react";

type MyFormikRadiosType = {
  defaultValue?: string | number | boolean | undefined;
  inline: boolean;
  text: string | number | boolean | undefined;
  label: string;
  name: string;
  required?: boolean;
  options: Array<BinaryOptionsType>;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
};

type BinaryOptionsType = {
  value: string | boolean | number;
  label: string | boolean | number;
};

export const MyFormikRadios = (
  props: MyFormikRadiosType & FieldHookConfig<any>
) => {
  // React treats radios and checkbox inputs differently other input types, select, and textarea.
  // Formik does this too! When you specify `type` to useField(), it will
  // return the correct bag of props for you -- a `checked` prop will be included
  // in `field` alongside `name`, `value`, `onChange`, and `onBlur`

  const [field, meta] = useField({ ...props, type: "radios" });
  return (
    <>
      <FormLabel>
        <QuestionWithButtons
          {...props}
          {...field}
          defaultValue={props.defaultValue ? props.defaultValue : undefined}
        />
      </FormLabel>
      {meta.touched && meta.error ? (
        <ErrorMessage component="span" name={props.name}>
          {meta.error.toString}
        </ErrorMessage>
      ) : null}
    </>
  );
};

const QuestionWithButtons = (props: MyFormikRadiosType, ...rest: any) => {
  const [checkedVal, changeCheckedVal] = useState(props.defaultValue);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (val === "true" || val === "false") {
      if (val === "true") {
        changeCheckedVal(true);
      } else {
        changeCheckedVal(false);
      }
    } else {
      changeCheckedVal(val);
    }
  }

  return (
    <FormControl
      {...(props.inline
        ? { sx: { flexDirection: "row", alignItems: "center", my: 0.5 } }
        : {
            sx: {
              flexDirection: "column",
              my: 0,
            },
          })}
      fullWidth
    >
      {props.text ? (
        <Grid item {...(props.inline ? { xs: 9 } : { xs: 12 })}>
          <FormLabel component="legend">{props.text}</FormLabel>
        </Grid>
      ) : (
        ""
      )}
      <Grid item {...(props.inline && props.text ? { xs: 3 } : { xs: 12 })}>
        <RadioGroup
          row
          aria-label={props.label}
          name={`${props.name}` || `${props.label}`}
          onChange={(event) => {
            props.setFieldValue(
              props.name,
              str2bool(event.currentTarget.value)
            );
          }}
        >
          {props.options.map((option, index) => (
            <FormControlLabel
              key={index}
              sx={{ width: !props.inline ? "100%" : "auto" }}
              name={props.label || props.name}
              value={option.value}
              control={
                <Radio
                  checked={option.value === checkedVal}
                  onChange={(e) => handleChange(e)}
                  required={props.required}
                />
              }
              label={<Typography width="100%">{option.label}</Typography>}
            />
          ))}
        </RadioGroup>
      </Grid>
    </FormControl>
  );
};

export default QuestionWithButtons;

const str2bool = (value: string) => {
  if (value) {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return value;
};
