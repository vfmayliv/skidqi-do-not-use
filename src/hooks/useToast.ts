
import { toast as sonnerToast } from "sonner";
import * as React from "react";
import { useAppStore } from "@/stores/useAppStore";

type ToastProps = React.ComponentPropsWithoutRef<typeof sonnerToast>;

const useToast = () => {
  const { language } = useAppStore();
  
  return {
    toast: ({ ...props }: ToastProps) => {
      sonnerToast({ ...props });
    },
  };
};

export { useToast, sonnerToast as toast };
