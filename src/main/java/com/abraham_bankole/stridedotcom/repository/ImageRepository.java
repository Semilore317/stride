package com.abraham_bankole.stridedotcom.repository;

import com.abraham_bankole.stridedotcom.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {

    List<Image> findByPrductId(Long id);
}
