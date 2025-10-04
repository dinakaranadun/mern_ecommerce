import express from 'express';
import { adminMiddleware, authMiddleware } from '../../middleware/authMiddleware.js';
import { upload } from '../../config/cloudinary.js';
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts, handleimageUpload } from '../../controllers/admin/productsController.js';



const adminProductRouter = express.Router();
 adminProductRouter.post('/products/imageUpload',authMiddleware,upload.single("my_file"),handleimageUpload);

adminProductRouter.get('/products', authMiddleware, fetchAllProducts);

adminProductRouter.post('/products',authMiddleware,adminMiddleware,addNewProduct);
adminProductRouter.put('/products/:id', authMiddleware, adminMiddleware,editProduct);
adminProductRouter.delete('/products/:id',authMiddleware,adminMiddleware,deleteProduct);

export default adminProductRouter;