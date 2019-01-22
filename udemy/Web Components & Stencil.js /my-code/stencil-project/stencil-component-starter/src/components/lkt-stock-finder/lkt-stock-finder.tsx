import { Component, State, EventEmitter, Event } from '@stencil/core';
import { AV_API_KEY } from '../../global/global'
@Component({
  tag: 'lkt-stock-finder',
  styleUrl: './lkt-stock-finder.css',
  shadow: true
})
export class StockFinder{
  stockNameInput: HTMLInputElement;
  @State() searchResults: {symbol: string, name: string}[] = [];
  
  @Event({
    bubbles: true,
    composed: true
  }) lktSymbolSelected: EventEmitter<string>;

  onFindStocks(event: Event){
    event.preventDefault()
    const stockName = (this.stockNameInput as HTMLInputElement).value;

    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${AV_API_KEY}`)
      .then(res => res.json())
      .then(json => this.searchResults = json['bestMatches'].map(item => ({
        symbol: item['1. symbol'],
        name: item['2. name']
      }) ))
      .catch(err => console.log(err))
  }

  onSelectSymbol(symbol: string){
    this.lktSymbolSelected.emit(symbol);
  }
  render(){
    return [
      <form onSubmit={this.onFindStocks.bind(this)}>
        <input id="stock-symbol" 
        ref={el => this.stockNameInput = el} 
        />
        <button type="submit">Find</button>
      </form>,
      <ul>
        {this.searchResults.map( item => (
          <li onClick={this.onSelectSymbol.bind(this, item.symbol)}><strong>{item.symbol}</strong> - {item.name}</li>
        ))}
      </ul>     
    ]
  }
}