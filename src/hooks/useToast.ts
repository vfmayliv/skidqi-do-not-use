
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
      } else if (props && typeof props === 'object') {
        // Make sure we're passing strings or valid React elements for title and description
        const safeProps = { ...props };
        
        // Handle title
        if (safeProps.title && typeof safeProps.title === 'object' && !React.isValidElement(safeProps.title)) {
          safeProps.title = JSON.stringify(safeProps.title);
        }
        
        // Handle description
        if (safeProps.description && typeof safeProps.description === 'object' && !React.isValidElement(safeProps.description)) {
          safeProps.description = JSON.stringify(safeProps.description);
        }
        
        sonnerToast(safeProps);
      } else {
        // Fallback for any other types
        sonnerToast(String(props));
      }
    },
  };
};

export { useToast, sonnerToast as toast };
