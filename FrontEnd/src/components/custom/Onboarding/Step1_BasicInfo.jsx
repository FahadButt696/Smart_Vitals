"use client";
import { useFormContext } from "react-hook-form";

const Step1_BasicInfo = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400">Basic Information</h2>

      <div>
        <label className="block text-white">Full Name</label>
        <input
          {...register("fullName", { required: "Full name is required" })}
          className="w-full p-2 rounded bg-white/10 text-white"
        />
        {errors.fullName && <p className="text-red-400">{errors.fullName.message}</p>}
      </div>

      <div>
        <label className="block text-white">Email</label>
        <input
          {...register("email", { required: "Email is required" })}
          className="w-full p-2 rounded bg-white/10 text-white"
        />
        {errors.email && <p className="text-red-400">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-white">Age</label>
        <input
          type="number"
          {...register("age", { required: "Age is required" })}
          className="w-full p-2 rounded bg-white/10 text-white"
        />
        {errors.age && <p className="text-red-400">{errors.age.message}</p>}
      </div>
    </div>
  );
};

export default Step1_BasicInfo;
