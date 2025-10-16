import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";
import ProductImage from "../utils/ProductImage";

const ImageOverlay = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  const overlayRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    // Prevent body scroll when overlay is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX.current;
    if (deltaX > 50) onNext();
    else if (deltaX < -50) onPrev();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fadeIn"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Close"
      >
        <X size={32} className="text-white" />
      </button>

      {/* Image Container */}
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center">
        <div
          className="relative w-full h-full flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {images && images.length > 0 ? (
            <ProductImage
              productId={images[currentIndex].id}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-white text-xl">No image available</div>
          )}
        </div>

        {/* Navigation Buttons */}
        {images && images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              aria-label="Previous image"
            >
              <span className="text-white text-2xl">◀</span>
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              aria-label="Next image"
            >
              <span className="text-white text-2xl">▶</span>
            </button>
          </>
        )}

        {/* Image Counter */}
        {images && images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/60 rounded-full text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageOverlay;