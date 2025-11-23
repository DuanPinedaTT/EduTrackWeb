import { useContext } from "react";
import AuthContext from "../contexts/authContext.js";

export function useAuth() {
  return useContext(AuthContext);
}
