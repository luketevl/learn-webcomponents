import { Component, State, Element, Prop, Watch, Listen } from '@stencil/core'
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
      this.stockInputValid = true;
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
        throw new Error('Invalid Symbol');
      }
      this.price = +data['Global Quote']['05. price'];
    })
    .catch(err => {
      this.error = err.message
      this.price = null
    })
  }
  componentDidLoad(){
    if(this.stockSymbol){
      // this.initialStockSymbol =this.stockSymbol;
      this.stockUserInput = this.stockSymbol;
      this.stockInputValid = true;
      this._fetchStockPrice(this.stockSymbol);
    }
  }

  hostData(){
    return {
      class: this.error ? 'error' : ''
    }
  }

  @Listen('body:lktSymbolSelected')
  onStockSymbolSelected(event: CustomEvent){
    console.log('event lktSymbolSelect');
    if(event.detail && event.detail !== this.stockSymbol){
      this.stockSymbol = event.detail
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
