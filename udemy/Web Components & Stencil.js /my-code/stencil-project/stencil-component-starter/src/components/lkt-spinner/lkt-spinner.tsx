import { Component, Prop } from '@stencil/core'

@Component({
  tag: 'lkt-spinner',
  styleUrl: './lkt-spinner.css',
  shadow: true
})
export class Spinner{
  @Prop() show: boolean = false;

  render(){
    return (
      <div class="lds-heart"><div></div></div>
    )
  }
}