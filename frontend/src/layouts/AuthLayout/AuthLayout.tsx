import { Outlet } from "react-router-dom";
import DiagLogo from "../../assets/svg/diag.svg?react";
import StepIndicator from "@/components/StepIndicator/StepIndicator";

export default function AuthLayout() {
  return (
    <>
      <div className="fixed z-10 mb-16 flex w-full items-center gap-2 bg-white px-12 py-5">
        <DiagLogo />
        <span className="text-lg font-semibold text-gray-700">DIAG</span>
      </div>{" "}
      <div className="min-h-screen bg-gray-50 px-12 py-16">
        <div className="mx-auto flex min-h-[90vh] w-auto justify-between gap-16 py-20">
          <div className="flex flex-col items-start justify-start">
            <div className="max-w-md">
              <h1 className="text-4xl leading-tight font-semibold text-gray-800">
                Let&apos;s get you set up in just 4 steps
              </h1>

              <p className="mt-6 text-gray-500">
                We'll keep it short and simple, just what we need to personalize
                your experience.
              </p>
            </div>
            <div className="mt-12">
              <StepIndicator />
            </div>
          </div>

          <div className="flex items-start justify-start">
            <div className="item-center mx-auto flex min-h-screen w-auto justify-center rounded-2xl bg-white px-28 py-10">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
