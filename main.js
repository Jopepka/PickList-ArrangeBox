import { ArrangeBoxElement } from "./ArrangeBox.js";
import { items } from "./items.js"

function randomSelect(items) {
    const first = Math.floor(Math.random() * items.length)
    let second = Math.floor(Math.random() * items.length)
    while (second == first) second = Math.floor(Math.random() * items.length)
    return first < second ? items.slice(first, second) : items.slice(second, first)
}

function show(items) {
    alert(`Your memes: ${items.map(item => item.name)}`)
}

function sortName(itemDto1, itemDto2) {
    return itemDto1.name < itemDto2.name ? 1 : -1
}

function sortByLike(itemDto1, itemDto2) {
    return itemDto1.countLikes < itemDto2.countLikes ? 1 : -1
}

function serchByName(text, itemDto) {
    return itemDto.name.trim().toLowerCase().includes(text.trim().toLowerCase())
}

function newArrangeBox() {
    function createArrangeBox(items) {
        const arrangeBox = new ArrangeBoxElement()
        arrangeBox.appendItems(items)
        arrangeBox.setSearchMatch(serchByName)
        document.querySelector('.arrangeBoxes').appendChild(arrangeBox.body)
        return arrangeBox
    }

    function createUiButtons(arrangeBox) {
        const buttonChosen = document.createElement('button')
        buttonChosen.addEventListener('click', () => show(arrangeBox.chosenItems()))
        buttonChosen.setAttribute('class', 'arrangeBox_buttons__item')
        buttonChosen.textContent = 'Get my memes!'
        document.querySelector('.arrangeBoxes').appendChild(buttonChosen)

        const sortByNameButton = document.createElement('button')
        sortByNameButton.addEventListener('click', () => arrangeBox.sort(sortName))
        sortByNameButton.setAttribute('class', 'arrangeBox_buttons__item')
        sortByNameButton.textContent = 'Sort by name'
        document.querySelector('.arrangeBoxes').appendChild(sortByNameButton)

        const sortByLikeButton = document.createElement('button')
        sortByLikeButton.addEventListener('click', () => arrangeBox.sort(sortByLike))
        sortByLikeButton.setAttribute('class', 'arrangeBox_buttons__item')
        sortByLikeButton.textContent = 'Sort by like'
        document.querySelector('.arrangeBoxes').appendChild(sortByLikeButton)
    }

    const arrangeBox = createArrangeBox(randomSelect(items))
    createUiButtons(arrangeBox)
}

const addNewArrangeBox = document.getElementById('newArrangeBox')
addNewArrangeBox.addEventListener('click', () => newArrangeBox())
newArrangeBox()