import express from 'express';
import { registerUser, signInuser,updateUser,logOut,getProfile } from '../../controllers/auth/authController.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';


const authRouter = express.Router();

authRouter.post('/',registerUser);
authRouter.post('/login',signInuser);
authRouter.route('/profile').put(authMiddleware,updateUser).get(authMiddleware,getProfile);
authRouter.post('/logout',logOut);

export default authRouter;
