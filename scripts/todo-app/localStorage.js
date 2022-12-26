const ID = 'todo'

export async function getTodoList(owner) {
	const listTodo = await JSON.parse(localStorage.getItem(ID)) ?? []
	return listTodo.filter(e => e.owner === owner)
}

export async function createItem({ title, owner }) {
	const listTodo = JSON.parse(localStorage.getItem(ID)) ?? [],
		newItem = {
			owner,
			title,
			status: "pending",
			id: Date.now().toString()
		}

	listTodo.push(newItem)
	localStorage.setItem(ID, JSON.stringify(listTodo))

	return newItem
}

export async function switchDone(data) {
	try {
		data.status = data.status === "completed" ? "pending" : "completed"
		const listTodo = JSON.parse(localStorage.getItem(ID))
		listTodo.forEach(e => {
			if (e.id === data.id)
				e.status = data.status
		});
		localStorage.setItem(ID, JSON.stringify(listTodo))
	} catch (err) {
		return false
	}
	return true
}

export async function deleteItem(data) {
	try {
		const listTodo = JSON.parse(localStorage.getItem(ID))
		listTodo.forEach(e => {
			if (e.id === data.id)
				listTodo.splice(listTodo.indexOf(e), 1)
		});
		localStorage.setItem(ID, JSON.stringify(listTodo))
	} catch (err) {
		return false
	}
	return true
}