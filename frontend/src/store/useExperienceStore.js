import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useExperienceStore = create((set) => ({
  experiences: [],
  loading: false,

  fetchExperiences: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/experiences/myexperiences");
      set({ experiences: res.data });
    } catch (error) {
      console.log(error);
      toast.error("Could not load your stories");
    } finally {
      set({ loading: false });
    }
  },

  deleteExperience: async (id) => {
    try {
      await axiosInstance.delete(`/experiences/${id}`);
      set((state) => ({
        experiences: state.experiences.filter((exp) => exp._id !== id),
      }));
      toast.success("Experience deleted");
      return true;
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
      return false;
    }
  },
}));