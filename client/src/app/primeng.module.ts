import { NgModule } from "@angular/core";

//PrimeNg modules
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';



@NgModule({
    exports: [
        InputTextModule,
        IftaLabelModule,
        ButtonModule,
        DropdownModule,
        TabMenuModule,
        TableModule
    ]
})

export class PrimeModule {}