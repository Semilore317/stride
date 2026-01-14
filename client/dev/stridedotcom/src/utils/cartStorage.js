/**
 * LocalStorage Cart Utilities
 * Manages cart data in localStorage for anonymous users
 */

const CART_STORAGE_KEY = 'stride_cart';

/**
 * Get cart from localStorage
 * @returns {Array} Array of cart items
 */
export const getStoredCart = () => {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading cart from localStorage:', error);
        return [];
    }
};

/**
 * Save cart to localStorage
 * @param {Array} items - Array of cart items
 */
export const saveCart = (items) => {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
};

/**
 * Clear cart from localStorage
 */
export const clearStoredCart = () => {
    try {
        localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing cart from localStorage:', error);
    }
};

/**
 * Add or update item in stored cart
 */
export const addItemToStoredCart = (product, quantity = 1) => {
    const items = getStoredCart();
    const existingIndex = items.findIndex(item => item.product.id === product.id);

    if (existingIndex >= 0) {
        // Update quantity of existing item
        items[existingIndex].quantity += quantity;
        items[existingIndex].totalPrice =
            items[existingIndex].quantity * parseFloat(product.price);
    } else {
        // Add new item
        items.push({
            id: Date.now(), // Temporary ID for localStorage item
            product: {
                id: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                images: product.images || []
            },
            quantity,
            unitPrice: parseFloat(product.price),
            totalPrice: quantity * parseFloat(product.price)
        });
    }

    saveCart(items);
    return items;
};

/**
 * Remove item from stored cart

 */
export const removeItemFromStoredCart = (productId) => {
    const items = getStoredCart();
    const filtered = items.filter(item => item.product.id !== productId);
    saveCart(filtered);
    return filtered;
};

/**
 * Update item quantity in stored cart

 */
export const updateItemQuantity = (productId, quantity) => {
    const items = getStoredCart();
    const index = items.findIndex(item => item.product.id === productId);

    if (index >= 0) {
        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            items.splice(index, 1);
        } else {
            items[index].quantity = quantity;
            items[index].totalPrice = quantity * items[index].unitPrice;
        }
        saveCart(items);
    }

    return items;
};

/**
 * Calculate cart totals
 */
export const calculateCartTotals = (items) => {
    return items.reduce(
        (acc, item) => ({
            totalAmount: acc.totalAmount + item.quantity,
            totalPrice: acc.totalPrice + item.totalPrice
        }),
        { totalAmount: 0, totalPrice: 0 }
    );
};
