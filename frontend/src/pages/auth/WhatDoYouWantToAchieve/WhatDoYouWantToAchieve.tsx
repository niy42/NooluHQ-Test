import { useState } from "react";
import classNames from "classnames";
import { options } from "../constants";
import { useNavigate } from "react-router-dom";
import ArrowBack from "../../../assets/svg/arrowBack.svg?react";
import { useAchievement } from "@/utils/hooks/useAchievement/useAchievement";

export default function WhatDoYouWantToAchieve() {
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const { submitAchievement } = useAchievement();

  return (
    <div className="w-160 max-w-180">
      <div className="mb-10 flex items-center justify-between">
        <button
          className="flex cursor-pointer items-center gap-2 text-sm text-gray-500"
          onClick={() => navigate(-1)}
        >
          <ArrowBack className="h-5 w-5" /> <span>Set up your workspace</span>
        </button>

        <span className="text-sm text-gray-400">4/4</span>
      </div>

      <h1 className="mb-2 text-3xl font-normal tracking-wide text-gray-800">
        What do you want to achieve?
      </h1>

      <p className="mb-10 max-w-lg text-sm text-gray-500">
        Choose a use case so we can recommend the right tools and templates to
        get you started faster. You can always change this later.
      </p>

      <div className="mb-10 grid grid-cols-3 gap-4">
        {options.map((option, i) => {
          const active = selected === i;
          const Icon = option.icon;

          return (
            <div
              key={i}
              onClick={() => setSelected(i)}
              className={classNames(
                "cursor-pointer gap-4 rounded-sm border p-5 transition",
                {
                  "border-indigo-500 bg-indigo-50": active,
                  "border-gray-200 hover:border-gray-300": !active,
                },
              )}
            >
              <div className="mb-2">
                {" "}
                <img src={Icon} className="h-4 w-4" />
              </div>

              <p className="mb-1 text-xs font-medium text-gray-800">
                {option.title}
              </p>

              <p className="text-xs text-gray-500">{option.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <button
          className="cursor-pointer text-sm text-indigo-600"
          onClick={() => navigate("/dasboard")}
        >
          Skip for later
        </button>

        <button
          className="w-48 cursor-pointer rounded-sm bg-linear-to-r from-indigo-500 to-indigo-600 px-10 py-3 font-medium text-white"
          onClick={() => submitAchievement(options[selected])}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
