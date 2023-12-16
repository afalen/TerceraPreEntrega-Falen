import express from 'express';
import passport from 'passport';
import { SessionsController } from '../controllers/sessions.controllers.js';
import { uploadProfile } from '../middlewares/multer.profile.js';

const router = express.Router()

// Ruta para agregar un nuevo usuario
router.post('/register', uploadProfile.single('file') , passport.authenticate('register',{failureRedirect: '/api/sessions/failregister'}), SessionsController.register);

// Ruta para cuando se detecta un fallo en el registro
router.get("/failregister", SessionsController.failRegister)

// Ruta para logueo del usuario
router.post("/login", passport.authenticate('login',{failureRedirect:'/api/sessions/faillogin'}) , SessionsController.login);

// Ruta para cuando se detecta un fallo en el logueo
router.get('/faillogin', SessionsController.failLogin)

router.get('/forgot', SessionsController.forgot)

router.post('/forgot-password', SessionsController.forgotPassword)

router.get('/reset-password', SessionsController.reset);

router.post('/reset-password', SessionsController.resetPassword) 

router.get('/generate_reset-link', SessionsController.generateLink);

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async(req,res)=>{})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), SessionsController.githubCallback)

router.get('/current', SessionsController.current)

export { router as sessionsRouter }