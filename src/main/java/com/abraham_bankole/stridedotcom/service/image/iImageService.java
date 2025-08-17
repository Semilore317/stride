package com.abraham_bankole.stridedotcom.service.image;

import com.abraham_bankole.stridedotcom.dtos.ImageDto;
import com.abraham_bankole.stridedotcom.model.Image;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface iImageService {
    Image getImageById(Long imageId);
    void deleteImageById(Long imageId);
    void updateImage(MultipartFile file, Long imageId);
    List<ImageDto> saveImages(List<MultipartFile> files, Long productId);
}
