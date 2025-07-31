"use client";
import { useFormContext } from "react-hook-form";

const Step2_BodyMetrics = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400">Body Metrics</h2>

      {/* Height */}
      <div>
        <label className="block text-white">Height</label>
        <div className="flex gap-2">
          <input
            type="number"
            {...register("height.value", { required: "Height value is required" })}
            placeholder="Value"
            className="w-2/3 p-2 rounded bg-white/10 text-white"
          />
          <select
            {...register("height.unit", { required: true })}
            className="w-1/3 p-2 rounded bg-white/10 text-white"
          >
            <option value="cm">cm</option>
            <option value="inches">inches</option>
          </select>
        </div>
        {errors.height?.value && <p className="text-red-400">{errors.height.value.message}</p>}
      </div>

      {/* Weight */}
      <div>
        <label className="block text-white">Weight</label>
        <div className="flex gap-2">
          <input
            type="number"
            {...register("weight.value", { required: "Weight value is required" })}
            placeholder="Value"
            className="w-2/3 p-2 rounded bg-white/10 text-white"
          />
          <select
            {...register("weight.unit", { required: true })}
            className="w-1/3 p-2 rounded bg-white/10 text-white"
          >
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
        {errors.weight?.value && <p className="text-red-400">{errors.weight.value.message}</p>}
      </div>

      {/* Target Weight */}
      <div>
        <label className="block text-white">Target Weight (kg)</label>
        <input
          type="number"
          {...register("targetWeight", { required: "Target weight is required" })}
          className="w-full p-2 rounded bg-white/10 text-white"
        />
        {errors.targetWeight && <p className="text-red-400">{errors.targetWeight.message}</p>}
      </div>
    </div>
  );
};

export default Step2_BodyMetrics;
