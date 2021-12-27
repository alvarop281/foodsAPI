import {Request, Response, NextFunction} from 'express';

// Interface
import { OrdersI } from '../interfaces/OrderI';

// Model
import { selectOrderByOrderId } from '../models/order.model';

// Middleware
import { failResponse } from "./response";

export async function OrderBelongsToUser( req: Request, res: Response, next: NextFunction ){
    // Save params
    const orderId: string = req.params.orderId;

    // find order
    const order: OrdersI = await selectOrderByOrderId( orderId );

    // validate if order exist
    if ( !order ) return res.status(401).json(
        failResponse({
            "msg": "Order does not exist",
            "param": "orderId",
        })
    );

    // Validate if the order belongs to the user
    if ( order.user_id != req.user.id?.toString() ) return res.status(401).json(
        failResponse({
            "msg": "The order does not belong to the user",
            "param": "orderId",
        })
    );

    // Validate if the order is active
    if ( order.status !== 'active' ) return res.status(401).json(
        failResponse({
            "msg": "The order is not active",
            "param": "orderId",
        })
    );
    
    next();
}