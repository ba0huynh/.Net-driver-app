import { createContext, use, useState, type PropsWithChildren } from 'react';

type SessionContextValue = {
  isSignedIn: boolean;
  signIn: (driverId: string, password: string) => Promise<void>;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

/**
 * Mock session store. Replace `signIn` with the real API call once the backend is ready,
 * and persist the token (e.g. with expo-secure-store).
 */
export function SessionProvider({ children }: PropsWithChildren) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  async function signIn(_driverId: string, _password: string) {
    // TODO: call the auth API
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsSignedIn(true);
  }

  function signOut() {
    setIsSignedIn(false);
  }

  return <SessionContext value={{ isSignedIn, signIn, signOut }}>{children}</SessionContext>;
}

export function useSession() {
  const value = use(SessionContext);
  if (!value) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return value;
}
