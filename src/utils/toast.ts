import {toast } from "react-toastify";
import { setLoadingType } from "../Types";

export const toastError = (message: string, setLoading?: setLoadingType ) => {
  toast.error(message);
  setLoading && setLoading(false);
};

export const toastSuccess = (message: string,  setLoading?: setLoadingType ) => {
  toast.success(message);
  setLoading && setLoading(false);
};

export const toastWarning = (message: string, setLoading?: setLoadingType) => {
  toast.warning(message);
  setLoading && setLoading(false);
};

export const toastInfo = (message: string, setLoading?: setLoadingType) => {
  toast.info(message);
  setLoading && setLoading(false);
};
  