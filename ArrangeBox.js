export class ArrangeBoxController {

    static events = {
        changeIsSelect: new Event('changeIsSelect'),
        changeContainer: new Event('changeContainer', { bubbles: true })
    }

    //Устанавливает свойство itemController для управления элементом
    static setItemController(item, data) {

        item.itemController = {
            _data: data,

            get data() { return item.itemController._data },
            get isSelect() { return item.getAttribute('isSelect') == 'true' },
            set isSelect(isSelect) {
                item.setAttribute("isSelect", isSelect)
                item.dispatchEvent(ArrangeBoxController.events.changeIsSelect)
            },
            get canChangeContainer() { return item.getAttribute('canChangeContainer') == 'true' },
            set canChangeContainer(isCan) {
                item.setAttribute("canChangeContainer", isCan)
            },
            appendToContainer(toContainer) {
                if (this.canChangeContainer) {
                    toContainer.appendChild(item)
                    item.dispatchEvent(ArrangeBoxController.events.changeContainer)
                }
            }
        }

        item.addEventListener('click', () => item.itemController.isSelect = !item.itemController.isSelect)
        item.setAttribute('isSelect', false)
        item.setAttribute('canChangeContainer', true)

        return item
    }

    //Устанавливает свойство containerController для управления таблицей
    static setConteinerController(container) {
        function _itemSwapUpDown(firstItem, secondItem) {
            if (secondItem != null && !secondItem.isSelect)
                _swapItem(firstItem, secondItem)
        }

        function _swapItem(firstNode, secondNode) {
            const firstParent = firstNode.parentNode;
            const secondParent = secondNode.parentNode;
            const firstHolder = document.createElement("div");
            const secondHolder = document.createElement("div");

            firstParent.replaceChild(firstHolder, firstNode);
            secondParent.replaceChild(secondHolder, secondNode);

            firstParent.replaceChild(secondNode, firstHolder);
            secondParent.replaceChild(firstNode, secondHolder);
        }

        container.containerController = {
            _state: [],

            get items() { return [...container.children] },
            get selected() { return container.containerController.items.filter(item => item.itemController.isSelect) },
            get state() { return container.containerController._state },

            addItems(items) { items.forEach(item => { item.itemController.isSelect = false; item.itemController.appendToContainer(container) }) },
            rememberState() { container.containerController._state = container.containerController.items },
            search(checkMatch) { return container.containerController.items.filter(item => checkMatch(item.itemController.data)) },
            sort(compare) {
                const sortedItems = container.containerController.items.sort((item1, item2) => {
                    return compare(item1.itemController.data, item2.itemController.data)
                })
                container.containerController.addItems(sortedItems)
            },

            itemsUp() { container.containerController.selected.forEach(item => _itemSwapUpDown(item, item.previousElementSibling)) },
            itemsDown() { container.containerController.selected.reverse().forEach(item => _itemSwapUpDown(item, item.nextElementSibling)) },
            itemsTotalUp() {
                container.containerController.selected.forEach(item => {
                    while (item.previousElementSibling && !item.previousElementSibling?.itemController.isSelect)
                        container.containerController.itemsUp()
                })
            },
            itemsTotalDown() {
                container.containerController.selected.reverse().forEach(item => {
                    while (item.nextElementSibling && !item.nextElementSibling?.itemController.isSelect)
                        container.containerController.itemsDown(container)
                })
            },
        }

        container.containerController.items.forEach(item => _setItem(item))

        return container
    }
}

export class ContainerItem {
    constructor(itemDto) {
        this.data = itemDto

        this._createBody()
        this._styling()
        this._fill(itemDto)
    }

    _createBody() {
        this.body = document.createElement('li')
        this.img = document.createElement('img')
        this.content = document.createElement('div')
        this.title = document.createElement('div')
        this.like = document.createElement('div')
        this.like_img = document.createElement('div')
        this.like_count = document.createElement('div')

        this.body.append(this.img, this.content)
        this.content.append(this.title, this.like)
        this.like.append(this.like_img, this.like_count)
    }

    _styling() {
        this.body.setAttribute('class', 'container_item')
        this.img.setAttribute('class', 'container_item__img')
        this.content.setAttribute('class', 'container_item__content')
        this.title.setAttribute('class', 'content__title')
        this.like.setAttribute('class', 'content__like')
        this.like_img.setAttribute('class', 'like__img')
        this.like_count.setAttribute('class', 'like__count')
    }

    _fill(pickListDto) {
        this.img.setAttribute('src', pickListDto.img)
        this.img.setAttribute('alt', 'item')

        this.title.textContent = pickListDto.name
        this.like_count.textContent = pickListDto.countLikes
    }
}

export class Table {
    constructor() {
        this._createBody()
        this._styling()
    }

    _createBody() {
        this.body = document.createElement('div')
        this.buttons = document.createElement('div')
        this.up = document.createElement('button')
        this.upAll = document.createElement('button')
        this.downAll = document.createElement('button')
        this.down = document.createElement('button')
        this.searchAndContainer = document.createElement('div')
        this.search = document.createElement('input')
        this.container = document.createElement('ul')

        this.body.appendChild(this.buttons)
        this.buttons.append(this.up, this.upAll, this.downAll, this.down)
        this.body.appendChild(this.searchAndContainer)
        this.searchAndContainer.append(this.search, this.container)
    }

