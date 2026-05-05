import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET = process.env.SECRET || "minha_chave_super_secreta";

// Extende a interface Request do Express para incluir o user
interface CustomJwtPayload extends JwtPayload {
  id: number;
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // pega só o token do "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido ou expirado" });
    }

    const payload = decoded as CustomJwtPayload;
    req.user = {
      id: payload.id
    }
    next();
  });
}