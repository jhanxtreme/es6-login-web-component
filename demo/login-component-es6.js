;(function(document){

class LoginComponent extends HTMLElement {
    constructor(){
        super();
        this._submitBtn = null;
        this._shadowRoot = null;
    }   
    
    static get observedAttributes(){
        return ['header-text', 'target', 'width', 'modal'];
    }

    connectedCallback() {
        this._shadowRoot = this.attachShadow({mode: 'open'});
        const _headerText = this.getAttributeValue(this.attributes['header-text'], { default: 'Login' });
        const _width = this.getAttributeValue(this.attributes['width'], { default: '100%' });
        const _modal =  this.getAttributeValue(this.attributes['modal'], { default: true });
        console.log(_modal === true);
        let template = `
            <style>
                :host{
                    position: relative;
                    font-family: tahoma, arial;
                    font-size: 100%;
                }
                *, *::after, *::before{
                    box-sizing: border-box;
                }
                .login-component {
                    border:1px red solid;
                    position: inherit;
                    padding: 1em;
                    border:1px #ddd solid;
                    border-radius:4px;
                    background-color: #fff;
                    margin: auto;
                }
                .login-component.modal-active{
                    position: relative;
                    margin: 3% auto;
                    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
                    -webkit-box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
                    -moz-box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
                }
                .form-group{
                    display: block;
                    margin-bottom: 1em;
                }
                .label{
                    width: 100%;
                    margin-bottom:.2em;
                    color:#555;
                    font-size: 90%;
                }
                input[type=text],
                input[type=password]{
                    padding: 1em;
                    width: 100%;
                    background-color: #f0f0f0;
                    border-radius: 2px;
                    border:0;
                }
                .header-text{
                    font-size: 150%;
                    margin-bottom: 1em;
                }
                input[type=button]{
                    padding: 1em;
                    width: 100%;
                    background-color: #00BCD4;
                    border: 0;
                    border-radius: 3px;
                    font-size: 100%;
                    color: #fff;
                    cursor:pointer;
                }
                .modal {
                    position: inherit;
                }
                .modal.modal-active{
                    position: fixed;
                    top:0;
                    left:0;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                    background-color: rgba(0,0,0, 0.35);
                }
                .fadeInDown{
                    animation-name: fadeInDown;
                    animation-duration: .5s;
                }
                @keyframes fadeInDown {
                    0%{
                        -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
                        filter: alpha(opacity=100);
                        -moz-opacity:0;
                        -khtml-opacity: 0;
                        opacity: 0;

                        -webkit-transform: translateY(-5%);
                        -moz-transform: translateY(-5%);
                        transform: translateY(-5%);
                    }
                    100%{
                        -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
                        filter: alpha(opacity=100);
                        -moz-opacity:1;
                        -khtml-opacity: 1;
                        opacity: 1;
                        -webkit-transform: translateY(0%);
                        -moz-transform: translateY(0%);
                        transform: translateY(0%);
                    }
                }
            </style>
            <div class="modal${_modal==='true'? ' modal-active':''}">
                <div class="login-component${_modal==='true'?' modal-active fadeInDown':''}" style="width: ${_width}">
                    <div class="header-text">${_headerText}</div>
                    <div class="form-group">
                        <div class="label">Username</div>
                        <input type="text" name="username" placeholder="Username" required />
                    </div>
                    <div class="form-group">
                        <div class="label">Password</div>
                        <input type="password" name="password" placeholder="Password" required />
                    </div>
                    <div class="form-group">
                        <input type="button" id="btn-submit" value="Login" />
                    </div>
                </div>
            </div>
        `;

        this._shadowRoot.innerHTML = template;
        this._submitBtn = this._shadowRoot.querySelector('#btn-submit');
        this.addEvents('click', this._submitBtn, (e)=>{
            let opts = this.extractFormValues(this._shadowRoot.querySelectorAll('input'));
            this.submit(opts);
            e.preventDefault();
        });

    }

    getAttributeValue(attr, params){
        return (attr && attr.value) ? attr.value : params.default;
    }
    
    extractFormValues(formInputs){
        let opts = {};
        formInputs.forEach(elem=>{
            if(typeof elem.name !== 'undefined' && elem.name.trim().length !== 0){
                opts[elem.name] = elem.value;
            }
        });
        return opts;
    }

    addEvents(evt, elem, func){
        if(!elem) return;
        if(document && 'addEventListener' in document){
            elem.addEventListener(evt, func);
        }else if(document && 'attachEvent' in document){
            elem.attachEvent('on'+evt, funct);
        }else{
            elem['on' + evt] = func;
        }
    }

    submit(params) {
        if(!this._submitBtn) return;
        console.log('Submitting...', params);
        const _targetLink = this.attributes['target'].value;
        const _params = params;
        this._submitBtn.value = 'Processing...';
        this.inputAccessibility(false);
        fetch(_targetLink, {
            method: 'post',
            body: JSON.stringify(params) 
        }).then((res)=>{
            this.inputAccessibility(true);
            this._submitBtn.value = 'Login';
        }).catch((err)=>{
            this.inputAccessibility(true);
            this._submitBtn.value = 'Login';
            console.log('Error Submit ' + err.toString() + ' ' + _targetLink);
            alert('Error Submit: ' + err.toString() + ' ' + _targetLink);
        });
    }

    inputAccessibility(bool){
        if(!this._shadowRoot.querySelectorAll('input')) return;
        let inputFields = this._shadowRoot.querySelectorAll('input');
        inputFields.forEach(elem=>{
            if(!bool){
                elem.setAttribute('disabled', bool);
            }else{
                elem.removeAttribute('disabled');
            }
        });
    }
    
    attributeChangedCallback(name, oldVal, newVal) {
        //...some logic here when attributes are dynamically changed
    }
}
customElements.define('login-component', LoginComponent);
})(document)