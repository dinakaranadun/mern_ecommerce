import { config } from "dotenv";
config(); 

export const { EMAIL_USER, EMAIL_PASSWORD } = process.env;
