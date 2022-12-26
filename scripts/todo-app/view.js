const createTitleBlock = (text) => {
	const block = document.createElement('h1')
	block.textContent = text
	block.classList.add('mt-3', 'mb-3')
	return block
}

const createStorageBlock = (storage, onClickFunc) => {
	const btn = document.createElement('button')

	btn.textContent = `Перейти на ${storage === 'localStorage' ? 'серверное' : 'локальное'} хранилище`
	btn.classList.add('btn', 'btn-primary', 'mb-3')

	btn.addEventListener('click', async function () {
		await onClickFunc(storage === 'localStorage' ? 'api' : 'localStorage')
	})

	return btn
}

const createFormBlock = () => {
	const form = document.createElement('form'),
		wrapper = document.createElement('div'),
		label = document.createElement('label'),
		input = document.createElement('input'),
		btn = document.createElement('button')

	label.textContent = 'Введите запланированное дело'
	input.type = 'text'
	btn.textContent = 'Добавить дело'
	btn.type = 'submit'

	wrapper.classList.add('mb-3')
	label.classList.add('form-label')
	input.classList.add('form-control', 'bg-body-tertiary')
	btn.classList.add('btn', 'btn-primary')

	wrapper.append(label, input)
	form.append(wrapper, btn)
	return { form, input }
}

const createListBlock = () => {
	const list = document.createElement('ol')
	list.classList.add('mt-3')
	return list
}

const createItem = (data, { onDone, onDelete }) => {
	const item = document.createElement('li'),
		btnGroup = document.createElement('div'),
		btnDone = document.createElement('button'),
		btnDel = document.createElement('button')

	item.textContent = data.title
	btnDone.textContent = 'Готово'
	btnDel.textContent = 'Удалить'

	item.classList.add('fs-3', 'mb-2')
	btnDone.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'me-2')
	btnDel.classList.add('btn', 'btn-outline-primary', 'btn-sm')	

	if (data.status === 'completed')
		item.classList.add('text-decoration-line-through')

	btnDone.addEventListener('click', async () => {
		const response = await onDone(data)
		if (response)
			item.classList.toggle('text-decoration-line-through', data.status === 'completed')
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
		listBlock = createListBlock(),
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