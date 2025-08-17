package com.abraham_bankole.stridedotcom.repository;

import com.abraham_bankole.stridedotcom.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findByName(String name); // if there's an error, its probably here - String vs Object
    boolean existsByName(String name);

}
