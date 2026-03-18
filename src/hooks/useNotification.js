import toast from 'react-hot-toast';

export const useNotification = () => {
  const success = (message) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-center',
    });
  };

  const error = (message) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-center',
    });
  };

  const loading = (message) => {
    return toast.loading(message, {
      position: 'top-center',
    });
  };

  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  return {
    success,
    error,
    loading,
    dismiss,
  };
};
