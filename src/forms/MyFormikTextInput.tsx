import { FieldHookConfig, useField } from "formik";
import React from "react";
import {
  FormHelperText,
  FormLabel,
  TextField,
  TextFieldProps,
} from "@mui/material";

type MyFormikTextInputProps = {
  name: string;
  id?: string;
  label?: string;
  clearOnFocus?: boolean;
  TextFieldProps?: TextFieldProps;
};
export const MyFormikTextInput = ({
  id,
  clearOnFocus,
  TextFieldProps,
  ...rest
}: MyFormikTextInputProps & FieldHookConfig<any>) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)

  const [field, meta] = useField(rest);
  const handleClearOnFocus = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.currentTarget.select();
  };

  return (
    <>
      <FormLabel htmlFor={id || rest.name}>{rest.label}</FormLabel>
      <TextField
        onFocus={
          !meta.touched && !meta.initialTouched && clearOnFocus
            ? handleClearOnFocus
            : undefined
        }
        {...TextFieldProps}
        {...field}
        error={!!(meta.touched && meta.error)}
      />
      {meta.error ? <FormHelperText error>{meta.error}</FormHelperText> : ""}
    </>
  );
};
