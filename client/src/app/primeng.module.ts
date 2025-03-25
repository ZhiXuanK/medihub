import { NgModule } from "@angular/core";

//PrimeNg modules
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';





@NgModule({
    exports: [
        InputTextModule,
        IftaLabelModule,
        ButtonModule
    ]
})

export class PrimeModule {}