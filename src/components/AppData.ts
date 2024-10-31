import { Model } from './base/Model';
import {
	IProduct,
	IOrder,
	IAppState,
	PaymentMethod,
	FormErrors,
	IContactInfoForm,
} from '../types/index';
import { EventEmitter } from './base/events';

export type CatalogChangeEvent = {
	catalog: IProduct[];
};

export class AppState extends Model<IAppState> {
	catalog: IProduct[];
	preview: string | null;
	order: IOrder | null;
	formErrors: FormErrors;

	constructor(events: EventEmitter) {
		super({} as IAppState, events);
		this.catalog = [];
		this.preview = null;
		this.order = null;
		this.formErrors = {};
	}

	getProduct(productId: string): IProduct | undefined {
		return this.catalog.find((product) => product.id === productId);
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	getItemsCount(): number {
		if (this.order) {
			return this.order.items.length;
		}
		return 0;
	}

	getItemsTotal(): number {
		if (this.order) {
			return this.order.items
				.map((item) => item.price)
				.reduce((sum, i) => sum + i, 0);
		}
		return 0;
	}

	addToOrder(product: IProduct): void {
		if (this.order) {
			if (!this.order.items.some((_product) => _product.id === product.id)) {
				this.order.items.push(product);
			}
		} else {
			this.order = {
				payment: PaymentMethod.card,
				address: '',
				email: '',
				phone: '',
				items: [product],
			};
			this.events.emit('order:updated', this.order);
		}
		this.events.emit('basket:changed', this.order);
	}

	removeFromOrder(productId: string): void {
		if (this.order) {
			this.order.items = this.order.items.filter(
				(item) => item.id !== productId
			);
			if (this.order.items.length === 0) {
				this.clearOrder();
			}
			this.events.emit('basket:changed', this.order);
		}
	}

	clearOrder(): void {
		this.order = null;
		this.events.emit('basket:changed');
	}

	setPreview(product: IProduct): void {
		this.preview = product.id;
		this.emitChanges('preview:changed', product);
	}

	setOrderField(field: keyof IContactInfoForm | 'address', value: string) {
		if (this.order) {
			this.order[field] = value;
			this.validateOrder();
		}
	}

	setPaymentMethod(value: PaymentMethod) {
		if (this.order) {
			this.order.payment = value;
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (this.order) {
			if (!this.order.email) {
				errors.email = 'Необходимо указать email';
			}
			if (!this.order.phone) {
				errors.phone = 'Необходимо указать телефон';
			}
			if (!this.order.address) {
				errors.address = 'Необходимо указать адрес';
			}
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
