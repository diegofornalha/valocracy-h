import { Toaster } from "react-hot-toast";

export const ToastProvider = ({ children }) => {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 5000,
          style: {},
          success: { duration: 3000 },
        }}
      />
      {children}
    </>
  );
};
