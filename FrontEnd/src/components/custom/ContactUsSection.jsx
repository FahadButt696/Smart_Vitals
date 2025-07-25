"use client";
import { Input } from "./Input";
import { Textarea } from "./Textarea";

export default function ContactForm() {
  return (
    <section className="w-full min-h-screen py-20 bg-gradient-to-br from-gray-900 via-cyan-900 to-neutral-900 flex items-center justify-center">
      <form className="space-y-6 max-w-xl w-full p-8 bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-cyan-800">
        <h2 className="text-3xl font-bold text-white text-center">Contact Us</h2>

        <Input type="text" placeholder="Your Name" />
        <Input type="email" placeholder="Your Email" />
        <Textarea rows={5} placeholder="Your Message" />

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:scale-105"
          >
            Send Message
          </button>
        </div>
      </form>
    </section>
  );
}
