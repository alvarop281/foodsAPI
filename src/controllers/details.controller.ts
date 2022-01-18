import { Request, Response } from 'express';

// Interface
import { DetailI } from '../interfaces/DetailI';
import { FoodI } from '../interfaces/FoodI';

// Middleware
import { successResponse, failResponse } from '../middlewares/response';

// Models
import { 
    selectDetailByOrderIdAndFoodId,
    createADetail,
    selectDetailByOrderIdAndId,
    updateDetailById,
    deleteDetailById,
    selectAllDetailsByOrderId
} from '../models/detail.model';
import { selectFoodById } from '../models/food.model';

export async function createDetail( req: Request, res: Response ){
    // Save data request
    const oldDetail: DetailI = req.body;
    oldDetail['order_id'] = req.params.orderId;

    // find food data
    const food: FoodI = await selectFoodById( oldDetail['food_id'] );
    if ( !food ) return res.status(401).json(
        failResponse([{
            "msg": "Food does not exist",
            "param": "food_id",
        }])
    );

    // check if the record to create already exists
    const recordExist: DetailI = await selectDetailByOrderIdAndFoodId( oldDetail['order_id'], oldDetail['food_id'] );
    if ( recordExist ) return res.status(401).json(
        failResponse([{
            "msg": "Food already exists",
            "param": "food_id",
        }])
    );

    // Save data
    oldDetail['unit_price'] = food.price;
    oldDetail['total_by_product'] = oldDetail['ordered_quantity'] * oldDetail['unit_price'];

    await createADetail( oldDetail );

    const detail: DetailI = await selectDetailByOrderIdAndFoodId( oldDetail['order_id'], oldDetail['food_id'] );

    // Success Response
    return res.status(201).json(
        successResponse( { detail }, { message: "Detail was created" } )
    )
}

export async function updateDetail( req: Request, res: Response ){

    let detail: DetailI = await selectDetailByOrderIdAndId( req.params.orderId, req.params.detailId );
    if ( !detail ) return res.status(401).json(
        failResponse([{
            "msg": "Bad request",
            "param": "food_id",
        }])
    );

    // find food data
    const food: FoodI = await selectFoodById( detail['food_id'] );
    
    // update data
    detail['unit_price'] = food.price;
    detail['total_by_product'] = req.body['ordered_quantity'] * detail['unit_price'];
    detail['ordered_quantity'] = req.body['ordered_quantity'];

    await updateDetailById( detail, req.params.detailId );
    
    // Success Response
    return res.status(200).json(
        successResponse( { detail }, { message: "Detail was updated" } )
    )
}

export async function deleteDetail( req: Request, res: Response ){
    let detail: DetailI = await selectDetailByOrderIdAndId( req.params.orderId, req.params.detailId );
    if ( !detail ) return res.status(401).json(
        failResponse([{
            "msg": "Bad request",
            "param": "detail_id",
        }])
    );

    await deleteDetailById( req.params.detailId );

    // Success Response
    return res.status(200).json(
        successResponse( { }, { message: "Detail was deleted" } )
    )

}

export async function getAllDetail( req: Request, res: Response ){
    const details: DetailI[] = await selectAllDetailsByOrderId( req.params.orderId );

    // Fail response
    if(!details[0]) return res.status(401).json(
        failResponse([{
            "msg": "Details do not exist",
            "param": "order_id",
        }])
    );

    // Success Response
    return res.status(200).json(
        successResponse( { details }, [] )
    )
}