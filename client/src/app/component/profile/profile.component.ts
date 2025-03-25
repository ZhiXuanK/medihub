import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, FormArray, Validators } from '@angular/forms';
import { MedicalProfileDetails } from '../../models';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private fb = inject(FormBuilder)
  private userSvc = inject(UserService)

  profile: any

  uid: string = ""
  isEditing: boolean = false

  medProfile !: FormGroup

  async ngOnInit(): Promise<void> {

    const profile = await this.userSvc.retrieveProfile().then(res => this.profile = res)
    console.log(profile)
    this.profile = profile
    console.log(profile)
    this.medProfile = this.createMedProfile()
  }

  //edit
  edit() {
    this.isEditing = true
  }

  //validity of form control
  protected valid(ctrlName: string): boolean {
    return this.validCtrl(this.medProfile, ctrlName)
  }

  protected validCtrl(grp: FormGroup | AbstractControl, ctrlName: string): boolean {
    const ctrl = grp.get(ctrlName)
    return !ctrl?.pristine && !!ctrl?.valid
  }

  protected processForm() {
    const profile: MedicalProfileDetails = this.medProfile.value
    this.isEditing = false
    console.info(">>>medicine profile: ", profile)
    this.userSvc.updateProfile(profile)
  }

  //getters
  get pastConds(): FormArray {
    return this.medProfile.get('past_conditions') as FormArray;
  }

  get currConds(): FormArray {
    return this.medProfile.get('current_conditions') as FormArray
  }

  get famHist(): FormArray {
    return this.medProfile.get('family_history') as FormArray
  }

  get drugAlgy(): FormArray {
    return this.medProfile.get('drug_allergies') as FormArray
  }

  get treatments(): FormArray {
    return this.medProfile.get('ongoing_treatments') as FormArray
  }

  //adding and deleting from form array
  protected addPastConds() {
    this.pastConds.push(this.createPastConds())
  }

  protected delPastConds(idx: number) {
    this.pastConds.removeAt(idx)
  }

  protected addCurrConds() {
    this.currConds.push(this.createCurrConds())
  }

  protected delCurrConds(idx: number) {
    this.currConds.removeAt(idx)
  }

  protected addFamHist() {
    this.famHist.push(this.createFamHist())
  }

  protected delFamHist(idx: number) {
    this.famHist.removeAt(idx)
  }

  protected addDrugAlgy() {
    this.drugAlgy.push(this.createDrugAllergy())
  }

  protected delDrugAlgy(idx: number) {
    this.drugAlgy.removeAt(idx)
  }

  protected addTreatments() {
    this.treatments.push(this.createTreatments())
  }

  protected delTreatment(idx: number) {
    this.treatments.removeAt(idx)
  }

  //creating individual group
  private createPastConds(): FormGroup {
    return this.fb.group({
      condition: this.fb.control<string>('', [Validators.required, Validators.minLength(3)])
    })
  }

  private createCurrConds(): FormGroup {
    return this.fb.group({
      condition: this.fb.control<string>('', [Validators.required, Validators.minLength(3)])
    })
  }

  private createFamHist(): FormGroup {
    return this.fb.group({
      affected_member: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
      condition: this.fb.control<string>('', [Validators.required, Validators.minLength(3)])
    })
  }

  private createDrugAllergy(): FormGroup {
    return this.fb.group({
      drug: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
      severity: this.fb.control<string>('', [Validators.required, Validators.minLength(3)])
    })
  }

  private createTreatments(): FormGroup {
    return this.fb.group({
      treatment: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
      illness: this.fb.control<string>('', [Validators.required, Validators.minLength(3)]),
      start_date: this.fb.control<Date>(new Date(), [Validators.required])
    })
  }

  //creating form
  private createMedProfile(): FormGroup {

    return this.fb.group({
      user_id: [this.profile.user_id, Validators.required],
      name: [this.profile.name, Validators.required],
      blood_type: [this.profile.blood_type, Validators.required],
      past_conditions: this.fb.array(
        this.profile.past_conditions.map((cond: { condition: any; }) =>
          this.fb.group({
            condition: [cond.condition, [Validators.required, Validators.minLength(3)]]
          })
        )
      ),
      current_conditions: this.fb.array(
        this.profile.current_conditions.map((cond: { condition: any; }) =>
          this.fb.group({
            condition: [cond.condition, [Validators.required, Validators.minLength(3)]]
          })
        )
      ),
      family_history: this.fb.array(
        this.profile.family_history.map((hist: { affected_member: any; condition: any; }) =>
          this.fb.group({
            affected_member: [hist.affected_member, [Validators.required, Validators.minLength(3)]],
            condition: [hist.condition, [Validators.required, Validators.minLength(3)]]
          })
        )
      ),
      drug_allergies: this.fb.array(
        this.profile.drug_allergies.map((allery: { drug: any; severity: any; }) =>
          this.fb.group({
            drug: [allery.drug, [Validators.required, Validators.minLength(3)]],
            severity: [allery.severity, [Validators.required, Validators.minLength(3)]]
          })
        )
      ),
      ongoing_treatments: this.fb.array(
        this.profile.ongoing_treatments.map((treatments: { treatment: any; illness: any; start_date: any; }) =>
          this.fb.group({
            treatment: [treatments.treatment, [Validators.required, Validators.minLength(3)]],
            illness: [treatments.illness, [Validators.required, Validators.minLength(3)]],
            start_date: [treatments.start_date, [Validators.required, Validators.minLength(3)]]
          })
        )
      )
    })

  }
}
