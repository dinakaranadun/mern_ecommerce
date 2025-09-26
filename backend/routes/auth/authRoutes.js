import express from 'express';
import { registerUser, signInuser } from '../../controllers/auth/authController';


const authRouter = express.Router();

authRouter.post('/',registerUser);
authRouter.post('/logi',signInuser);

export default authRouter;
