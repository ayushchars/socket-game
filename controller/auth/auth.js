import express  from "express"
import {register,login, getAllUser,getUserbyId, block, adminCreateUser, editUser, deleteUserById } from "./authContoller.js"
import validateUser from "../../middleware/validateUser.js"
import {isAdmin, requireSignin} from "../../middleware/authMiddleware.js"

const router = express.Router()

router.post("/register" ,validateUser, register)
router.post("/login" , login)
router.get('/allusers', requireSignin, getAllUser);
router.post('/getuserbyid', requireSignin, getUserbyId);
router.post('/adminCreateUser', requireSignin, adminCreateUser);
router.post('/block', requireSignin,isAdmin, block);
router.post('/editUser', requireSignin,isAdmin, editUser);
router.post("/deleteuserbyid", deleteUserById);
export default router