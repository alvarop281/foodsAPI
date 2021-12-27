import { Request, Response } from 'express';
import fs from 'fs';

// Interface
import { FoodI } from '../interfaces/FoodI';
import { CategoryI } from '../interfaces/CategoryI';

// Middleware
import { successResponse, failResponse } from '../middlewares/response';

// Models
import { 
    selectAllFoodsByCategoryId,
    selectFoodById,
    createAFood,
    deleteFoodById,
    updateAFood
} from '../models/food.model';
import { selectCategoryById } from '../models/category.model';

export async function getAllFoodsByCategoryId( req: Request, res: Response ) {
    const id: string = req.params.categoryId;

    const foods: FoodI[] = await selectAllFoodsByCategoryId( id );

    // Fail response
    if(!foods[0]) return res.status(401).json(
        failResponse({
            "msg": "Foods do not exist",
            "param": "categoryID",
        })
    );

    // Success Response
    return res.status(200).json(
        successResponse( { foods }, [] )
    )
}

export async function getFoodById( req: Request, res: Response ) {
    const id: string = req.params.foodId;

    const food: FoodI = await selectFoodById( id );

    // Fail response
    if(!food) return res.status(401).json(
        failResponse({
            "msg": "Food do not exist",
            "param": "categoryID",
        })
    );

    // Success Response
    return res.status(200).json(
        successResponse( { food }, [] )
    )
}

export async function createFood( req: Request, res: Response ){
    // Save params
    const id: string = req.params.categoryId;
    const category: CategoryI = await selectCategoryById( id );

    // Verify if category exist
    if(!category) return res.status(401).json(
        failResponse({
            "msg": "Category do not exist",
            "param": "categoryID",
        })
    );

    const newFood: FoodI = req.body;
    newFood['category_id'] = id;
    
    if(req.files){
        const img_1: any = req.files.img_1;
        const img_2: any = req.files.img_2;

        if(!img_1 || !img_2) return res.status(401).json(
            failResponse({
                "msg": "images does not exist",
                "param": "img_1 or img_2",
            })
        );

        // Try insert img_1
        const err_1 = await tryInsertImage( img_1 );
        if( err_1 ) return res.status(401).json(
            failResponse( {errors: err_1} )
        );
        // Try insert img_1
        const err_2 = await tryInsertImage( img_2 );
        if( err_2 ) return res.status(401).json(
            failResponse( {errors: err_2} )
        );

        // Save de name
        newFood['img_1'] = img_1.name;
        newFood['img_2'] = img_2.name;
    }

    await createAFood( newFood );

     // Success Response
     return res.status(201).json(
        successResponse( { newFood }, { message: "Food was Created" } )
    )
}

export async function deleteFood( req: Request, res: Response ){
    const id: string = req.params.foodId;

    // Check if food exist
    const food: FoodI = await selectFoodById( id );
    if(!food) return res.status(401).json(
        failResponse({
            "msg": "Food do not exist",
            "param": "ID",
        })
    );

    // Try to delete img_1
    let errors: any = await tryDeleteImage( food['img_1'] );
    if (errors) return res.status(401).json(
        failResponse({ errors: errors })
    );

    // Try to delete img_2
    let errors_2 = await tryDeleteImage( food['img_2'] );
    if (errors_2) return res.status(401).json(
        failResponse({ errors: errors_2 })
    );

    await deleteFoodById( id );

    // Success Response
    return res.status(200).json(
        successResponse( { }, { message: "Food was Deleted" } )
    )

}

export async function updateFood( req: Request, res: Response ){
    // Save the params
    const id = req.params.foodId;
    const food: FoodI = req.body;

    const oldfood = await selectFoodById( id );
    if ( !oldfood ) return res.status(401).json(
        failResponse({
            "msg": "Food do not exist",
            "param": "ID",
        })
    );

    // Save and store image
    if(req.files){
        const img_1: any = req.files.img_1;
        const img_2: any = req.files.img_2;
        
        if( img_1 ){
            const errorInsert_1 = await tryInsertImage( img_1 );
            if( errorInsert_1 ) return res.status(401).json(
                failResponse( {errors2: errorInsert_1} )
            );

            const errorDelete_1 = await  tryDeleteImage( oldfood['img_1'] );
            if ( errorDelete_1 ) return res.status(401).json(
                failResponse({ errors1: errorDelete_1 })
            );

            food['img_1'] = img_1.name;
        }

        if( img_2 ){
            const errorInsert_2 = await tryInsertImage( img_2 );
            if( errorInsert_2 ) return res.status(401).json(
                failResponse( {errors4: errorInsert_2} )
            );
            const errorDelete_2 = await  tryDeleteImage( oldfood['img_2'] );
            if ( errorDelete_2 ) return res.status(401).json(
                failResponse({ errors3: errorDelete_2 })
            );

            food['img_2'] = img_2.name;
        }
    }

    await updateAFood( food, id );

    // Success Response
    return res.status(200).json(
        successResponse( { food }, { message: "Food was Updated" } )
    )
}

async function tryInsertImage ( img: any ){
    // Validate the file type
    if( img.mimetype !== 'image/png' ){
        return { "msg": "File type must be image/png",
                 "param": "File type" }
    }

    // Store file 1
    img.mv('./uploads/foods/' + img.name, function ( error: any ){
        if(error) return { errors: error }
    });
}

async function tryDeleteImage( img: string ){
    if(img !== '' && img !== null){
        try {
            fs.unlinkSync('./uploads/foods/' + img)
        } catch(err) {
            return err;
        }
    }
}