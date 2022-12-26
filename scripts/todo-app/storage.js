const ID = 'nameStorage'

export function getStorage() {
    return localStorage.getItem(ID) ?? 'localStorage'
}

export function changeStorage(storage) {
    localStorage.setItem(ID, storage)
    location.reload();
}