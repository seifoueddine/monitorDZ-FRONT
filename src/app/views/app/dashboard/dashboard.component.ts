import { Component, Input, OnInit } from "@angular/core";
import { NotificationsService, NotificationType } from "angular2-notifications";
import { ChartService } from "src/app/components/charts/chart.service";
import { Colors } from "src/app/constants/colors.service";
import { lineChartData, polarAreaChartData } from "src/app/data/charts";
import { DashboardService } from "src/app/shared/services/dashboard.service";

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
  lineChartData: any;
  spinner: boolean;
  articleByMedium: any;
  articleByAuthor: any;
  articleByTag: any;
  articleByDate: any;
  polarAreaChartDataTag: { labels: string[]; datasets: { data: unknown[]; borderWidth: number; borderColor: string[]; backgroundColor: string[]; }[]; };

  constructor(
    private chartService: ChartService,
    private dashboardService: DashboardService,
    private notifications: NotificationsService,
  ) {
    this.chartDataConfig = this.chartService;
  }

  ngOnInit(): void {
    this.getArticleByMedium();
    this.getArticleByAuthor();
    this.getArticleByTag();
    this.getArticleByDate();
  }

  getArticleByMedium() {
    this.dashboardService.getArticleByMedium().subscribe(
      (data) => {
        if (data.status) {
          const resp = data.body;
          this.articleByMedium = resp;
          const keys = Object.keys(this.articleByMedium);
          const values = Object.values(this.articleByMedium);

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

  getArticleByAuthor() {
    this.dashboardService.getArticleByAuthor().subscribe(
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

  getArticleByDate() {
    this.dashboardService.getArticleByDate().subscribe(
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


}
