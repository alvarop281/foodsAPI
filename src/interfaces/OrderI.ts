export interface OrdersI{
    id?: string;
    payment_type: string;
    proof_of_payment: string;
    delivery_method: string;
    commentary: string;
    status: string;
    address_id: string;
    user_id: string;
}