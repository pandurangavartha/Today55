export interface ProductAddModel {
    id: number;
    productName: string;
    productCode: string;
    categoryId: number;
    image: any;
    documentName: any;
    category: Category;
}

export interface Category {
    id: number;
    name: string;
}
export enum BootstrapAlertType {
    SUCCESS,
    INFO,
    WARNING,
    DANGER
}
export class BootstrapAlert {
    type: string;
    message: string;
    dismissable: boolean;
}
