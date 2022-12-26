import createTodo from './view.js';
import { getStorage, changeStorage } from './storage.js'

export default async function (owner, insertSelector) {
	const storage = await getStorage()
	let { getTodoList, createItem, switchDone, deleteItem } =
		storage === 'localStorage' ?
			await import('./localStorage.js') :
			await import('./api.js');

	(async () => {
		createTodo({
			title: document.title,
			insertSelector,
			owner,
			storage,
			listItems: await getTodoList(owner),
			onSubmitCreateItem: createItem,
			onClickDone: switchDone,
			onClickDelete: deleteItem,
			onClickChangeStorage: changeStorage
		});
	})();
}