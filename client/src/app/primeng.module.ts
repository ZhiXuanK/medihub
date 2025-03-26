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
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SplitterModule } from 'primeng/splitter';


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
        CheckboxModule,
        ScrollPanelModule,
        ProgressSpinnerModule,
        SplitterModule
    ]
})

export class PrimeModule {}