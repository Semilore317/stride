// if there's an error its probably from here
package com.abraham_bankole.stridedotcom.repository;

import com.abraham_bankole.stridedotcom.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryNameAndBrand(String category, String brand);
    List<Product> findByCategoryName(String category);
    List<Product> findByNameAndBrand(String brand, String name);
    List<Product> findByNameContainingIgnoreCase(String name);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))") //reduces the need to type the full name of the product
    List<Product> findByName(String name);
    List<Product> findByBrand(String brand);

    boolean existsByNameAndBrand(String name, String brand);
}
