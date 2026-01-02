import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const usePreparationStore = create((set) => ({
  preps: [],
  loading: false,

  fetchPreparations: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/preparations");
      set({ preps: res.data });
    } catch (error) {
      console.log(error);
      toast.error("Could not load preparations");
    } finally {
      set({ loading: false });
    }
  },

  deletePreparation: async (id) => {
    try {
      await axiosInstance.delete(`/preparations/${id}`);
      set((state) => ({
        preps: state.preps.filter((item) => item._id !== id),
      }));
      toast.success("Preparation deleted");
      return true;
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
      return false;
    }
  },
}));