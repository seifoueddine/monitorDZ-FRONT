import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  providers: [DatePipe]
})
export class FooterComponent implements OnInit {

  year: string;
  constructor(private datePipe: DatePipe){
      this.year = this.datePipe.transform(new Date(), 'yyyy');
  }

  ngOnInit() {
  }

}
