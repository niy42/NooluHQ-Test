import { useWorkspace } from "@/utils/hooks/useWorkspace/useWorkspace";
import ArrowBack from "../../../assets/svg/arrowBack.svg?react";
import { useNavigate } from "react-router-dom";

export default function CreateWorkspace() {
  const { handleSubmit, onSubmit, register } = useWorkspace();
  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-160">
      <div className="mb-10 flex items-center justify-between">
        <button
          className="flex cursor-pointer items-center gap-2 text-sm text-gray-500"
          onClick={() => navigate(-1)}
        >
          <ArrowBack className="h-5 w-5" /> Tell us about you
        </button>

        <span className="text-sm text-gray-400">3/4</span>
      </div>

      <h1 className="mb-2 text-3xl font-normal tracking-wide text-gray-800">
        Create your workspace
      </h1>

      <p className="mb-10 max-w-lg text-sm text-gray-500">
        Name your workspace and invite teammates (if you'd like). You can always
        add more later, we&apos;ll keep things flexible.
      </p>

      <label className="text-sm font-medium text-gray-700">
        What&apos;s the name of your workspace?
      </label>

      <input
        {...register("workspace")}
        placeholder="eg., Nexa team"
        className="mt-2 mb-8 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
      />

      <button
        type="submit"
        className="w-full cursor-pointer rounded-sm bg-linear-to-r from-indigo-500 to-indigo-600 py-3 font-medium text-white"
      >
        Continue
      </button>
    </form>
  );
}
