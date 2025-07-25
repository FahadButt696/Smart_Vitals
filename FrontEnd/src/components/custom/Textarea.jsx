"use client";
import React from "react";

export const Textarea = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      {...props}
      className={`w-full px-5 py-3 rounded-md border border-cyan-700 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white placeholder:text-neutral-400 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 transition-all duration-300 resize-none ${className}`}
    />
  );
});

Textarea.displayName = "Textarea";
