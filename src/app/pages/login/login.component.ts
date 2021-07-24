import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel;
  recordarme = true;
  constructor( private auth: AuthService,
               private route: Router) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
    if(localStorage.getItem('email')){
      this.usuario.email= localStorage.getItem('email');
      this.recordarme=true;  
    }
    
  }

  onSubmit( form: NgForm) {
    if (form.invalid) {return; }
    Swal.fire({
      allowOutsideClick: false,
      text: 'espere por Favor...',
      icon: 'info'

    });
    Swal.showLoading();
    this.auth.login(this.usuario).subscribe(resp =>{
      console.log(resp);
      Swal.close();
      if(this.recordarme){
        localStorage.setItem('email',this.usuario.email);
      }
      this.route.navigate(['home']);

    } , err =>{

      console.log();
      Swal.fire({
      
        text: err.error.error.message,
        icon: 'error'
  
      });
    } 
    );
  }

}
