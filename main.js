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
                <div class="user_row" data-id = ${user.id}>
                <div class="user">${user.firstName} ${user.surname}</div>
                <div class="user_date"></div>
                <div class="user_date"></div>
                <div class="user_date"></div>
                <div class="user_date"></div>
                <div class="user_date"></div>
                <div class="user_date"></div>
                <div class="user_date"></div>
                </div>
                `;
        }).join('')
    };
    document.querySelector('.table').innerHTML = getHtml()
    //document.querySelector('.users_list').innerHTML = getHtml();
}

function renderTasksList(taskList) {
    console.log(taskList)
    // const getUserTask = () =>{
    //     taskList.forEach((task, index)=>{
    //         if(task.executor){
    //             return()
    //         }
    //
    //     })
    // }
     console.log(document.querySelector(`[data-id='1']`))

    const getHtml = () => {
        return taskList.map(task => {
            return `
                    <li>
                        <span class="task__name"> ${task.subject} </span>
                        <span class="task__date"> ${task.endDate}</span>
                    </li>
                `;
        }).join('')
    };
    document.querySelector('.backlog__list').innerHTML = getHtml()
}

function togglePreloader() {

}