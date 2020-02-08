
class JDynastContainer extends JDynaDom {
    constructor(innerHTML = '', obj = undefined) {
        if (obj instanceof Element || obj instanceof JDynaDom) {
            super(obj, innerHTML);
        } else {
            super('div', innerHTML);
        }
        this.class('container')
        this.header = null;
    }

    setHeader(header, arg = undefined, subtext = undefined) {
        let absType;
        if (isString(header)) {
            if (!arg) {
                arg = HeaderTypes['wimbotron'];
            }
            if (Object.values(HeaderTypes).includes(arg)) {
                absType = arg;
            } else if (Object.keys(HeaderTypes).includes(arg)) {
                absType = HeaderTypes[arg];
            } else {
                this.eliminateHeader();
                return;
            }
            this.eliminateHeader();
            if (absType == '' || absType.startsWith('display')) {
                this.header = new JDynastHeader(header, 'basic');
                this.header.class(absType);
                this.header.html(header);
            } else {
                this.header = new JDynaDom('div');
                this.header.class(absType);
                if (absType.endsWith('fluid')) {
                    let subHead = new JDynaDom('div');
                    subHead.class('container');
                    subHead.html(`<h1>${header}</h1>`);
                    if (subtext) {
                        subHead.html(`<p>${subtext}</p>`, true);
                    }
                    subHead.parent(this.header);
                } else {
                    this.header.html(`<h1>${header}</h1>`);
                    if (subtext) {
                        this.header.html(`<p>${subtext}</p>`, true);
                    }
                }
            }
            if (this.child()[0] != this.header) {
                if (this.child().length > 0) {
                    this.domElement.insertBefore(this.header.domElement, this.domElement.children[0]);
                } else {
                    this.child(this.header);
                }
            }
        } else if (header instanceof JDynastHeader) {
            this.header = header;
            if (this.child().length > 0) {
                this.domElement.insertBefore(this.header.domElement, this.domElement.children[0]);
            } else {
                this.child(this.header);
            }
        } else if (header instanceof JDynaDom) {
            if (this.header != header) {
                this.eliminateHeader();
                this.header = header;
            }
            if (this.header.class().includes('display')) {
                this.header.html(`${arg}`);
            } else if (this.header.class().includes('jumbotron')) {
                let sub, ssub;
                if (this.header.class().includes('fluid')) {
                    sub = this.header.child()[0].child()[0];
                    ssub = this.header.child()[0].child()[1]; 
                } else {
                    sub = this.header.child()[0];
                    ssub = this.header.child()[1];
                }
                sub.html(`${arg}`);
                if (subtext) {
                    ssub.html(subtext);
                } else if (subtext == null) {
                    ssub.html('');
                }
            } else {
                this.header.html(`${arg}`);
            }
        }
    }

    eliminateHeader() {
        if (this.header != null) {
            this.header.eliminate();
            this.header = null;
        }
    }

    pushToHeader(node) {
        this.header.child(node);
    }
}

class JDynastHeader extends JDynaDom {
    constructor(title = '', type = HeaderTypes['wimbotron'], subtext = undefined, obj = undefined) {
        let subTxObj;
        if (obj instanceof Element || obj instanceof JDynaDom) {
            super(obj);
        } else {
            let typeClass = JDynastHeader.checkType(type);
            if (typeClass == '' || typeClass.includes('display')) {
                super('h1', header);
                this.class(typeClass);
                this.titleObj = this;
            } else if (typeClass.includes('jumbotron')) {
                super('div');
                this.class(typeClass);
                if (typeClass.includes('fluid')) {
                    let container = new JDynastContainer(`<h1>${title}</h1>`);
                    subTxObj = new JDynaDom('p');
                    if (isString(subtext)) {
                        subTxObj.html(subtext);
                    }
                    this.titleObj = container.child()[0];
                    subTxObj.parent(container);
                    if (this.domElement.children.length > 0) {
                        this.domElement.insertBefore(container, this.domElement.children[0]);
                    } else {
                        this.child(container);
                    }
                    // this.titleObj = this.titleObj.child()[0];
                } else {
                    this.titleObj = new JDynaDom('h1');
                    subTxObj = new JDynaDom('p');
                    this.titleObj.html(title);
                    if (isString(subtext)) {
                        subTxObj.html(subtext);
                    }
                    if (this.domElement.children.length > 0) {
                        this.domElement.insertBefore(this.titleObj.domElement, this.domElement.children[0]);
                        this.domElement.insertBefore(subTxObj.domElement, this.domElement.children[1]);
                    } else {
                        this.child(this.titleObj);
                        this.child(subTxObj);
                    }
                }
            }
        }
    }

