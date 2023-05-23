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
        renderUsersList(data.userList);
        renderTasksList(data.taskList);
    });
}

function getData() {
    const userUrl = 'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users';
    const taskUrl = 'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/s\n' +
        'cript/tasks';
    return new Promise((resolve, reject) => {
        Promise.all([fetch(userUrl), fetch(taskUrl)])
            .then(res => {
                Promise.all([res[0].json(), res[1].json()])
                    .then(response => {
                        resolve({
                            userList: response[0],
                            taskList: response[1],
                        });
                    });
            });
    });
}

function renderUsersList(userList) {

    const getHtml = () => {
        console.log(userList);
        return userList.map(user => {
            return `
                    <li> ${user.firstName} ${user.surname} </li>
                `;
        }).join('')
    };
    document.querySelector('.users_list').innerHTML = getHtml();
}

function renderTasksList(taskList) {
    console.log(taskList)
    const getHtml = () => {
        return taskList.map(task => {
            return `
                    <li> ${task.subject} </li>
                `;
        }).join('')
    };
    document.querySelector('.backlog').innerHTML = getHtml()
}

function togglePreloader() {

}