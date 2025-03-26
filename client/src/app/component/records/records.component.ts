import { Component, inject, OnInit } from '@angular/core';
import { Medicine, Visit } from '../../models';
import { VisitService } from '../../services/visit.service';
import { AuthStore } from '../../stores/auth.store';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  private fb = inject(FormBuilder)

  visits !: Visit[]
  medicines !: Medicine[]

  uid!:string

  editingVisit:boolean = false
  editingMed:boolean = false

  currentEditVisit !:FormGroup
  currentEditMed !: FormGroup

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

  editVisit(visit:Visit){
    this.currentEditVisit = this.createEditVisit(visit)
    this.editingVisit = true
  }

  createEditVisit(visit:Visit):FormGroup{
    return this.fb.group({
      visit_id: this.fb.control<string>(visit.visit_id, [Validators.required]),
      user_id: this.fb.control<string>(visit.user_id),
      doctor: this.fb.control<string>(visit.doctor, [Validators.required, Validators.minLength(3)]),
      visit_date: this.fb.control<string>(visit.visit_date, [Validators.required]),
      purpose: this.fb.control<string>(visit.purpose, [Validators.required, Validators.minLength(1)]),
      notes: this.fb.control<string>(visit.notes, [Validators.required, Validators.minLength(1)])
    })
  }

  protected processVisitForm() {
    const form: Visit = this.currentEditVisit.value
    console.info(">>>visit details: ", form)
    this.visitSvc.updateVisit(form)
    this.editingVisit=false
    this.ngOnInit()
  }

}
