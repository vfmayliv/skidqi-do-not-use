
import { toast as sonnerToast } from "sonner";
import * as React from "react";
import { useAppStore } from "@/stores/useAppStore";

// Define proper type for toast input - based on sonner's types
type ToastProps = 
  | string 
  | React.ReactNode 
  | {
      title?: string | React.ReactNode;
      description?: string | React.ReactNode;
      action?: React.ReactNode;
      variant?: "default" | "destructive";
      [key: string]: any;
    };

interface UseToastReturn {
  toast: (props: ToastProps) => void;
}

const useToast = (): UseToastReturn => {
  const { language } = useAppStore();
  
  return {
    toast: (props: ToastProps) => {
      if (typeof props === 'string' || React.isValidElement(props)) {
        sonnerToast(props);
      } else {
        sonnerToast(props as any);
      }
    },
  };
};

export { useToast, sonnerToast as toast };
