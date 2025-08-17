package com.abraham_bankole.stridedotcom.repository;

import com.abraham_bankole.stridedotcom.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findByName(Category category);
}
