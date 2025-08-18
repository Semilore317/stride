package com.abraham_bankole.stridedotcom.controller;

import com.abraham_bankole.stridedotcom.dtos.ImageDto;
import com.abraham_bankole.stridedotcom.model.Image;
import com.abraham_bankole.stridedotcom.response.ApiResponse;
import com.abraham_bankole.stridedotcom.service.image.iImageService;
import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;




import java.sql.SQLException;
import java.util.List;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/images")
public class ImageController {
    private final iImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse> uploadImages(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("productId") Long productId){
        try {
            List<ImageDto> imageDto = imageService.saveImages(productId, files);
            return ResponseEntity.ok(new ApiResponse("Images uploaded successfully!", imageDto));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Upload Error!", e.getMessage()));
        }
    }

    @GetMapping("/image/download/{imageId}")
    public ResponseEntity<Resource> downloadImage(@PathVariable  Long imageId) throws SQLException {
        Image image = imageService.getImageById(imageId);
        ByteArrayResource resource = new ByteArrayResource(image.getImage().getBytes(1, (int) image.getImage().length()));
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(image.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""
                        + image.getFileName() + "\"").body(resource);
        //if there's an error it's probably  from casting the resource from Resource
    }
}
