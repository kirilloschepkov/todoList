import TOKEN from '../../token.js'

const hash = string => {
	let result = 0;
	for (let i = 0; i < string.length; i++) {
		result += string.charCodeAt(i);
	}
	return result;
};

export async function getTodoList(owner) {
	const response = await fetch(`https://gorest.co.in/public/v2/todos`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `Bearer ${TOKEN}`
		}
	})

	if (!response.status.toString().startsWith('2')) return
	return await response.json().then(res => res.filter(e => e.user_id === hash(owner)))
}

export async function createItem({ title, owner }) {
	const response = await fetch('https://gorest.co.in/public/v2/todos', {
		method: 'POST',
		body: JSON.stringify({
			user_id: hash(owner),
			title,
			status: "pending"
		}),
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `Bearer ${TOKEN}`
		}
	})

	if (!response.status.toString().startsWith('2')) return
	return await response.json()
}

export async function switchDone(data) {
	data.status = data.status === "completed" ? "pending" : "completed"
	const response = await fetch(`https://gorest.co.in/public/v2/todos/${data.id}`, {
		method: 'PATCH',
		body: JSON.stringify({ status: data.status }),
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `Bearer ${TOKEN}`
		}
	})

	if (!response.status.toString().startsWith('2')) return
	return true
}

export async function deleteItem(data) {
	const response = await fetch(`https://gorest.co.in/public/v2/todos/${data.id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `Bearer ${TOKEN}`
		}
	})

	if (!response.status.toString().startsWith('2')) return
	return true
}