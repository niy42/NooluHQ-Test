import { CustomTextField } from "../../../components/TextField/TextField";
import { useWhoIsJoining } from "@/utils/hooks/useWhoIsJoining/useWhoIsJoining";

export default function WhoIsJoining() {
  const { control, handleSubmit, register, onSubmit } = useWhoIsJoining();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
      <div className="mb-6 flex justify-end">
        <span className="text-sm text-gray-400">2/4</span>
      </div>

      <h1 className="mb-2 text-3xl font-semibold text-gray-800">
        Who&apos;s joining us?
      </h1>

      <p className="mb-10 max-w-lg text-sm text-gray-500">
        We&apos;d love to know your name and role so we can tailor the
        experience to how you work best, whether you&apos;re solo or with a
        team.
      </p>

      <div className="mb-6">
        <p className="mb-2 text-sm font-normal text-gray-700">
          What should we call you?
        </p>

        <CustomTextField
          control={control}
          name="name"
          placeholder="eg., Orimadegun Promise"
        />
      </div>

      <div className="mb-8">
        <p className="mb-2 text-sm text-gray-700">What's your role?</p>

        <CustomTextField
          control={control}
          name="role"
          placeholder="eg., Product designer"
        />
      </div>

      <div className="mb-10">
        <p className="mb-4 text-sm text-gray-700">
          Are you working solo or with a team?
        </p>

        <div className="flex flex-col gap-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              {...register("teamSize")}
              type="radio"
              value="just-me"
              className="h-3.5 w-3.5 cursor-pointer accent-indigo-600"
            />
            <span className="text-sm text-gray-700">Just me</span>
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              {...register("teamSize")}
              type="radio"
              value="2-10"
              className="h-3.5 w-3.5 cursor-pointer accent-indigo-600"
            />
            <span className="text-sm text-gray-700">2-10 teammates</span>
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              {...register("teamSize")}
              type="radio"
              value="11-50"
              className="h-3.5 w-3.5 cursor-pointer accent-indigo-600"
            />
            <span className="text-sm text-gray-700">11-50 teammates</span>
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              {...register("teamSize")}
              type="radio"
              value="50+"
              className="accent-indigo-60 h-3.5 w-3.5 cursor-pointer"
            />
            <span className="text-sm text-gray-700">50+ teammates</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full cursor-pointer rounded-sm bg-linear-to-r from-indigo-500 to-indigo-600 py-3 font-medium text-white hover:opacity-95"
      >
        Continue
      </button>
    </form>
  );
}
