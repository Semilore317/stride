package com.abraham_bankole.stridedotcom.service.category;

import com.abraham_bankole.stridedotcom.model.Category;

import java.util.List;

public interface iCategoryService {
    Category addCategory(Category category);
    Category updateCategory(Category category, Long categoryId);
    void deleteCategory(Long categoryId);
    List<Category> getAllCategories();
    Category findCategoryByName(String categoryName);
    Category findCategoryById(Long categoryId);
}
