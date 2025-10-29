import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AllCommunityModule, ModuleRegistry, RowSelectionModule, RowSelectionOptions } from 'ag-grid-community'; 
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { ColDef } from 'ag-grid-community';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule, RowSelectionModule]);

@Component({
  selector: 'app-user-list',
  imports: [AsyncPipe, AgGridAngular, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  standalone: true
})
export class UserListComponent implements OnInit {
  users?: Observable<any>;
  colDefs: ColDef[] = [
    { field: '_id', headerName: 'ID' },
    { field: "name" },
    { field: "email" },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => {
        return `
          <button class="btn btn-sm btn-success" data-action="edit">Edit</button>
          <button class="btn btn-sm btn-danger" data-action="delete">Delete</button>
        `;
      },
      width: 200
    }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    resizable: true
  };

  rowSelection: RowSelectionOptions | "single" | "multiple" = { 
    mode: 'multiRow' 
  };

  // videoUrl = environment.Endpoint+'/video/test.mp4';

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
  ){}

  ngOnInit(): void {
    this.users = this.userService.getAllUsers();
  }
  onCellClicked(event: any) {
    if (event.event.target.dataset.action === 'edit') {
      // Handle edit action
      console.log('Edit action on', event.data?._id);
    } else if (event.event.target.dataset.action === 'delete') {
      if(confirm('Are you sure to delete this user?')) {
        this.userService.deleteUser(event.data?._id)
        .pipe(take(1))
        .subscribe({
          next: (data:any) => {
            if(data.status !== 1) {
              this.toastr.error('Error message!', data?.message);
              return;
            }
            this.toastr.success('Success message!', data?.message);
            this.users = this.userService.getAllUsers();
          },
          error: (err:any) => {
            this.toastr.error('Error message!', err?.message);
          }
        });
      }
    }
  }
}
