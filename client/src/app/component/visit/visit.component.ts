import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, AbstractControl, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Visit } from '../../models';
import { AuthService } from '../../services/firebase-auth.service';
import { VisitService } from '../../services/visit.service';
import { checkDateValidator } from '../../validators/validators';
import { v4 as uuid, validate } from 'uuid';

@Component({
  selector: 'app-visit',
  standalone: false,
  templateUrl: './visit.component.html',
  styleUrl: './visit.component.css'
})
export class VisitComponent {
  private fb = inject(FormBuilder)
  private authSvc = inject(AuthService)
  private activatedRoute = inject(ActivatedRoute)
  private visitSvc = inject(VisitService)

  visit: any

  visitid: string = ""
  uid: string = ""
  timingOptions: string[] = ['morning', 'afternoon', 'night']
  
  visitDetails !: FormGroup

  get medicine(): FormArray {
    return this.visitDetails.get('medicine') as FormArray
  }

  async ngOnInit(): Promise<void> {

    if (this.activatedRoute.snapshot.paramMap.has('visitid')){
      this.visitid = this.activatedRoute.snapshot.paramMap.get('visitid')!
      const visit = await this.visitSvc.retrieveRecord(this.visitid)
      this.visit = visit
    }

    this.uid = await this.authSvc.getCurrentUserId$();
    this.visitDetails = this.createVisitDetails()
  }

  //validity
  protected valid(ctrlName: string): boolean {
    return this.validCtrl(this.visitDetails, ctrlName)
  }

  protected validCtrl(grp: FormGroup | AbstractControl, ctrlName: string): boolean {
    const ctrl = grp.get(ctrlName)
    return !ctrl?.pristine && !!ctrl?.valid
  }

  protected processForm() {
    const form: Visit = this.visitDetails.value
    console.info(">>>visit details: ", form)
    this.visitSvc.addNewVisit(form)
  }


  //adding and deleting from form array
  protected addMedicine() {
    this.medicine.push(this.createMedicine())
  }

  protected delMedicine(idx: number) {
    this.medicine.removeAt(idx)
  }

  //creating individual group
  private createMedicine(): FormGroup {
    return this.fb.group({
      med_id: this.fb.control<string>(uuid(), [Validators.required]),
      visit_id: this.fb.control<string>(this.visitid),
      name: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
      // active_ingredients: this.fb.control<string>('', Validators.required),
      start_date: this.fb.control<string>('', [Validators.required]),
      end_date: this.fb.control<string>('', [Validators.required]),
      dosage: this.fb.control<number>(0, [Validators.required, Validators.min(1)]),
      timing: this.fb.array([])
    }, {
      validator: checkDateValidator('start_date', 'end_date')
    })
  }


  private createVisitDetails():FormGroup {

    if (this.visitid){
      //if editing visit
      return this.fb.group({
        visit_id: this.fb.control<string>(this.visit.visit_id, [Validators.required]),
        user_id: this.fb.control<string>(this.visit.user_id),
        doctor: this.fb.control<string>(this.visit.doctor, [Validators.required, Validators.minLength(3)]),
        visit_date: this.fb.control<string>(this.visit.visit_date, [Validators.required]),
        purpose: this.fb.control<string>(this.visit.purpose),
        notes: this.fb.control<string>(this.visit.notes),
        medicine: this.fb.array(
          this.visit.medicine.map( (med: {
            visit_id: any; timing: any; med_id: any; name: any; active_ingredients: any; start_date: any; end_date: any; dosage: any; 
          }) => 
            this.fb.group({
              med_id: [med.med_id, [Validators.required]],
              visit_id: [med.visit_id],
              name: [med.name, [Validators.required, Validators.minLength(3)]],
              // active_ingredients: [med.active_ingredients, [Validators.required]],
              start_date: [med.start_date, [Validators.required]],
              end_date: [med.end_date, [Validators.required]],
              dosage: [med.dosage, [Validators.required, Validators.min(1)]],
              timing: [med.timing, [Validators.required]]
            })
          )
        )
      })
    } 

    //if new visit
    return this.fb.group({
      visit_id: this.fb.control<string>(uuid(), [Validators.required]),
      user_id: this.fb.control<string>(this.uid),
      doctor: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
      visit_date: this.fb.control<string>('', [Validators.required]),
      purpose: this.fb.control<string>(''),
      notes: this.fb.control<string>(''),
      medicine: this.fb.array([])
    })

  }

  //timing form array
  onTimingChange(event:any, medIndex: number):void {
    const medArray = this.visitDetails.get('medicine') as FormArray
    const medGroup = medArray.at(medIndex) as FormGroup
    const timingArray = medGroup.get('timing') as FormArray

    if (event.target.checked){
      timingArray.push(new FormControl(event.target.value))
    } else {
      const index = timingArray.controls.findIndex(
        control => control.value === event.target.value
      )
      if (index !== -1){
        timingArray.removeAt(index)
      }
    }
  }

  isTimingSelected(med:AbstractControl, option:string):boolean{
    const medGroup = med as FormGroup
    const timingArray = medGroup.get('timing') as FormArray
    return timingArray.value.includes(option)
  }


}
