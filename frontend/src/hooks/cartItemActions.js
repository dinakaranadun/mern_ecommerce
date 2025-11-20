import { useAddToCartMutation, useRemoveProductMutation, useUpdateCartMutation } from "@/store/user/userCartsliceApi";
import { toast } from "react-toastify";




const CartItemActions = () => {
    
const [updateProductQuantity] = useUpdateCartMutation();
const [removeProduct] = useRemoveProductMutation()
const [addToCart] = useAddToCartMutation();
  
    const handleProductRemoving = async(cartId) => {
        try {
    
            const res = await removeProduct(cartId).unwrap();
            if(res.success){
            toast.info('Product removed', {
                position: 'bottom-right',
                autoClose: 1000,
                hideProgressBar: true,
                closeButton: false,
                icon: false
            });
            }
            
        } catch (error) {
            if (error?.status === 'FETCH_ERROR' || error?.error?.includes('Failed to fetch')) {
                    toast.error('Sorry.. Something went wrong');
                } else {
                    toast.error(error?.data?.message || error.error || 'Something went wrong');
                }
        }
    }

     const handleQuantityUpdate = async(cartItemId,quantity) => {
        try {
    
          const res = await updateProductQuantity({cartItemId,quantity}).unwrap();
          if(res.success){
            console.log('updated qty');
          }
       
        } catch (error) {
          if (error?.status === 'FETCH_ERROR' || error?.error?.includes('Failed to fetch')) {
                  toast.error('Sorry.. Something went wrong');
            } else {
                  toast.error(error?.data?.message || error.error || 'Something went wrong');
            }
        }
      }

      const addItemToCart = async (productId) => {
          try {
            const res = await addToCart({ productId, quantity: 1 }).unwrap();
            if (res.success) {
              toast.info('Product added to cart', {
                position: 'bottom-right',
                autoClose: 2000,
                hideProgressBar: true,
                closeButton: false,
                icon: false
              });
            }
          } catch (error) {
            if (error?.status === "FETCH_ERROR" || error?.error?.includes("Failed to fetch")) {
              toast.error("Sorry..Something Went Wrong");
            } else {
              toast.error(error?.data?.message || error.error || "Something went wrong");
            }
          }
        }

      return {handleQuantityUpdate,handleProductRemoving,addItemToCart}
}

export default CartItemActions