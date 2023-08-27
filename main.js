let DATE = getMondayDate()
let USERS_LIST = 0
let TASKS_LIST = 0
window.addEventListener('load', renderApp());
document.querySelector(`.arrow_left`).addEventListener('click', (e) => {
    prevWeek()
})
document.querySelector(`.arrow_right`).addEventListener('click', (e) => {
    nextWeek()
})

function renderApp() {
    let date_array = [...renderTime(DATE)]
    if (!USERS_LIST.keys || !TASKS_LIST.keys) {
        const data = getData();

        data.then(data => {
            USERS_LIST = (data.userList)
            TASKS_LIST = (data.taskList)
            togglePreloader();
            renderUsersList(data.userList);
            renderTasksList(data.taskList, date_array);
            makeItDrag()
        });
    } else {
        togglePreloader();
        renderUsersList(USERS_LIST);
        renderTasksList(TASKS_LIST, date_array);
        makeItDrag()
    }

    return
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
        return userList.map((user) => {
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
                `
        }).join('')
    }
    document.querySelector('.table').innerHTML = getHtml()
    //document.querySelector('.users_list').innerHTML = getHtml();
}

function renderTasksList(taskList, date_array) {
    TASKS_LIST[7].executor = 3
    TASKS_LIST[7].planEndDate = `2023-09-05`
    console.log(date_array)
    for (let i = 0; i < taskList.length; i++) {
        let task = taskList[i]
        if (task.executor) {
            addTaskToUser(task, task.executor, date_array)
        } else {
            document.querySelector('.backlog__list').innerHTML += `<li class="task">
                        <span class="task__name"> ${task.subject} </span>
                    
                    </li>`
        }
    }
}

function addTaskToUser(task, user_id, date_array) {
    let node = document.querySelector(`[data-id="${user_id}"]`)
    let isRes = false
    for (let i = 0; i < date_array.length; i++) {
        let day = date_array[i].split('.')[0]
        let month = date_array[i].split('.')[1]

        if (task.planEndDate === `2023-${month}-${day}`) {
            isRes = node.children[i + 1].innerHTML += `<div class="user__task task"><span class="task__name"> ${task.subject} </span></div>`
        }
    }
    return isRes
}

function togglePreloader() {

}

function getMondayDate() {
    let targetDay = 1;
    let targetDate = new Date()
    let delta = targetDay - targetDate.getDay();
    if (!delta >= 0) {
        targetDate.setDate(targetDate.getDate() + delta)
    } else {
        targetDate.setDate(targetDate.getDate() + 7 + delta)
    }
    console.log('moday date is ' + targetDate)
    return targetDate

}

function renderTime(date) {
    let copy = new Date(date)
    let resultArr = []
    const DATE_LINE = document.querySelector(".date-line")
    for (let element of DATE_LINE.children) {
        let day;
        let month = copy.getMonth() + 1;
        month.toString().length === 1 ? month = `0${month}` : month = `${month}`
        copy.getDate().toString().length === 1 ? day = "0" + (copy.getDate()) : day = copy.getDate()

        resultArr.push(day + "." + month)
        element.innerText = resultArr[resultArr.length - 1]
        copy.setDate(copy.getDate() + 1);
    }
    return resultArr
}

function nextWeek() {
    DATE.setDate(DATE.getDate() + 7)
    renderApp()
}

function prevWeek() {
    DATE.setDate(DATE.getDate() - 7)
    renderApp()
}

function makeItDrag() {
    const dragOverElements = document.querySelectorAll(`.user_date`)
    document.querySelectorAll('.task').forEach(task => {
        task.draggable = true;
        task.addEventListener("dragstart", (e) => {
            e.target.classList.add(`selected`);
        })
        task.addEventListener("dragend", (e) => {
            e.target.classList.remove(`selected`);
        })


    })
    dragOverElements.forEach(cell => {
        cell.addEventListener('dragover', (e) => {
            e.preventDefault()
            console.log(e.target)
            const activeElement = document.querySelector(`.selected`);
            const currentElement = e.target;
            const isMovable = activeElement !== currentElement && currentElement.classList.contains(`user_date`);
            if (!isMovable) {
                return;
            }
            currentElement.appendChild(activeElement)
        });
        })

}