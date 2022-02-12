import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FunctionService } from '../services/function.service';
import { catchError, retry } from 'rxjs/operators'
import { Hello } from '../domain/hello';

@Component({
  selector: 'app-function-view',
  templateUrl: './function-view.component.html',
  styleUrls: ['./function-view.component.scss']
})
export class FunctionViewComponent implements OnInit {

  message$!: Observable<Hello>

  constructor(private service: FunctionService) { }

  ngOnInit(): void {
    this.message$ = this.service.get("John").pipe(
      retry(1),
      catchError(e => of({ title: "Fallback in case of error" }))
    )
  }

}
