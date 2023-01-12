import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Folder } from 'src/app/models/Folder';
import { Task } from 'src/app/models/Task';
import { FolderService } from 'src/app/services/folder.service';
import { TaskService } from 'src/app/services/task.service';




@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css'],
 
})


export class FolderComponent implements OnInit {

  $: any;
  id_folder:any = this.activatedRoute.snapshot.params['id_folder'];
  folderName = this.activatedRoute.snapshot.params['folder_name'];
  folders:Folder[] = [];
  addTaskForm:FormGroup;
  folder: any;
  existe:boolean = false;
  task_not_finish: Task[] =[];
  task: Task[] = [];
  t: Task[] = [];
  tasks:Task[] = [];
  today = new Date();
  modalTitle: string = "";
  modalBody: string = "";
  finish: any;
  public state: string = 'false';
  editTaskForm:FormGroup;
  user:any;
  delete:any;
  dateValid:boolean = false;
  isLoad:boolean = false;
  constructor(private route:Router,private titulo:Title,private taskService: TaskService,private formBuilder:FormBuilder,private folderService:FolderService, private activatedRoute:ActivatedRoute) {

    titulo.setTitle(this.folderName);
    this.editTaskForm = this.formBuilder.group({
      id_task:[''],
      taskName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.maxLength(20), Validators.minLength(3)]],
      task_date: ['', [Validators.required]],

    })

    this.addTaskForm = this.formBuilder.group({
      taskName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.maxLength(20), Validators.minLength(3)]],
      task_date: ['', [Validators.required]],
    })

   }

  ngOnInit(): void {

    this.folders = JSON.parse(localStorage.getItem('folders') || '')
    let idFolders = [];
    idFolders = this.folders.map(x=>x.id_folder);
    

    idFolders.forEach(x=>{if( x == this.id_folder){this.existe = true;}})

if(this.existe){    

    this.user = JSON.parse(localStorage.getItem('user') || '')
    this.folderService.getTaskXFolder(this.id_folder).subscribe(
      (data:any)=>{
        
        this.task = data;

        
        this.t = this.task.filter((x: any) => x.is_finished === false)
        localStorage.setItem('task',JSON.stringify(this.t));

        
      },(error:any)=>{
        if(error.status == 500){
          this.modalTitle = "Error";
          this.modalBody = "Token timed out, please login."
          $('#modal-message').modal('show');
          $('#btn1').css('visibility','hidden');
          $('#btn2').css('visibility','hidden');
          setTimeout(()=>{
            $('#modal-message').modal('hide');
            localStorage.clear();
            this.route.navigate(['login']);
            location.reload();
          },2000); 
          
        }
      }
      )
   
    }else{
      this.route.navigate(['home']);
    }
  }

  btnClick(i: any) {
    this.modalTitle = "Confirm";
    this.modalBody = "¿ Are you sure to finish this task ?"
    $('#modal-message').modal('show');

    this.finish = i;

  }

  finishTask() {

    this.taskService.finishTask(this.finish).subscribe(

      (data: any) => {
        location.reload();
      }, (error: any) => {
        console.log(error);
      }

    )

  }

  deleteClick(id:any,name:any){
    this.modalTitle = "Confirm"
    this.modalBody = `¿ Are you sure to delete this task ? (`+name+`)`
    $('#modal-deleteConfirm').modal('show');
    this.delete = id;
  }

  deleteTask(){

    this.taskService.deleteTask(this.delete).subscribe(

      (data:any)=>{
        $('#message').css('color','#3a2').css('visibility','visible');
        $('#btn-delete').prop('disabled',true);
        setTimeout(()=>{
        $('#modal-deleteConfirm').modal('hide'),
        location.reload()
      },2000)
      },(error:any)=>{
        console.log(error);
      }
    )
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
  
  btnEditClick(i:any){

    this.task = JSON.parse(localStorage.getItem('task') || '')
    

    this.editTaskForm.controls['taskName'].setValue(this.t[i].task_name);
    this.editTaskForm.controls['task_date'].setValue(this.t[i].task_date);
    this.editTaskForm.controls['id_task'].setValue(this.t[i].id_task);
    $('#editTaskModal').modal('show');
    console.log(i);

  }

  editTaskFormSubmit(){
    if(this.editTaskForm.valid && this.dateValid){
      this.isLoad = true;
      $('#btn-edit').prop('disabled',true);
      this.editTask();
    }else{
      alert("Form have some error(s)")
    }
  }

  editTask(){
    const t:any = {
      task_name : this.editTaskForm.get('taskName')?.value,
      task_date : this.editTaskForm.get('task_date')?.value,
    }
    
    let id = this.editTaskForm.get('id_task')?.value;
    
    this.taskService.editTask(t,id).subscribe(
      (data:any)=>{
        this.isLoad = false;
        $('#msg').css('visibility','visible');
        $('#msg').append('Task edited<i class="fa fa-solid fa-check" style="color:#3a2;margin-left:5px;"></i>')
        localStorage.removeItem('folders')
        setTimeout(()=>{
          $('#editTaskModal').modal('hide');
          location.reload();
        },2000)
      }
    )

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

  createTask() {
const fol : Folder={
  folder_name: this.folderName,
  user_folder: this.user,
  id_folder : this.id_folder
}
    const task: Task = {
      task_date: this.addTaskForm.get('task_date')?.value,
      task_name: this.addTaskForm.get('taskName')?.value,
      task_folder: fol,
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
        this.modalBody = error.error.message;
        this.modalTitle = "Error";
        $('#modal-message').modal('show');
        $('#btn-submit-createTask').prop('disabled', false);
      }
    )

  }

}