let DATE = getMondayDate()
let USERS_LIST = 0
let TASKS_LIST = 0
let BACKLOG_LIST = []
window.addEventListener('load', renderApp);

function renderApp() {
    let date_array = [...renderTime(DATE)]
    if (!USERS_LIST.keys || !TASKS_LIST.keys) {
        const data = getData();
        data.then(data => {
            USERS_LIST = (data.userList)
            TASKS_LIST = (data.taskList)
            renderUsersList(data.userList);
            sortTask(data.taskList, date_array);
            renderBackLog(BACKLOG_LIST)
            addSearch()
            document.querySelector(`.arrow_left`).addEventListener('click', (e) => {
                e.preventDefault()
                prevWeek()
            })
            document.querySelector(`.arrow_right`).addEventListener('click', (e) => {
                e.preventDefault()
                nextWeek()
            })
            makeItDrag()
            addDragover()
            togglePreloader();
        });
    }
}

function refresh() {
    renderUsersList(USERS_LIST);
    sortTask(TASKS_LIST, [...renderTime(DATE)]);
    makeItDrag()
    addUserDragover()
    addUsersDateDragover()
}

function getData() {
    const userUrl = 'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users';
    const taskUrl = 'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/s\n' +
        'cript/tasks';
    return new Promise((resolve) => {
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
                <div class="user" data-id=${user.id}>${user[`firstName`]} ${user[`surname`]}</div>
                <div class="user_date" data-id = ${user.id} data-index = "0"></div>
                <div class="user_date" data-id = ${user.id} data-index = "1"></div>
                <div class="user_date" data-id = ${user.id} data-index = "2"></div>
                <div class="user_date" data-id = ${user.id} data-index = "3"></div>
                <div class="user_date" data-id = ${user.id} data-index = "4"></div>
                <div class="user_date" data-id = ${user.id} data-index = "5"></div>
                <div class="user_date" data-id = ${user.id} data-index = "6"></div>
                </div>
                `
        }).join('')
    }
    document.querySelector('.table').innerHTML = getHtml()
    //document.querySelector('.users_list').innerHTML = getHtml();
}

function sortTask(taskList, date_array) {
    /**
     * @param {{executor: number,}} task description
     */
    BACKLOG_LIST = []//обнуление листа иначе будет дублироваться

    for (let i = 0; i < taskList.length; i++) {
        let task = taskList[i]
        if (task.executor) {
            addTaskToUser(task, task.executor, date_array)
        } else {
            BACKLOG_LIST.push(task)
        }
    }

}

function renderBackLog(list) {
    const DOM_BACKLOG_LIST = document.querySelector('.backlog__list')
    DOM_BACKLOG_LIST.innerHTML = ''
    list.forEach(task => {
        DOM_BACKLOG_LIST.innerHTML += `<li class="task" data-id="${task.id}">
                        <span class="task__name"> ${task[`subject`]} </span>
                    </li>`
    })
    makeBackLogTasksMovable(DOM_BACKLOG_LIST)
}

function addTaskToUser(task, user_id, date_array) {
    /**
     * @param {{planEndDate: string, planStartDate: string, subject: number}} task description
     */
    let node = document.querySelector(`[data-id="${user_id}"]`)
    let isRes = false
    for (let i = 0; i < date_array.length; i++) {
        let day = date_array[i].split('.')[0]
        let month = date_array[i].split('.')[1]

        if (task.planEndDate === `2023-${month}-${day}`) {
            isRes = node.children[i + 1].innerHTML += `<div title=start-date:&nbsp;${task.planStartDate}&#013;end-date:&nbsp;${task.planEndDate} class="user__task task" data-id=${task.id}><span class="task__name"> ${task[`subject`]} </span></div>`
        }
    }
    return isRes
}

function togglePreloader() {
    document.querySelector('.load-overlay').style.visibility = 'hidden'
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
    refresh()
}

function prevWeek() {
    DATE.setDate(DATE.getDate() - 7)
    refresh()
}

function makeItDrag() {
    document.querySelectorAll('.task').forEach(task => {
        if (!task.classList.contains('movable')) {
            task.draggable = true;
            task.addEventListener("dragstart", (e) => {
                e.target.classList.add(`selected`);
            })
            task.addEventListener("dragend", (e) => {
                e.target.classList.remove(`selected`);
                refresh()
            })
            task.classList.add('movable')

        }

    })
}

function addDragover() {
    addUserDragover()
    addUsersDateDragover()
    addBacklogDragOver()
}

