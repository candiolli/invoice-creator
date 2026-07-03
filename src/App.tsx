import { useEffect, useState } from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { InvoiceWorkspace } from "./InvoiceWorkspace";
import { AuthModal } from "./AuthModal";

export default function App() {
  return (
    <Authenticator.Provider>
      <AppInner />
    </Authenticator.Provider>
  );
}

function AppInner() {
  const { authStatus, user, signOut } = useAuthenticator((c) => [
    c.authStatus,
    c.user,
  ]);
  const authenticated = authStatus === "authenticated";
  const [showAuth, setShowAuth] = useState(false);

  // Close the sign-in modal automatically once the user is authenticated.
  useEffect(() => {
    if (authenticated) setShowAuth(false);
  }, [authenticated]);

  return (
    <>
      <InvoiceWorkspace
        authEnabled
        authenticated={authenticated}
        email={user?.signInDetails?.loginId}
        onSignIn={() => setShowAuth(true)}
        onSignOut={signOut}
      />
      {showAuth && !authenticated && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
