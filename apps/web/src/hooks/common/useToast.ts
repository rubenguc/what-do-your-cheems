import { toast } from 'react-toastify';

export const useToast = () => {
  const showSuccessToast = (message: string) => {
    toast.success(message, {
      // toastId: "success-toast",
      position: 'top-center',
      draggable: true,
    });
  };

  const showErrorToast = (message: string) => {
    toast.error(message, {
      toastId: 'error-toast',
      position: 'top-center',
      draggable: true,
    });
  };

  return {
    showSuccessToast,
    showErrorToast,
  };
};
