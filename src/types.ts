export type ToastId = number;

export interface CrispyToast {
  id: ToastId;
  visible: boolean;
  render: (t: CrispyToast) => React.ReactNode;
}