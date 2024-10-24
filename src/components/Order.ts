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
		const paymentButtons =
			this.container.querySelectorAll<HTMLButtonElement>('.button_alt');
		paymentButtons.forEach((button) => {
			button.classList.remove('button_alt-active');
			if (button.innerText === value) {
				button.classList.add('button_alt-active');
			}
		});
	}
}
