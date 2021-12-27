import { Router } from "express";
const router = Router();

// Middleware to validate the body of request
import { body } from 'express-validator';
import { validationRequest } from '../../middlewares/validationRequest';
import { validationToken } from "../../middlewares/validationToken";
import { OrderBelongsToUser } from "../../middlewares/validateOrderBelongs";

// Controllers
import { 
    createDetail,
    updateDetail,
    deleteDetail,
    getAllDetail
} from '../../controllers/details.controller';

// orderDetail Route
router.route('/:orderId/details')
    .get( validationToken, OrderBelongsToUser, getAllDetail )
    .post([
        body('id').optional().not().exists().withMessage('Invalid request'),
        body('ordered_quantity').isInt({ min: 1 }).withMessage('You must indicate a quantity'),
        body('unit_price').optional().not().exists().withMessage('Invalid request'),
        body('total_by_product').optional().not().exists().withMessage('Invalid request'),
        body('food_id').isInt({ min: 1 }).withMessage('must be at least 2 chars long'),
        body('order_id').optional().not().exists().withMessage('Invalid request'),
    ], validationRequest, validationToken, OrderBelongsToUser, createDetail );

router.route('/:orderId/details/:detailId')
    .put([
        body('id').optional().not().exists().withMessage('Invalid request'),
        body('ordered_quantity').isInt({ min: 1 }).withMessage('You must indicate a quantity'),
        body('unit_price').optional().not().exists().withMessage('Invalid request'),
        body('total_by_product').optional().not().exists().withMessage('Invalid request'),
        body('food_id').optional().not().exists().withMessage('Invalid request'),
        body('order_id').optional().not().exists().withMessage('Invalid request'),
    ], validationRequest, validationToken, OrderBelongsToUser, updateDetail )
    .delete( validationToken, OrderBelongsToUser, deleteDetail );

export default router;