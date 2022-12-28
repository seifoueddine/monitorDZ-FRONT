import { Component, Input, OnInit } from "@angular/core";
import { NotificationsService, NotificationType } from "angular2-notifications";
import { ChartService } from "src/app/components/charts/chart.service";
import { Colors } from "src/app/constants/colors.service";
import { lineChartData, polarAreaChartData } from "src/app/data/charts";
import { DashboardService } from "src/app/shared/services/dashboard.service";
import * as moment from "moment";
import { DatePipe } from '@angular/common';
import { environment } from "src/environments/environment";
import { Configuration, OpenAIApi } from 'openai';
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  @Input() chartClass = "dashboard-donut-chart";
  chartDataConfig: ChartService;
  polarAreaChartData: any;
  polarAreaChartDataAuthor: any;
  polarAreaChartDataTAgMedia: any;
  lineChartData: any;
  lineChartData_tag: any;
  spinner: boolean;
  articleByMedium: any;
  articleByAuthor: any;
  articleByTag: any;
  articleByDate: any;
  articlesWithCount = [];
  polarAreaChartDataTag: { labels: string[]; datasets: { data: unknown[]; borderWidth: number; borderColor: string[]; backgroundColor: string[]; }[]; };
  days: any = 7;
  start_date: any = new Date();
  end_date: any = new Date();
  
  start_date_tag: any = new Date();
  end_date_tag: any = new Date();

  start_date_author: any = new Date();
  end_date_author: any = new Date();

  rage_date: any = [new Date(), new Date()];
  rage_date_tag: any = [new Date(), new Date()];
    rage_date_author: any = [new Date(), new Date()];
  duration: any;
  durationTag: any;
    durationAuthor: any;
  today: Date = new Date();
  total = 0;
  _barChartOptions: any
   lineChartOptions: { legend: { display: boolean; }; responsive: boolean; maintainAspectRatio: boolean; tooltips: any; plugins: { datalabels: { display: boolean; }; }; scales: { yAxes: { gridLines: { display: boolean; lineWidth: number; color: string; drawBorder: boolean; }; ticks: { beginAtZero: boolean; stepSize: number; min: number; max: number; padding: number; }; }[]; xAxes: { gridLines: { display: boolean; }; }[]; }; };
  link: any;

  constructor(
    private chartService: ChartService,
    private dashboardService: DashboardService,
    private notifications: NotificationsService,
    private datePipe: DatePipe,
    private openai: OpenAIApi,
    private configuration:Configuration
  ) {
    this.chartDataConfig = this.chartService;

  }

  ngOnInit(): void {
    this.getArticleByMedium(this.start_date, this.end_date);
    this.getArticleByAuthor(this.start_date_author, this.end_date_author);
    this.getArticleByTag();
    this.getArticleByDate(7);
    this.getTagByDate(this.start_date_tag, this.end_date_tag);
    this.staticValues();
  }

  getArticleByMedium(startDate: any, endDate: any) {
    this.polarAreaChartData = null;
    this.articlesWithCount = [];
    this.dashboardService.getArticleByMedium(startDate,endDate).subscribe(
      (data) => {
        if (data.status) {
          this.total = 0;
          const resp = data.body;
          this.articleByMedium = resp;
          const keys = Object.keys(this.articleByMedium);
          const values:number[] = Object.values(this.articleByMedium);
          keys.map((key,index)=> {
            let object: any = {}
            object.name = key;
            object.count = values[index] + ( values[index] == 1 ? ' article' : ' articles');
            this.total = this.total + values[index]
            this.articlesWithCount.push(object)
          });

          this.polarAreaChartData = {
            labels: keys.length ? keys : ['NO DATA'],
            datasets: [
              {
                label: '',
                data:  values.length ? values : [1],
                borderWidth: 2,
                borderColor: [
                   '#6b1f64',
                   '#012740',
                   '#0f3d63',
                   '#0072a3',
                   '#3f4d2c',
                   '#54871e',
                   '#bd5911',
                   '#730402',
                   '#9c8236',
                   '#252526',
                   '#22a33e',
                   '#1f939c'
                ],
                backgroundColor: [
                  '#922c8833',
                  '#00365a33',
                  '#14538833',
                  '#008ecc33',
                  '#576a3d33',
                  '#6fb32733',
                  '#ed711733',
                  '#90060433',
                  '#c0a14533',
                  '#48494b33',
                  '#32e64033',
                  '#2cd0db33'
                  
                ],
              },
            ],
          };
        }
      },
      (error) => {
        this.spinner = false;
        this.notifications.create("Error", "error", NotificationType.Error, {
          theClass: "primary",
          timeOut: 6000,
          showProgressBar: false,
        });
      }
    );
  }

  getArticleByAuthor(startDate,endDate) {
    this.polarAreaChartDataAuthor = null
    this.dashboardService.getArticleByAuthor(startDate,endDate).subscribe(
      (data) => {
        if (data.status) {
          const resp = data.body;
          this.articleByAuthor = resp;
          const keys = Object.keys(this.articleByAuthor);
          const values = Object.values(this.articleByAuthor);
          this.polarAreaChartDataAuthor = {
            labels: keys.length ? keys : ['NO DATA'],
            datasets: [
              {
                data:  values.length ? values : [1],
                borderWidth: 2,
                borderColor: [
                   '#6b1f64',
                   '#012740',
                   '#0f3d63',
                   '#0072a3',
                   '#3f4d2c',
                   '#54871e',
                   '#bd5911',
                   '#730402',
                   '#9c8236',
                   '#252526',
                   '#22a33e',
                   '#1f939c'
                ],
                backgroundColor: [
                  '#922c8833',
                  '#00365a33',
                  '#14538833',
                  '#008ecc33',
                  '#576a3d33',
                  '#6fb32733',
                  '#ed711733',
                  '#90060433',
                  '#c0a14533',
                  '#48494b33',
                  '#32e64033',
                  '#2cd0db33'
                  
                ],
              },
            ],
          };
          
        }
      },
      (error) => {
        this.spinner = false;
        this.notifications.create("Error", "error", NotificationType.Error, {
          theClass: "primary",
          timeOut: 6000,
          showProgressBar: false,
        });
      }
    );
  }

  getArticleByTag() {
    this.dashboardService.getArticleByTag().subscribe(
      (data) => {
        if (data.status) {
          const resp = data.body;
          this.articleByTag = resp;
          const keys = Object.keys(this.articleByTag);
          const values = Object.values(this.articleByTag);
          this.polarAreaChartDataTag = {
            labels: keys.length ? keys : ['NO DATA'],
            datasets: [
              {
                data:  values.length ? values : [1],
                borderWidth: 2,
                borderColor: [
                   '#6b1f64',
                   '#012740',
                   '#0f3d63',
                   '#0072a3',
                   '#3f4d2c',
                   '#54871e',
                   '#bd5911',
                   '#730402',
                   '#9c8236',
                   '#252526',
                   '#22a33e',
                   '#1f939c'
                ],
                backgroundColor: [
                  '#922c8833',
                  '#00365a33',
                  '#14538833',
                  '#008ecc33',
                  '#576a3d33',
                  '#6fb32733',
                  '#ed711733',
                  '#90060433',
                  '#c0a14533',
                  '#48494b33',
                  '#32e64033',
                  '#2cd0db33'
                  
                ],
              },
            ],
          };
          
        }
      },
      (error) => {
        this.spinner = false;
        this.notifications.create("Error", "error", NotificationType.Error, {
          theClass: "primary",
          timeOut: 6000,
          showProgressBar: false,
        });
      }
    );
  }

  getArticleByDate(days? : any) {
    this.lineChartData = null
    this.days = days;
    this.dashboardService.getArticleByDate(this.days).subscribe(
      (data) => {
        if (data.status) {
          const resp = data.body;
          this.articleByDate = resp;
          const keys = Object.keys(this.articleByDate);
          const values = Object.values(this.articleByDate);
          let new_keys = [];
          keys.map((x)=>{
            new_keys.push( x.replace('00:00:00 UTC',' '))

          });

     
          const max = Math.max.apply(null, values);

          this.lineChartOptions = {
            legend: {
              display: false
            },
            responsive: true,
            maintainAspectRatio: false,
            tooltips: this.chartService.chartTooltip,
            plugins: {
              datalabels: {
                display: false
              }
            },
            scales: {
              yAxes: [
                {
                  gridLines: {
                    display: true,
                    lineWidth: 1,
                    color: 'rgba(0,0,0,0.1)',
                    drawBorder: false
                  },
                  ticks: {
                    beginAtZero: true,
                    stepSize: 10,
                    min: 50,
                    max: max + 50,
                    padding: 20
                  }
                }
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false
                  }
                }
              ]
            }
          };


            this.lineChartData = {
              labels: new_keys,
              datasets: [
                {
                  label: '',
                  data: values,
                  borderColor: Colors.getColors().themeColor1,
                  pointBackgroundColor: Colors.getColors().foregroundColor,
                  pointBorderColor: Colors.getColors().themeColor1,
                  pointHoverBackgroundColor: Colors.getColors().themeColor1,
                  pointHoverBorderColor: Colors.getColors().foregroundColor,
                  pointRadius: 4,
                  pointBorderWidth: 2,
                  pointHoverRadius: 6,
                  borderWidth: 2,
                  fill: false
                }
              ]
            };
        
          
        }
      },
      (error) => {
        this.spinner = false;
        this.notifications.create("Error", "error", NotificationType.Error, {
          theClass: "primary",
          timeOut: 6000,
          showProgressBar: false,
        });
      }
    );
  }

  changeDays(days){
  this.getArticleByDate(days);
  }

  changeDate(rangeDate: any) {
    this.spinner = true;
    this.start_date = this.datePipe.transform(
      new Date(rangeDate[0]),
      "dd/MM/yyyy"
    );
    this.end_date = this.datePipe.transform(
      new Date(rangeDate[1]),
      "dd/MM/yyyy"
    );

    let d2 = Date.parse(rangeDate[0]);
    let d1 = Date.parse(rangeDate[1]);
    this.getArticleByMedium(this.start_date, this.end_date);
    // this.loadData(
    //   this.itemsPerPage,
    //   1,
    //   this.direction,
    //   this.order_by,
    //   this.search,
    //   this.media_ids,
    //   this.start_date,
    //   this.end_date,
    //   this.langJoin
    // );

    let m = moment(d1);
    let years = m.diff(d2, "years");
    m.add(-years, "years");
    let months = m.diff(d2, "months");
    m.add(-months, "months");
    let days = m.diff(d2, "days");

    this.duration =
      +years > 0
        ? years + " Years " + months + " Mois " + days + " Jours "
        : +months > 0
        ? months + " Mois " + (+days > 0 ? days + " jours " : "")
        : days > 0
        ? days + " Jours "
        : "Même Jour";
  }

  removeDates() {
    this.spinner = true;
    this.start_date = new Date();
    this.end_date = new Date();
    this.duration = null;
    this.rage_date = [new Date(),new Date()];
    this.getArticleByMedium(this.start_date, this.end_date);

  }

  changeDateTag(rangeDate: any) {
   // this.spinner = true;
    this.start_date_tag = this.datePipe.transform(
      new Date(rangeDate[0]),
      "dd/MM/yyyy"
    );
    this.end_date_tag = this.datePipe.transform(
      new Date(rangeDate[1]),
      "dd/MM/yyyy"
    );

    let d2 = Date.parse(rangeDate[0]);
    let d1 = Date.parse(rangeDate[1]);
    this.getTagByDate(this.start_date_tag, this.end_date_tag);

    let m = moment(d1);
    let years = m.diff(d2, "years");
    m.add(-years, "years");
    let months = m.diff(d2, "months");
    m.add(-months, "months");
    let days = m.diff(d2, "days");

    this.durationTag =
      +years > 0
        ? years + " Years " + months + " Mois " + days + " Jours "
        : +months > 0
        ? months + " Mois " + (+days > 0 ? days + " jours " : "")
        : days > 0
        ? days + " Jours "
        : "Même Jour";
  }

  changeDateAuthor(rangeDate: any) {
    // this.spinner = true;
     this.start_date_author = this.datePipe.transform(
       new Date(rangeDate[0]),
       "dd/MM/yyyy"
     );
     this.end_date_author = this.datePipe.transform(
       new Date(rangeDate[1]),
       "dd/MM/yyyy"
     );
 
     let d2 = Date.parse(rangeDate[0]);
     let d1 = Date.parse(rangeDate[1]);
     this.getArticleByAuthor(this.start_date_author, this.end_date_author);
 
     let m = moment(d1);
     let years = m.diff(d2, "years");
     m.add(-years, "years");
     let months = m.diff(d2, "months");
     m.add(-months, "months");
     let days = m.diff(d2, "days");
 
     this.durationTag =
       +years > 0
         ? years + " Years " + months + " Mois " + days + " Jours "
         : +months > 0
         ? months + " Mois " + (+days > 0 ? days + " jours " : "")
         : days > 0
         ? days + " Jours "
         : "Même Jour";
   }
 

  removeDatesTag() {
    this.spinner = true;
    this.start_date_tag = new Date();
    this.end_date_tag = new Date();
    this.durationTag = null;
    this.rage_date_tag = [new Date(),new Date()];
    this.getTagByDate(this.start_date, this.end_date);

  }

 removeDatesAuthor() {
    this.spinner = true;
    this.start_date_author = new Date();
    this.end_date_author = new Date();
    this.durationAuthor = null;
    this.rage_date_author = [new Date(),new Date()];
    this.getArticleByAuthor(this.start_date, this.end_date);

  }
  

  getTagByDate(startDate: any, endDate: any) {
    this.lineChartData_tag = null
   // this.days = days;
    this.dashboardService.getTagByDate(startDate,endDate).subscribe(
      (data) => {
        if (data.status) {
          const resp = data.body;
         // this.articleByDate = resp;
          const keys = Object.keys(resp);
          const values = Object.values(resp);
          const max = Math.max.apply(null, values);


          this._barChartOptions =   {
            legend: {
              position: 'bottom',
              labels: {
                padding: 30,
                usePointStyle: true,
                fontSize: 12
              }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  gridLines: {
                    display: true,
                    lineWidth: 1,
                    color: 'rgba(0,0,0,0.1)',
                    drawBorder: false
                  },
                  ticks: {
                    beginAtZero: true,
                    stepSize: 1,
                    min: 0,
                    max: max,
                    padding: 20
                  }
                }
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false
                  }
                }
              ]
            },
            tooltips: this.chartService.chartTooltip
          };




          let new_keys = [];
          // keys.map((x)=>{
          //   new_keys.push( x.replace('00:00:00 UTC',' '))

          // });
            this.lineChartData_tag = {
              labels: keys,
              datasets: [
                {
                  label: '',
                  data: values,
                  borderColor: Colors.getColors().themeColor1,
                  pointBackgroundColor: Colors.getColors().foregroundColor,
                  pointBorderColor: Colors.getColors().themeColor1,
                  pointHoverBackgroundColor: Colors.getColors().themeColor1,
                  pointHoverBorderColor: Colors.getColors().foregroundColor,
                  pointRadius: 4,
                  pointBorderWidth: 2,
                  pointHoverRadius: 6,
                  borderWidth: 2,
                  fill: false
                }
              ]
            };
        
          
        }
      },
      (error) => {
        this.spinner = false;
        this.notifications.create("Error", "error", NotificationType.Error, {
          theClass: "primary",
          timeOut: 6000,
          showProgressBar: false,
        });
      }
    );
  }


  staticValues(){
    this.polarAreaChartDataTAgMedia = {
      labels: ['ALGERIE360','ENNAHAR','TSA','CHIFFREAFFAIRE','LIBERTE'],
      datasets: [
        {
          data:  [15,12,7,10,19],
          borderWidth: 2,
          borderColor: [
             '#6b1f64',
             '#012740',
             '#0f3d63',
             '#0072a3',
             '#3f4d2c',
             '#54871e',
             '#bd5911',

          ],
          backgroundColor: [
            '#922c8833',
            '#00365a33',
            '#14538833',
            '#008ecc33',
            '#576a3d33',
            '#6fb32733',
            '#ed711733',

            
          ],
        },
      ],
    };
  }

}
