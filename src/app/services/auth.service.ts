import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1';
  private apiKey = 'AIzaSyCjRs7WBk2zth3oks9E0K1i_Byv32GLe5Q';
  token:string;
  //Crear nuevos usuarios
   //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
   //login
   //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
  constructor( private htpp: HttpClient ) {
    this.leerToken();
   }

  logout(){
    localStorage.removeItem('token');

  }

  login(usuario: UsuarioModel){

    const authData ={
      ...usuario,
      returnSecureToken: true
    }

    return this.htpp.post(
      `${this.url}/accounts:signInWithPassword?key=${this.apiKey}`,
      authData
    ).pipe(map(
      resp => {
        console.log('Entro pipe');
        
        this.guardarToken(resp['idToken'],resp['expiresIn']);
        return resp;
      }
    
    ));
  
  }

  nuevoUsuario(usuario: UsuarioModel){
    const authData ={
      ...usuario,
      returnSecureToken: true
    }

    return this.htpp.post(
      `${this.url}/accounts:signUp?key=${this.apiKey}`,
      authData
    ).pipe(map(
      resp => {
        console.log('Entro pipe');
        this.guardarToken(resp['idToken'],resp['expiresIn']);
        return resp;
      }
    
    ));
  }

  private guardarToken(idToken: string, exprira: number){
    console.log(exprira);
    this.token=idToken;
    localStorage.setItem('token',idToken);
    let hoy = new Date();
    hoy.setSeconds(exprira);
    localStorage.setItem('expira', hoy.getTime().toString())

  }

  leerToken(){
    if(localStorage.getItem('token')){
      this.token = localStorage.getItem('token');
    }else{
      this.token= '';
    }
    return this.token;
  }

  estaAutenticado():boolean{
    if(this.token.length < 2){
      return false;
    } 
    const expira = Number(localStorage.getItem('expira'));
    const hoy = new Date();
    if(hoy.getTime()>= expira))
    return false;
  }


}
