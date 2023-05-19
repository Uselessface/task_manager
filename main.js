/*
window.addEventListener('load', render)

const userUrl = 'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users'
const taskURL = 'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/tasks'

const users = []
const usersList = document.querySelector('.users_list')
fetch(userUrl).then(response => response.json()).then(data => users.push(...data)).then(() => {
    const userList = users.map(user => {
        return `
            <li>
                <span> ${user.firstName}</span> <span> ${user.surname}</span>
            </li>
`
    })
    usersList.innerHTML = userList

})
//fetch(taskURL).then(response => response.json()).then(data => tasks.push(...data))
*/


window.addEventListener('load', renderApp());

function renderApp() {
    const data = getData();
    data.then(data => {
        togglePreloader();
        renderUsersList(data[0]);
        renderTasksList(data[1]);
    });
}

function getData() {
    const userUrl = 'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users';
    const taskUrl = 'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/s\n' +
        'cript/tasks';
    return Promise.all([fetch(userUrl), fetch(taskUrl)]);
}

function renderUsersList(users) {


}

function renderTasksList(tasks) {
    console.log(tasks.json())
}

function togglePreloader() {

}