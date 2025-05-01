
import { toast as sonnerToast } from "sonner";
import * as React from "react";
import { useAppStore } from "@/stores/useAppStore";

// Define proper type for toast input
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
      // Handle string or ReactElement directly
      if (typeof props === 'string' || React.isValidElement(props)) {
        sonnerToast(props);
      } 
      // Handle object props
      else if (props && typeof props === 'object') {
        const safeProps = { ...props } as Record<string, any>;
        
        // Ensure title is a string or valid React element
        let titleToUse: string | React.ReactNode = '';
        if (safeProps.title !== undefined) {
          if (typeof safeProps.title === 'string' || React.isValidElement(safeProps.title)) {
            titleToUse = safeProps.title;
          } else if (safeProps.title && typeof safeProps.title === 'object') {
            titleToUse = JSON.stringify(safeProps.title);
          }
        }
        
        // Ensure description is a string or valid React element
        let descriptionToUse: string | React.ReactNode | undefined = undefined;
        if (safeProps.description !== undefined) {
          if (typeof safeProps.description === 'string' || React.isValidElement(safeProps.description)) {
            descriptionToUse = safeProps.description;
          } else if (safeProps.description && typeof safeProps.description === 'object') {
            descriptionToUse = JSON.stringify(safeProps.description);
          }
        }
        
        // Extract the properties we need for sonner toast
        const { title, description, action, variant, ...rest } = safeProps;
        
        // Call sonner toast with proper parameters
        sonnerToast(titleToUse, {
          description: descriptionToUse,
          action: action as React.ReactNode,
          // Only include variant if it exists and is valid
          ...(variant ? { variant } : {}),
          // Pass any additional properties
          ...rest
        });
      } else {
        // Fallback for any other types
        sonnerToast(String(props));
      }
    },
  };
};

export { useToast, sonnerToast as toast };
