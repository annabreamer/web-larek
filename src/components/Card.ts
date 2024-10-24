import { ensureElement } from '../utils/utils';
import { Component } from './base/Components';

interface IProductCardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IProduct {
	title: string;
	description?: string;
	image: string;
	category: string;
	price: number | null;
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

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
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
	}
}

export class ProductCard extends CatalogItem {
	protected _description?: HTMLElement;

	constructor(container: HTMLElement, actions?: IProductCardActions) {
		super(container, actions);
		this._description = container.querySelector(`.${this.blockName}__text`);
	}

	set description(value: string) {
		this.setText(this._description, value);
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
