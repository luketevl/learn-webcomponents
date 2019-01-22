class Modal extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.innerHTML = `
      <style>
      #backdrop{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(0,0,0, .75);
        z-index: 10;
        
      }
      #modal, #backdrop{
        opacity: 0;
        pointer-events: none;
      }
      #modal, #backdrop{
        opacity: 0;
        pointer-events: none;
      }
      :host([opened]) #modal, :host([opened]) #backdrop{
        opacity: 1;
        pointer-events: all;
      }
      #modal{
        position: fixed;
        top: 15vh;
        left: 25%;
        width: 50%;
        z-index: 100;
        background: #FFF;
        border-radius: 3px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .26);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      header{
        padding: 1rem;
      }

      header h1{
        font-size: 1.25rem;
      }

      #main{
        padding: 1rem;
      }
      #actions{
        border-top: 1px solid #ccc;
        padding: 1rem;
        display: flex;
        justify-content: flex-end;
      }

      #actions button{
        margin: 0 .25rem;
      }
      </style>
      <div id="backdrop"></div>
      <div id="modal">
        <header>
          <slot name="title"></slot>
          <h1>Please confirm</h1>
        </header>
        <section id="main">
          <slot></slot>
        </section>
        <section id="actions">
          <slot name="action">
            <button id="cancel">Cancel</button>
            <button id="confirm">Yeah !</button>
          </slot>
        </section>
      
      </div>
    `;

    const slots = this.shadowRoot.querySelectorAll('slot');
    slots[1].addEventListener('slotchange', event => {
      console.dir(slots[1].assignedNodes());
    });

    const backdrop = this.shadowRoot.querySelector('#backdrop');
    const cancelButton  = this.shadowRoot.querySelector('#cancel');
    const confirmButton = this.shadowRoot.querySelector('#confirm');

    cancelButton.addEventListener('click', this._cancel.bind(this))
    confirmButton.addEventListener('click', this._confirm.bind(this))
    backdrop.addEventListener('click', this._cancel.bind(this));

  }
  // static get observedAttributes(){
  //   return ['opened']
  // }

  // attributeChangedCallback(name, oldValue, newValue){
  //   if(name === 'opened'){
  //     if(this.hasAttribute('opened')){
  //       this.shadowRoot.querySelector('#backdrop').style.opacity = 1;
  //       this.shadowRoot.querySelector('#backdrop').style.pointerEvents = 'all';
  //       this.shadowRoot.querySelector('#modal').style.opacity = 1;
  //       this.shadowRoot.querySelector('#modal').style.pointerEvents = 'all';
  //     }
  //   }
  // }

  open(){
    this.setAttribute('opened', '');
  }
  hide(){
    this.removeAttribute('opened');
  }

  _cancel(event){
    this.hide();
    const cancelCustom = new Event('cancel',{
      bubbles: true,
      composed: true
    });
    event.target.dispatchEvent(cancelCustom);
  }
  _confirm(){
    this.hide();
    const confirmEvent = new Event('confirm')
    this.dispatchEvent(confirmEvent);
  }
}

customElements.define('lkt-modal', Modal);