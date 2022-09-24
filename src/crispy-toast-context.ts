import { createContext } from "react";
import { CrispyToast, ToastId } from "./types";

type Options = Pick<CrispyToast, "render">;

export interface CrispyToastContextProps {
  dismiss: (id: ToastId) => void;
  toast: (options: Options) => void;
}

export const CrispyToastContext = createContext<
  CrispyToastContextProps | undefined
>(undefined);
