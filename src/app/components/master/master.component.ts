import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from 'src/app/models/Task';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/User';
import { Folder } from 'src/app/models/Folder';
import { TaskService } from 'src/app/services/task.service';
import { DatePipe } from '@angular/common';
import { FolderService } from 'src/app/services/folder.service';
import { hide } from '@popperjs/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../modal/modal.component';
import { AuthServiceService } from 'src/app/services/auth-service.service';

import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit {
  $: any;
  modal: Modal | undefined;
  addTaskForm: FormGroup;
  createFolderForm: FormGroup;
  changePasswordForm: FormGroup;
  
  today = new Date();
  user: User;
  folder: Folder[] = [];
  task: Task[] = [];
  userOnline:String[] = [];
  pass_regex = "(?=.*[-!#$%&/().,?¡_])(?=.*[A-Z])(?=.*[a-z]).{8,}";
  task_do: Task[] = [];
  task_finish: Task[] = [];
  dateValid: boolean;
  passwordCoincide: boolean = false;
  modalTitle: string = "";
  modalBody: string = "";
  idFolderDelete: any;
  role = localStorage.getItem('rol' || '');
  constructor(private formBuilder: FormBuilder, private userService: UserService, private taskService: TaskService,
    private folderService: FolderService, private modalService: NgbModal, private authService: AuthServiceService,
    private router:Router,private titulo:Title) {

      titulo.setTitle("Home");
    this.addTaskForm = this.formBuilder.group({
      taskName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.maxLength(20), Validators.minLength(3)]],
      task_date: ['', [Validators.required]],
      folder: ['', [Validators.required]]
    })

    this.createFolderForm = this.formBuilder.group({
      folderName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.maxLength(20), Validators.minLength(3)]]
    })

    this.changePasswordForm = this.formBuilder.group({

      actualPassword: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(8), Validators.pattern(this.pass_regex)]],
      newPasswordRepeat: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(8), Validators.pattern(this.pass_regex)]]

    });


  }

  ngOnInit(): void {
    
    this.userService.getUserById(localStorage.getItem('id_user')).subscribe(
      (data: any) => {
        this.user = data.body;
        this.folder = data.body.folder_x_user;
        this.task = data.body.task_x_user;
        localStorage.setItem('folders', JSON.stringify(data.body.folder_x_user));
        localStorage.setItem('user',JSON.stringify(this.user));
        this.task.forEach(
          x => {

            let k = new Date(x.task_date)

            var dif = k.getTime() - this.today.getTime();

            let day = Math.floor(dif / (1000 * 60 * 60 * 24));

            console.log(day)
            if ( ((day >= 0 && day <= 1)) && !x.is_finished) {
              this.task_do.push(x)
              console.log(this.task_do);
            }else if((day < 0 || isNaN(day)) && !x.is_finished){
              this.task_finish.push(x);
              console.log("-")
              console.log(this.task_finish)
            }
          }
        )
        
        if (this.task_do.length !== 0) {
          console.log(this.task_do)
         const toastLiveExample = document.getElementById('liveToast')
          const toast = new bootstrap.Toast(toastLiveExample || ''); 
          toast.show()
        }

        if(this.task_finish.length !== 0){

          const toastLiveExample = document.getElementById('notificationsTaskFinished')
          const toast = new bootstrap.Toast(toastLiveExample || '');
          toast.show()
        }

      }, (error: any) => {

        console.log(JSON.parse(error));
      }


    )



    $('#newPasswordRepeat').focusout(() => {
      if ($('#newPassword').val() ===
        $('#newPasswordRepeat').val()) {
        this.passwordCoincide = true;
      } else {
        this.passwordCoincide = false;
      }

    })

    $('#newPassword').focusout(() => {
      if ($('#newPassword').val() ===
        $('#newPasswordRepeat').val()) {
        this.passwordCoincide = true;
      } else {
        this.passwordCoincide = false;
      }
    })

      if(localStorage.getItem('rol')?.includes('ADMIN')){
      this.userService.getUserOnline().subscribe(
        (data:any)=>{
          this.userOnline = data.body;
          console.log(this.userOnline)
        },(error:any)=>{

          if(error.status == 500){
            this.modalService.open(NgbdModalContent).componentInstance.error = "Token expired, or invalid. You're will redirect to the login page.";
            setTimeout(()=>{
            localStorage.clear();this.router.navigate(['login']); location.reload();},2000);
           
          }
        }
      )
    }
    }

  

  open() {
    this.modal = new bootstrap.Modal(document.getElementById('exampleModal')!)
    this.modal.show();
  }

  addTaskSubmit() {
    if (this.addTaskForm.valid && this.dateValid && (this.addTaskForm.get('folder')?.value !== '-')) {
      $('#modal-footer-createTask').append('<span class="spinner-grow spinner-grow-sm text-success text-center loading" role="status" aria-hidden="true"></span>')
      $('#btn-submit-createTask').prop('disabled', true);
      this.createTask();
    } else {
      alert("Form have some error.");
    }
  }

  addFolderSubmit() {
    if (this.createFolderForm.valid) {
      this.createFolder();
    } else {
      alert("form have some error.");
    }
  }

  changePasswordSubmit() {
    if (this.changePasswordForm.valid && this.passwordCoincide) {

      $('#modal-footer-changePassword').append('<span class="spinner-grow spinner-grow-sm text-success loading" role="status" aria-hidden="true"></span>')
      $('#btn-submit-changePassword').prop('disabled', true);
      this.changePassword();
    } else {
      alert("form have some error.");
    }
  }

  validateTaskDate(event: any) {

    let day = new Date(event.target.value);
    let maxYear = this.today.getFullYear() + 2;
    let yearDigits = day.toString().split(' ')
    if ((day < this.today) || (day.getFullYear() > maxYear) || (yearDigits[3].length > 4)) {
      this.dateValid = false;
    } else {
      this.dateValid = true;
    }
  }

  createFolder() {

    const fol: Folder = {
      folder_name: this.createFolderForm.get('folderName')?.value,
      user_folder: this.user
    }
    console.log(fol);
    this.folderService.createFolder(fol).subscribe(
      (data: any) => {
        location.reload();
      }, (err: any) => {
        if(err.status == 500){
        $('#addFolderModal').modal('hide');
          this.modalService.open(NgbdModalContent).componentInstance.error = "Token expired, or invalid. You're will redirect to the login page.";
          setTimeout(()=>{
          localStorage.clear();this.router.navigate(['login']);location.reload()},2000);
         
        }

        
      }
    )
  }

  createTask() {

    const task: Task = {
      task_date: this.addTaskForm.get('task_date')?.value,
      task_name: this.addTaskForm.get('taskName')?.value,
      task_folder: this.addTaskForm.get('folder')?.value,
      user_task: this.user,
      task_date_added: ''
    }

    this.taskService.createTask(task).subscribe(
      (data: any) => {
        $('.loading').remove()
        $('#message-Task').css('color', '#6a4').css('visibility', 'visible');
        setTimeout(() => {
          this.addTaskForm.reset();
          $('#message-Task').css('visibility', 'hidden');
          $('#addTaskModal').modal('hide');

        }, 2000);
        location.reload();
      }, (error: any) => {
        if(error.status == 500){

          setTimeout(()=>{this.modalService.open(NgbdModalContent).componentInstance.error = "Token expired, or invalid. You're will redirect to the login page.";
          localStorage.clear();this.router.navigate(['login']);},2000);
          location.reload();
        }
        this.modalBody = error.error.message;
        this.modalTitle = "Error";
        $('#modal-message').modal('show');
        $('#btn-submit-createTask').prop('disabled', false);
      }
    )

  }


  changePassword() {
    const changePass: any = {
      actualPassword: this.changePasswordForm.get('actualPassword')?.value,
      newPassword: this.changePasswordForm.get('newPassword')?.value
    }
    this.authService.changePassword(this.user.id_user, changePass).subscribe(
      (data: any) => {
        console.log(data);
        $('.loading').remove();
        $('#modal-footer-changePassword').append('<i class="fa fa-solid fa-check" style="color:#3a2;"></i>')
        setTimeout(() => {
          $('#changePasswordModal').modal('hide');
        }, 2000)

      }, (error: any) => {
        if(error.status == 500){

          setTimeout(()=>{this.modalService.open(NgbdModalContent).componentInstance.error = "Token expired, or invalid. You're will redirect to the login page.";
          localStorage.clear();this.router.navigate(['login']);},2000);
          location.reload();
        }
        console.log(error);
        this.modalBody = error.error.message;
        this.modalTitle = "Error";
        $('#modal-message').modal('show');
        $('#btn-submit-changePassword').prop('disabled', false);
        $('.loading').remove();

      }
    )

  }

  deleteFolderClick(id: any) {
    this.modalTitle = "Confirm";
    this.modalBody = "¿ Are you sure to delete this folder ?";
    $('#modal-confirmDelete').modal('show');
    this.idFolderDelete = id;
  }

  deleteFolder() {

    this.folderService.deleteFolder(this.idFolderDelete).subscribe(
      (data: any) => {

        $('#message-confirmDelete').css('color', '#6a4').css('visibility', 'visible');
        $('#btn-delete').prop('disabled', true);
        setTimeout(() => {
          $('#message-confirmDelete').css('visibility', 'hidden');
          $('#modal-confirmDelete').modal('hide')
          location.reload();
        }, 3000)
      }, (error: any) => {
        if(error.status == 500){

          setTimeout(()=>{this.modalService.open(NgbdModalContent).componentInstance.error = "Token expired, or invalid. You're will redirect to the login page.";
          localStorage.clear();this.router.navigate(['login']);},2000);
          location.reload();
        }
      }
    )
  }

  logout(){

    this.authService.logout().subscribe(
      (data:any)=>{
        localStorage.clear();
        this.router.navigate(['login']);
      },(error:any)=>{
        if(error.status == 500){

          setTimeout(()=>{this.modalService.open(NgbdModalContent).componentInstance.error = "Token expired, or invalid. You're will redirect to the login page.";
          localStorage.clear();this.router.navigate(['login']);},2000);
          location.reload();
        }
        
      }
    )
  }

  editModal(){
    $('#editUserModal').modal('show')
  }
}
