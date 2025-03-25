import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function confirmPasswordValidator (passwordKey: string, confirmPasswordKey: string): ValidatorFn {

    return (formGroup:AbstractControl) : ValidationErrors | null => {

        const passwordCtrl = formGroup.get(passwordKey)
        const confirmPasswordCtrl = formGroup.get(confirmPasswordKey)

        if (!passwordCtrl || !confirmPasswordCtrl){
            return null
        }

        return passwordCtrl.value !== confirmPasswordCtrl.value ? { mustMatch: true } : null;

        // //if password don't match, error on confirmPasswordCtrl
        // if (passwordCtrl.value !== confirmPasswordCtrl.value){
        //     confirmPasswordCtrl.setErrors({mustMatch: true})
        // } else {
        //     //no error if password match
        //     if (confirmPasswordCtrl.hasError('mustMatch')){
        //         confirmPasswordCtrl.setErrors(null)
        //     }
        // }
        // return null
    }

}

export function checkDateValidator (startDateKey: string, endDateKey: string): ValidatorFn {

    return (formGroup:AbstractControl) : ValidationErrors | null => {

        const startCtrl = formGroup.get(startDateKey)
        const endCtrl = formGroup.get(endDateKey)

        if (!startCtrl || !endCtrl){
            return null
        }

        const startDate = new Date(startCtrl?.value)
        const endDate = new Date(endCtrl?.value)

        //if end date earlier than start date
        return startDate > endDate ? {dateError: true}:null
    }

}