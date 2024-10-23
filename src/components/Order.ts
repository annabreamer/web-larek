import { IContactInfoForm, IOrderForm, PaymentMethod } from '../types';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class Order extends Form<IContactInfoForm & IOrderForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set payment(value: PaymentMethod) {
		const paymentRadio = this.container.querySelector<HTMLInputElement>(
			`input[name="payment"][value="${value}"]`
		);
		if (paymentRadio) {
			paymentRadio.checked = true;
		}
	}
}
