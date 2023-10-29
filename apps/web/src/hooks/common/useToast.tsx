import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const useToast = () => {
  const { t: tServer } = useTranslation('errors');

  const showSuccessToast = (
    message: string,
    persistent?: boolean,
    id?: string
  ) => {
    toast.success(message, {
      id: id || 'success-toast',
      position: 'top-center',
      duration: persistent ? Infinity : 5000,
      // icon: persistent ? <Spinner size="sm" /> : null,
    });
  };

  const showErrorToast = (message: string) => {
    toast.error(tServer(message), {
      id: 'error-toast',
      position: 'top-center',
      duration: 3300,
    });
  };

  const showInfoToast = (message: string) => {
    toast(tServer(message), {
      id: 'info-toast',
      position: 'top-center',
      duration: 3300,
    });
  }

  const closeAllToasts = () => {
    toast.remove();
  };

  return {
    showSuccessToast,
    showInfoToast,
    showErrorToast,
    closeAllToasts,
  };
};
