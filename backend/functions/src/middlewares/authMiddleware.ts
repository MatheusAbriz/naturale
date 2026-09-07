import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("ERRO CRÍTICO DE SEGURANÇA: A variável de ambiente JWT_SECRET não foi definida!");
}

interface CustomJwtPayload extends JwtPayload {
  id: number;
}

// O bloco "declare global" foi removido daqui porque já existe no index.d.ts!

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Acesso negado: Token não fornecido" });
  }

  jwt.verify(token, JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido ou expirado" });
    }

    const payload = decoded as CustomJwtPayload;

    if (!payload || typeof payload.id !== "number") {
      return res.status(403).json({ message: "Estrutura de token inválida" });
    }

    // O TypeScript agora lê a tipagem a partir do index.d.ts sem conflitos!
    req.user = {
      id: payload.id
    };

    next();
  });
}