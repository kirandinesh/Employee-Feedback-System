import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared/shared/shared.module';
import { AddEmployeeDialogComponent } from './add-employee-dialog/add-employee-dialog.component';
import { AssignEmployeeDialogComponent } from './assign-employee-dialog/assign-employee-dialog.component';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
@NgModule({
  declarations: [
    DashboardComponent,
    AddEmployeeDialogComponent,
    AssignEmployeeDialogComponent,
    EditEmployeeComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatIconModule,
    SharedModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
})
export class AdminModule {}
