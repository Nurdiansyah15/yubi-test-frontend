import React from "react";
import { BiUser } from "react-icons/bi";
import { toast } from "sonner";

const ToastContainer = ({ icon, message }) => {
  return (
    <div className="flex flex-row items-center gap-3">
      {icon}
      <div>{message}</div>
    </div>
  );
};

const CustomToast = (message, type = "success") => {
  let icon = <BiUser />;
  if (type === "success") {
    icon = <BiUser color="white" />;
  }
  if (type === "error" || type === "warning" || type === "info") {
    icon = <BiUser color="white" />;
  }

  toast(<ToastContainer icon={icon} message={message} />, {
    style: {
      background:
        type === "success"
          ? "#4caf50"
          : type === "error"
          ? "#f44336"
          : type === "warning"
          ? "#ff9000"
          : "#2196f3",
      color: "#fff",
    },
  });
};

export default CustomToast;
