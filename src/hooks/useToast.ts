
import { toast as sonnerToast, Toast } from "sonner";
import * as React from "react";
import { useAppStore } from "@/stores/useAppStore";

// Define proper type for toast input
type ToastProps = string | React.ReactNode | {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  action?: React.ReactNode;
  [key: string]: any;
};

const useToast = () => {
  const { language } = useAppStore();
  
  return {
    toast: (props: ToastProps) => {
      sonnerToast(props);
    },
  };
};

export { useToast, sonnerToast as toast };
