export interface EntityAddModel {
    id: number;
    companyId: number;
    name: string;
    image: any;
    company: Company;
}

export interface Company {
    id: number;
    name: string;
}
