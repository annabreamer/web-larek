import { AppState, CatalogChangeEvent } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { BasketItem, CatalogItem, ProductCard } from './components/Card';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import { Contacts, Order } from './components/Order';
import { Page } from './components/Page';
import { ProductAPI } from './components/ProductApi';
import './scss/styles.scss';
import { IContactInfoForm, IOrderForm, IProduct, PaymentMethod } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new ProductAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

// Модель данных приложения
const appData = new AppState(events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
		appData.clearOrder();
	},
});

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
		});
	});
});

// Отправлена форма контактной информации
events.on('contacts:submit', () => {
	const order = {
		payment: appData.order.payment,
		email: appData.order.email,
		phone: appData.order.phone,
		address: appData.order.address,
		total: appData.getItemsTotal(),
		items: appData.order.items.map((item) => item.id),
	};
	api
		.orderProducts(order)
		.then((result) => {
			success.total = result.total;
			modal.render({
				content: success.render({}),
			});
			appData.clearOrder();
		})
		.catch((err) => {
			console.error(err);
		});
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IContactInfoForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { address } = errors;
	order.valid = !address;
	order.errors = Object.values({ address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactInfoForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	'order.address:change',
	(data: { field: 'address'; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	'order.payment:change',
	(data: { field: 'payment'; value: string }) => {
		if (data.value === PaymentMethod.card) {
			appData.setPaymentMethod(PaymentMethod.card);
		}
		if (data.value === PaymentMethod.cash) {
			appData.setPaymentMethod(PaymentMethod.cash);
		}
		order.payment = appData.order.payment;
	}
);

// Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Открыть форму заказа
events.on('order:open', () => {
	appData.order.payment = PaymentMethod.card;
	appData.order.address = '';
	modal.render({
		content: order.render({
			payment: PaymentMethod.card,
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Переключиться на форму контактной информации
events.on('order:submit', () => {
	appData.order.email = '';
	appData.order.phone = '';
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменения в корзине, но лучше все пересчитать
events.on('basket:changed', () => {
	page.counter = appData.getItemsCount();
	if (appData.order) {
		basket.items = appData.order.items.map((item, index) => {
			const card = new BasketItem(cloneTemplate(cardBasketTemplate), {
				onClick: (event) => {
					appData.removeFromOrder(item.id);
				},
			});
			card.index = index + 1;
			return card.render({
				title: item.title,
				price: item.price,
			});
		});
	} else {
		basket.items = [];
	}
	basket.total = appData.getItemsTotal();
});

// Открыть товар
events.on('card:select', (item: IProduct) => {
	appData.setPreview(item);
});

// Изменен открытый выбранный лот
events.on('preview:changed', (item: IProduct) => {
	const isInBasket = appData.order?.items.some(
		(_product) => _product.id === item.id
	);
	const showItem = (item: IProduct) => {
		const card = new ProductCard(cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if (isInBasket) {
					appData.removeFromOrder(item.id); // Удаление из корзины
				} else {
					if (item.price > 0) {
						appData.addToOrder(item); // Добавление в корзину
					}
				}
				modal.close();
			},
		});

		if (isInBasket) {
			card.buttonAddToCart.textContent = 'Удалить из корзины';
			card.disableAddButton(false); // Кнопка остаётся активной для удаления
		} else {
			card.buttonAddToCart.textContent = 'В корзину';
			if (item.price > 0) {
				card.disableAddButton(false); // Активируем кнопку для добавления, если цена больше 0
			} else {
				card.disableAddButton(true); // Деактивируем кнопку, если цена 0
			}
		}

		modal.render({
			content: card.render(item),
		});
	};

	if (item) {
		showItem(item);
	} else {
		modal.close();
	}
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем товары с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
