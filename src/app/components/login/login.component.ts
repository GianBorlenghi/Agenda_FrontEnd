import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Login } from 'src/app/models/Login';
import { User } from 'src/app/models/User';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { ModalComponent, NgbdModalContent } from '../modal/modal.component';

@Component({
  selector: 'ngbd-modal-content',
  template: `
 
    <div class="modal-header">
      <h4 class="modal-title text-danger">Reset password</h4>
      <button type="button" class="btn-close text-primary" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
    </div>
    <div class="modal-body">
    <p>Insert your username</p>
      <div class="col-auto">
      <label class="sr-only" for="inlineFormInputGroup">E-mail</label>
      <div class="input-group mb-2">
        <div class="input-group-prepend">
          
        </div>
        <input type="text" style="color:#444;" class="form-control" id="reset-username" placeholder="Username" minlength="8">
        
      </div>
      <div class="text-center" style="visibility:hidden">
      <span class="spinner-grow spinner-grow-sm text-success"  role="status"
      aria-hidden="true"></span></div>
      <div id="message-error" style=" text-align:center;font-size: 15px;color :#953;"></div>

    </div>
    <div class="modal-footer">

      <button type="button" class="btn btn-outline-success" id="btn-reset" (click)="resetPassword()">Send</button>
      <button type="button" class="btn btn-outline-danger" (click)="activeModal.close('Close click')">Close</button>
    </div>
    
    </div>
  
  `
})
export class NgbdModalInput {
  @Input() error: any;
  constructor(public activeModal: NgbActiveModal, public authService: AuthServiceService) {
  }

  resetPassword() {
    let value_user = $('#reset-username').val();
    if (!this.validateUser(value_user)) {
      $('#reset-username').css('border', '1px solid #a11')
    } else {
      $('.text-center').css('visibility', 'visible')
      $('#reset-username').css('border', '1px solid #1a1')
      $('#btn-reset').prop('disabled', true);
      $('#message-error').text('')
      this.authService.resetPassword(value_user).subscribe(
        (data: any) => {
          $('#message-error').text("Your new password was send to your e-mail").css('color', '#1a1')
          $('.text-center').css('visibility', 'hidden')

          setTimeout(() => {
            this.activeModal.close();
          }, 2000)
        },
        (error: any) => {
          $('.text-center').css('visibility', 'hidden')
          $('#reset-username').css('border', '1px solid #a11')
          $('#message-error').text(error.error.message);
          $('#btn-reset').prop('disabled', false);
        }
      )
    }

  }

