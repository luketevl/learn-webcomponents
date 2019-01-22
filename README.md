# learn-webcomponents
Learn about WebComponents

# LINKS 
- https://developers.google.com/web/tools/chrome-devtools/inspect-styles/
- https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots
- https://developers.google.com/web/fundamentals/web-components/customelements
- https://developers.google.com/web/fundamentals/web-components/shadowdom
- https://www.webcomponents.org/polyfills
- https://developer.mozilla.org/en-US/docs/Web/Web_Components
- https://developers.google.com/web/fundamentals/web-components/customelements
- https://developers.google.com/web/fundamentals/web-components/shadowdom
- https://github.com/Polymer/lit-element
- https://github.com/skatejs/skatejs

# What are Web Components? 

## SHADOW DOM
> Manage a separate DOM node tree for your HTML elements (including CSS styles)

## TEMPLATES & SLOTS
> Write HTML templates that you can add to your HTML elements. Defined as core structure behind your element

## HTML IMPORTS
> Import HTML files **(NOT CONTINUED)**

![What are Web Components?]("What are Web Components?" /images/what_are_web_components.png)


# Why Web Components?
- Advantage
  - Encapsulate Logic + UI
    - Easy to understand
    - Easy to maintain
    - Separation of Concerns
  - Re-usable across Page
    - Use it just like a normal HTML element
    - Don't worry about overlapping logic
    - Write logic + UI only once
  - Re-usable between Apps/Projects 
    - Use it just like a normal HTML element
    - Re0use core UI elements across projects
    - Write logic + UI only once
    - *Optional: Publish as Package (npm)

![Why Web Components?]("Why Web Components?" /images/what_are_web_components.png)

# Web Components vs Angular, React, Vue and Jquery

![Web Components vs Angular, React, Vue and Jquery]("Web Components vs Angular, React, Vue and Jquery" /images/what_are_web_components.png)


# What are Web Components?
> Custom HTML element **<my-tag />**
![What are Web Components?]("What are Web Components?" /images/what_are_web_components.png)

# Types of Custom Elements
- Autonomous Elements (extend HTMLElement)
  - Don`t depend on anything that are totally independent
```js
class Tooltip extends HTMLElement{
  constructor(){
    super();
  }
}
```
- Extended Built-in Elements
![Types of Custom Elements?]("Types of Custom Elements?" /images/types-of-custom-elements.png)

# Web Component Lifecycle
- **constructor**
  - Called when object was **created**
  - Created in **memory** **dont** in **DOM**
- **connectedCallback()**
  - Element **attached** to **DOM**
  - Can start adding content or where can accessing the DOM
- **disconnectedCallback()**
  - Executed automatically
  - Element **detached** to DOM
- **attributeChangedCallback()**
  - Observed attribute updated
![Life Cycle?]("Life Cycle?" /images/life-cycle.png)


## STEPS
- Create File componentName.js
- Import File in index.html


### Creating
```js
class Tooltip extends HTMLElement{
  constructor(){
    super();
  }
}

class ConfirmLink extends HTMLAnchorElement{
  connectedCallback(){
    this.addEventListener('click', event =>  {
      if(!confirm('Do you really want to leave?')){
        event.preventDefault();
      }
    });
  }
}
```
- **Defining**
  - TagName
  - Class
  - Object { extends: 'elementNameExtended'} (to Autonomous)
```js
// TO Autonomous
customElements.define('lkt-tooltip', Tooltip);

//  TO EXTENDED
customElements.define('lkt-confirm-link', ConfirmLink, { extends: 'a' });
```

- **Using**
  - **Autonomous**
```html
<lkt-tooltip />
```
  - **EXTENDED**
    - Use te keyword **is**
```html
<a href="" is="lkt-confirm-link">Link</a>
```
### Dispatch Custom Events
- Event attached in **element**
```js
const cancelButton  = this.shadowRoot.querySelector('#cancel');
cancelButton.addEventListener('click', this._cancel.bind(this))
_cancel(event){
  const eventCustom = new Event('customEvent');
  event.target.dispatchEvent(eventCustom);
}
```
- Event attached in **component**
  - **bubles** allows us to define whether this event should bubble up or not
  - **composed** when set to true now suddenly ensures that this will work
    - you set it to true, then this event may leave the shadow DOM in which it is is in one
```js
const cancelButton  = this.shadowRoot.querySelector('#cancel');
cancelButton.addEventListener('click', this._cancel.bind(this))
_cancel(event){
  const eventCustom = new Event('customEvent', {
    bubble: true
  });
  event.target.dispatchEvent(eventCustom);
}
```

### Listening events
```js
class Tooltip extends HTMLElement{
  constructor(){
    super();
    this._tooltipContainer;
  }
  
