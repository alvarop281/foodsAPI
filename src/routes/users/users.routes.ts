import { Router } from "express";
const router = Router();

// Middleware to validate the body of request
import { body, check } from 'express-validator';
import { validationRequest } from '../../middlewares/validationRequest';
import { validationToken } from "../../middlewares/validationToken";
import { validateResourceOwner } from '../../middlewares/validateResourceOwner';
import { OrderBelongsToUser } from "../../middlewares/validateOrderBelongs";

// Controllers
import { updateUser } from '../../controllers/users.controller';
import { 
    getAllAddressFromUser, 
    createAddress,
    getAddressFromUser,
    updateAddress,
    deleteAddress
} from '../../controllers/addresses.controller';
import { 
    createOrder,
    selectAllOrders,
    updateOrder
} from '../../controllers/orders.controller';

    // User Route
router.route('/:userId')
    .put([
        body('id').optional().not().exists().withMessage('Invalid request'),
        body('password').optional().isLength( {min: 6} ).withMessage('You must enter a password with at least 6 digits'),
        body('full_name').isLength( {min:1} ).withMessage('You must indicate your name'),
        body('dni').isLength( {min:9} ).withMessage('You must indicate your DNI'),
        body('phone_number').isLength( {min:12} ).withMessage('You must indicate your Phone Number'),
    ], validationRequest, validationToken, validateResourceOwner, updateUser);

    // Address Route
router.route('/:userId/addresses')
    .get( validationToken, validateResourceOwner, getAllAddressFromUser )
    .post([
        body('id').optional().not().exists().withMessage('Invalid request'),
        body('user_id').optional().not().exists().withMessage('Invalid request'),
        body('address').isLength({ min: 2 }).withMessage('must be at least 2 chars long'),
        body('reference').isLength({ min: 2 }).withMessage('must be at least 2 chars long')
    ], validationRequest, validationToken, validateResourceOwner, createAddress);

router.route('/:userId/addresses/:addressId')
    .get( validationToken, validateResourceOwner, getAddressFromUser)
    .put([
        body('id').optional().not().exists().withMessage('Invalid request'),
        body('user_id').optional().not().exists().withMessage('Invalid request'),
        body('address').isLength({ min: 2 }).withMessage('must be at least 2 chars long'),
        body('reference').isLength({ min: 2 }).withMessage('must be at least 2 chars long')
    ], validationRequest, validationToken, validateResourceOwner, updateAddress)
    .delete( validationToken, validateResourceOwner, deleteAddress);

    // Order Route
router.route('/:userId/orders')
    .get( validationToken, validateResourceOwner, selectAllOrders )
    .post([
        body('id').optional().not().exists().withMessage('Invalid request'),
        body('payment_type').optional().not().exists().withMessage('Invalid request'),
        body('proof_of_payment').optional().not().exists().withMessage('Invalid request'),
        body('delivery_method').optional().not().exists().withMessage('Invalid request'),
        body('commentary').optional().not().exists().withMessage('Invalid request'),
        body('status').optional().not().exists().withMessage('Invalid request'),
        body('address_id').optional().not().exists().withMessage('Invalid request'),
        body('user_id').optional().not().exists().withMessage('Invalid request')
    ], validationRequest, validationToken, validateResourceOwner, createOrder );

router.route('/:userId/orders/:orderId')
    .put([
        body('id').optional().not().exists().withMessage('Invalid request'),
        check('payment_type').optional().isIn(['cash', 'transfer', 'card']).withMessage('You must indicate a payment type'),
        check('delivery_method').optional().isIn(['delivery', 'pickUp']).withMessage('You must indicate a delivery method'),
        body('commentary').isLength({ min: 2 }).withMessage('must be at least 2 chars long'),
        body('status').optional().not().exists().withMessage('Invalid request'),
        body('address_id').isLength({ min: 1 }).withMessage('must be at least 2 chars long'),
        body('user_id').optional().not().exists().withMessage('Invalid request')
    ], validationRequest, validationToken, validateResourceOwner, OrderBelongsToUser, updateOrder);

export default router;