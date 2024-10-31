import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Components';

interface IProductCardActions {
	onClick: (event: MouseEvent) => void;
}

export class CardView extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IProductCardActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._button = container.querySelector(`.${blockName}__button`);
		this._price = container.querySelector(`.${blockName}__price`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number | null) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}
}

export class CatalogItem extends CardView {
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;

	constructor(container: HTMLElement, actions?: IProductCardActions) {
		super('card', container, actions);

		this._image = ensureElement<HTMLImageElement>(
			`.${this.blockName}__image`,
			container
		);
		this._category = container.querySelector(`.${this.blockName}__category`);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this.setText(this._category, value);
		switch (value) {
			case 'софт-скил':
				this._category.style.backgroundColor = '#83FA9D';
				break;
			case 'другое':
				this._category.style.backgroundColor = '#FAD883';
				break;
			case 'дополнительное':
				this._category.style.backgroundColor = '#B783FA';
				break;
			case 'кнопка':
				this._category.style.backgroundColor = '#83DDFA';
				break;
			case 'хард-скил':
				this._category.style.backgroundColor = '#FAA083';
				break;
			default:
				this._category.style.backgroundColor = '#83FA9D';
		}
	}
}

export class ProductCard extends CatalogItem {
	buttonAddToCart: HTMLButtonElement;
	protected _description?: HTMLElement;

	constructor(container: HTMLElement, actions?: IProductCardActions) {
		super(container, actions);
		this._description = container.querySelector(`.${this.blockName}__text`);
		this.buttonAddToCart = container.querySelector('.card__button');

		if (this.buttonAddToCart && actions?.onClick) {
			this.buttonAddToCart.addEventListener('click', actions.onClick);
		}
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	disableAddButton(disable: boolean) {
		if (this.buttonAddToCart) {
			this.buttonAddToCart.disabled = disable;
		}
	}
}

export class BasketItem extends CardView {
	protected _index?: HTMLElement;

	constructor(container: HTMLElement, actions?: IProductCardActions) {
		super('card', container, actions);
		this._index = container.querySelector(`.basket__item-index`);
	}

	set index(value: number) {
		this.setText(this._index, String(value));
	}
}