  connectedCallback(){
    const tooltipIcon = document.createElement('span');
    tooltipIcon.textContent = ' (?)';
    tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this));
    tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this));
    this.appendChild(tooltipIcon);
  }

  _showTooltip(){
    console.log('show');
    this._tooltipContainer = document.createElement('div');
    this._tooltipContainer.textContent = 'This is the tooltip text!!';
    this.appendChild(this._tooltipContainer);
    }
    _hideTooltip(){
      this.removeChild(this._tooltipContainer);
    }
}

customElements.define('lkt-tooltip', Tooltip);
```
### Creating Attributes
- **getAttributes** in **connectedCallbakc**
```js
class Tooltip extends HTMLElement{
  constructor(){
    super();
    this._tooltipContainer;
    this._tooltipText = 'Some dummy tooltip text';
  }
  
  connectedCallback(){
    if(this.hasAttribute('text')){
      this._tooltipText = this.getAttribute('text');
    }
    const tooltipIcon = document.createElement('span');
    tooltipIcon.textContent = ' (?)';
    tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this));
    tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this));
    this.appendChild(tooltipIcon);
  }

  _showTooltip(){
    console.log('show');
    this._tooltipContainer = document.createElement('div');
    this._tooltipContainer.textContent = this._tooltipText;
    this.appendChild(this._tooltipContainer);
    }
    _hideTooltip(){
      this.removeChild(this._tooltipContainer);
    }
}

customElements.define('lkt-tooltip', Tooltip);
```

### Observing attribute change
- Javascript required implement observe
```js
static get observedAttributes(){
  return ['attributeName'];
}
attributeChangedCallback(attrName, oldValue, newValue){
  if(oldValue ===  newValue) return ;
  if(attrName === 'text'){
    this._tooltipText = newValue;
  }
}
```



### Styling
- Global CSS WRONG
```js
_showTooltip(){
    console.log('show');
    this._tooltipContainer = document.createElement('div');
    this._tooltipContainer.style.backgroundColor = '#000';
    this._tooltipContainer.style.color = '#FFF';
    this._tooltipContainer.style.position = 'absolute';
    this._tooltipContainer.style.zIndex = '2';
    this._tooltipContainer.textContent = this._tooltipText;
    this.appendChild(this._tooltipContainer);
  }
```
- Using **Shadow DOM**
```js
constructor(){
    super();
    this._tooltipContainer;
    this._tooltipText = 'Some dummy tooltip text';
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.innerHTML = `
    <style>
      div{
        background-color: #000;
        color: #FFF;
        position: absolute;
        z-index: 2;
      }
    </style>
    <slot>Default Text</slot>
    <span> (?) </span>
                                  `;
  }

  _showTooltip(){
    console.log('show');
    this._tooltipContainer = document.createElement('div');
    this._tooltipContainer.textContent = this._tooltipText;
    this.appendChild(this._tooltipContainer);
    }
```

- Styling "slot" Light DOM
  - Use the **::slotted(target){}**
  - Use the **::slotted(*){}** to style ALL slots
  - **Light DOM STYLE**  overwrite **SLOT STYLE**
```html
<lkt-tooltip><span class="highlight">Here we go</span></lkt-tooltip>
```
```js
constructor(){
    super();
    this._tooltipContainer;
    this._tooltipText = 'Some dummy tooltip text';
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.innerHTML = `

                                <style>
                                // DONT WORK
                                  .highlight{
                                    background-color: #F00;  
                                  }

                                // WORK
                                  ::slotted(.highlight){
                                   background-color: #F00;
                                   border: 1px solid orange;   
                                  }
                                </style>
                                <slot>Default text</slot>
                                 <span> (?) </span>
                                `;
  }
