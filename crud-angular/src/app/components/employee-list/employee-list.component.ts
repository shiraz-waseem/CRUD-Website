import { Component } from '@angular/core';
import { IEmployee } from '../../interfaces/employee';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../../services/http.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, RouterLink],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent {
  employeeList: IEmployee[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'age',
    'phone',
    'salary',
    'action',
  ];

  constructor(
    private httpService: HttpService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getEmployeeFromServer();
  }

  getEmployeeFromServer() {
    this.httpService.getAllEmployee().subscribe((result) => {
      this.employeeList = result;
      console.log(this.employeeList);
    });
  }

  edit(id: number) {
    console.log(id);
    this.router.navigateByUrl('/employee/' + id);
  }

  delete(id: number) {
    this.httpService.deleteEmployee(id).subscribe(() => {
      console.log('deleted');
      // this.employeeList=this.employeeList.filter(x=>x.id!=id);
      this.getEmployeeFromServer();
      this.toastr.success('Record deleted sucessfully');
    });
  }
}
