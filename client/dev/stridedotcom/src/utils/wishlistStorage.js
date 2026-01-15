/**
 * LocalStorage Wishlist Utilities
 * Manages wishlist data in localStorage for anonymous users
 */

const WISHLIST_STORAGE_KEY = 'stride_wishlist';

/**
 * Get wishlist from localStorage
 * @returns {Array} Array of wishlist products
 */
export const getStoredWishlist = () => {
    try {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading wishlist from localStorage:', error);
        return [];
    }
};

/**
 * Save wishlist to localStorage
 * @param {Array} items - Array of products
 */
export const saveWishlist = (items) => {
    try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
        console.error('Error saving wishlist to localStorage:', error);
    }
};

/**
 * Clear wishlist from localStorage
 */
export const clearStoredWishlist = () => {
    try {
        localStorage.removeItem(WISHLIST_STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing wishlist from localStorage:', error);
    }
};

/**
 * Add product to wishlist
 * @param {Object} product - Product to add
 * @returns {Array} Updated wishlist
 */
export const addToStoredWishlist = (product) => {
    const items = getStoredWishlist();
    const exists = items.some(item => item.id === product.id);

    if (!exists) {
        items.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            images: product.images || []
        });
        saveWishlist(items);
    }

    return items;
};

/**
 * Remove product from wishlist
 * @param {number} productId - Product ID to remove
 * @returns {Array} Updated wishlist
 */
export const removeFromStoredWishlist = (productId) => {
    const items = getStoredWishlist();
    const filtered = items.filter(item => item.id !== productId);
    saveWishlist(filtered);
    return filtered;
};

/**
 * Check if product is in wishlist
 * @param {number} productId - Product ID to check
 * @returns {boolean} True if in wishlist
 */
export const isInStoredWishlist = (productId) => {
    const items = getStoredWishlist();
    return items.some(item => item.id === productId);
};