```
- Styling **HOST Component**
  - Use the **:host{}**
```js
constructor(){
    super();
    this._tooltipContainer;
    this._tooltipText = 'Some dummy tooltip text';
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.innerHTML = `

                                <style>
                                // DONT WORK
                                  .highlight{
                                    background-color: #F00;  
                                  }

                                  :host{
                                    background-color: #CCC;
                                  }

                                </style>
                                <slot>Default text</slot>
                                <span> (?) </span>
                                `;
  }
```
- Styling **CONDITIONAL** Component
```js
constructor(){
    super();
    this._tooltipContainer;
    this._tooltipText = 'Some dummy tooltip text';
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.innerHTML = `

                                <style>
                                // DONT WORK
                                  .highlight{
                                    background-color: #F00;  
                                  }

                                  :host(.className){
                                    background-color: #CCC;
                                  }

                                </style>
                                <slot>Default text</slot>
                                <span> (?) </span>
                                `;
  }
```
- Styling **HOST Component** in **MID**
  - Use the **:host{}**
```js
constructor(){
    super();
    this._tooltipContainer;
    this._tooltipText = 'Some dummy tooltip text';
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.innerHTML = `

                                <style>
                                // DONT WORK
                                  .highlight{
                                    background-color: #F00;  
                                  }

                                  :host-context(p){
                                    background-color: #CCC;
                                  }

                                </style>
                                <slot>Default text</slot>
                                <span> (?) </span>
                                `;
  }
```
- Cleaning Up Our Overall Styling


#### Shadow DOM
- Global CSS dont have affect
- **Creating**
  - Create in **constructor()**
```js
constructor(){
  this.attachShadow({
    mode: 'open'
  })
}
```
- **Using**
```js
_example(){
  this.shadowRoot.appendChild();
}
```

### Templates
- Use to pass "child:" to parent, equal amarican players
- **Creating** 
  - Required **id**
```html
<!--  BAD - NOT REUSABLE -->
<template id="tooltip-template">
  <span> (?) </span>
