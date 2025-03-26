import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MedicalAppointment, MedicineDisplay } from '../../models';
import { CalendarService } from '../../services/calendar.service';
import { AuthStore } from '../../stores/auth.store';
import { checkDateValidator } from '../../validators/validators';
import { MedicineService } from '../../services/medicine.service';
import { Router } from '@angular/router';
import { AIService } from '../../services/ai.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  private fb = inject(FormBuilder)

  private calSvc = inject(CalendarService)
  private medSvc = inject(MedicineService)
  private authStore = inject(AuthStore)
  private router = inject(Router)
  private aiSvc = inject(AIService)
  authStatus!:boolean
  response!: string|null

  uid !: string

  // events:Event[]= []
  events:MedicalAppointment[] = []

  newAppointment !: FormGroup

  mornMeds!: MedicineDisplay[]
  aftMeds !: MedicineDisplay[]
  nightMeds !: MedicineDisplay[]

  aiAdvice !: string

  lowSupplyMeds !: string[]

  async ngOnInit(): Promise<void> {
    await this.authStore.userId$.subscribe(res => {
      console.log(res)
      this.uid = res!
      this.newAppointment = this.initializeAppointment()
      this.loadMedicineSchedule()
      this.aiSvc.retrieveAIAdvice(this.uid).then(res => this.aiAdvice = res.advice)
      this.medSvc.retrieveLowSupplyMedicine(this.uid).then(res => this.lowSupplyMeds = res.results)
    })

    if (this.calSvc.getAuthStatus()){
      this.loadAppointments()
    }

  }

  //medicine schedule
  async loadMedicineSchedule():Promise<void>{
    await this.medSvc.retrieveMedicineOfTheDay(this.uid).then(
      res => {
        this.mornMeds = res.morning
        this.aftMeds = res.afternoon
        this.nightMeds = res.night
      }
    )
  }

  reduceDosage(med_id:string){
    this.medSvc.reduceDosage(med_id)
    this.router.navigate(["/refresh"])
  }

  //calendar
  linkCalendar():void{
    this.calSvc.requestAccessToken().subscribe(
      res => this.loadAppointments()
    )
  }

  initializeAppointment():FormGroup{
    return this.fb.group({
      summary: this.fb.control<string>('Medical Appointment', [Validators.required]),
      description: this.fb.control<string>(''),
      start: this.fb.control<string>(''),
      end: this.fb.control<string>('')
    }, {
      validator: checkDateValidator('start', 'end')
    })
  }

  processForm():void{
    console.log(this.newAppointment.value)
    this.calSvc.addMedicalAppointment(this.newAppointment.value).subscribe(
      response => {
        console.log("event created: ", response)
        this.newAppointment.reset()
        this.loadAppointments()
      },
      error => {
        console.error("error creating event: ", error)
      }
    )
  }

  loadAppointments(){
    this.calSvc.retrieveMedicalAppointments().subscribe(
      response => {
        console.log("response: ", response)
        this.events = response
      }, error => {
        console.error("error retrieving appointments", error)
      }
    )
  }

}
