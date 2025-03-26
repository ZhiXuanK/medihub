import { NgModule } from "@angular/core";

//PrimeNg modules
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';


@NgModule({
    exports: [
        InputTextModule,
        IftaLabelModule,
        ButtonModule,
        DropdownModule,
        TabMenuModule,
        TableModule,
        TextareaModule,
        DatePickerModule,
        FloatLabelModule,
        InputNumberModule,
        CheckboxModule
    ]
})

export class PrimeModule {}