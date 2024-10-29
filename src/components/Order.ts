import { IContactInfoForm, IOrderForm, PaymentMethod } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class Order extends Form<IOrderForm> {
	protected buttonCash: HTMLButtonElement;
	protected buttonCard: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.buttonCash = ensureElement<HTMLButtonElement>(
			'.button_alt[name=cash]',
			container
		);
		this.buttonCard = ensureElement<HTMLButtonElement>(
			'.button_alt[name=card]',
			container
		);

		this.buttonCard.addEventListener('click', () => {
			this.onInputChange('payment', 'card'); 
			this.payment = PaymentMethod.card;
		});

		this.buttonCash.addEventListener('click', () => {
			this.onInputChange('payment', 'cash');
			this.payment = PaymentMethod.cash;
		});
	}

	set payment(value: PaymentMethod) {
		this.buttonCash.classList.toggle(
			'button_alt-active',
			this.buttonCash.name === value
		);
		this.buttonCard.classList.toggle(
			'button_alt-active',
			this.buttonCard.name === value
		);
	}

	disableButtons() {
		this.buttonCash.disabled = true;
		this.buttonCard.disabled = true;
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}

export class Contacts extends Form<IContactInfoForm> {
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
}
