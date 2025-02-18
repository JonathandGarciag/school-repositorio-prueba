import { Router } from "express";
import { check } from "express-validator";
import { getUser, updateUser } from "../user/user.controller.js";

const router = Router();
 
router.get(
    "/", 
    getUser
);

router.put(
    "/:id", 
    updateUser
);


export default router;