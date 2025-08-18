package com.abraham_bankole.stridedotcom.service.image;

import com.abraham_bankole.stridedotcom.dtos.ImageDto;
import com.abraham_bankole.stridedotcom.model.Image;
import com.abraham_bankole.stridedotcom.model.Product;
import com.abraham_bankole.stridedotcom.repository.ImageRepository;
import com.abraham_bankole.stridedotcom.service.product.iProductService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImageService implements iImageService {
    private final ImageRepository imageRepository;
    private final iProductService productService;

    @Override
    public Image getImageById(Long imageId) {
        return imageRepository.findById(imageId)
                .orElseThrow(() -> new EntityNotFoundException("Image not found"));
    }

    @Override
    public void deleteImageById(Long imageId) {
        imageRepository.findById(imageId).ifPresentOrElse(imageRepository::delete,
                () -> {
                    throw new EntityNotFoundException("Image not found");
                });
    }

    @Override
    public void updateImage(MultipartFile file, Long imageId) {
        Image image = getImageById(imageId);
        try {
            // this is why the image data type is MultiPart
            image.setFileName(file.getOriginalFilename());
            image.setFileType(file.getContentType());
            image.setImage(new SerialBlob(file.getBytes()));
            imageRepository.save(image);
        } catch (IOException | SQLException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public List<ImageDto> saveImages(Long productId, List<MultipartFile> files) {
        // instead of returning the image entity directly to the frontend
        // we make use of a DTO (Data Transfer Object) that's returned to the frontend
        // allows to transfer stuff between server and client without exposing the internal entity structure
        Product product = productService.getProductsById(productId);
        List<ImageDto> savedImages = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                Image image = new Image();
                image.setFileName(file.getOriginalFilename());
                image.setFileType(file.getContentType());
                image.setImage(new SerialBlob(file.getBytes()));
                image.setProduct(product);

                String buildDownloadUrl = "/api/v1/images/download/";
                String downloadUrl = buildDownloadUrl + image.getId();
                image.setDownloadUrl(downloadUrl);

                Image savedImage = imageRepository.save(image);

                // update link to get the id of saved image link
                savedImage.setDownloadUrl(buildDownloadUrl + savedImage.getId());
                imageRepository.save(savedImage);

                // build the info to return to the frontend
                ImageDto imageDto = new ImageDto();
                imageDto.setId(savedImage.getId());
                imageDto.setFileName(savedImage.getFileName());
                imageDto.setDownloadUrl(savedImage.getDownloadUrl());

                savedImages.add(imageDto);

            } catch (IOException | SQLException e) {
                throw new RuntimeException(e);
            }
        }
        return savedImages;
    }
}