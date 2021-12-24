import { Router } from "express";
const router = Router();

// Middleware to validate the body of request
import { body } from 'express-validator';
import { validationRequest } from '../../middlewares/validationRequest';
import { adminAccess } from "../../middlewares/validateAdminAccess";
import { validationToken } from "../../middlewares/validationToken";

// Food Controller
import { 
    getFoodById,
    deleteFood,
    updateFood
} from '../../controllers/foods.controllers'

router.route('/:foodId')
    .get( getFoodById )
    .put([
        body('id').optional().not().exists().withMessage('Invalid request'),
        body('title').isLength({ min: 2 }).withMessage('must be at least 2 chars long'),
        body('price').isFloat().withMessage('You must indicate a price'),
        body('description').isLength({ min: 2 }).withMessage('must be at least 2 chars long'),
        body('ingredients').isLength({ min: 2 }).withMessage('must be at least 2 chars long'),
        body('category_id').optional().not().exists().withMessage('Invalid request'),
    ], validationRequest, validationToken, adminAccess, updateFood )
    .delete( validationRequest, validationToken, adminAccess, deleteFood );

export default router;