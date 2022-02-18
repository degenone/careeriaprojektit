export interface INWProductsResponse {
    productId: number;
    productName: string;
    supplierId: number;
    categoryId: number;
    quantityPerUnit: string;
    unitPrice: number;
    unitsInStock: number;
    unitsOnOrder: number;
    reorderLevel: number;
    discontinued: boolean;
    imageLink: string;
    orderDetails: any;
}

export interface INWSuppliersResponse {
    address: string;
    city: string;
    companyName: string;
    contactName: string;
    contactTitle: string;
    country: string;
    fax: string;
    homePage: string;
    phone: string;
    postalCode: string;
    products: any;
    region: string;
    supplierId: number;
}

export type Category = {
    categoryId: number;
    categoryName: string;
    description: string;
    picture: string;
}