import { CognitoUser, CognitoRole } from "../components/CognitoAuthPage";

// Local storage keys for state persistence
const SESSION_KEY = "sentinel_cognito_session";
const REGISTERED_USERS_KEY = "sentinel_registered_users";

export const authService = {
  /**
   * Retrieves the currently authenticated user session if it exists.
   */
  getCurrentUser: (): CognitoUser | null => {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  },

  /**
   * Performs sign-in handshake. Simulates Cognito STS auth delay, validating credentials against
   * the persistent user directory or default fallback credentials.
   */
  signIn: async (email: string, password: string): Promise<CognitoUser> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Fallback default high-quality enterprise user
        if (email.toLowerCase() === "sarah.jenkins@sentinelchain.ai" && password === "SecurePass123!") {
          const defaultUser: CognitoUser = {
            name: "Sarah Jenkins",
            email: "sarah.jenkins@sentinelchain.ai",
            company: "Sentinel Logistics Corp",
            role: "Supply Chain Manager"
          };
          localStorage.setItem(SESSION_KEY, JSON.stringify(defaultUser));
          resolve(defaultUser);
          return;
        }

        // Check locally registered mock Cognito accounts
        const storedUsersRaw = localStorage.getItem(REGISTERED_USERS_KEY);
        const registeredUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
        const matchedUser = registeredUsers.find(
          (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (matchedUser) {
          const userSession: CognitoUser = {
            name: matchedUser.name,
            email: matchedUser.email,
            company: matchedUser.company,
            role: matchedUser.role
          };
          localStorage.setItem(SESSION_KEY, JSON.stringify(userSession));
          resolve(userSession);
        } else {
          const error = new Error("UserNotFoundException: Incorrect email or password entered.");
          error.name = "UserNotFoundException";
          reject(error);
        }
      }, 1000);
    });
  },

  /**
   * Registers a new user within the Cognito User Pool simulation directory.
   */
  signUp: async (
    name: string,
    company: string,
    email: string,
    role: CognitoRole,
    password: string
  ): Promise<{ email: string; requiresVerification: boolean }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Save user details temporarily for the verification stage
        const tempRegUser = { name, company, email, role, password };
        localStorage.setItem("sentinel_temp_reg_user", JSON.stringify(tempRegUser));
        resolve({ email, requiresVerification: true });
      }, 1000);
    });
  },

  /**
   * Verifies registration with a 6-digit confirmation code.
   */
  confirmSignUp: async (code: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (code.length !== 6) {
          reject(new Error("InvalidParameterException: Verification code must be exactly 6 characters."));
          return;
        }

        const tempRegUserRaw = localStorage.getItem("sentinel_temp_reg_user");
        if (tempRegUserRaw) {
          const tempUser = JSON.parse(tempRegUserRaw);
          
          // Save verified user to registered users persistent directory
          const storedUsersRaw = localStorage.getItem(REGISTERED_USERS_KEY);
          const registeredUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
          registeredUsers.push(tempUser);
          localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
          
          localStorage.removeItem("sentinel_temp_reg_user");
          resolve();
        } else {
          reject(new Error("ExpiredCodeException: Registration session has expired. Please sign up again."));
        }
      }, 1000);
    });
  },

  /**
   * Requests a password reset for a registered user.
   */
  forgotPassword: async (email: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  },

  /**
   * Confirms password reset with security code and creates the new password.
   */
  confirmForgotPassword: async (email: string, code: string, newPassword: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (code.length !== 6) {
          reject(new Error("InvalidParameterException: Code must be exactly 6 digits."));
          return;
        }

        if (email.toLowerCase() === "sarah.jenkins@sentinelchain.ai") {
          resolve();
          return;
        }

        const storedUsersRaw = localStorage.getItem(REGISTERED_USERS_KEY);
        const registeredUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
        const userIndex = registeredUsers.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());

        if (userIndex !== -1) {
          registeredUsers[userIndex].password = newPassword;
          localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
          resolve();
        } else {
          // Simply succeed to simulate fluid Cognito behavior
          resolve();
        }
      }, 1000);
    });
  },

  /**
   * Clears Cognito session cookie / storage item.
   */
  signOut: async (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.removeItem(SESSION_KEY);
      resolve();
    });
  }
};