</template>
```
- **Using**
```js
// BAD - NOT REUSABLE
  constructor(){
    super();
    this._tooltipContainer;
    this._tooltipText = 'Some dummy tooltip text';
    this.attachShadow({
      mode: 'open'
    });

    const template = document.querySelector('#tooltip-template');

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  _example(){
    const tooltipIcon = this.shadowRoot.querySelector('span');
    // ....
  }

  // GOOD -> REUSABLE
  constructor(){
    super();
    this._tooltipContainer;
    this._tooltipText = 'Some dummy tooltip text';
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.innerHTML = `<slot>Default text</slot>
                                 <span> (?) </span>
                                `;
  }
```

#### Slots
- Creating
```html
 <template id="tooltip-template">
    <slot></slot><span> (?) </span>
  </template>
  <lkt-tooltip>Here we go</lkt-tooltip>
```
- **Slot Changes**
```
const slots = this.shadowRoot.querySelectorAll('slot');
    slots[1].addEventListener('slotchange', event => {
      console.dir(slots[1].assignedNodes());
    });
```


## FUNCTIONS
- **RENDER***
```js
_render(){}
```
- **Create Public methods**
```js

```

# Stencil.js
- https://stenciljs.com/
- https://stenciljs.com/docs/router
- https://stenciljs.com/docs/state-tunnel
- https://stenciljs.com/docs/config
- https://stenciljs.com/docs/distribution
- https://stenciljs.com/docs/overview


## What is Stencil.JS ?
![What is Stencil.JS ?](https://i.imgur.com/JwLubdq.png)
## Modules

- **Create component**
  - **tag**: TagName
  - **styleUrl**: URL to configure
  - **scoped**: Allow us to tell stencil that all the styles it finds in the external stylesheet or that are defined for this component || EMULATE SHADOW DOM
  - **shadow**: Use native shadow DOM
```js
import { Component } from "@stencil/core";

@Component({
  tag: 'lkt-modal',
  styleUrl: './lkt-modal.css',
  scoped: true, 
  shadow: true,

})
export class Modal{
  render(){
    return (
      <div>Muahahahahahaha</div> 
    )
  }
}
```

- **PROPS** | DEFAULT ARE **IMMUTABLE**
  - **Automatic Watcher**
```js

import { Component, Prop } from "@stencil/core";

@Component({
  tag: 'lkt-modal',
  styleUrl: './lkt-modal.css',
  scoped: true, 
  shadow: true,

})
export class Modal{
  @Prop({
    reflectToAttr: true
  }) title: string;

  @Prop({
    reflectToAttr: true,
    mutable: true
  }) open: string;

  render(){
    return (
      <h1>{this.title}</h1>
    )
  }
}
```

- *STATE**
```js

import { Component, Prop, State } from "@stencil/core";

@Component({
  tag: 'lkt-modal',
  styleUrl: './lkt-modal.css',
  scoped: true, 
  shadow: true,

})
export class Modal{
  @State() showContactInfo: boolean = false;

  @Prop({
    reflectToAttr: true
  }) title: string;

  @Prop({
    reflectToAttr: true,
    mutable: true
  }) open: string;

  render(){
    return (
      <h1>{this.title}</h1>
    )
  }
}
```
- **METHODS**
```js

import { Component, Prop, State, Method } from "@stencil/core";

@Component({
  tag: 'lkt-modal',
  styleUrl: './lkt-modal.css',
  scoped: true, 
  shadow: true,

})
export class Modal{
  @State() showContactInfo: boolean = false;

  @Prop({
    reflectToAttr: true
  }) title: string;

  @Prop({
    reflectToAttr: true,
    mutable: true
  }) opened: string;

@Method() 
  open(){
    console.log('method');
  }
  render(){
    return (
      <h1>{this.title}</h1>
    )
  }
}
```

## Acessing HOST ELEMENT
```js

import { Component, Prop, State, Method, Element } from "@stencil/core";

@Component({
  tag: 'lkt-modal',
  styleUrl: './lkt-modal.css',
  scoped: true, 
  shadow: true,

})
export class Modal{
  @Element() el: HTMLElement;

  @State() showContactInfo: boolean = false;

  @Prop({
    reflectToAttr: true
  }) title: string;

  @Prop({
    reflectToAttr: true,
    mutable: true
  }) opened: string;

@Method() 
  open(){
    const stockSymbol = (this.el.shadowRoot.querySelector('#stock-symbol') as HTMLInputElement).value
    console.log('method');
  }
  render(){
    return (
      <h1>{this.title}</h1>
    )
  }
}
```


## Using **REF**
```js

import { Component, Prop, State, Method, Element } from "@stencil/core";

@Component({
  tag: 'lkt-modal',
  styleUrl: './lkt-modal.css',
  scoped: true, 
  shadow: true,

})
export class Modal{
  stockSymbol: HTMLInputElement;
  
  @Element() el: HTMLElement;

  @State() showContactInfo: boolean = false;

  @Prop({
    reflectToAttr: true
  }) title: string;

  @Prop({
    reflectToAttr: true,
    mutable: true
  }) opened: string;

@Method() 
  open(){
    const stockSymbol = this.stockSymbol.value;
    console.log('method', stockSymbol);
  }
  render(){
    return (
      <h1>{this.title}</h1>
    )
  }
}
```
## Two Way Binding
```js
import { Component, State, Element } from '@stencil/core'
import { AV_API_KEY } from '../../global/global'
@Component({
  tag: 'lkt-stock-price',
  styleUrl: './lkt-stock-price.css',
  shadow: true
})

export class StockPrice{
  stockInput: HTMLInputElement;

  @Element() el: HTMLElement;

  @State() price: number = 0;
  @State() stockUserInput: string= '';
  @State() stockInputValid: boolean;

  onFetchStockPrice(event: Event){
    event.preventDefault();
    const stockSymbol = this.stockInput.value;
    console.log('Submitted');

    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if(!data.hasOwnProperty('Error Message')){
          this.price = +data['Global Quote']['05. price'];
        }
      })
      .catch(err => console.log(err))
  }
  onUserInput(event: Event){
    this.stockUserInput = (event.target as HTMLInputElement).value;
    this.stockInputValid = this.stockUserInput.trim() !== ''

  }
   render(){
     return [
       <form onSubmit={this.onFetchStockPrice.bind(this)}>
         <input id="stock-symbol" 
          ref={el => this.stockInput = el} 
          value={this.stockUserInput} 
          onInput={this.onUserInput.bind(this)}
          />
         <button disabled={!this.stockInputValid} type="submit">Fetch</button>
      </form>,
       <div>
         <p>Price: {this.price}</p>
       </div>
     ]
   }
}

