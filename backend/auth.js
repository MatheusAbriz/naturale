import bcrypt from "bcrypt";       // ou bcryptjs, se preferir
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET;
