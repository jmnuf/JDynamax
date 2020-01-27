function capitalizeString(txt) {
    if (isString(txt)) {
        let first = txt.substr(0, 1).toUpperCase();
        return first + txt.substr(1).toLowerCase();
    }
    return null;
}

HTMLElement.prototype.realAddEventListener = HTMLElement.prototype.addEventListener;

HTMLElement.prototype.listeners = {};

HTMLElement.prototype.addEventListener = function(name, fnx, c){
    this.realAddEventListener(name, fnx, c); 
    if (this.listeners[name]) {
        this.listeners[name].push(fnx);
    } else {
        this.listeners[name] = [];
        this.listeners[name].push(fnx);
    }
};

// Base class
class JDynaDom {
    constructor(element, innerHtml = '') {
        if (element instanceof Element) {
            this.domElement = element;
            this.domType = element.nodeName.toLowerCase();
            this.prevDisplay = element.style['display'] || '';
            this.domElement.innerHTML = element.innerHTML || innerHtml;
        } else if (typeof element == typeof '-' || element instanceof String) {
            this.domElement = document.createElement(element.toLowerCase());
            this.domType = element.toLowerCase();
            this.prevDisplay = '';
            this.domElement.innerHTML = innerHtml;
            document.body.appendChild(this.domElement);
        }
    }

    html(innerHTML = undefined, append = false) {
        if (innerHTML == undefined) {
            return this.domElement.innerHTML;
        }
        if (append) {
            this.domElement.innerHTML += innerHTML;
        } else {
            this.domElement.innerHTML = innerHTML;
        }
        return this.domElement.innerHTML;
    }

    outerhtml() {
        return this.domElement.outerHTML;
    }

    child(child = undefined, getAllNodes = false) {
        if (child instanceof Element) {
            // this.domElement.appendChild(new JDynaDom(child).domElement);
            this.domElement.appendChild(child);
        } else if (child instanceof JDynaDom) {
            this.domElement.appendChild(child.domElement);
        }
        let children = [];
        let c;
        if (getAllNodes) {
            c = this.domElement.childNodes;
        } else {
            c = this.domElement.children;
        }
        for (let i = 0; i < c.length; i++) {
            children.push(new JDynaDom( c[i]) );
        }
        return children;
    }

    parent(parent = undefined) {
        if (parent == undefined) {
            return new JDynaDom( this.domElement.parentNode );
        }
        if (parent instanceof Element) {
            // parent.appendChild(this.domElement);
            return new JDynaDom(parent).child(this);
        } else if (typeof parent == typeof '' || parent instanceof String) {
            let p = document.querySelector(parent);
            if (p) {
                return new JDynaDom(p).child(this);
            } else {
                return 'Invalid-Element-Name';
            }
        } else if (parent instanceof JDynaDom) {
            return parent.child(this.domElement);
        } else {
            return 'Invalid-Argument';
        }
    }

    moveBefore(element) {
        if (element instanceof JDynaDom) {
            element.domElement.parentNode.insertBefore(this.domElement, element.domElement);
        } else if (element instanceof Element) {
            element.parentNode.insertBefore(this.domElement, element);
        }
    }

    search(query) {
        if (isString(query) && query.trim() != '') {
            return new JDynaDom( this.domElement.querySelector(query) );
        }
    }

    static docSearch(query) {
        if (isString(query) && query.trim() != '') {
            return new JDynaDom( document.querySelector(query) );
        }
    }

    show() {
        if (this.domElement.hasAttribute('style')) {
            if (this.domElement.style['display'] == 'none') {
                this.domElement.style['display'] = this.prevDisplay;
            }
        }
    }

    hide() {
        if (this.domElement.hasAttribute('style')) {
            if (this.domElement.style['display'] != 'none'){
                this.prevDisplay = this.domElement.style['display'];
                this.domElement.style['display'] = 'none';
            }
        } else {
            this.domElement.setAttribute('style', 'display:none');
        }
    }

    eliminate() {
        this.domElement.remove();
    }

    css(styleName = undefined, styleValue = undefined) {
        let css = this.domElement.getAttribute('style') || '';
        if (styleName == undefined) {
            return css;
        }
        if (styleValue) {
            this.domElement.style[styleName] = styleValue;
            return this.domElement.getAttribute('style');
        } else {
            return this.domElement.style[styleName];
        }
    }

    id(id = undefined) {
        if (id == undefined) {
            return this.domElement.id;
        }
        this.domElement.id = id;
    }

    class(cls = undefined) {
        if (cls == undefined || cls == false || cls == null) {
            return this.domElement.className;
        }
        if (isString(cls)) {
            if (cls.trim() != '') {
                if (cls.includes(' ')) {
                    for (let c of cls.split(' ')) {
                        if (c.trim() != '') {
                            this.domElement.classList.toggle(c);
                        }
                    }
                } else {
                    this.domElement.classList.toggle(cls);
                }
            }
        }
        return this.domElement.className;
    }

    hasClass(cls) {
        if (isString(cls)) {
            return this.domElement.classList.contains(cls);
        } else {
            return false;
        }
    }

    getListeners(eventName = undefined) {
        if (eventName) {
            return this.domElement.listeners[eventName];
        } else {
            return this.domElement.listeners;
        }
    }

