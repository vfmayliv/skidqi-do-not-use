
import { toast as sonnerToast } from "sonner";
import * as React from "react";
import { useAppStore } from "@/stores/useAppStore";

// Define proper type for toast props
type ToastProps = Parameters<typeof sonnerToast>[0];

const useToast = () => {
  const { language } = useAppStore();
  
  return {
    toast: (props: ToastProps) => {
      sonnerToast(props);
    },
  };
};

export { useToast, sonnerToast as toast };
