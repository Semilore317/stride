package com.abraham_bankole.stridedotcom.service.category;

import com.abraham_bankole.stridedotcom.model.Category;
import com.abraham_bankole.stridedotcom.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor // ensure the dependency used uses final modifier
public class CategoryService implements iCategoryService{
    private final CategoryRepository categoryRepository;
    @Override
    public Category addCategory(Category category) {
        return null;
    }

    @Override
    public Category updateCategory(Category category, Long categoryId) {
        return null;
    }

    @Override
    public void deleteCategory(Long categoryId) {

    }

    @Override
    public List<Category> getAllCategories() {
        return List.of();
    }

    @Override
    public Category findCategoryByName(String categoryName) {
        return null;
    }

    @Override
    public Category findCategoryById(Long categoryId) {
        return null;
    }
}
