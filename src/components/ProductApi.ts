import { IOrder, IProduct } from '../types';
import { Api, ApiListResponse } from './base/api';

export interface IProductAPI {
	getProductList: () => Promise<IProduct[]>;
	getProductItem: (id: string) => Promise<IProduct>;
	orderProducts: (order: IOrder) => Promise<IOrder>;
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

	orderProducts(order: IOrder): Promise<IOrder> {
		return this.post('/order', {
			payment: order.payment,
			email: order.email,
			phone: order.phone,
			address: order.address,
			total: order.items
				.map((item) => item.price)
				.reduce((sum, i) => sum + i, 0),
			items: order.items.map((item) => item.id),
		}).then((data: object) => data as IOrder);
	}
}
