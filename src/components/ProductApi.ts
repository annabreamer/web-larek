import { IContactInfoForm, IOrderForm, IProduct } from '../types';
import { Api, ApiListResponse } from './base/api';

interface IOrderRequest extends IOrderForm, IContactInfoForm {
	total: number;
	items: string[];
}

interface IOrderResult {
	id: string;
	total: number;
}

export interface IProductAPI {
	getProductList: () => Promise<IProduct[]>;
	getProductItem: (id: string) => Promise<IProduct>;
	orderProducts: (order: IOrderRequest) => Promise<IOrderResult>;
}

export class ProductAPI extends Api implements IProductAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductItem(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((item: IProduct) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderProducts(order: IOrderRequest): Promise<IOrderResult> {
		return this.post('/order', order).then((data: object) => data as IOrderResult);
	}
}
