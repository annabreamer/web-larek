export interface IProduct {
	id: string;
	description?: string;
	title: string;
	image: string;
	category: string;
    price: number | null;
}

// export interface IProductData {
// 	items: IProduct[];
// 	preview: string | null;
// }

export interface IAppState {
    catalog: IProduct[];
    preview: string | null;
    order: IOrder | null;
}

export interface IOrderForm {
    payment: string;
    address: string;
}

export interface IContactInfoForm {
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm, IContactInfoForm {
    items: IProduct[]
}




