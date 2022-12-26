const createTitleBlock = (text) => {
	const block = document.createElement('h1')
	block.textContent = text
	return block
}

const createStorageBlock = (storage, onClickFunc) => {
	const btn = document.createElement('button')

	btn.textContent = `Перейти на ${storage === 'localStorage' ? 'серверное' : 'локальное'} хранилище`
	btn.classList.add('btn-storage')

	btn.addEventListener('click', async function () {
		await onClickFunc(storage === 'localStorage' ? 'api' : 'localStorage')
	})

	return btn
}

const createFormBlock = () => {
	const form = document.createElement('form'),
		input = document.createElement('input'),
		button = document.createElement('button')

	input.placeholder = 'Введите...'
	button.textContent = 'Добавить дело'

	form.append(input, button)
	return { form, input }
}

const createItem = (data, { onDone, onDelete }) => {
	const item = document.createElement('li'),
		btnGroup = document.createElement('div'),
		btnDone = document.createElement('button'),
		btnDel = document.createElement('button')

	item.textContent = data.title
	btnDone.textContent = 'Готово'
	btnDel.textContent = 'Удалить'

	if (data.status === 'completed')
		item.classList.add('done')

	btnDone.addEventListener('click', async () => {
		const response = await onDone(data)
		if (response)
			item.classList.toggle('done', data.status === 'completed')
	})

	btnDel.addEventListener('click', async () => {
		if (confirm('Вы уверены?')) {
			const response = await onDelete(data)
			if (response)
				item.remove()
		}
	})

	btnGroup.append(btnDone, btnDel)
	item.append(btnGroup)
	return item
}

export default async ({
	title,
	insertSelector,
	owner,
	storage,
	listItems,
	onSubmitCreateItem,
	onClickDone,
	onClickDelete,
	onClickChangeStorage
}) => {
	const titleBlock = createTitleBlock(title),
		storageBlock = createStorageBlock(storage, onClickChangeStorage),
		formBlock = createFormBlock(),
		listBlock = document.createElement('ol'),
		handlers = { onDone: onClickDone, onDelete: onClickDelete }

	listItems.forEach(e => {
		listBlock.append(createItem(e, handlers))
	});
	
	formBlock.form.addEventListener('submit', async e => {
		e.preventDefault()
		
		const response = await onSubmitCreateItem({
			owner,
			title: formBlock.input.value.trim()
		});
		
		if (response)
			listBlock.append(createItem(response, handlers))
		formBlock.input.value = ''
	})

	document.querySelector(insertSelector).append(titleBlock, storageBlock, formBlock.form, listBlock)
}