import { useContext } from "react";

//context
import AuthContext from "../contexts/AuthContext";

export const useAuth = () => useContext(AuthContext);
