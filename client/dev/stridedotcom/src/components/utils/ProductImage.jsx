import React, { useEffect } from 'react'

const ProductImage = ({productId}) => {
    const [productImage, setProductImage] = React.useState(null);
    useEffect(() => {
        const fetchProductImage  = async (id) => {
            try{
                const response = await fetch(`https://localhost:9090/api/v1/images/image/download/${id}`);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    setProductImage(reader.result);
                };
                reader.readAsDataURL(blob);
            }catch (error){
                console.error("Error fetching image:", error);
            }
            
        }

        if(productId){
            fetchProductImage(productId);
        }
    }, [productId]);

    if(!productId) return null;
  return (
    <div>
        <img src={productImage} alt='Product Image'/>
    </div>
  )
}

export default ProductImage