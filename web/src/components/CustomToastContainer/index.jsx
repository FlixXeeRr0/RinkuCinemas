import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const CustomToastContainer = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
    />
  );
};

export default CustomToastContainer;
