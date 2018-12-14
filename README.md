# learn-webcomponents
Learn about WebComponents

# LINKS 
- https://developers.google.com/web/tools/chrome-devtools/inspect-styles/


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


## FUNCTIONS



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