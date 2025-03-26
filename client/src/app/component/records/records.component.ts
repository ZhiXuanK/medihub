import { Component, inject, OnInit } from '@angular/core';
import { Medicine, Visit } from '../../models';
import { VisitService } from '../../services/visit.service';
import { AuthStore } from '../../stores/auth.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-records',
  standalone: false,
  templateUrl: './records.component.html',
  styleUrl: './records.component.css'
})
export class RecordsComponent implements OnInit {

  private visitSvc = inject(VisitService)
  private authStore = inject(AuthStore)
  private router = inject(Router)

  visits !: Visit[]
  medicines !: Medicine[]

  uid!:string

  async ngOnInit(): Promise<void> {
    this.authStore.userId$.subscribe(
      res => {
        return this.visitSvc.retrieveAllVisitsByUser(res!).then(
          res => {
            this.visits = res;
            this.medicines = res.reduce((acc, visit) => {
              return acc.concat(visit.medicine);
            }, [] as Medicine[]);
          }
        );
      }
    )

  }

  addNewRecord(){
    this.router.navigate(["/visit"])
  }

  editVisit(visit_id:string){
    
  }

}
