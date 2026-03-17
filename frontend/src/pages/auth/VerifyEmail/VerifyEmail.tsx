import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBack from "../../../assets/svg/arrowBack.svg?react";
import { useVerify } from "@/utils/hooks/useVerification/useVerification";
import { Controller } from "react-hook-form";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const {
    control,
    handleSubmit,
    onSubmit,
    isPending,
    isResending,
    resendMutation,
    resendCode,
  } = useVerify(email);

  const inputRefs = React.useRef<HTMLInputElement[]>([]);

  const focusNext = (index: number) => {
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const focusPrev = (index: number) => {
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  useEffect(() => {
    if (resendMutation.isSuccess) {
      setCountdown(60);
      setCanResend(false);
    }
  }, [resendMutation.isSuccess]);

  return (
    <div className="w-full max-w-160">
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex cursor-pointer items-center gap-2 text-sm text-gray-500"
        >
          <ArrowBack className="h-5 w-5" /> <span>Back</span>
        </button>

        <span className="text-sm text-gray-400">1/4</span>
      </div>

      <h1 className="mb-2 text-3xl font-normal tracking-wide text-gray-800">
        Verify Email address
      </h1>

      <p className="mb-10 max-w-md text-sm text-gray-500">
        A six digit verification code has been sent to your email address, enter
        it here to verify your account
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 flex justify-center gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Controller
              key={index}
              name="code"
              control={control}
              rules={{
                required: "Code is required",
                minLength: { value: 6, message: "Enter full 6-digit code" },
                pattern: { value: /^\d{6}$/, message: "Only numbers allowed" },
              }}
              render={({ field: { onChange, value = "" } }) => {
                const chars = value.padEnd(6, "").split("").slice(0, 6);

                return (
                  <input
                    ref={(el) => {
                      inputRefs.current[index] = el!;
                    }}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={chars[index] || ""}
                    onChange={(e) => {
                      const input = e.target.value;

                      if (input.length > 1) return;
                      if (input && !/^\d$/.test(input)) return;

                      const newChars = [...chars];
                      newChars[index] = input || "";
                      const newValue = newChars.join("");

                      onChange(newValue);
                      if (input && index < 5) {
                        focusNext(index);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !chars[index] && index > 0) {
                        focusPrev(index);
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pasted = e.clipboardData
                        .getData("text")
                        .replace(/\D/g, "")
                        .slice(0, 6 - index);
                      if (pasted) {
                        const newValue =
                          value + pasted.slice(0, 6 - value.length);
                        onChange(newValue);
                        const nextFocus = Math.min(
                          value.length + pasted.length,
                          5,
                        );
                        inputRefs.current[nextFocus]?.focus();
                      }
                    }}
                    className="h-16 w-16 rounded-lg border border-gray-200 text-center text-xl font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    autoFocus={index === 0}
                  />
                );
              }}
            />
          ))}
        </div>

        <p className="mb-10 text-center text-sm text-gray-500">
          Didn't get the code?{" "}
          {canResend ? (
            <button
              type="button"
              onClick={() => {
                resendCode();
                setCountdown(60);
                setCanResend(false);
              }}
              disabled={isResending}
              className={`font-medium text-indigo-600 hover:underline ${
                isResending ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              {isResending ? "Sending..." : "Resend Code"}
            </button>
          ) : (
            <span className="text-gray-400">
              Resend in {Math.floor(countdown / 60)}:
              {(countdown % 60).toString().padStart(2, "0")}
            </span>
          )}
        </p>

        <button
          type="submit"
          disabled={isPending}
          className={`w-full cursor-pointer rounded-sm bg-linear-to-r from-indigo-500 to-indigo-600 py-3 font-medium text-white transition hover:opacity-95 ${
            isPending ? "cursor-not-allowed opacity-70" : ""
          }`}
        >
          {isPending ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
