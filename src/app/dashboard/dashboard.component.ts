import { Component, OnInit } from "@angular/core";

@Component({
  selector: "dashboard",
  template: `
    <app-side-nav></app-side-nav>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