    title(title = undefined) {
        if (isString(title)) {
            if (this.domType == 'div') {
                if (this.class().includes('fluid')) {
                    return this.child()[0].child()[0].html(title);
                } else {
                    return this.child()[0].html(title);
                }
            }
            return this.html(title);
        } else {
            if (this.domType == 'div') {
                if (this.class().includes('fluid')) {
                    return this.child()[0].child()[0].html();
                } else {
                    return this.child()[0].html();
                }
            }
            return this.html();
        }
    }

    titleObj() {
        if (this.domType == 'div') {
            if (this.class().includes('fluid')) {
                return this.child()[0].child()[0];
            } else {
                return this.child()[0];
            }
        }
        return this;
    }

    subtitle(subtitle = undefined) {
        if (isString(subtitle)) {
            if (this.domType == 'div') {
                if (this.class().includes('fluid')) {
                    return this.child()[0].child()[1].html(subtitle);
                } else {
                    return this.child()[1].html(subtitle);
                }
            }
            return null;
        } else {
            if (this.domType == 'div') {
                if (this.class().includes('fluid')) {
                    return this.child()[0].child()[1].html();
                } else {
                    return this.child()[1].html();
                }
            }
            return null;
        }
    }

    subtitleObj() {
        if (this.domType == 'div') {
            if (this.class().includes('fluid')) {
                return this.child()[0].child()[1];
            } else {
                return this.child()[1];
            }
        }
        return null;
    }

    static checkType(type) {
        if (Object.keys(HeaderTypes).includes(type)) {
            return HeaderTypes[type];
        } else if (Object.values(HeaderTypes).includes(type)) {
            return type;
        } else {
            return '';
        }
    }
}

const HeaderTypes = {
    'basic': '',
    'display1': 'display-1',
    'display2': 'display-2',
    'display3': 'display-3',
    'display4': 'display-4',
    'jumbotron': 'jumbotron',
    'wimbotron': 'jumbotron jumbotron-fluid'
}

class JDynastBtn extends JDynaButton {
    constructor(innerHTML = '', type = BtnTypes['primary'], onclick = undefined, obj = undefined) {
        super(innerHTML, onclick, obj);
        if (!this.hasClass('btn')) {
            this.class('btn');
        }
        this.setType(type);
        if (!this.hasClass('m-2')){
            this.class('m-2');
        }
    }

    static createFrom(obj, innerHTML = undefined, type , onclick) {
        return new JDynastBtn(innerHTML, type, onclick, obj);
    }

    setType(type) {
        if (isString(type)) {
            type = type.toLowerCase();
            let cls = false;
            if (Object.keys(BtnTypes).includes(type)) {
                if (!this.hasClass(BtnTypes[type])) {
                    cls = BtnTypes[type];
                }
            } else if (Object.values(BtnTypes).includes(type)) {
                if (!this.hasClass(type)) {
                    cls = type;
                }
            }
            if (cls) {
                if (this.hasClass(cls)) {
                    return cls;
                }
                let last = false;
                for(let t in BtnTypes) {
                    if (this.hasClass(BtnTypes[t])) {
                        this.class(BtnTypes[t]);
                        if (last) {
                            last += ' ' + BtnTypes[t];
                        } else {
                            last = BtnTypes[t];
                        }
                    }
                }
                this.class(cls);
                return last;
            }
        }
    }
}

const BtnTypes = {
    'basic': '',
    'primary': 'btn-primary',
    'secondary': 'btn-secondary',
    'success': 'btn-success',
    'info': 'btn-info',
    'warning': 'btn-warning',
    'danger': 'btn-danger',
    'dark': 'btn-dark',
    'light': 'btn-light',
    'link': 'btn-link'
};

class JDynastTable extends JDynaTable {
    constructor(args = [undefined, undefined], type = TableTypes['dhover']) {
        if (Array.isArray(args)) {
            if (args.length >= 2) {
                super(args[0], args[1]);
            } else if (args.length > 0) {
                super(args[0]);
            } else {
                super();
            }
        } else {
            super(args);
        }
        this.class('table');
        if (Object.keys(TableTypes).includes(type)) {
            this.class(TableTypes[type]);
        } else if (Object.values(TableTypes).includes(type)) {
            this.class(type);
        }
    }

    theadType(type = undefined) {
        if (isString(type)) {
            if (Object.keys(THeadTypes).includes(type)) {
                return this.child()[0].class(THeadTypes[type]);
            } else if (Object.values(THeadTypes).includes(type)) {
                return this.child()[0].class(type);
            }
        }
        for (let t in THeadTypes) {
            if (this.child()[0].class().includes(THeadTypes[t])) {
                return THeadTypes[t];
            }
        }
    }