```
## Lifecycle
- **componentDidLoad**
```js
import { Component, State, Element, Prop } from '@stencil/core'
import { AV_API_KEY } from '../../global/global'
@Component({
  tag: 'lkt-stock-price',
  styleUrl: './lkt-stock-price.css',
  shadow: true
})

export class StockPrice{
  stockInput: HTMLInputElement;

  @Element() el: HTMLElement;

  @State() price: number = 0;
  @State() stockUserInput: string= '';
  @State() stockInputValid: boolean;
  @State() error: string= '';
  @Prop() stockSymbol: string;

  onFetchStockPrice(event: Event){
    event.preventDefault();
    const stockSymbol = this.stockInput.value;
    console.log('Submitted');
    this.error = '';
    this._fetchStockPrice(stockSymbol);
  }
  onUserInput(event: Event){
    this.stockUserInput = (event.target as HTMLInputElement).value;
    this.stockInputValid = this.stockUserInput.trim() !== ''

  }

  _fetchStockPrice(stockSymbol: string){
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
    .then(res => {
      if(res.status !== 200){
        throw new Error('Invalid')
       }else{
          return res.json() ;
       }
    })
    .then(data => {
      console.log(data);
      if(!data['Global Quote']['05. price']){
        throw new Error('Invlaid Symbol');
      }
      this.price = +data['Global Quote']['05. price'];
    })
    .catch(err => this.error = err.message)
  }
  componentDidLoad(){
    if(this.stockSymbol){
      this._fetchStockPrice(this.stockSymbol);
    }
  }
   render(){
    let dataContent = this.error ? <p>Error: {this.error}</p> : <p>Price: {this.price}</p>
     return [
       <form onSubmit={this.onFetchStockPrice.bind(this)}>
         <input id="stock-symbol" 
          ref={el => this.stockInput = el} 
          value={this.stockUserInput} 
          onInput={this.onUserInput.bind(this)}
          />
         <button disabled={!this.stockInputValid} type="submit">Fetch</button>
      </form>,
       <div>
         {dataContent}
       </div>
     ]
   }
}

```
- **componentWillLoad**
```js
componentWillLoad(){
    console.log('ComponentWillLoad');
    console.log(this.stockSymbol);
  }
```
- **componentWillUpdate**
```js
componentWillUpdate(){
    console.log('componentWillUpdate');
    console.log(this.stockSymbol);
  }
```
- **componentDidUpdate**
```js
componentDidUpdate(){
    console.log('componentDidUpdate');
    console.log(this.stockSymbol);
  }
```
- **componentDidUnload**
```js
componentDidUnload(){
    console.log('componentDidUnload');
    console.log(this.stockSymbol);
  }
```
## Watch Props Changes
```JS
import { Component, State, Element, Prop, Watch } from '@stencil/core'
import { AV_API_KEY } from '../../global/global'
@Component({
  tag: 'lkt-stock-price',
  styleUrl: './lkt-stock-price.css',
  shadow: true
})

export class StockPrice{
  stockInput: HTMLInputElement;
  // initialStockSymbol: string = 'AAPL';

  @Element() el: HTMLElement;

  @State() price: number = 0;
  @State() stockUserInput: string= '';
  @State() stockInputValid: boolean;
  @State() error: string= '';
  @Prop({
    mutable: true,
    reflectToAttr: true
  }) stockSymbol: string;

