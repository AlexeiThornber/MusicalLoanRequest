import { keyToValueConverter, Items } from '../../items/item-list.js';

//prevent from the buttons to behave like a form
document.getElementById('createEventForm').addEventListener('submit', function(event) {
    event.preventDefault();
});


//Change this to a map
export const mapSelectedItems = new Map();

/**
 * The following code is the radio button handler for the 
 * different categories of items
 */

let radioButtons = document.querySelectorAll("input[name='category']");
let selectedCategory = document.querySelector("input[name='category']:checked");; //default value

radioButtons.forEach(radioButton => {
    radioButton.addEventListener("change", () =>  {
        selectedCategory = document.querySelector("input[name='category']:checked");
        switch(selectedCategory.value){
            case "Sound & Instruments":
                addHTMLOptions(Items.Sonorisation);
                addHTMLQuantity(Items.Sonorisation.FACADE_SCENE)
                break;
            case "Microphones":
                addHTMLOptions(Items.Micros);
                addHTMLQuantity(Items.Micros.PIED_MICRO)
                break;
            case "Cables":
                addHTMLOptions(Items.Cables);
                addHTMLQuantity(Items.Cables.XLR)
                break;
        }
    } );
})

let itemOptions = document.getElementById("item-selector")

window.addHTMLOptions = addHTMLOptions;

export function addHTMLOptions(category) {
    let options = ''
    for (let key in category) {
        const item = category[key];
        options += `<option value="${key}">${item.name}</option>`;
    }
    itemOptions.innerHTML = options;
}

//Default value
addHTMLOptions(Items.Sonorisation);

/**
 * The following code handles the item picker in the drop down menu
 */

let selection = document.getElementById("item-selector");

selection.addEventListener('change', () => {
    let selectedItem = selection.options[selection.selectedIndex].value;
    switch(selectedCategory.value){
        case "Sound & Instruments":
            for (let key in Items.Sonorisation) {
                const item = Items.Sonorisation[key];
                if (key == selectedItem) {
                    addHTMLQuantity(item);
                }
            }
            break;
        case "Microphones":
            for (let key in Items.Micros) {
                const item = Items.Micros[key];
                if (key == selectedItem) {
                    addHTMLQuantity(item);
                }
            }
            break;
        case "Cables":
            for (let key in Items.Cables) {
                const item = Items.Cables[key];
                if (key == selectedItem) {
                    addHTMLQuantity(item);
                }
            }
            break;
    }
})

export function addHTMLQuantity(item) {
    let inputNumber = document.getElementById("quantity");
    inputNumber.max = item.quantity;
    inputNumber.value = 1; // Reset the number inside the input tag to 1
}

//Default value
addHTMLQuantity(Items.Sonorisation.FACADE_SCENE)

window.addHTMLOptions = addHTMLOptions;

/**
 * The following code handles the save button when choosing an item
 */

export function saveSelection(){
    const itemSelection = document.getElementById("item-selector");
    const selectedItem = itemSelection.options[itemSelection.selectedIndex];

    //If the item is not yet contained in the set, then we proceed adding it
    if(!mapSelectedItems.has(selectedItem.value)){
        const quantitySelector = document.getElementById("quantity");
        const selectedQuantity = quantitySelector.value;


        mapSelectedItems.set(selectedItem.value, selectedQuantity);
        let convertedSelectedItem = keyToValueConverter(selectedItem.value , selectedCategory.value);
    
        let list = document.getElementById("item-list");
    
        let newItemHTML = `<li id = "${selectedItem.value}">
            <div class = "remove" onclick = "removeItem('${selectedItem.value}')">&times;</div>
            <div class = "item-content">${convertedSelectedItem.name}</div>
            <div class = "quantity">x${selectedQuantity}</div>
        </li>`
    
        list.innerHTML += newItemHTML; 
        // console.log(mapSelectedItems);
    }
}

export function removeItem(itemToRemove){
    mapSelectedItems.delete(itemToRemove);
    let liToDelete = document.getElementById(itemToRemove);
    liToDelete.remove();
    console.log(liToDelete);
}


window.saveSelection = saveSelection;
window.removeItem = removeItem;