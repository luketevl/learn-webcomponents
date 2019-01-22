import { Component, Prop } from "@stencil/core";

@Component({
  tag: 'lkt-side-drawer',
  styleUrl: './lkt-side-drawer.css',
  shadow: true
})
export class SideDrawer{
  @Prop() title: string;

  render(){
    return (
      <aside>
        <header>
          <h1>{this.title}</h1>
          <main>
            <slot />
          </main>
        </header>
        </aside>
    )
  }
}