function addSearch() {
    let input = document.querySelector('.backlog__input')

    document.querySelector('.search__button').addEventListener('click', () => {
        searchTask(input.value)
    })
}

function searchTask(value) {
    if (value) {
        let filtered_backlog = BACKLOG_LIST.filter(task => task.subject.toUpperCase().includes(value.toUpperCase()))
        renderBackLog(filtered_backlog)
    } else {
        renderBackLog(BACKLOG_LIST)
    }
}

function makeBackLogTasksMovable(backlog) {
    backlog.childNodes.forEach(task => {
        task.draggable = true;
        task.addEventListener("dragstart", (e) => {
            e.target.classList.add(`selected`);
        })
        task.addEventListener("dragend", (e) => {
            e.target.classList.remove(`selected`);
        })
    })
}

function addUserDragover() {
    let dragOverElements = document.querySelectorAll('.user')
    dragOverElements.forEach(cell => {
        cell.addEventListener('dragover', (e) => {
            e.preventDefault()
            const activeElement = document.querySelector(`.selected`);
            const currentElement = e.target;
            if (activeElement === currentElement) {
                return;
            }
            if (currentElement.classList.contains('user')) {
                currentElement.appendChild(activeElement)
            }
        })
        cell.addEventListener('drop', (e) => {
            e.preventDefault()
            const activeElement = document.querySelector(`.selected`);
            const currentElement = e.target;
            if (activeElement === currentElement) {
                return;
            }
            if (currentElement.classList.contains('user')) {
                TASKS_LIST[TASKS_LIST.findIndex(task => task.subject === activeElement.innerText)].executor = currentElement.dataset.id
                addTaskToUser(TASKS_LIST[TASKS_LIST.findIndex(task => task.subject === activeElement.innerText)], currentElement.dataset.id, [...renderTime(DATE)])
                removeTaskFromBacklog(activeElement.innerText)
            }
        });

    })
}

function addBacklogDragOver() {
    let backlogList = document.querySelector('.backlog__list')
    backlogList.addEventListener(`dragover`, (evt) => {
        evt.preventDefault();
        const activeElement = document.querySelector(`.selected`);
        const currentElement = evt.target;
        if (activeElement === currentElement || currentElement.tagName === "SPAN") {
            return;
        }
        const getNextElement = (cursorPosition, currentElement) => {
            // Получаем объект с размерами и координатами
            const currentElementCoord = currentElement.getBoundingClientRect();
            // Находим вертикальную координату центра текущего элемента
            const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;
            // Если курсор выше центра элемента, возвращаем текущий элемент
            // В ином случае — следующий DOM-элемент
            return (cursorPosition < currentElementCenter) ?
                currentElement :
                currentElement.nextElementSibling;
        };
        const nextElement = getNextElement(evt.clientY, currentElement);
        TASKS_LIST[TASKS_LIST.findIndex(task => task.subject === activeElement.innerText)].executor = null
        backlogList.insertBefore(activeElement, nextElement);
    });

}

function addUsersDateDragover() {
    let dragOverElements = document.querySelectorAll(`.user_date`)
    dragOverElements.forEach(cell => {
        cell.addEventListener('dragover', (e) => {
            e.preventDefault()
            const activeElement = document.querySelector(`.selected`);
            const currentElement = e.target;
            if (activeElement === currentElement) {
                return;
            }
            if (currentElement.classList.contains(`user_date`) && activeElement.classList.contains('task')) {
                currentElement.appendChild(activeElement)
            }
        })
        cell.addEventListener('drop', (e) => {
            e.preventDefault()
            const activeElement = document.querySelector(`.selected`);
            const currentElement = cell;
            if (activeElement === currentElement) {
                return;
            }

            currentElement.appendChild(activeElement)
            removeTaskFromBacklog(activeElement.innerText)
            TASKS_LIST[TASKS_LIST.findIndex(task => task.subject === activeElement.innerText)].executor = currentElement.dataset.id
            let date_array = [...renderTime(DATE)]
            let day = date_array[currentElement.dataset.index].split('.')[0]
            let month = date_array[currentElement.dataset.index].split('.')[1]
            TASKS_LIST[TASKS_LIST.findIndex(task => task.subject === activeElement.innerText)].planEndDate = `2023-${month}-${day}`
        })

    });


}

function removeTaskFromBacklog(name) {
    return BACKLOG_LIST.splice(BACKLOG_LIST.findIndex(task => task.subject === name), 1)
}