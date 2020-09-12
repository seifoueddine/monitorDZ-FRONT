import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent, ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { NotificationType, NotificationsService } from 'angular2-notifications';
import { OurNotificationsService } from 'src/app/shared/our-notifications.service';
import { ActivatedRoute } from '@angular/router';
import { CampaignsService } from 'src/app/shared/services/campaigns.service';
import { CampaignFormComponent } from './campaign-form/campaign-form.component';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent implements OnInit {

 
 

  @ViewChild(DatatableComponent) table: DatatableComponent;
  rows = [];

  public options = {
    position: ["bottom", "center"],
}
  spinner: boolean = true;
  ColumnMode = ColumnMode;
  temp = [...this.rows];
  itemsPerPage: number = 10;
  itemOptionsPerPage = [5, 10, 20];
  selected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  idItem: any ='';
 
  
  totalItem = 0;
  totalPage = 0;
  currentPage: number = 1;
  search: string = '';
  orderBy: string = 'created_at';
  direction: string = 'desc'
  loading: boolean;
  page: any;
  searchReq: any;

  totalElements: any;
 
   @ViewChild('addNewModalRef', { static: true }) addNewModalRef: CampaignFormComponent;
  showModal: any;
  sectors: any = [];
  media: any = [];
  tags: any = [];
  constructor(private campaignService: CampaignsService, private notifications: NotificationsService,
    private ourNotificationService: OurNotificationsService,private route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.setPage({ offset: 0 });
    // this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
     this.listenToNotifier();
  
 
  }


  
  listenToNotifier() {
    this.ourNotificationService.reloadCampaignsNotifier$.subscribe(res => {
    this.selected = [];
    this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
    });
  }


  

  loadData(pageSize, currentPage, direction, orderBy, search) {
    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.search = search;
    this.orderBy = orderBy;
    this.direction = direction

    this.campaignService.getCampaign(currentPage, orderBy , direction, pageSize, search).subscribe(
      data => {
        if (data.status) {
          this.totalElements = +data.headers.get('X-Total-Count');
          const resp = data.body;
          this.rows = resp.data
          this.totalItem = data.totalItem;
          this.totalPage = data.totalPage;
          this.spinner = false;
          this.sectors = resp.included.filter(s=> s.type === 'sector');
          this.media = resp.included.filter(s=> s.type === 'medium');
        }
      },
      error => {
        this.notifications.create('Error', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
      }
    );
  }


  
  showAddNewModal() {
    this.addNewModalRef.show(); 
  }


  editCampaign(campaign){
  let sectorIdsArray = [];
  let mediaIdsArray = [];
  let tagIdsArray = [];
  campaign.relationships.sectors.data.map(x=> sectorIdsArray.push(x.id));
  campaign.relationships.media.data.map(x=> mediaIdsArray.push(x.id));
  const sectorList =  this.sectors.filter(f => sectorIdsArray.includes(f.id));  
  const mediaList =  this.media.filter(f => mediaIdsArray.includes(f.id));
  const tagList =  campaign.attributes.tags;
  let sectorNameArray = [];
  let mediaNameArray = [];
  let tagNameArray = [];
  sectorList.map(x=> sectorNameArray.push(x.id));
  mediaList.map(x=> mediaNameArray.push(x.id));
  tagList.map(x=> tagNameArray.push(String(x.id)));
   campaign.sectorNameArray = sectorNameArray;
   campaign.mediaNameArray = mediaNameArray;
   campaign.tagNameArray = tagNameArray;
    this.addNewModalRef.show(campaign);
  }



  
  updateFilter(event) {
    const val = event.target.value.toLowerCase().trim();
   console.log(val);
   this.search = val
   if (this.searchReq) {
     clearTimeout(this.searchReq);
   }
   this.searchReq =   setTimeout(() => {
     this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
     this.loading = false;
   }, 1000);
 }

 onSelect({ selected }) {
   console.log(selected);
   
   this.idItem = ''
   const array = [];
   selected.map(x=> { array.push( x.id) });
   this.idItem =  array.join(',');
   console.log(this.idItem);
   
   this.selected.splice(0, this.selected.length);
   this.selected.push(...selected);
   this.setSelectAllState();
 }

 setSelectAllState() {
   if (this.selected.length === this.rows.length) {
     this.selectAllState = 'checked';
   } else if (this.selected.length !== 0) {
     this.selectAllState = 'indeterminate';
   } else {
     this.selectAllState = '';
   }
 }

 selectAllChange($event) {
   if ($event.target.checked) {
     this.selected = [...this.rows];
   } else {
     this.selected = [];
   }
   this.idItem = ''
   const array = [];
   this.selected.map(x => { array.push(x.id) });
   this.idItem = array.join(',');
   console.log(this.idItem);
   this.setSelectAllState();
 }

 onItemsPerPageChange(itemCount) {
   console.log(itemCount);
   this.itemsPerPage = itemCount;
   this.currentPage = 1
   this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
   // this.loading = false;
  
 }


 onSort(event) {
   // event was triggered, start sort sequence
   console.log('Sort Event', event);
   this.loading = true;
   const sortValue = event.sorts[0].prop
   const dirValue = event.sorts[0].dir
   this.direction = dirValue
   this.orderBy = sortValue;
   // emulate a server request with a timeout
   setTimeout(() => {
     this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
     this.loading = false;
   }, 1000);
 }



  /**
  * Populate the table with new data based on the page number
  * @param page The page to select
  */
 setPage(pageInfo) {
   this.currentPage = pageInfo.offset + 1;
   this.loadData(this.itemsPerPage, this.currentPage, this.direction, this.orderBy, this.search);
   console.log(pageInfo);
   console.log(this.currentPage);
 }


 getTags(tags){ 


  let tagNameArray = [];
  tags.map(x=> tagNameArray.push(x.name));
  return  tagNameArray.join(',') 


 }



 getMedia(campaign){ 


  let mediaIdsArray = [];
  campaign.relationships.media.data.map(x=> mediaIdsArray.push(x.id));
  const mediaList =  this.media.filter(f => mediaIdsArray.includes(f.id));  
  let mediaNameArray = [];
  mediaList.map(x=> mediaNameArray.push(x.attributes.name));
  return  mediaNameArray.join(',') 


 }


}
