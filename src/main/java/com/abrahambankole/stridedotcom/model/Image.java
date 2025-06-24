package com.abrahambankole.stridedotcom.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Blob;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String filename;
    private String fileType;
    @Lob
    private Blob image; // Binary Large Object for image, CLOB - Character Large Object for text

    private String downloadUrl;

    // set up relationship between image and product - one product to many images
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}
