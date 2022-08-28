import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.renderer.addClass(document.body, 'background');
    this.renderer.addClass(document.body, 'no-footer');
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'background');
    this.renderer.removeClass(document.body, 'no-footer');
  }
}
