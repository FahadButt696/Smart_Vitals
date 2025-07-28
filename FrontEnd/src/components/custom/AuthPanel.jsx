import { SignIn, SignUp } from "@clerk/clerk-react";

export default function AuthPanel({ isSignUp }) {
  return (
    <div className="flex w-full md:w-1/2 justify-center items-center py-20 px-6 md:px-12">
      <div className="w-full max-w-md">
        {isSignUp ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
            <SignUp path="/Signup" routing="path" signInUrl="/Login" />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
            <SignIn path="/Login" routing="path" signUpUrl="/Signup" />
          </>
        )}
      </div>
    </div>
  );
}
