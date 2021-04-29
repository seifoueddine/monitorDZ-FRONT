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
  spinner: boolean;
  articleByMedium: any;
  articleByAuthor: any;

  constructor(
    private chartService: ChartService,
    private dashboardService: DashboardService,
    private notifications: NotificationsService
  ) {
    this.chartDataConfig = this.chartService;
  }

  ngOnInit(): void {
    this.getArticleByMedium();
    // this.getArticleByAuthor();
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
            labels: keys,
            datasets: [
              {
                label: '',
                data: values,
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
