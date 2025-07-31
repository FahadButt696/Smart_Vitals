import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { UserButton } from "@clerk/clerk-react";
import AuthForm from "@/components/custom/AuthForm";

const Dashboard = () => {
  const { user } = useUser();

  return (
    <>
    <SignedIn>
      <div className="text-white p-6 w-screen h-screen flex flex-col justify-center items-center ">
        <h1 className="text-2xl font-semibold mb-4">Welcome, {user?.username || "User"}!</h1>
        <p><strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress}</p>
        <p><strong>Username:</strong> {user?.username || "Not set"}</p>
        <p><strong>User ID:</strong> {user?.id}</p>
        <UserButton />
      </div>
    </SignedIn>
    <SignedOut>
      <AuthForm type="sign-in"/>
    </SignedOut>
    </>
  );
};

export default Dashboard;
