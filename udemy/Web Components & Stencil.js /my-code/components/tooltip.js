class Tooltip extends HTMLElement{
  constructor(){
    super();
    
    this._tooltipVisible = false;
    this._tooltipText = 'Some dummy tooltip text';
    this.attachShadow({
      mode: 'open'
    });

    // const template = document.querySelector('#tooltip-template');

    this.shadowRoot.innerHTML = `
                                  <style>
                                    div{
                                      background-color: #000;
                                      color: #FFF;
                                      position: absolute;
                                      z-index: 2;
                                    }
                                    .highlight{
                                      background-color: #FF0000;
                                    }
                                    ::slotted(.highlight){
                                      background-color: #F00;   
                                      border: 1px solid orange;   
                                     }
                                  </style>
                                  <slot></slot>
                                  <span> (?) </span>
                                `;
  }
  attributeChangedCallback(attrName, oldValue, newValue){
    if(newValue === oldValue) return false;

    if(attrName === 'text'){
      this._tooltipText = newValue;
    }
  }
  static get observedAttributes(){
    return ['text'];
  }
  connectedCallback(){
    if(this.hasAttribute('text')){
      this._tooltipText = this.getAttribute('text');
  }

    const tooltipIcon = this.shadowRoot.querySelector('span');
    tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this));
    tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this));
    this.shadowRoot.appendChild(tooltipIcon);
    this.style.position= 'relative';

    this._render();
  }

  _showTooltip(){
    this._tooltipVisible = true;
    this._render();
    
  }
    _hideTooltip(){
      this._tooltipVisible = false;
      this._render();
    }

   _render(){
    let tooltipContainer = this.shadowRoot.querySelector('div');
     if(this._tooltipVisible){
      tooltipContainer = document.createElement('div');
      tooltipContainer.style.backgroundColor = '#000';
      tooltipContainer.style.color = '#FFF';
      tooltipContainer.style.position = 'absolute';
      tooltipContainer.style.zIndex = '2';
      tooltipContainer.textContent = this._tooltipText;
      this.shadowRoot.appendChild(tooltipContainer);
     }else{
       if(tooltipContainer){
         this.shadowRoot.removeChild(tooltipContainer);
       }
     }
   }
}

customElements.define('lkt-tooltip', Tooltip);