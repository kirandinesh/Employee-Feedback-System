import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeesRoutingModule } from './employees-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared/shared.module';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [HomeComponent, HeaderComponent],
  imports: [CommonModule, EmployeesRoutingModule, SharedModule],
})
export class EmployeesModule {}
