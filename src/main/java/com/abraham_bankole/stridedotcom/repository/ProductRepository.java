// if there's an error its probably from here
package com.abraham_bankole.stridedotcom.repository;

import com.abraham_bankole.stridedotcom.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryNameAndBrand(String category, String brand);
    List<Product> findByCategoryName(String category);
    List<Product> findByNameAndBrand(String brand, String name);
    List<Product> findByName(String name);
}
