import { Router } from "express";
const router = Router();

// Middleware to validate the body of request
import { body } from 'express-validator';
import { validationRequest } from '../../middlewares/validationRequest';
import { adminAccess } from "../../middlewares/validateAdminAccess";
import { validationToken } from "../../middlewares/validationToken";

// Category controller
import { 
    getAllCategories, 
    getCategoryByID, 
    createCategory, 
    updateCategory,
    deleteCategory
} from '../../controllers/categories.controller';

// Food Controller
import { 
    getAllFoodsByCategoryId, 
    createFood 
} from '../../controllers/foods.controllers'

router.route('/')
    .get(getAllCategories)
    .post([
        body('id').optional().not().exists().withMessage('Invalid request'),
        body('description').isLength({ min: 2 }).withMessage('must be at least 2 chars long'),
        body('icon').isLength({ min: 2 }).withMessage('must be at least 2 chars long')
    ], validationRequest, validationToken, adminAccess, createCategory);

router.route('/:categoryId')
    .get(getCategoryByID)
    .put([
        body('id').optional().not().exists().withMessage('Invalid request'),
        body('description').isLength({ min: 2 }).withMessage('must be at least 2 chars long'),
        body('icon').isLength({ min: 2 }).withMessage('must be at least 2 chars long')
    ], validationRequest, validationToken, adminAccess, updateCategory)
    .delete(validationRequest, validationToken, adminAccess, deleteCategory);

router.route('/:categoryId/foods/')
    .get(getAllFoodsByCategoryId)
    .post([
        body('id').optional().not().exists().withMessage('Invalid request'),
        body('title').isLength({ min: 2 }).withMessage('must be at least 2 chars long'),
        body('price').isFloat().withMessage('You must indicate a price'),
        body('description').isLength({ min: 2 }).withMessage('must be at least 2 chars long'),
        body('ingredients').isLength({ min: 2 }).withMessage('must be at least 2 chars long'),
        body('category_id').optional().not().exists().withMessage('Invalid request'),
    ], validationRequest, validationToken, adminAccess, createFood);

export default router;