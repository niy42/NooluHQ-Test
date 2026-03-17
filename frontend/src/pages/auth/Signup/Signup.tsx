"use client";

import { Stack } from "@mui/material";
import { CustomTextField } from "../../../components/TextField/TextField";
import Google from "../../../assets/svg/google-icon.svg?react";
import { useRegister } from "@/utils/hooks/useRegistration/useRegistration";

export default function SignupForm() {
  const { control, handleSubmit, watch, onSubmit, isPending } = useRegister();
  const password = watch("password");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-130 max-w-160">
      <div className="flex justify-end font-sans text-sm text-gray-400">
        1/4
      </div>
      <h2 className="mt-2 text-3xl font-normal tracking-wide text-gray-800">
        Let&apos;s start with the basics
      </h2>
      <p className="mt-4 mb-10 text-sm text-gray-500">
        Enter your email and set a secure password.
      </p>

      <Stack spacing={3}>
        <CustomTextField
          control={control}
          name="email"
          label="Email address"
          labelOnTop
          placeholder="Your email address"
          rules={{ required: "Email is required" }}
        />
        <CustomTextField
          control={control}
          name="password"
          type="password"
          label="Create password"
          labelOnTop
          placeholder="Create your password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          }}
        />
        <CustomTextField
          control={control}
          name="confirmPassword"
          type="password"
          label="Confirm password"
          labelOnTop
          placeholder="Confirm your password"
          rules={{
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          }}
        />
      </Stack>

      <button
        type="submit"
        disabled={isPending}
        className={`mt-10 w-full cursor-pointer rounded-sm py-3 font-medium text-white transition hover:opacity-95 ${
          isPending
            ? "cursor-not-allowed bg-gray-400"
            : "bg-linear-to-r from-indigo-500 to-indigo-600"
        }`}
      >
        {isPending ? "Creating Account..." : "Create Account"}
      </button>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <span className="cursor-pointer font-medium text-indigo-600">
          Login
        </span>
      </p>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-200"></div>
        <span className="text-xs text-gray-400">OR</span>
        <div className="h-px flex-1 bg-gray-200"></div>
      </div>

      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <Google className="h-5 w-5" />
        Continue with Google
      </button>
    </form>
  );
}
