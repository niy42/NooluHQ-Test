"use client";

import { type ChangeEvent, type ReactNode, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  type BaseTextFieldProps,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField as MUITextField,
  ThemeProvider,
} from "@mui/material";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";

import classNames from "classnames";

import EyeHideIcon from "../../assets/svg/eyeHide.svg?react";
import EyeShowIcon from "../../assets/svg/eyeShow.svg?react";
import SearchIcon from "../../assets/svg/searchIcon.svg?react";
import CheckCircleIcon from "../../assets/svg/successCheckIcon.svg?react";

import theme from "../../theme/muiTheme";
import "./textField.css";

export interface TextFieldProps<
  T extends FieldValues = FieldValues,
> extends BaseTextFieldProps {
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;

  errorText?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;

  isSearch?: boolean;
  readOnly?: boolean;
  labelOnTop?: boolean;

  isLoading?: boolean;
  isRounded?: boolean;
  isSuccess?: boolean;
  isError?: boolean;

  className?: string;
  labelClassName?: string;
  errorTextClassName?: string;
  inputClasses?: string;

  min?: number;
  max?: number;
  height?: string | number;

  // RHF
  control?: Control<T>;
  name?: Path<T>;
  rules?: RegisterOptions<T>;
}

export const CustomTextField = <T extends FieldValues = FieldValues>(
  props: TextFieldProps<T>,
) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    type,
    label,
    endIcon,
    startIcon,
    errorText,
    labelOnTop,
    isRounded,
    isLoading,
    isSuccess,
    readOnly,
    isSearch,
    isError,
    className,
    placeholder,
    labelClassName,
    inputClasses,
    errorTextClassName,
    min,
    max,
    variant = "outlined",
    control,
    name,
    rules,
    height,
    ...rest
  } = props;

  const togglePassword = () => setShowPassword((prev) => !prev);

  const renderEndIcon = () => {
    if (type === "password") {
      return (
        <IconButton onClick={togglePassword}>
          {showPassword ? (
            <EyeShowIcon className="text-signup-eye" />
          ) : (
            <EyeHideIcon className="text-signup-eye" />
          )}
        </IconButton>
      );
    }

    if (isLoading) {
      return (
        <ThemeProvider theme={theme}>
          <CircularProgress size={20} thickness={6} disableShrink />
        </ThemeProvider>
      );
    }

    if (isSuccess)
      return <CheckCircleIcon className="successIcon" aria-hidden="true" />;

    if (isError)
      return <CancelIcon className="dangerIcon" aria-hidden="true" />;

    return endIcon || null;
  };

  const renderField = (fieldProps: any, fieldError?: string) => (
    <FormControl error={!!fieldError || !!errorText || isError} fullWidth>
      {labelOnTop && (
        <label
          className={classNames(
            "bd-text-field-label mb-3 text-xs font-medium text-gray-600",
            labelClassName,
          )}
        >
          {label}
        </label>
      )}

      <MUITextField
        {...rest}
        {...fieldProps}
        placeholder={placeholder}
        label={!labelOnTop ? label : undefined}
        variant={variant}
        type={showPassword ? "text" : type}
        className={classNames(
          "text-dark!",
          { "bd-text-field": !isSearch },
          className,
        )}
        InputProps={{
          startAdornment: (startIcon || isSearch) && (
            <InputAdornment position="start">
              {startIcon || (isSearch && <SearchIcon />)}
            </InputAdornment>
          ),

          endAdornment: (
            <InputAdornment position="end">{renderEndIcon()}</InputAdornment>
          ),

          classes: {
            notchedOutline: classNames({
              "border-none!": isSearch,
              "border-outline-color! border! border-solid!":
                variant === "outlined",
            }),
          },

          className: classNames(
            "text-dark!",
            {
              "rounded-full!": isRounded,
              "h-[52px]!": !isSearch,
              "bg-white rounded-full! h-[46px]!": isSearch,
            },
            inputClasses,
          ),

          inputProps: {
            className: classNames(
              "placeholder:text-sm",
              isSearch ? "!placeholder-dark !placeholder:font-light" : "",
            ),
            ...props.inputProps,
            min,
            max,
            readOnly,
          },
        }}
      />

      {(fieldError || errorText) && (
        <FormHelperText
          className={classNames("relative -left-3", errorTextClassName)}
        >
          {fieldError || errorText}
        </FormHelperText>
      )}
    </FormControl>
  );

  // RHF MODE
  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field, fieldState }) =>
          renderField(field, fieldState.error?.message)
        }
      />
    );
  }

  // Standalone mode
  return renderField({});
};

CustomTextField.displayName = "TextField";
