import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MedicalAppointment } from '../../models';
import { CalendarService } from '../../services/calendar.service';
import { AuthStore } from '../../stores/auth.store';
import { checkDateValidator } from '../../validators/validators';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  private fb = inject(FormBuilder)

  private calSvc = inject(CalendarService)
  authStatus!:boolean
  response!: string|null

  // events:Event[]= []
  events:MedicalAppointment[] = []

  newAppointment !: FormGroup

  ngOnInit(): void {
    this.newAppointment = this.initializeAppointment()
  }

  //calendar
  linkCalendar():void{
    this.calSvc.requestAccessToken().subscribe()
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
