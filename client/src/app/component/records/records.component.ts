import { Component, inject, OnInit } from '@angular/core';
import { Medicine, Visit } from '../../models';
import { VisitService } from '../../services/visit.service';
import { AuthStore } from '../../stores/auth.store';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { checkDateValidator } from '../../validators/validators';
import { MedicineService } from '../../services/medicine.service';

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
  private medSvc = inject(MedicineService)

  visits !: Visit[]
  medicines !: Medicine[]

  uid!: string

  editingVisit: boolean = false
  editingMed: boolean = false

  currentEditVisit !: FormGroup
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

  addNewRecord() {
    this.router.navigate(["/visit"])
  }

  editVisit(visit: Visit) {
    this.currentEditVisit = this.createEditVisit(visit)
    this.editingVisit = true
  }

  createEditVisit(visit: Visit): FormGroup {
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
    this.visitSvc.updateVisit(form).then(
      res =>{
        this.editingVisit = false
        this.ngOnInit()
      }
    )

  }

  editMedicine(medicine: Medicine) {
    this.currentEditMed = this.createEditMed(medicine)
    this.editingMed = true
  }

  createEditMed(medicine: Medicine): FormGroup {
    return this.fb.group({
      med_id: this.fb.control<string>(medicine.med_id, [Validators.required]),
      visit_id: this.fb.control<string>(medicine.visit_id),
      name: this.fb.control<string>(medicine.name, [Validators.required, Validators.minLength(3)]),
      start_date: this.fb.control<string>(medicine.start_date, [Validators.required]),
      end_date: this.fb.control<string>(medicine.end_date, [Validators.required]),
      dosage: this.fb.control<number>(medicine.dosage, [Validators.required, Validators.min(1)]),
      timing: this.fb.array(medicine.timing)
    }, {
      validator: checkDateValidator('start_date', 'end_date')
    })
  }

  processMedicineForm(){
    const form:Medicine = this.currentEditMed.value
    console.info(">>>>medicine details: ", form)
    this.medSvc.updateMedicine(form).then(
      res => {
        this.editingMed=false
        this.ngOnInit()
      }
    )
  }

  protected validCtrl(grp: FormGroup | AbstractControl, ctrlName: string): boolean {
    const ctrl = grp.get(ctrlName)
    return !ctrl?.pristine && !!ctrl?.valid
  }

}
