import { Component } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { HttpService } from '../../services/http.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { IEmployee } from '../../interfaces/employee';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent {
  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  employeeForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    age: [0, [Validators.required]],
    phone: ['', []],
    salary: [0, [Validators.required]],
  });
  employeeId!: number;
  isEdit = false;

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.params['id'];
    if (this.employeeId) {
      this.isEdit = true;
      this.httpService.getEmployee(this.employeeId).subscribe((result) => {
        // console.log(result);
        this.employeeForm.patchValue(result);
        // this.employeeForm.controls.email.disable();
      });
    }
  }

  save() {
    console.log(this.employeeForm.value);
    const employee: IEmployee = {
      name: this.employeeForm.value.name!,
      age: this.employeeForm.value.age!,
      email: this.employeeForm.value.email!,
      phone: this.employeeForm.value.phone!,
      salary: this.employeeForm.value.salary!,
    };

    if (this.isEdit) {
      this.httpService
        .updateEmployee(this.employeeId, employee)
        .subscribe(() => {
          console.log('success');
          this.toastr.success('Record updated sucessfully.');
          this.router.navigateByUrl('/employee-list');
        });
    } else {
      this.httpService.createEmployee(employee).subscribe(() => {
        console.log('success');
        this.toastr.success('Record added sucessfully.');
        this.router.navigateByUrl('/employee-list');
      });
    }
  }
}
