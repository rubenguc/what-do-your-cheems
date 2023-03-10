import { Spinner } from '@chakra-ui/react';
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
      icon: persistent ? <Spinner size="sm" /> : '',
    });
  };

  const showErrorToast = (message: string) => {
    toast.error(tServer(message), {
      id: 'error-toast',
      position: 'top-center',
      duration: 3300,
    });
  };

  return {
    showSuccessToast,
    showErrorToast,
  };
};
