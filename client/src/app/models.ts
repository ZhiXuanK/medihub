export interface UserDetails{
    email: string
    password: string
}

export interface AuthStatus {
    status: boolean
    response: any
    uid: string | null
}

export interface ApiKey {
    apikey: string
}

export interface history {
    affected_member: string
    condition: string
}

export interface allergy {
    drug: string
    severity: string
}

export interface treatment {
    treatment: string
    illness: string
    severity: string
}

export interface MedicalProfileDetails {
    user_id: string
    name: string
    blood_type: string
    past_conditions: string[]
    current_conditions: string[]
    family_history: history[]
    drug_allergies: allergy[]
    ongoing_treatment: treatment[]
}

export interface Medicine {
    med_id: string
    visit_id: string
    name: string
    // active_ingredients: string[]
    start_date: string
    end_date: string
    dosage: number
    timing: string[]
}

export interface Visit {
    visit_id: string
    user_id: string
    doctor: string
    visit_date: string
    purpose: string
    notes: string
    medicine: Medicine[]
}

export interface MedicalAppointment {
    summary: string
    description: string
    start: string
    end: string
}

export interface MedicineDisplay {
    name: string
    med_id: string
    taken: string
}

export interface MedicineSchedule {
    morning: MedicineDisplay[]
    afternoon: MedicineDisplay[]
    night: MedicineDisplay[]
}