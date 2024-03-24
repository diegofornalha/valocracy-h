import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

//context
import AuthContext from "../contexts/AuthContext";

//api
import { api } from "../api/api";
import { getIsEmailUnique, getIsUsernameUnique, getUser } from "../api/user";
import {
  isJWTValid,
  sendEmailValidationCodeRequest,
  sendRegistryEmailValidationCodeRequest,
  validateCodeRequestLogin,
  validateCodeRequestSignUp,
} from "../api/auth";

export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isRegistering, setIsRegistering] = useState(
    location.pathname === "/auth/signup" ? true : false
  );
  const [emailCodeId, setEmailCodeId] = useState(null);

  const updateUserInfo = async () => {
    const user = await getUser();

    setUser(user);
  };

  const sendCode = async (email, username = "") => {
    //check if user is registering
    if (!isRegistering) {
      const fetch = sendEmailValidationCodeRequest({ email });
      toast.promise(fetch, {
        loading: "Sending code...",
        success: "Code sent!",
        error: "Error sending code",
      });
      const response = await fetch;
      console.log(response);
      setEmailCodeId(response.code_id);
    } else {
      const fetch = sendRegistryEmailValidationCodeRequest(email, username);
      toast.promise(fetch, {
        loading: "Sending code...",
        success: "Code sent!",
        error: "Error sending code",
      });
      const response = await fetch;
      console.log(response);
      setEmailCodeId(response.id);
    }
  };

  const handleLogin = async (data) => {
    const email = data.email;
    setEmail(email);

    //verify if email is unique
    const isEmailUnique = await getIsEmailUnique(email);

    if (isEmailUnique.is_unique) {
      setIsRegistering(true);
      return;
    }

    //send email validation code
    await sendCode(email);
    //redirect to email code validation
    navigate("/auth/validation");
  };

  const handleRegister = async (data) => {
    const email = data.email;
    const username = data.username;

    setEmail(email);
    setUsername(username);

    if (!email || !username) {
      toast.error("Please, verify your email or username");
      return;
    }

    //verify if email and username is unique
    const isEmailUnique = await getIsEmailUnique(email);
    if (!isEmailUnique.is_unique) {
      toast.error("Email already exists");
      return;
    }

    const isUsernameUnique = await getIsUsernameUnique(username);
    if (!isUsernameUnique.is_unique) {
      toast.error("Username already exists");
    }

    await sendCode(email, username);
    //navigate to email code validation
    navigate("/auth/validation");
  };

  const login = async (userData) => {
    localStorage.setItem("token-valocracy", userData.accessToken);
    setIsAuthenticated(true); // Update isAuthenticated state
    api.defaults.headers.Authorization = `Bearer ${userData.accessToken}`;
    await updateUserInfo();

    // navigate("/"); // Redirect to home
  };

  const logout = () => {
    localStorage.removeItem("token-valocracy"); // Ensure consistent key
    setIsAuthenticated(false); // Update isAuthenticated state
    setUser(null);
    api.defaults.headers.Authorization = ""; // Remove Authorization header
    // navigate("/auth"); // Redirect to login
  };

  const sendEmailValidationCode = async (email) => {
    const response = await sendEmailValidationCodeRequest({
      email: email,
    });

    console.log(response);

    return response;
  };

  const validateCode = async (id, code) => {
    try {
      if (isRegistering) {
        const data = {
          email,
          username,
          validation: {
            id,
            code,
            validation_type: 1,
          },
        };
        const fetch = validateCodeRequestSignUp(data);
        toast.promise(fetch, {
          loading: "Validating code...",
          success: "Code validated!",
          error: "Error validating code",
        });
        const response = await fetch;
        console.info("LOGIN by VALIDATE CÓDIGO", response);
        await login(response);
      } else {
        const data = {
          user_credential: email,
          id,
          code,
          login_format: "email",
        };
        const fetch = validateCodeRequestLogin(data);
        toast.promise(fetch, {
          loading: "Validating code...",
          success: "Code validated!",
          error: "Error validating code",
        });
        const response = await fetch;
        console.info("LOGIN by VALIDATE CÓDIGO", response);
        await login(response);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const handleResendCode = async () => {
    try {
      if (isRegistering) {
        const fetch = sendRegistryEmailValidationCodeRequest(email, username);
        toast.promise(fetch, {
          loading: "Sending code...",
          success: "Code sent!",
          error: "Error sending code",
        });
        const response = await fetch;
        console.log(response);
        setEmailCodeId(response.id);
      } else {
        const fetch = sendEmailValidationCodeRequest({ email });
        toast.promise(fetch, {
          loading: "Sending code...",
          success: "Code sent!",
          error: "Error sending code",
        });
        const response = await fetch;
        console.log(response);
        setEmailCodeId(response.code_id);
      }
    } catch (error) {
      toast.error(error);
      console.error(error);
    }
  };

  useEffect(() => {
    const validateTokenAndSetUser = async () => {
      const storedToken = localStorage.getItem("token-valocracy"); // Ensure consistent key
      if (!storedToken) {
        setIsAuthenticated(false);
        return;
      } else {
        setIsAuthenticated(true);
      }

      const isValid = await isJWTValid(storedToken);
      if (isValid) {
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        await updateUserInfo();
      } else {
        logout(); // Logout if token is invalid
      }
    };

    validateTokenAndSetUser();
  }, []);

  const value = {
    user,
    email,
    username,
    login,
    logout,
    isAuthenticated,
    updateUserInfo,
    isRegistering,
    emailCodeId,
    handleLogin,
    handleRegister,
    sendEmailValidationCode,
    validateCode,
    handleResendCode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
