import { useContext } from "react";
import { CrispyToastContext } from "./crispy-toast-context";

export const useCrispyToast = () => {
  const ctx = useContext(CrispyToastContext);

  if (!ctx) {
    throw new Error("useCrispyToast must be used inside a CrispyToastProvider");
  }

  return ctx;
};
