import { Request, Response } from 'express';

// Interface
import { CategoryI } from '../interfaces/CategoryI';
import { FoodI } from '../interfaces/FoodI';

// Middleware
import { successResponse, failResponse } from '../middlewares/response';

// Category Model
import { selectAllCategories, 
        selectCategoryById, 
        createACategory, 
        selectCategoryByDescriptionAndIcon,
        updateCategoryById,
        deleteCategoryById
} from '../models/category.model';
import { selectAllFoodsByCategoryId } from '../models/food.model';

export async function getAllCategories( req: Request, res: Response ) {
    const categories: CategoryI[] = await selectAllCategories();

    // Fail response
    if(!categories[0]) return res.status(401).json(
        failResponse({
            "msg": "Categories do not exist",
            "param": "categoryID",
        })
    );

    // Success Response
    return res.status(200).json(
        successResponse( { categories }, [] )
    )
}

export async function getCategoryByID( req: Request, res: Response ){
    const id: string = req.params.categoryId;

    const category: CategoryI = await selectCategoryById(id);

    if (category)
        // Success Response
        return res.status(200).json(
            successResponse( { category }, [] )
        )
    else
        return res.status(401).json(
            failResponse({
                "msg": "Category does not exist",
                "param": "categoryID",
            })
        );

}

export async function createCategory( req: Request, res: Response ){
    const newCategory: CategoryI = req.body;
    
    await createACategory( newCategory );

    const category: CategoryI = await selectCategoryByDescriptionAndIcon( newCategory.description, newCategory.icon );

    // Success Response
    return res.status(201).json(
        successResponse( { category }, { message: "Category was created" } )
    )
}

export async function updateCategory( req: Request, res: Response ) {
    const id: string = req.params.categoryId;
    const category: CategoryI = req.body;

    // Check if category exist
    const isValid: CategoryI = await selectCategoryById(id);
    if(!isValid) return res.status(401).json(
        failResponse({
            "msg": "Category does not exist",
            "param": "categoryID",
        })
    );

    // Update category
    await updateCategoryById( category, id );
    category["id"]= id;

    // Success Response
    return res.status(200).json(
        successResponse( { category }, { message: "Category was updated" } )
    )

}


export async function deleteCategory( req: Request, res: Response ) {
    const id: string = req.params.categoryId;

    // Check if category exist
    const isValid: CategoryI = await selectCategoryById(id);
    if(!isValid) return res.status(401).json(
        failResponse({
            "msg": "Category does not exist",
            "param": "categoryID",
        })
    );

    // Check if category has foods
    const foods: FoodI[] = await selectAllFoodsByCategoryId( id );
    if ( foods ) return res.status(401).json(
        failResponse({
            "msg": "Category has foods",
            "param": "categoryID",
        })
    );

    // Delete category
    await deleteCategoryById( id );

    // Success Response
    return res.status(200).json(
        successResponse( { }, { message: "Category was deleted" } )
    )

}