
export function successResponse( objects: any, businessMessage: any ){
    return {
        objects,
        success: true,
        businessMessage
    }
}

export function failResponse ( businessError: any ){
    return{
        objects: [],
        success: false,
        businessError
    }
}