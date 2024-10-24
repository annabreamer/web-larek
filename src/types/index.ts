export interface IProduct {
	id: string;
	description?: string;
	title: string;
	image: string;
	category: string;
	price: number | null;
}

export interface IAppState {
	catalog: IProduct[];
	preview: string | null;
	order: IOrder | null;
	getProduct(productId: string): void;
	setCatalog(items: IProduct[]): void;
	getItemsCount(): number;
	addToOrder(product: IProduct): void;
	removeFromOrder(productId: string): void;
	clearOrder(): void;
	setPreview(product: IProduct): void;
	setOrderField(field: keyof IContactInfoForm | 'address', value: string): void;
	setPaymentMethod(value: PaymentMethod): void;
	validateOrder(): void;
}

export enum PaymentMethod {
	Online = 'Онлайн',
	OnDelivery = 'При получении',
}

export interface IOrderForm {
	payment: PaymentMethod;
	address: string;
}

export interface IContactInfoForm {
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm, IContactInfoForm {
	items: IProduct[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;