  validateUser(user: any) {
    var rege = '^[a-zA-Z 0-9]{5,16}$'
    return (RegExp(rege).test(user));
  }

}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild("modalRef", { static: false }) modalRef: TemplateRef<any>;


  modal: ModalComponent;
  loginForm: FormGroup;
  registerForm: FormGroup;
  $: any;
  provinces: any[] = [];
  municipios: any[] = [];
  cities: any[] = [];
  selectedCity: any;
  selectedProvince: any;
  pass_regex = "(?=.*[-!#$%&/().,?¡_])(?=.*[A-Z])(?=.*[a-z]).{8,}";
  today: any = new Date();
  ageValid: boolean;
  isLoad: boolean = false;
  isLoadReg: boolean = false;
  constructor(private titulo:Title,private route: Router, private formBuilder: FormBuilder, private authService: AuthServiceService, private httpClient: HttpClient, private modalService: NgbModal) {

    titulo.setTitle("Login");
    this.loginForm = this.formBuilder.group({

      username: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(5), Validators.pattern('^[a-zA-Z 0-9]*$')]],
      password: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(8)]]
    })


    //------------------------------------------------------------------------------------------------------------------------

    this.registerForm = this.formBuilder.group({

      name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(3), Validators.pattern('^[a-zA-Z]*$')]],
      surname: ['', [Validators.required, Validators.maxLength(35), Validators.minLength(3), Validators.pattern('^[a-zA-Z]*$')]],
      dateOfBirth: ['', [Validators.required]],
      province: ['', [Validators.required]],
      city: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      username: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(5), Validators.pattern('^[a-zA-Z 0-9]*$')]],
      password: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(8), Validators.pattern(this.pass_regex)]]
    })
  }


  ngOnInit(): void {


    if (localStorage.getItem('token') !== null) {
      this.route.navigate(['home'])
    }

    $('.message #a2').click(function () {
      $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
      $('.form').css('margin', '-50px auto');
      $('#m1').css('margin-top', '0px');
      $('#m1').css('margin-bottom', '0px')

    });

    $('.message #a1').click(function () {
      $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
      $('.form').css('margin', '100px auto');
    });
    this.getProvinces();


    $('#input-name').focus(() => {
      $('#input-name').css('border', 'none').css('outline', 'none')
    })

    $('#input-surname').focus(() => {
      $('#input-surname').css('border', 'none').css('outline', 'none')
    })

    $('#date_of_birth').focus(() => {
      $('#date_of_birth').css('border', 'none').css('outline', 'none')
    })

    $('#input-province').focus(() => {
      $('#input-province').css('border', 'none').css('outline', 'none')
    })

    $('#input-city').focus(() => {
      $('#input-city').css('border', 'none').css('outline', 'none')
    })
    $('#input-mail').focus(() => {
      $('#input-mail').css('border', 'none').css('outline', 'none')
    })

    $('#input-username').focus(() => {
      $('#input-username').css('border', 'none').css('outline', 'none')
    })

    $('#input-password').focus(() => {
      $('#input-password').css('border', 'none').css('outline', 'none')
    })
  }


  submitRegister() {

    if (this.registerForm.valid && this.selectedCity !== '-' && this.selectedProvince !== '-') {
      $('#btn-register').prop('disabled', true).css('visibility', 'hidden');
      this.isLoadReg = true;
      this.register();
    } else if (this.registerForm.get('name')?.errors?.['required'] || this.registerForm.get('name')?.errors?.['maxlength'] ||
      this.registerForm.get('name')?.errors?.['minlength'] || this.registerForm.get('name')?.errors?.['pattern']) {

      this.modalService.open(NgbdModalContent, { centered: true }).componentInstance.error = "Form have some field invalid."
      $('#input-name').css('border', '1.5px solid #e32');

    } else if (this.registerForm.get('surname')?.errors?.['required'] || this.registerForm.get('surname')?.errors?.['maxlength'] ||
      this.registerForm.get('surname')?.errors?.['minlength'] || this.registerForm.get('surname')?.errors?.['pattern']) {
      this.modalService.open(NgbdModalContent, { centered: true }).componentInstance.error = "Form have some field invalid."

      $('#input-surname').css('border', '1.5px solid #e32');

    } else if (this.registerForm.get('date_of_birth')?.errors?.['required'] || !this.ageValid) {
      this.modalService.open(NgbdModalContent, { centered: true }).componentInstance.error = "Form have some field invalid."

      $('#date_of_birth').css('border', '1.5px solid #e32');

    } else if (this.registerForm.get('province')?.errors?.['required'] || this.selectedProvince == '-') {
      this.modalService.open(NgbdModalContent, { centered: true }).componentInstance.error = "Form have some field invalid."

      $('#input-province').css('border', '1.5px solid #e32');

    } else if (this.registerForm.get('city')?.errors?.['required'] || this.selectedCity == '-') {
      this.modalService.open(NgbdModalContent, { centered: true }).componentInstance.error = "Form have some field invalid."

      $('#input-city').css('border', '1.5px solid #e32');

    } else if (this.registerForm.get('email')?.errors?.['required'] || this.registerForm.get('email')?.errors?.['mail']) {
      this.modalService.open(NgbdModalContent, { centered: true }).componentInstance.error = "Form have some field invalid."

      $('#input-mail').css('border', '1.5px solid #e32');

    } else if (this.registerForm.get('username')?.errors?.['required'] || this.registerForm.get('username')?.errors?.['maxlength'] ||
      this.registerForm.get('username')?.errors?.['minlength'] || this.registerForm.get('username')?.errors?.['pattern']) {
      this.modalService.open(NgbdModalContent, { centered: true }).componentInstance.error = "Form have some field invalid."

      $('#input-username').css('border', '1.5px solid #e32');

    } else if (this.registerForm.get('password')?.errors?.['required'] || this.registerForm.get('password')?.errors?.['maxlength'] ||
      this.registerForm.get('password')?.errors?.['minlength'] || this.registerForm.get('password')?.errors?.['pattern']) {
      this.modalService.open(NgbdModalContent, { centered: true }).componentInstance.error = "Form have some field invalid."

      $('#input-password').css('border', '1.5px solid #e32');

    }

  }

  submitLogin() {

    if (this.loginForm.valid) {
      this.logIn();
      $('#btn-login').prop('disabled', true).css('visibility', 'hidden')
      this.isLoad = true;

    } else {
      this.modalService.open(NgbdModalContent, { centered: true }).componentInstance.error = "Form have some field invalid."
    }
  }
  openResetModal() {
    this.modalService.open(NgbdModalInput, { centered: true })
  }


  validateBirth() {
    $('#date_of_birth').focusout((e) => {
      e.stopImmediatePropagation();
      let value = $('#date_of_birth').val()
      let age = this.getAge(value);
      console.log(age);
      if (age >= 18 && age < 90) {
        $('#date_of_birth').css('border', 'none')
        this.ageValid = true;
      } else {
        $('#date_of_birth').css('border', '1px solid #a22')
        this.ageValid = false;
      }
    })

  }


  register() {

    const user: User = {

      name: this.registerForm.get('name')?.value,
      surname: this.registerForm.get('surname')?.value,
      username: this.registerForm.get('username')?.value,
      date_of_birth: this.registerForm.get('dateOfBirth')?.value,
      province: this.registerForm.get('province')?.value,
      city: this.registerForm.get('city')?.value,
      mail: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value

    }

    this.authService.register(user).subscribe(

      (data: any) => {
        this.isLoadReg = false;
        location.reload();

      },

      (err: any) => {
        this.isLoadReg = false;
        $('#btn-register').prop('disabled', false).css('visibility', 'visible');
        this.modalService.open(NgbdModalContent, { centered: true })
          .componentInstance.error = err.error.message;
      }

    )
  }



  logIn(): void {

    const user: Login = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value,
    }

    this.authService.logIn(user).subscribe(

      (data: any) => {
        this.isLoad = false;
        this.authService.isLogued = true;
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('id_user', data.id_user);
        localStorage.setItem('rol', data.rol);
        this.route.navigate(['/home']);
      }, (err: any) => {
        this.isLoad = false;
        $('#btn-login').prop('disabled', false).css('visibility', 'visible')
        this.modalService.open(NgbdModalContent, { centered: true })
          .componentInstance.error = err.error.message;

      }
    )


  }

  getProvinces() {

    this.httpClient.get("https://apis.datos.gob.ar/georef/api/provincias").subscribe(
      (data: any) => {
        this.provinces = data.provincias
      }
    )

  }

  getNameOfProvince(name: Event) {
    this.selectedProvince = name;
    $('#select_cities').prop('hidden', true)
    $('#alert-city').prop('hidden', true)
    if (this.selectedProvince != '-') {
      this.getCities();
    }
  }

  getCity(event: Event) {
    this.selectedCity = event;
  }

  getCities() {
    this.httpClient.get("https://apis.datos.gob.ar/georef/api/localidades?provincia=" + this.selectedProvince + "&max=950", { responseType: 'json' }).subscribe(
      (data: any) => {
        $('#select_cities').prop('hidden', false);
        $('#alert-city').prop('hidden', false)
        this.cities = data.localidades
      }
    )
  }



  getAge(db: any) {
    let dateOfBirth = new Date(db);
    let years = this.today.getFullYear() - dateOfBirth.getFullYear();
    let months = this.today.getMonth() - dateOfBirth.getMonth();

    if (months < 0 || (months === 0 && this.today.getDate() < dateOfBirth.getDate())) {
      years--;
    }
    return years;
  }



}
