import { toast } from "react-toastify";

export function showToast({ type, message, ...rest }) {
    return toast[type]?.(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        ...rest,
    });
}
