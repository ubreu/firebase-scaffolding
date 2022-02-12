import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Observable } from 'rxjs';
import { Hello } from '../domain/hello';

const endpoint = 'sayHello'

@Injectable({
  providedIn: 'root'
})
export class FunctionService {

  constructor(public readonly functions: AngularFireFunctions) { }

  get(name: string): Observable<Hello> {
    return this.functions.httpsCallable(endpoint, { timeout: 5_000 })({ name: name })
  }
}
