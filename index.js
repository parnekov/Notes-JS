// variable declarations
const input = document.getElementById("mainInput");
const buttonAdd = document.getElementById("addButton");
const container = document.getElementById("generalUl");
const buttonDelDone = document.getElementById("deleteDone");
const buttonDelAll = document.getElementById("deleteAll");

// load actual data
renderList();
handleEnterButton();

// realize enter button
function handleEnterButton(){
    input.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
        addRowToList();
        renderList();
      }
    });
}

// add one row
function handleAddRow(){
        buttonAdd.onclick = ()=>{
        addRowToList();
        renderList();
    };
}

// delete one row
function handleDeleteRow(){
    const deleteBtns = document.getElementsByClassName("delete");
    const array = getArrayFromHTML(); 
    for (let index = 0; index < deleteBtns.length; index++) {
        deleteBtns[index].onclick = ()=>{
            if(deleteBtns[index].id == array[index].id){
                array[index] = "";
                uploadListToStorage(array);
                renderList();
            }            
        };
    }
}

// delete whole list
function handleDeleteAllRows(){
    buttonDelAll.onclick = ()=>{
        deleteList();   
        renderList();
    }
}

// delete rows, which was marked
function handleDeleteCheckedRows(){
    buttonDelDone.onclick = ()=>{
        const array = getArrayFromHTML(); 
        // updatedArray - array without cheked checkboxes
        const updatedArray = array.filter(element => element.isChecked === false);   
        uploadListToStorage(updatedArray);   
        renderList();
    };
}

// checkBox listener
function handleCheckBox(){
    let array = document.getElementsByClassName("checkBoxes");
    // assign function to onclick property of each checkbox
    for (let i=0; i < array.length; i++) {
        array[i].onclick = function() {
           pressCheckBox();
           renderList();
        }
    }
}


// get text form editText
function getDataFromInput(input){
    if(input.value !== ""){
        return input.value;
    }
    return alert("Please, Put some information to your note.");
}


// create object and add to array 
function createObject(text, isChecked = false, id = 0){
    return {
        text,
        isChecked,
        id};   
}

// call previous array from Html add new row and upload to storage
function addRowToList(){
    const array = getArrayFromHTML();
    let id = 0;
    if(array !== null && array !== undefined){
        id = array.length;
        array.push(createObject(getDataFromInput(input), false, id));
        uploadListToStorage(array);
        input.value ="";
    } else {
        array.push(createObject(getDataFromInput(input)));
        uploadListToStorage(array);
        input.value ="";
    }
}

// reupload list with new checkbox state
function pressCheckBox(){
    let array = getArrayFromHTML();
    uploadListToStorage(array);
    console.log("press checkbox");
}

// get array and upload to storage
function uploadListToStorage(toDoList){
    localStorage.setItem('todo', JSON.stringify(toDoList));
}

// dowload from storage
function downloadListFromSorage(){
    const todoListStorage = localStorage.getItem('todo'); 
    if(todoListStorage != undefined){
        return JSON.parse(todoListStorage);;
    }
}

// delete data from html and storage
function deleteList(){
        container.innerHTML ="<br>";
        localStorage.clear();
}

// get array of objects from html
function getArrayFromHTML(){
    const arrayFromWindow = [];
    const listOfLi = document.getElementById("listUl");
    if(listOfLi !== null){
        const lis = document.getElementById("listUl").getElementsByTagName("li");
        for (let index = 0; index < lis.length; index++) {
    
            let сheckBoxId = lis[index].getElementsByTagName("input")[0].id;
            let checkBoxElement = document.getElementById(сheckBoxId);
            let isChecked = checkBoxElement.checked;
        
            let elementSpan = lis[index].getElementsByTagName("span");
            let text = elementSpan[0].innerHTML;
    
            let id = lis[index].getElementsByTagName("button")[0].id;
            
            let obj = {
                text,
                isChecked,
                id
            }
            arrayFromWindow.push(obj);
        }
        return arrayFromWindow;
    } else{
        return arrayFromWindow;
    }
}

function renderList(){
    container.innerHTML ="";
    const dataToRender = downloadListFromSorage();
    const listOfLi = document.createElement("ul");
    listOfLi.setAttribute("id", "listUl");
    listOfLi.setAttribute("class", "ulClass");

    container.appendChild(listOfLi);

    let check = "";
    // create element li and push in ul

    // Iterate array and set in window
    if(dataToRender !== undefined){
        for (let index = 0; index < dataToRender.length; index++) {
            dataToRender[index].isChecked === true ? check = "checked" : check = "";
            let toDoNote = document.createElement('li');
            if(dataToRender[index].text !== undefined){
                toDoNote.innerHTML = `<input class="checkBoxes" id="checkId-${index}" type="checkbox" 
                ${check}><span class="textNote">${dataToRender[index].text}</span><button class="buttonDelete" id="${index}">Delete</button>`;
                listOfLi.appendChild(toDoNote);
            }
        }
    }
    handleAddRow();
    handleDeleteRow();
    handleDeleteAllRows();
    handleDeleteCheckedRows();
    handleCheckBox();
}