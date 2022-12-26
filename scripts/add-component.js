export default function (from, to) {
    fetch(from)
    .then(response => {
        return response.text()
    })
    .then(data => {
        document.querySelector(to).innerHTML = data;
    });
}