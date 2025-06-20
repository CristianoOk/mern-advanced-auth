import express from "express";
import { login, logout, signup, verifyEmail, forgotPassword, resetPassword, checkAuth  } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth) //La idea de esto es que se se pida cada vez que se actualice la page. Para que se chequee si el user esta autenticado o no.

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword); //Los dos puntos, ya sabés que son porque es un parámetro dinámico bb:).

export default router;