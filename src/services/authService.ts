import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  signOut as amplifySignOut,
  getCurrentUser as amplifyGetCurrentUser,
  fetchUserAttributes,
  resetPassword as amplifyResetPassword,
  confirmResetPassword as amplifyConfirmResetPassword,
} from "aws-amplify/auth";
import { CognitoUser, CognitoRole } from "../components/CognitoAuthPage";

// ---------------------------------------------------------------------------
// Local storage keys (used only to persist the extra profile fields that
// Cognito itself does not store: name / company / role)
// ---------------------------------------------------------------------------
const PROFILE_KEY_PREFIX = "sentinel_profile_";
const PENDING_SIGNUP_EMAIL_KEY = "sentinel_pending_signup_email";

interface LocalProfile {
  name: string;
  company: string;
  role: CognitoRole;
}

const profileKey = (email: string): string =>
  `${PROFILE_KEY_PREFIX}${email.toLowerCase()}`;

const saveProfile = (email: string, profile: LocalProfile): void => {
  localStorage.setItem(profileKey(email), JSON.stringify(profile));
};

const loadProfile = (email: string): LocalProfile | null => {
  const raw = localStorage.getItem(profileKey(email));
  return raw ? (JSON.parse(raw) as LocalProfile) : null;
};

// ---------------------------------------------------------------------------
// Error helper - converts Cognito/Amplify errors into readable JS Errors
// ---------------------------------------------------------------------------
const toReadableError = (err: unknown): Error => {
  if (err instanceof Error) {
    return new Error(err.message);
  }
  return new Error("An unknown authentication error occurred.");
};

// ---------------------------------------------------------------------------
// authService
// ---------------------------------------------------------------------------
export const authService = {
  /**
   * Retrieves the currently authenticated user session if it exists,
   * merging the real Cognito session with the locally stored profile
   * (name / company / role).
   */
  getCurrentUser: async (): Promise<CognitoUser | null> => {
    try {
      await amplifyGetCurrentUser();
      const attributes = await fetchUserAttributes();
      const email = attributes.email ?? "";

      if (!email) {
        return null;
      }

      const profile = loadProfile(email);

      const user: CognitoUser = {
        name: profile?.name ?? email,
        email,
        company: profile?.company ?? "",
        role: (profile?.role ?? "") as CognitoRole,
      };

      return user;
    } catch {
      return null;
    }
  },

  /**
   * Performs sign-in against the real AWS Cognito User Pool and returns
   * a merged CognitoUser object (Cognito identity + locally stored profile).
   */
  signIn: async (email: string, password: string): Promise<CognitoUser> => {
    try {
      const result = await amplifySignIn({ username: email, password });

      if (result.nextStep.signInStep !== "DONE") {
        throw new Error(
          `Authentication requires additional step: ${result.nextStep.signInStep}`
        );
      }

      const attributes = await fetchUserAttributes();
      const resolvedEmail = attributes.email ?? email;
      const profile = loadProfile(resolvedEmail);

      const user: CognitoUser = {
        name: profile?.name ?? resolvedEmail,
        email: resolvedEmail,
        company: profile?.company ?? "",
        role: (profile?.role ?? "") as CognitoRole,
      };

      return user;
    } catch (err) {
      throw toReadableError(err);
    }
  },

  /**
   * Registers a new user in the real Cognito User Pool using email/password.
   * name / company / role are persisted locally since Cognito custom
   * attributes are intentionally not used.
   */
  signUp: async (
    name: string,
    company: string,
    email: string,
    role: CognitoRole,
    password: string
  ): Promise<{ email: string; requiresVerification: boolean }> => {
    try {
      const result = await amplifySignUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });

      saveProfile(email, { name, company, role });
      localStorage.setItem(PENDING_SIGNUP_EMAIL_KEY, email);

      const requiresVerification = !result.isSignUpComplete;

      return { email, requiresVerification };
    } catch (err) {
      throw toReadableError(err);
    }
  },

  /**
   * Confirms registration with a 6-digit confirmation code, against the
   * email that was most recently registered via signUp().
   */
  confirmSignUp: async (code: string): Promise<void> => {
    try {
      const email = localStorage.getItem(PENDING_SIGNUP_EMAIL_KEY);

      if (!email) {
        throw new Error(
          "ExpiredCodeException: Registration session has expired. Please sign up again."
        );
      }

      await amplifyConfirmSignUp({
        username: email,
        confirmationCode: code,
      });

      localStorage.removeItem(PENDING_SIGNUP_EMAIL_KEY);
    } catch (err) {
      throw toReadableError(err);
    }
  },

  /**
   * Requests a password reset for a registered Cognito user.
   */
  forgotPassword: async (email: string): Promise<void> => {
    try {
      await amplifyResetPassword({ username: email });
    } catch (err) {
      throw toReadableError(err);
    }
  },

  /**
   * Confirms password reset with a security code and sets the new password.
   */
  confirmForgotPassword: async (
    email: string,
    code: string,
    newPassword: string
  ): Promise<void> => {
    try {
      await amplifyConfirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
    } catch (err) {
      throw toReadableError(err);
    }
  },

  /**
   * Signs the current user out of the Cognito session.
   */
  signOut: async (): Promise<void> => {
    try {
      await amplifySignOut();
    } catch (err) {
      throw toReadableError(err);
    }
  },
};