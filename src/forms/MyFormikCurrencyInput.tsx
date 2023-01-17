// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import {
  Field,
  FieldHookConfig,
  FieldMetaProps,
  FieldProps,
  FormikBag,
} from "formik";
import React from "react";
import { FormHelperText, FormLabel, Grid } from "@mui/material";
import CurrencyInput from "react-currency-input-field";

export type MyFormikCurrencyInputType = {
  label?: string;
  id?: string;
  CurrencyFieldStyle?: React.CSSProperties | undefined;
  currencyWidth: number | undefined;
  name: string;
  clearOnFocus?: boolean;
  defaultValue: string | number | undefined;
  containerProps?: React.CSSProperties | undefined;
};

export const MyFormikCurrencyInput = (
  props: MyFormikCurrencyInputType & FieldHookConfig<any>
) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const {
    label,
    id,
    CurrencyFieldStyle,
    clearOnFocus,
    defaultValue,
    currencyWidth,
    containerProps,
    ...rest
  } = props;

  const DefaultCurrencyFieldStyle = {
    font: "inherit",
    letterSpacing: "inherit",
    color: "currentColor",
    padding: "4px 0 5px",
    border: 0,
    height: "1.4375em",
    margin: 0,
    display: "block",
    minWidth: 0,
    width: "100%",
    textAlign: "right",
    outline: "none",
  };

  const handleClearOnFocus = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.currentTarget.select();
  };

  const handleValueChange = (
    value: string | undefined,
    name: string | undefined,
    form: FormikBag<any, any>
  ) => {
    form.setFieldValue(name!, value);
    form.setFieldTouched(name);
  };

  return (
    <>
      {label ? <FormLabel htmlFor={id || props.name}>{label}</FormLabel> : null}
      <Grid
        item
        xs={currencyWidth || 6}
        marginY={0}
        paddingY={0}
        {...containerProps}
      >
        <Field name={props.name}>
          {({
            field,
            form,
            meta,
          }: {
            field: FieldProps["field"];
            form: FormikBag<any, any>;
            meta: FieldMetaProps<any>;
          }) => {
            return (
              <>
                <CurrencyInput
                  style={CurrencyFieldStyle || DefaultCurrencyFieldStyle}
                  placeholder={defaultValue ? defaultValue.toString() : ""}
                  decimalsLimit={2}
                  prefix="$"
                  defaultValue={field.value}
                  onFocus={
                    !meta.touched && clearOnFocus
                      ? handleClearOnFocus
                      : undefined
                  }
                  onValueChange={(value, name, values) =>
                    handleValueChange(value, name, form)
                  }
                  {...rest}
                />
                {meta.error ? (
                  <FormHelperText error>{meta.error}</FormHelperText>
                ) : (
                  ""
                )}
              </>
            );
          }}
        </Field>
      </Grid>
    </>
  );
};
