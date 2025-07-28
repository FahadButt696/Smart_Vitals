'use client';
import React, { useState } from 'react';

export const TextAreaWithLabel = ({ label, icon, name, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const shouldFloat = isFocused || value;

  return (
    <div className="relative w-full">
      <div className="absolute left-4 top-4 text-cyan-400">{icon}</div>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required
        rows={5}
        className="w-full pl-12 pr-4 pt-6 pb-2 text-white bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-cyan-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-transparent resize-none"
        placeholder={label}
      />
      <label
        htmlFor={name}
        className={`absolute  bottom-5 left-12 transition-all duration-200 pointer-events-none px-1 text-cyan-400 ${
          shouldFloat ? 'top-1 text-xs' : 'top-3 text-base'
        }`}
      >
        {label}
      </label>
    </div>
  );
};