  @Watch('stockSymbol')
  stockSymbolChanged(newValue: string, oldValue: string){
    if(newValue !== oldValue){
      this.stockUserInput = newValue;
      this._fetchStockPrice(newValue);
    }
  }
  onFetchStockPrice(event: Event){
    event.preventDefault();
    this.stockSymbol = this.stockInput.value;
    console.log('Submitted');
    this.error = '';
    this._fetchStockPrice(this.stockSymbol);
  }
  onUserInput(event: Event){
    this.stockUserInput = (event.target as HTMLInputElement).value;
    this.stockInputValid = this.stockUserInput.trim() !== ''

  }

  _fetchStockPrice(stockSymbol: string){
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
    .then(res => {
      if(res.status !== 200){
        throw new Error('Invalid')
       }else{
          return res.json() ;
       }
    })
    .then(data => {
      console.log(data);
      if(!data['Global Quote']['05. price']){
        throw new Error('InvaLid Symbol');
      }
      this.price = +data['Global Quote']['05. price'];
    })
    .catch(err => this.error = err.message)
  }
  componentDidLoad(){
    if(this.stockSymbol){
      // this.initialStockSymbol =this.stockSymbol;
      this.stockUserInput = this.stockSymbol;
      this.stockInputValid = true;
      this._fetchStockPrice(this.stockSymbol);
    }
  }
  // componentWillLoad(){
  //   console.log('ComponentWillLoad');
  //   console.log(this.stockSymbol);
  // }

  // componentWillUpdate(){
  //   console.log('componentWillUpdate');
  //   console.log(this.stockSymbol);
  // }
  // componentDidUpdate(){
  // //  if(this.stockSymbol !== this.initialStockSymbol){
  //   //  this.initialStockSymbol = this.stockSymbol;
  //   // this._fetchStockPrice(this.stockSymbol);
  // //  }
  //   console.log('componentDidUpdate');
  //   console.log(this.stockSymbol);
  // }
  componentDidUnload(){
    console.log('componentDidUnload');
    console.log(this.stockSymbol);
  }
   render(){
    let dataContent = this.error ? <p>Error: {this.error}</p> : <p>Price: {this.price}</p>
     return [
       <form onSubmit={this.onFetchStockPrice.bind(this)}>
         <input id="stock-symbol" 
          ref={el => this.stockInput = el} 
          value={this.stockUserInput} 
          onInput={this.onUserInput.bind(this)}
          />
         <button disabled={!this.stockInputValid} type="submit">Fetch</button>
      </form>,
       <div>
         {dataContent}
       </div>
     ]
   }
}

```

## Emiting **CUSTOM EVENTS**
- **Creating**
```js
import { Component, EventEmitter, Event } from '@stencil/core';

  @Event({
    bubbles: true,
    composed: true
  }) lktSymbolSelected: EventEmitter<string>;

export class StockFinder{
  onSelectSymbol(symbol: string){
    this.lktSymbolSelected.emit(symbol);
  }

}
```
- **Listening**
  - #Listen('eventName') | Listen event inside component
  - #Listen('body:eventName') | Listen event outside component GLOBAL
```js
import { Component, Listen } from '@stencil/core'
export class StockPrice{
  @Listen('lktSymbolSelected')
  onStockSymbolSelected(event: CustomEvent){
    if(event.detail && event.detail !== this.stockSymbol){
      this._fetchStockPrice(event.detail);
    }
  }
}
```
## HOSTDATA | ADD automatic class in web component host
```js
hostData(){
  return {
    class: this.error ? 'error' : ''
  }
}
```

## EMBEDDING COMPONENTS INTO COMPONENTS
- **Components** are **globally** just use.

## Deployment & Publishing



## OBSERVATIONS
- Web Components
 - Just vanilla javascript, no dependecies
 - **Nothing** but components -- e.g **no routing** etc... Require extras plugins.
- **HTMLElement**
  - All components(autonomous or extended) extends HTMLElement 
- customElements.define
  - **Use** company prefix, better to **unique** name
  - **Dont** use **my-** prefix
- **Attributes VS Properties**
![Attributes VS Properties?]("Attributes VS Properties?" /images/attributes_vs_propterties.png)
- **Light DOM STYLE **  overwrite **SLOT STYLE**
- You will need some polyfills there - specifically, you need to "unlock" Custom Elements and the Shadow DOM there: https://www.webcomponents.org/polyfills