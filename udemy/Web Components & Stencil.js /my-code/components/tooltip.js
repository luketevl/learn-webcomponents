class Tooltip extends HTMLElement{
  constructor(){
    super();
    this._tooltipContainer;
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
  }

  _showTooltip(){
    console.log('show');
    this._tooltipContainer = document.createElement('div');
    this._tooltipContainer.style.backgroundColor = '#000';
    this._tooltipContainer.style.color = '#FFF';
    this._tooltipContainer.style.position = 'absolute';
    this._tooltipContainer.style.zIndex = '2';
    this._tooltipContainer.textContent = this._tooltipText;
    this.shadowRoot.appendChild(this._tooltipContainer);
  }
    _hideTooltip(){
      this.shadowRoot.removeChild(this._tooltipContainer);
    }
}

customElements.define('lkt-tooltip', Tooltip);