    tbodyColors(color1, color2 = undefined) {
        let rows = this.child()[1].child();
        if (!color2) {
            color2 = color1;
        }
        for (let i = 0; i < rows.length; i++) {
            if (i % 2 == 0) {
                row.css('background-color', color1);
            } else {
                row.css('background-color', color2);
            }
        }
    }
}

const TableTypes = {
    'basic': '', 'dark': 'table-dark', 'light': 'table-light',
    'dhover': 'table-dark table-hover', 'lhover': 'table-light table-hover'
}

const THeadTypes = { 'dark': 'thead-dark', 'light': 'thead-light' }

class JDynastModal extends JDynaDom {
    constructor(id = 'myModal', message = 'My Modal', title = undefined, footer = undefined) {
        super('div');
        this.class('modal');
        this.id(id);
        this.dynadialog = new JDynaDom('div');
        this.dynadialog.class('modal-dialog');
        this.dynadialog.parent(this);
        this.dynacontent = new JDynaDom('div');
        this.dynacontent.class('modal-content');
        this.dynacontent.parent(this.dynadialog);
        this.dynaheader = new JDynaDom('div');
        this.dynaheader.class('modal-header');
        this.dynatitle = new JDynaDom('h4', isString(title) ? title : '');
        this.dynatitle.class('modal-title');
        this.dynatitle.parent(this.dynaheader);
        this.dynaheader.html('<button type="button" class="close" data-dismiss="modal">&times;</button>', true);
        this.dynaheader.parent(this.dynacontent);
        this.dynabody = new JDynaDom('div', message);
        this.dynabody.class('modal-body');
        this.dynabody.parent(this.dynacontent);
        this.dynafooter = null;
        if (isString(footer)) {
            this.dynafooter = new JDynaDom('div', footer);
            this.dynafooter.class('modal-footer');
            this.dynafooter.parent(this.content);
        }
    }

    header(html = undefined) {
        if (isString(html)) {
            this.dynaheader.html(html);
        }
        return this.dynaheader.html();
    }

    headerObj() {
        return this.dynaheader;
    }

    title(text = undefined) {
        if (isString(text)) {
            this.dynatitle.html(text);
        }
        return this.dynatitle.html();
    }

    titleObj() {
        return this.dynatitle;
    }

    body(html) {
        if (isString(html)) {
            this.dynabody.html(html);
        }
        return this.dynabody.html();
    }

    bodyObj() {
        return this.dynabody;
    }

    footer(html = undefined) {
        if (isString(html)) {
            if (this.dynafooter == null) {
                this.dynafooter = new JDynaDom('div');
                this.dynafooter.class('modal-footer');
                this.dynafooter.parent(this.dynacontent);
            }
            this.dynafooter.html(html);
        }
        return this.dynafooter.html();
    }

    footerObj() {
        return this.dynafooter;
    }
}

class JDynastModalBtn extends JDynastBtn {
    constructor(modalId, innerHTML = 'modal', type = undefined, onclick = undefined, obj = undefined) {
        super(innerHTML, type, onclick, obj);
        this.domElement.setAttribute('type', 'button');
        this.domElement.setAttribute('data-toggle', 'modal');
        if (isString(modalId)) {
            if (modalId.startsWith('#')) {
                while(modalId.substr(0, 1) === '#') {
                    modalId = modalId.substr(1);
                }
            }
        }
        this.domElement.setAttribute('data-target', '#' + modalId);
    }
}

class JDynastInp extends JDynaDom {
    constructor(id, pretext = '@', placeholder = '', type = 'text') {
        super('div');
        this.class('input-group mb-3');
        let dynalabeldiv = new JDynaDom('div');
        dynalabeldiv.class('input-group-prepend');
        dynalabeldiv.parent(this);
        if (isString(pretext)) {
            this.dynaprepend = new JDynaDom('span', pretext);
            this.dynaprepend.class('input-group-text');
        } else if (pretext instanceof JDynaDom) {
            this.dynaprepend = pretext;

        }
        if (this.dynaprepend) {
            this.dynaprepend.parent(dynalabeldiv);
        }
        this.dynainput = new JDynaDom('input');
        this.dynainput.id(id);
        this.dynainput.class('form-control');
        this.dynainput.domElement.setAttribute('placeholder', placeholder);
    }

    input(fnx = undefined) {
        if (fnx) {
            this.dynainput.addListener('input',  fnx);
        }
        return this.dynainput.getListeners('input');
    }
}
