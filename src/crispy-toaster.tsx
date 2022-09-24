import { Transition, TransitionClasses } from "@headlessui/react";
import { CSSProperties, useCallback, useMemo, useState } from "react";
import {
  CrispyToastContext,
  CrispyToastContextProps,
} from "./crispy-toast-context";
import { CrispyToast, ToastId } from "./types";

type HorizontalDirection = "left" | "right" | "center";
type VerticalDirection = "top" | "bottom";

type Position = `${VerticalDirection}-${HorizontalDirection}`;

type EnterTransition = Pick<TransitionClasses, "enterFrom" | "enterTo">;
type LeaveTransition = Pick<TransitionClasses, "leaveFrom" | "leaveTo">;
type Transition = EnterTransition & LeaveTransition;

const enter = "transition-all duration-300";
const leave = "transition-all duration-150";

const FadeIn: EnterTransition = {
  enterFrom: "opacity-0",
  enterTo: "opacity-100",
};

const FadeOut: LeaveTransition = {
  leaveFrom: "opacity-100",
  leaveTo: "opacity-0",
};

const mergeTransitions = (transitions: TransitionClasses[]) => {
  const classes: TransitionClasses = {};

  const mergeWithClasses = (hook: keyof TransitionClasses, value: string) => {
    const current = classes[hook];

    if (!current) {
      classes[hook] = value;
      return;
    }

    classes[hook] = `${current} ${value}`;
  };

  for (const transition of transitions) {
    transition.enterFrom && mergeWithClasses("enterFrom", transition.enterFrom);
    transition.enterTo && mergeWithClasses("enterTo", transition.enterTo);
    transition.leaveFrom && mergeWithClasses("leaveFrom", transition.leaveFrom);
    transition.leaveTo && mergeWithClasses("leaveTo", transition.leaveTo);
  }

  return classes;
};

const SlideFromRight: Transition = {
  enterFrom: "translate-x-full",
  enterTo: "translate-x-0",
  leaveFrom: "translate-x-0",
  leaveTo: "translate-x-full",
};

const SlideFromLeft: Transition = {
  enterFrom: "-translate-x-full",
  enterTo: "translate-x-0",
  leaveFrom: "translate-x-0",
  leaveTo: "-translate-x-full",
};

const SlideFromTop: Transition = {
  enterFrom: "-translate-y-full",
  enterTo: "translate-y-0",
  leaveFrom: "translate-y-0",
  leaveTo: "-translate-y-full",
};

const SlideFromBottom: Transition = {
  enterFrom: "translate-y-full",
  enterTo: "translate-y-0",
  leaveFrom: "translate-y-0",
  leaveTo: "translate-y-full",
};

const animation: Record<Position, TransitionClasses> = {
  "top-left": mergeTransitions([FadeIn, FadeOut, SlideFromLeft]),
  "top-right": mergeTransitions([FadeIn, FadeOut, SlideFromRight]),
  "top-center": mergeTransitions([FadeIn, FadeOut, SlideFromTop]),
  "bottom-left": mergeTransitions([FadeIn, FadeOut, SlideFromLeft]),
  "bottom-right": mergeTransitions([FadeIn, FadeOut, SlideFromRight]),
  "bottom-center": mergeTransitions([FadeIn, FadeOut, SlideFromBottom]),
};

const styles: Record<Position, CSSProperties> = {
  "top-left": {
    top: 0,
    left: 0,
  },
  "top-right": {
    top: 0,
    right: 0,
  },
  "top-center": {
    top: 0,
    right: 0,
    left: 0,
    margin: "0 auto",
  },
  "bottom-left": {
    bottom: 0,
    left: 0,
  },
  "bottom-right": {
    bottom: 0,
    right: 0,
  },
  "bottom-center": {
    bottom: 0,
    right: 0,
    left: 0,
    margin: "0 auto",
  },
};

const isTop = (position: Position) => {
  return (
    position === "top-center" ||
    position === "top-left" ||
    position === "top-right"
  );
};

// Related to the transition classes on enter and leave
const minDuration = 300;

interface CrispyToasterProps {
  children: React.ReactNode;
  position?: Position;
  duration?: number;
}

export const CrispyToaster: React.FC<CrispyToasterProps> = ({
  children,
  position = "bottom-right",
  duration = 3000,
}) => {
  const [toasts, setToasts] = useState<CrispyToast[]>([]);

  const dismiss: CrispyToastContextProps["dismiss"] = useCallback(
    (id) => {
      setToasts((toasts) =>
        toasts.map((t) => {
          if (t.id === id) {
            t.visible = false;
          }

          return t;
        })
      );
    },
    [setToasts]
  );

  const toast: CrispyToastContextProps["toast"] = useCallback((options) => {
    const id = Date.now();

    const toast: CrispyToast = {
      ...options,
      id,
      visible: true,
    };

    setToasts((toasts) => {
      if (isTop(position)) {
        return [toast, ...toasts];
      }
      return [...toasts, toast];
    });

    setTimeout(() => {
      dismiss(id);
    }, Math.max(duration, minDuration));
  }, []);

  const remove = useCallback(
    (id: ToastId) => {
      setToasts((toasts) => toasts.filter((t) => t.id !== id));
    },
    [setToasts]
  );

  const ctx = useMemo<CrispyToastContextProps>(
    () => ({
      dismiss,
      toast,
    }),
    [dismiss]
  );

  return (
    <CrispyToastContext.Provider value={ctx}>
      {children}
      <div
        className="fixed z-[9999] flex w-full max-w-md flex-col gap-2 p-2"
        style={styles[position]}
      >
        {toasts.map((t) => (
          <Transition
            appear={true}
            show={t.visible}
            enter={enter}
            leave={leave}
            {...animation[position]}
            afterLeave={() => remove(t.id)}
            key={t.id}
            role="alert"
            className="w-full max-w-5xl"
          >
            {t.render(t)}
          </Transition>
        ))}
      </div>
    </CrispyToastContext.Provider>
  );
};