    addListener(eventName, fnx, appendEv) {
        if ( ! this.domElement.listeners[eventName] ) {
            this.domElement.listeners[eventName] = [];
        }
        let count = this.domElement.listeners[eventName].length;
        if (!appendEv && count > 1) {
            for (let listener of this.domElement.listeners[eventName]){
                this.removeListener(eventName, listener);
            }
            this.listeners[eventName] = [];
        }
        this.domElement.addEventListener(eventName, fnx);
        this.listeners[eventName].push(fnx);
    }

    removeListener(eventName, fnx = undefined) {
        if (this.domElement.listeners[eventName].length > 0) {
            if (fnx) {
                if (this.domElement.listeners[eventName].includes(fnx)) {
                    this.domElement.removeEventListener(eventName, fnx);
                }
            } else {
                for(let f of this.domElement.listeners[eventName]) {
                    this.domElement.removeEventListener(eventName, f);
                }
            }
        }
    }
}

class JDynaButton extends JDynaDom {
    constructor(innerHTML = '', onclick = false, obj = undefined) {
        if (obj instanceof Element) {
            super(obj, innerHTML);
        } else if (obj instanceof JDynaDom && obj.domType == 'button') {
            super(obj.domElement, innerHTML);
        } else {
            super('button', innerHTML)
        }
        this.onclickFnx = undefined;
        if (onclick) {
            this.onclickFnx = onclick;
            this.addListener('click', onclick);
        }
    }

    onclick(fnx, appendEv = false) {
        if(fnx == undefined) {
            return this.onclickFnx;
        }
        this.onclickFnx = fnx;
        if (!appendEv) {
            this.removeListener('click');
        }
        this.addListener('click', this.onclickFnx);
    }

    click() {
        this.onclickFnx();
    }

    static createFrom(domElement, innerHTML = '', onclick = function() { console.log('button pressed') }) {
        return (innerHTML, onclick, domElement);
    }
}

class JDynaTable extends JDynaDom {
    constructor(arg0 = undefined, arg1 = undefined){
        if (arg0 instanceof Element) {
            super(arg0);
        } else if (arg0 instanceof JDynaDom) {
            super(arg0);
        } else if (arg1 instanceof Element) {
            super(arg1);
        } else if (arg1 instanceof JDynaDom) {
            super(arg1);
        } else {
            super('table');
        }
        if (!this.tryToDisplay(arg0)) {
            this.tryToDisplay(arg1);
        }
    }

    tryToDisplay(data) {
        if (Array.isArray(data) || typeof data == typeof {} || data instanceof JDynaTableData) {
            this.displayData(data);
            return true;
        } else {
            return false;
        }
    }

    displayData(data) {
        if (typeof data != typeof [] || typeof data != typeof {} || ! data instanceof JDynaTableData) {
            return 'Invalid-Argument'
        }
        this.data = data;
        let tableContents = '';
        if (data instanceof JDynaTableData) {
            data = data.getDataForTable();
        }
        if (typeof data == typeof []) {
            for(let i = -1; i < data.length; i++) {
                if (i == -1) {
                    if (data.length > 0) {
                        tableContents += '<thead><tr>';
                        for (let head in data[0]) {
                            tableContents += '<th>' + head + '</th>'
                        }
                        tableContents += '</tr></thead>';
                    } else {
                        break;
                    }
                } else {
                    tableContents += '<tr>';
                    for(let col in data[i]) {
                        tableContents += '<td>' + data[i][col] + '</td>';
                    }
                    tableContents += '</tr>';
                }
            }
        } else if (typeof data == typeof {}) {
            for(let key in data) {
                if (key.toLowerCase() == 'headers') {
                    tableContents += '<thead><tr>';
                    for(let col in data[key]) {
                        tableContents += '<th>' + data[key][col] + '</th>';
                    }
                    tableContents += '</tr></thead>';
                } else {
                    tableContents += '<tr>';
                    for(let col in data[key]) {
                        tableContents += '<td>' + data[key][col] + '</td>';
                    }
                    tableContents += '</tr>';
                }
            }
        }
        return this.html(tableContents);
    }

    static createTableData(headers, rows){
        let data = [];
        let row = {};
        for (let j = 0; j < rows.length; j++) {
            row = {};
            for (let i = 0; i < headers.length; i++) {
                row[headers[i]] = rows[j][i];
            }
            data.push(row);
        }
        return data;
    }
}

class JDynaTableData {
    constructor(headers = [], rows = []) {
        if (Array.isArray(headers)) {
            this.headers = headers;
        }
        if (Array.isArray(rows)) {
            this.rows = rows;
        }
    }

    addToHeaders(header) {
        this.headers.push(header);
    }

    createHeaders( ...heads) {
        this.headers = heads;
    }

    addRow(row) {
        this.rows.push(row);
    }

    addNewRow(...cols) {
        let row = []
        for(let i = 0; i < cols.length; i++) {
            row.push(cols[i]);
        }
        this.addRow(row);
    }

    getDataForTable() {
        return JDynaTable.createTableData(this.headers, this.rows);
    }
    
    static createSampleTableData() {
        let data = [];
        data.push({
            'Col1': 'Some text',
            'col2': 'Other text',
            'Color': 'I don\'t know colors...'
        });
        data.push({
            'Col1': 'More text',
            'col2': 'More other text',
            'Color': 'I still don\'t know colors...'
        });
        data.push({
            'Col1': 'Sample text?',
            'col2': '.txt is pretty cool...',
            'Color': 'Uhhh.... White?'
        });
        return data;
    }

}

function isString(arg) {
    return typeof arg == typeof '-' || arg instanceof String;
}
