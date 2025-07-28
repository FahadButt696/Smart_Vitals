import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

export default function ProtectedPage({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
