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

export default router;