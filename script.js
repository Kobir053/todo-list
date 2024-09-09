let todoList = [];

window.onload = ()=>{
    // window.localStorage.clear();
    if(window.localStorage.getItem("todos") != null){
        const listFromLocalStorage = JSON.parse(window.localStorage.getItem("todos"));
        todoList = listFromLocalStorage;
        renderTable(listFromLocalStorage);
    }
}

// remove all the rows from table and set the table-head
const removeRows = () => {
    const table = document.querySelector("table");
    table.innerHTML = "";
    const tr = document.createElement("tr");

    const th1 = setElementWithTextContent("th", "ID");
    const th2 = setElementWithTextContent("th", "ToDo");
    const th3 = setElementWithTextContent("th", "Status");
    const th4 = setElementWithTextContent("th", "Change Status");
    const th5 = setElementWithTextContent("th", "Edit");
    const th6 = setElementWithTextContent("th", "Delete");

    tr.append(th1, th2, th3, th4, th5, th6);
    table.appendChild(tr);
}

// rendering a table-rows by recieved list
const renderTable = (myList) => {
    removeRows();
    myList.forEach((val) => {
        createTask(null,val);
    })
}

// generate id by the date including time.. 
const generateId = () => {
    let date = new Date();
    let dateString = `${date.getDate().toString()}/${(date.getMonth()+1).toString()}/${date.getFullYear().toString()}&`+
    `${date.getHours().toString()}:${date.getMinutes().toString()}:${date.getSeconds().toString()}:${date.getMilliseconds().toString()}`;
    return dateString;
}
// create complete task-row for recieved task
const createTask = (e = null, task = null) => {
    let newTask;
    // in case the function called to create task-row for a new task
    if(e != null){
        const taskName = document.querySelector(".addTaskDiv > input").value;
        newTask = {
            id: generateId(),
            name: taskName,
            status: false
        };
        todoList.push(newTask);
        window.localStorage.setItem("todos", JSON.stringify(todoList));
    }
    // in case the function called just to create task-row for existing task
    else{
        newTask = {
            id: task.id,
            name: task.name,
            status: task.status
        };
    }
    // create a tr with 6 td for him
    const newTR = document.createElement("tr");
    // set the td that will only have text
    let idToShow = newTask.id.substring(0,3) + "...";
    let statusToShow = newTask.status == false? "active": "done";
    const idTD = setElementWithTextContent("td", idToShow);
    const taskTD = setElementWithTextContent("td", newTask.name);
    const statusTD = setElementWithTextContent("td", statusToShow);
    // set td for the crud buttons
    const changeStatusTD = document.createElement("td");
    const editTD = document.createElement("td");
    const deleteTD = document.createElement("td");
    // buttons for crud
    const changeStatusBTN = setElementWithTextContent("button", "Change Status");
    const editBTN = setElementWithTextContent("button", "Edit");
    const deleteBTN = setElementWithTextContent("button", "Delete");
    // append the crud buttons to their td
    changeStatusTD.appendChild(changeStatusBTN);
    editTD.appendChild(editBTN);
    deleteTD.appendChild(deleteBTN);

    newTR.append(idTD, taskTD, statusTD, changeStatusTD, editTD, deleteTD);

    // set listeners to the buttons
    setListener(changeStatusBTN, changeStatus);
    setListener(editBTN, editTask);
    setListener(deleteBTN, deleteTask);
    // set id for the table-row - named of the task id
    newTR.setAttribute("id", newTask.id);

    const table = document.querySelector("table");
    table.appendChild(newTR);
}

// get the 'add-task-button' and set its click listener
const addTaskButton = document.querySelector(".addTaskDiv > button");
addTaskButton.addEventListener("click", createTask);

// change the task status to 'done', for the click listener of change status button
const changeStatus = (e) => {
    const td = e.target.parentElement;
    const tr = td.parentElement;
    const trID = tr.id;
    let taskIndex = todoList.findIndex((todo) => todo.id == trID);
    if(taskIndex != -1 && !todoList[taskIndex].status){
        todoList[taskIndex].status = true;
        window.localStorage.setItem("todos", JSON.stringify(todoList));
        renderTable(todoList);
    }
    else
        alert("could not change the status");
}

// edit the task name, for the click listener of edit button
const editTask = (e) => {
    let result = prompt("enter the new task name");
    const td = e.target.parentElement;
    const tr = td.parentElement;
    const trID = tr.id;
    const taskIndex = todoList.findIndex((todo) => todo.id == trID);
    if(taskIndex != -1){
        todoList[taskIndex].name = result;
        window.localStorage.setItem("todos", JSON.stringify(todoList));
        renderTable(todoList);
    }
    else
        alert("could not change the task name");
}

// delete the task, for the click listener of delete button
const deleteTask = (e) => {
    const td = e.target.parentElement;
    const tr = td.parentElement;
    const trID = tr.id;
    const taskIndex = todoList.findIndex((todo) => todo.id == trID);
    if(taskIndex != -1){
        todoList.splice(taskIndex, 1);
        window.localStorage.setItem("todos", JSON.stringify(todoList));
        renderTable(todoList);
    }
    else
        alert("could not delete the task");
}

// create element and set its text-content
const setElementWithTextContent = (element, textContent) => {
    const newElement = document.createElement(element);
    newElement.textContent = textContent;
    return newElement;
}

// set a listener for recieved button
const setListener = (btn, func) => {
    btn.addEventListener("click", func);
}

