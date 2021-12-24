import { Router } from "express";
const router = Router();

// Middleware to validate the body of request
import { body } from 'express-validator';
import { validationRequest } from '../../middlewares/validationRequest';
import { validationToken } from "../../middlewares/validationToken";
import { validateResourceOwner } from '../../middlewares/validateResourceOwner';

// Controllers
import { updateUser } from '../../controllers/users.controller';
import { getAllAddressFromUser } from '../../controllers/addresses.controller';

router.route('/:userId')
    .put([
        body('id').optional().not().exists().withMessage('Invalid request'),
        body('password').optional().isLength( {min: 6} ).withMessage('You must enter a password with at least 6 digits'),
        body('full_name').isLength( {min:1} ).withMessage('You must indicate your name'),
        body('dni').isLength( {min:9} ).withMessage('You must indicate your DNI'),
        body('phone_number').isLength( {min:12} ).withMessage('You must indicate your Phone Number'),
    ], validationRequest, validationToken, validateResourceOwner, updateUser);

router.route('/:userId/addresses')
    .get( validationToken, validateResourceOwner, getAllAddressFromUser )

export default router;