    _styling() {
        this.body.setAttribute('class', 'arrangeBox__table')
        this.buttons.setAttribute('class', 'arrangeBox_buttons')
        Array(this.up, this.upAll, this.down, this.downAll).forEach(item => item.setAttribute('class', 'arrangeBox_buttons__item'))

        this.searchAndContainer.setAttribute('class', 'arrangeBox__searchAndContainer')
        this.search.setAttribute('class', 'searchAndContainer__search')
        this.search.setAttribute('placeholder', 'search')
        this.container.setAttribute('class', 'searchAndContainer__container')

        this.up.textContent = 'up'
        this.upAll.textContent = 'upAll'
        this.down.textContent = 'down'
        this.downAll.textContent = 'downAll'
    }
}

export class ButtonsBeetwen {
    constructor() {
        this._createBody()
        this._styling()
    }

    _createBody() {
        this.body = document.createElement('div')
        this.left = document.createElement('button')
        this.leftAll = document.createElement('button')
        this.rightAll = document.createElement('button')
        this.right = document.createElement('button')
        this.refresh = document.createElement('button')

        this.body.append(this.left, this.leftAll, this.rightAll,
            this.right, this.refresh)
    }

    _styling() {
        this.body.setAttribute('class', 'arrangeBox__buttonsBetween')
        Array(this.left, this.leftAll, this.right, this.rightAll, this.refresh).forEach(item => item.setAttribute('class', 'arrangeBox_buttons__item'))

        this.left.textContent = '<'
        this.leftAll.textContent = '<<'
        this.right.textContent = '>'
        this.rightAll.textContent = '>>'
        this.refresh.textContent = 'refresh'
    }
}

export class ArrangeBox {
    constructor() {
        this._createBody()
        this._styling()
    }

    _createBody() {
        this.body = document.createElement('div')
        this.leftTable = new Table()
        this.buttonsBeetwen = new ButtonsBeetwen()
        this.rightTable = new Table()

        this.body.append(this.leftTable.body, this.buttonsBeetwen.body,
            this.rightTable.body)
        this.rightTable.body.appendChild(this.rightTable.buttons)
    }

    _styling() {
        this.body.setAttribute('class', 'arrangeBox')
    }
}

export class ArrangeBoxConnector {
    static connectItems(item) {
        ArrangeBoxController.setItemController(item.body, item.data)

        item.body.addEventListener(ArrangeBoxController.events.changeIsSelect.type, () => item.body.itemController.isSelect ?
            item.body.classList.add('select') :
            item.body.classList.remove('select'))

        return item
    }

    static connectTable(table) {
        ArrangeBoxController.setConteinerController(table.container)
        const controller = table.container.containerController

        table.up.addEventListener('click', controller.itemsUp)
        table.upAll.addEventListener('click', controller.itemsTotalUp)
        table.down.addEventListener('click', controller.itemsDown)
        table.downAll.addEventListener('click', controller.itemsTotalDown)
        table.body.addEventListener(ArrangeBoxController.events.changeContainer.type, () => {
            table.search.value = ''
            table.search.dispatchEvent(new Event('input'))
        })

        return table
    }

    static connectButtonsBeetwen(arrangeBox) {
        const leftController = arrangeBox.leftTable.container.containerController
        const rightController = arrangeBox.rightTable.container.containerController

        arrangeBox.buttonsBeetwen.left.addEventListener('click', () => leftController.addItems(rightController.selected))
        arrangeBox.buttonsBeetwen.leftAll.addEventListener('click', () => leftController.addItems(rightController.items))
        arrangeBox.buttonsBeetwen.right.addEventListener('click', () => rightController.addItems(leftController.selected))
        arrangeBox.buttonsBeetwen.rightAll.addEventListener('click', () => rightController.addItems(leftController.items))
        arrangeBox.buttonsBeetwen.refresh.addEventListener('click', () => {
            arrangeBox.leftTable.search.value = ''
            arrangeBox.leftTable.search.dispatchEvent(new Event('input'))
            arrangeBox.rightTable.search.value = ''
            arrangeBox.rightTable.search.dispatchEvent(new Event('input'))

            leftController.addItems(leftController.state)
        })

        return arrangeBox
    }

    static connectArrangeBox(arrangeBox) {
        ArrangeBoxConnector.connectTable(arrangeBox.leftTable)
        ArrangeBoxConnector.connectTable(arrangeBox.rightTable)
        ArrangeBoxConnector.connectButtonsBeetwen(arrangeBox)

        return arrangeBox
    }

    static appendItems(arrangeBox, items) {
        arrangeBox.leftTable.container.append(...items.map(item =>
            ArrangeBoxConnector.connectItems(new ContainerItem(item), item).body))
        arrangeBox.leftTable.container.containerController.rememberState()
    }

    static chosenItems(arrangeBox) { return arrangeBox.rightTable.container.containerController.items.map(item => item.itemController.data) }
}

export class ArrangeBoxElement {
    constructor() {
        this.arrangeBox = new ArrangeBox()
        this.body = this.arrangeBox.body

        ArrangeBoxConnector.connectArrangeBox(this.arrangeBox)
    }

    setSearchMatch(searchMatch) {
        const controller = this.arrangeBox.leftTable.container.containerController
        const table = this.arrangeBox.leftTable

        table.search.addEventListener('input', () => {
            controller.items.forEach(item => {
                item.style.display = 'none'
                item.itemController.canChangeContainer = false
                item.itemController.isSelect = false
            })
            controller.search((data) => searchMatch(table.search.value, data)).forEach(item => {
                item.style.display = ''
                item.itemController.canChangeContainer = true
            })
        })

        table.search.events
    }

    appendItems(items) {
        ArrangeBoxConnector.appendItems(this.arrangeBox, items)
    }

    chosenItems() {
        return ArrangeBoxConnector.chosenItems(this.arrangeBox)
    }

    sort(compare) {
        this.arrangeBox.leftTable.container.containerController.sort(compare)
        this.arrangeBox.rightTable.container.containerController.sort(compare)
    }
}
