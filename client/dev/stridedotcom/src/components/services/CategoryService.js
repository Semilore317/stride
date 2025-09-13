import { api } from "./api";

export const getAllCategories = async () => {
    const response = await api.get("/categories/all");
    return response.data.data; // unwrap data
};
