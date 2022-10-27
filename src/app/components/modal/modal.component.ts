import {Component, Input} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title text-danger">Error</h4>
      <button type="button" class="btn-close text-primary" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body">
      <p>{{error}}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() error:any;

  constructor(public activeModal: NgbActiveModal) {}
}


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})export class ModalComponent {
  $:any;
  constructor(private modalService: NgbModal) {}
nOnInit(){
  $('#btn-reset').click(function(){
    console.log("HI")
  })
}
  open() {
    const modalRef = this.modalService.open(NgbdModalContent);
    }
}