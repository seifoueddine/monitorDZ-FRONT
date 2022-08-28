import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { OurNotificationsService } from 'src/app/shared/our-notifications.service';
import { SectorsService } from 'src/app/shared/services/sectors.service';
import { Sectors } from 'src/app/shared/models/sectors.model';

@Component({
  selector: 'app-sector-form',
  templateUrl: './sector-form.component.html',
  styleUrls: ['./sector-form.component.scss']
})
export class SectorFormComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };


  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  sectorForm: UntypedFormGroup;
  data: any
  types: { id: string; name: string; }[];
  constructor(private modalService: BsModalService,
              private sectorService: SectorsService, private notifications: NotificationsService,
              private ourNotificationService: OurNotificationsService)
               { 
               }

  ngOnInit() {
  }

  show(data?) { 
    this.data = data
    this.modalRef = this.modalService.show(this.template, this.config);
    this.createSectorForm(); 
  }


  createSectorForm() {
    if (!this.data) {
      this.sectorForm = new UntypedFormGroup({
        name: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
      });

    } else {
      this.sectorForm = new UntypedFormGroup({
        name: new UntypedFormControl(this.data.attributes.name, [Validators.required, Validators.minLength(2)]),
      });
    }
  }


  createSector(event) {
    // event.preventDefault();

    if (this.sectorForm.valid) {

      if (this.data) {
          const object = new Sectors;
          object.id = this.data.id
          object.name = this.sectorForm.value.name;
          this.sectorService.updateSector(object).subscribe(resCreate => {

            this.notifications.create('Success', 'Mettre à jour le secteur avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
            this.modalRef.hide();
            this.ourNotificationService.notficateReloadSectors();
      
          }, err => {
            
            this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'primary', timeOut: 6000, showProgressBar: false });

          });
        

      } else {
        const sector: Sectors = new Sectors();
        event.preventDefault();
        sector.name = this.sectorForm.value.name;
        this.sectorService.addSector(sector).subscribe(resCreate => {
          this.notifications.create('Success', 'Secteur créé avec succès', NotificationType.Success, { theClass: 'primary', timeOut: 6000, showProgressBar: false });
          this.modalRef.hide();
          this.ourNotificationService.notficateReloadSectors();
        }, error => {
          this.notifications.create('Erreur', 'error', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });

        });
       
      }
    }
  }


}
