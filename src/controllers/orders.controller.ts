import { Request, Response } from 'express';

// Middleware
import { successResponse, failResponse } from '../middlewares/response';

// Interface
import { OrdersI } from '../interfaces/OrderI';
import { DetailI } from '../interfaces/DetailI';

// Models
import { 
    selectActiveOrderByUserId,
    createAAddress,
    selectAllOrderByUserId,
    updateOrderById
} from '../models/order.model';
import { selectAllDetailsByOrderId } from '../models/detail.model';
import { selectAdrressByUserIdAndAddressId } from '../models/address.model';

export async function createOrder( req: Request, res: Response ){
    // Save data from request
    const userId: string = req.params.userId;
    let order: OrdersI = req.body;
    order['user_id'] = userId;

    const oldOrder = await selectActiveOrderByUserId( userId );

    if ( !oldOrder ) {
        order['status'] = 'active';
        await createAAddress( order );
        order = await selectActiveOrderByUserId ( userId );
    } else {
        order = oldOrder;
    }

    // Success Response
    return res.status(201).json(
        successResponse( { order }, { message: "Order was created" } )
    )
}

export async function selectAllOrders( req: Request, res: Response ){
    // Save data from request
    const userId: string = req.params.userId;
    const orders: OrdersI = await selectAllOrderByUserId( userId );
    
    // Validate if the user has orders.
    if ( !orders ) return res.status(401).json(
        failResponse([{
            "msg": "Orders do not exist",
            "param": "id",
        }])
    );

    // Success Response
    return res.status(200).json(
        successResponse( { orders }, [] )
    )

}

export async function updateOrder( req: Request, res: Response ){
    // Save data from request
    const userId: string = req.params.userId;
    const orderId: string = req.params.orderId;
    const order: OrdersI = req.body;
    order['id']      = orderId;
    order['user_id'] = userId;

    // check if the order has details uploaded
    const details: DetailI[] = await selectAllDetailsByOrderId( orderId );
    if( details.length === 0 ) return res.status(401).json(
        failResponse([{
            "msg": "Details do not exist",
            "param": "id",
        }])
    );

    // check delivery_method field
    if ( order['delivery_method'] === 'pickUp' ){
        order['address_id'] = 'NULL';

    } else if ( order['delivery_method'] === 'delivery' ){

        // check if address exists
        const address = await selectAdrressByUserIdAndAddressId( userId, order['address_id'] );
        if( !address ) return res.status(401).json(
            failResponse([{
                "msg": "Address does not exist",
                "param": "address_id",
            }])
        );
    }

    // check payment_type field
    if ( order['payment_type'] === 'cash' || order['payment_type'] === 'card' ){
        order['proof_of_payment'] = 'NULL';
    } else {
        if(req.files){
            // validate if the image exists
            const proof: any = req.files.proof_of_payment;
            if( !proof ) return res.status(401).json(
                failResponse([{
                    "msg": "images does not exist",
                    "param": "proof_of_payment",
                }])
            );

            // Validate the file type
            if( proof.mimetype !== 'image/png' && proof.mimetype !== 'image/jpeg' ){

                return res.status(401).json(
                    failResponse([{
                        "msg": "File type must be png or jpeg",
                         "param": "File type"
                    }])
                );
            }

            // Store file
            proof.mv('./uploads/proof/' + userId + '/' + orderId  + '/' + proof.name, function ( error: any ){
                if(error) return res.status(401).json(
                    failResponse( [{errors: error}] )
                );
            });

            // Set name
            order['proof_of_payment'] = proof.name;
            
        } else {
            return res.status(401).json(
                failResponse([{
                    "msg": "images does not exist",
                    "param": "proof_of_payment",
                }])
            );
        }
    }

    // Set status order
    order['status'] = 'inProgress';

    await updateOrderById( order, orderId );

    // Success Response
    return res.status(200).json(
        successResponse( { order }, { message: "Order was updated" } )
    )

}