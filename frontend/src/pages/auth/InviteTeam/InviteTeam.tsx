import { useNavigate } from "react-router-dom";
import ArrowBack from "../../../assets/svg/arrowBack.svg?react";
import QuickTips from "../../../assets/svg/tips.svg?react";
import { instructions } from "../constants";
import { useInvite } from "@/utils/hooks/useInvite/useInvite";
import classNames from "classnames";

export default function InviteTeammates() {
  const urlParams = new URLSearchParams(window.location.search);
  const workspaceId = urlParams.get("workspace-id")!;
  const { handleSubmit, onSubmit, register, formState } = useInvite({
    workspaceId,
  });
  const navigate = useNavigate();

  const { isSubmitting } = formState;

  function InviteInstructions() {
    return (
      <ol className="ml-5 list-decimal space-y-2">
        {instructions.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
    );
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-130 p-10">
      <div className="mb-10 flex items-center justify-between">
        <button
          className="flex cursor-pointer items-center gap-2 text-sm text-gray-500"
          onClick={() => navigate(-1)}
        >
          <ArrowBack className="h-5 w-5" /> <span>Back</span>
        </button>

        <span className="text-sm text-gray-400">3/4</span>
      </div>

      <h1 className="mb-2 text-3xl font-normal tracking-wide text-gray-800">
        Invite teammates by email
      </h1>

      <p className="mb-10 max-w-lg text-sm text-gray-500">
        Add their email addresses so they can join your workspace right away.
        You can skip this and invite them later.
      </p>

      <label className="text-sm text-gray-700">Enter Email Address?</label>

      <input
        {...register("email")}
        placeholder="eg., Adebanjo@gmail.com"
        className="mt-2 mb-8 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
      />

      <div className="mb-8 rounded-xl border border-gray-200 p-6 text-sm text-gray-500">
        <p className="mb-4 flex items-center gap-1.5 font-medium text-gray-700">
          <QuickTips className="h-3 w-3" /> <span>Quick Tips</span>
        </p>
        <InviteInstructions />
      </div>

      <div className="flex items-center justify-between">
        <button
          className="cursor-pointer text-sm text-indigo-600"
          onClick={() => navigate("/invite-team")}
        >
          Skip for later
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className={classNames(
            "w-48 cursor-pointer rounded-sm px-10 py-3 font-medium text-white",
            {
              "bg-gray-400": isSubmitting,
              "bg-linear-to-r from-indigo-500 to-indigo-600": !isSubmitting,
            },
          )}
        >
          {isSubmitting ? "Sending invite…" : "Continue"}
        </button>
      </div>
    </form>
  );
}
