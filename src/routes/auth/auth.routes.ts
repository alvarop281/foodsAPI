import { Router } from "express";
const router = Router();

// Middleware to validate the body of request
import { body } from 'express-validator';

// User controllers
import { signin, login, profile } from "../../controllers/auth.controller";

// Middelwares
import { validationRequest } from '../../middlewares/validationRequest';
import { validationToken } from '../../middlewares/validationToken';

router.route('/signin/')
    .post([
        body('id').optional().not().exists().withMessage('Invalid request'),
        body('full_name').isLength( {min:1} ).withMessage('You must indicate your name'),
        body('password').isLength( {min: 6} ).withMessage('You must enter a password with at least 6 digits'),
        body('dni').isLength( {min:9} ).withMessage('You must indicate your DNI'),
        body('phone_number').isLength( {min:12} ).withMessage('You must indicate your Phone Number'),
    ], validationRequest, signin);

router.route('/login/')
    .post([
        body('password').isLength( {min: 6} ).withMessage('Invalid Password'),
        body('phone_number').isLength( {min:12} ).withMessage('You must indicate your Phone Number'),
    ], validationRequest, login);

router.route('/profile/')
    .get(validationToken, profile);


export default router;