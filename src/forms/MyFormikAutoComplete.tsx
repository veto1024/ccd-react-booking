import React from "react";
import {
  Autocomplete,
  FilterOptionsState,
  FormHelperText,
  TextField,
} from "@mui/material";
import { Field, FieldMetaProps, FieldProps, FormikBag } from "formik";

type MyFormikAutoCompleteType = {
  options: any;
  name: string;
  noSuggestAdd?: boolean;
  label: string;
  filter: (arg0: any, arg1: FilterOptionsState<any>) => any[];
};

export const MyFormikAutoComplete = ({
  options,
  name,
  filter,
  label,
  noSuggestAdd,
}: MyFormikAutoCompleteType) => {
  return (
    <>
      <Field name={name}>
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
              <Autocomplete
                freeSolo
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                onChange={(event, newValue) =>
                  form.setFieldValue(name, newValue)
                }
                id={`${name}-autocomplete-box`}
                options={options}
                sx={{ width: "100%" }}
                value={field.value}
                renderOption={(props, option) => (
                  <li {...props}>{option.name}</li>
                )}
                renderInput={(params) => (
                  <TextField label={label} {...params} />
                )}
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === "string") {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    return option.inputValue;
                  }
                  // Regular option
                  return option.name;
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some(
                    (option) => inputValue === option.name
                  );
                  if (inputValue !== "" && !isExisting && !noSuggestAdd) {
                    filtered.push({
                      inputValue,
                      name: `Add "${inputValue}"`,
                    });
                  }
                  return filtered;
                }}
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
    </>
  );
};

export default MyFormikAutoComplete;
