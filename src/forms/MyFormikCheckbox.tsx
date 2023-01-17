import { FieldHookConfig, useField } from "formik";
import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";

export type MyFormikCheckboxType = {
  label: string;
  setFieldValue: any;
  defaultValue: boolean;
  labelPlacement: "end" | "start" | "top" | "bottom" | undefined;
};
export const MyFormikCheckbox = (
  props: MyFormikCheckboxType & FieldHookConfig<any>
) => {
  const [field, meta] = useField({ ...props, type: "checkbox" });

  return (
    <>
      <FormControlLabel
        labelPlacement={props.labelPlacement ? props.labelPlacement : "end"}
        defaultChecked={Boolean(props.defaultValue)}
        control={<Checkbox />}
        label={props.label}
        {...field}
      />
    </>
  );
};
