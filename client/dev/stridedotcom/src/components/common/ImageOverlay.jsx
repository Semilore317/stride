import React, { useRef, useEffect, useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import ProductImage from "../utils/ProductImage";

const ImageOverlay = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  const overlayRef = useRef(null);
  const imageContainerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
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

  useEffect(() => {
    // Reset zoom and position when image changes
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleTouchStart = (e) => {
    if (zoom > 1) return; // Disable swipe when zoomed
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (zoom > 1) return; // Disable swipe when zoomed
    touchEndX.current = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX.current;
    if (deltaX > 50) onNext();
    else if (deltaX < -50) onPrev();
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Close"
      >
        <X size={32} className="text-white" />
      </button>

      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
          aria-label="Zoom in"
        >
          <ZoomIn size={24} className="text-white" />
        </button>
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 1}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
          aria-label="Zoom out"
        >
          <ZoomOut size={24} className="text-white" />
        </button>
        <div className="px-3 py-2 bg-black/60 rounded-full text-white text-sm flex items-center">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Image Container */}
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center overflow-hidden">
        <div
          ref={imageContainerRef}
          className="relative w-full h-full flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
        >
          {images && images.length > 0 ? (
            <div
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                transition: isDragging ? "none" : "transform 0.2s ease-out",
              }}
            >
              <ProductImage
                productId={images[currentIndex].id}
                className="max-w-full max-h-[90vh] object-contain select-none"
                draggable="false"
              />
            </div>
          ) : (
            <div className="text-white text-xl">No image available</div>
          )}
        </div>

        {/* Navigation Buttons */}
        {images && images.length > 1 && zoom === 1 && (
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