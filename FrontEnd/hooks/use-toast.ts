"use client"

import { toast } from "sonner"

export function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => toast.dismiss(toastId),
  }
}

export { toast }
