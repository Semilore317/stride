import React from 'react';

const ProductImage = ({ productId, className = '', alt = 'Product Image' }) => {
    if (!productId) return null;

    // Construct relative URL (proxied to backend via Vite config)
    const imageUrl = `/api/v1/images/image/download/${productId}`;

    const handleImageError = (e) => {
        console.error('Image load failed for ID:', productId);
        console.error('URL attempted:', e.target.src);
        // Optional: Set fallback (add a placeholder in public/)
        e.target.src = '/placeholder-image.jpg';  // Or a default base64 image
    };

    const handleImageLoad = () => {
        //console.log('Image loaded successfully for ID:', productId);
    };

    return (
        <img
            src={imageUrl}
            alt={alt}
            className={className}
            onError={handleImageError}
            onLoad={handleImageLoad}
        />
    );
};

export default ProductImage;