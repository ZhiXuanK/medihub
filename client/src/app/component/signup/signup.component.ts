import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDetails, MedicalProfileDetails } from '../../models';
import { AuthService } from '../../services/firebase-auth.service';
import { UserService } from '../../services/user.service';
import { confirmPasswordValidator } from '../../validators/validators';
import { AuthStore } from '../../stores/auth.store';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit, OnDestroy{
  private fb = inject(FormBuilder)
  private authSvc = inject(AuthService)
  private authStore = inject(AuthStore)
  private userSvc = inject(UserService)
  private router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)

  uid: string = ""
  registered:boolean = false
  
  medProfile !: FormGroup
  pastConds !: FormArray
  currConds !: FormArray
  famHist !: FormArray
  drugAlgy !: FormArray
  treatments !: FormArray

  user !: FormGroup

  errorMessage: string = ''

  bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  severityTypes = ['mild', 'moderate', 'severe']

  ngOnDestroy(): void {
    this.registered=false
  }


  //Minimum eight characters, at least one letter and one number:
  private createUser(): FormGroup {
    return this.fb.group({
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      password: this.fb.control<string>('', [Validators.required, Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")]),
      confirmPassword: this.fb.control<string>('', [Validators.required])
    }, {
      validator: confirmPasswordValidator('password', 'confirmPassword')
    })
  }

  protected signUp() {
    const user: UserDetails = this.user.value
    console.info(">>>user detail: ", user)
    this.authSvc.signUp(user.email, user.password)
      .then(res => {
        console.log('User registered: ', res.user?.uid)
        this.userSvc.signup()
        this.registered=true
      })
      .catch(err => {
        console.error('error: ', err)

        this.router.navigate(['/signup-acc'], { queryParams: { error: 'Error. Please try again later.' } })
      }
      )
  }

  async ngOnInit(): Promise<void> {

    this.user = this.createUser()

    //check if there is error message
    this.activatedRoute.queryParams.subscribe(params => {
      this.errorMessage = params['error'] || ''
    })
    const uid = await this.authStore.userId$.subscribe(res => {
      console.log("res"+res)
      this.uid = res!
      console.log(this.uid)
      this.medProfile = this.createMedProfile()
    })
    //const uid = await this.authSvc.getCurrentUserId$().then(res => this.uid = res)
    //this.uid = uid

  }

  //validity of form control
  protected valid(ctrlName: string): boolean {
    return this.validCtrl(this.medProfile, ctrlName)
  }

  protected validCtrl(grp: FormGroup | AbstractControl, ctrlName:string): boolean{
    const ctrl = grp.get(ctrlName)
    return !ctrl?.pristine && !!ctrl?.valid
  }

  protected processForm(){
    const profile:MedicalProfileDetails = this.medProfile.value
    console.info(">>>medicine profile: ", profile)
    this.userSvc.saveProfile(profile)
    this.router.navigate(['/dashboard'])
  }

  //adding and deleting from form array
  protected addPastConds() {
    this.pastConds.push(this.createPastConds())
  }
  
  protected delPastConds(idx:number) {
    this.pastConds.removeAt(idx)
  }

  protected addCurrConds(){
    this.currConds.push(this.createCurrConds())
  }
  
  protected delCurrConds(idx: number){
    this.currConds.removeAt(idx)
  }

  protected addFamHist(){
    this.famHist.push(this.createFamHist())
  }

  protected delFamHist(idx: number){
    this.famHist.removeAt(idx)
  }

  protected addDrugAlgy(){
    this.drugAlgy.push(this.createDrugAllergy())
  }

  protected delDrugAlgy(idx: number){
    this.drugAlgy.removeAt(idx)
  }

  protected addTreatments(){
    this.treatments.push(this.createTreatments())
  }

  protected delTreatment(idx: number){
    this.treatments.removeAt(idx)
  }

  //creating individual group
  private createPastConds():FormGroup {
    return this.fb.group({
      condition: this.fb.control<string>('', [Validators.required, Validators.minLength(3)])
    })
  }

  private createCurrConds():FormGroup {
    return this.fb.group({
      condition: this.fb.control<string>('', [Validators.required, Validators.minLength(3)])
    })
  }

  private createFamHist():FormGroup {
    return this.fb.group({
      affected_member: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
      condition: this.fb.control<string>('', [Validators.required, Validators.minLength(3)])
    })
  }

  private createDrugAllergy():FormGroup {
    return this.fb.group({
      drug: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
      severity: this.fb.control<string> ('', [Validators.required, Validators.minLength(3)])
    })
  }

  private createTreatments():FormGroup {
    return this.fb.group({
      treatment: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
      illness: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
      start_date: this.fb.control<Date>(new Date(), [Validators.required])
    })
  }

  //creating form
  private createMedProfile():FormGroup{
    
    this.pastConds = this.fb.array([])
    this.currConds = this.fb.array([])
    this.famHist = this.fb.array([])
    this.drugAlgy = this.fb.array([])
    this.treatments = this.fb.array([])

    return this.fb.group({
      user_id: this.fb.control<string>(this.uid), //keep hidden in HTML
      name: this.fb.control<string>('', [Validators.required, Validators.minLength(2)]),
      blood_type: this.fb.control<string>('', [Validators.required]),
      past_conditions: this.pastConds,
      current_conditions: this.currConds,
      family_history: this.famHist,
      drug_allergies: this.drugAlgy,
      ongoing_treatments: this.treatments
    })

  }
}
