import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray, ReactiveFormsModule } from "@angular/forms";
import { CreateService } from '../services/create.service';
import { EditService } from '../services/edit.service';
import { CommonModule } from "@angular/common";
import { environment } from "../../environments/environment";
import { EditStateService } from "../services/edit-state.service";

export interface Payroll {
  name: string;
  salary: string;
  gender: string;
  startdate: string;
  departments: string[];
  note: string;
  profilePic: string;
  id: number;
}

@Component({
  selector: 'app-form-component',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule], 
  templateUrl: './form-component.component.html',
  styleUrls: ['./form-component.component.css']
})
export class FormComponentComponent implements OnChanges {
  @Output() formSubmitted = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<void>();
  @Input() editPayrollData?: Payroll | undefined = undefined;
  
  departments = ['HR', 'Finance', 'Engineering', 'Marketing']; 
  selectedDepartments: string[] = [];
  environment = environment;
  constructor(
    private createService: CreateService,
    private editService: EditService,
    private editStateService: EditStateService
  ) {}

  PayrollForm = new FormGroup({
    name: new FormControl('', Validators.required),
    salary: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    startdate: new FormControl('', Validators.required),
    note: new FormControl(''),
    profilePic: new FormControl(''),
    departments: new FormControl<string[]>([], { nonNullable: true })
  });
  ngOnChanges(changes: SimpleChanges) {
    if (changes['editPayrollData'] && this.editPayrollData) {
      this.PayrollForm.patchValue({
        name: this.editPayrollData.name,
        salary: this.editPayrollData.salary,
        gender: this.editPayrollData.gender,
        startdate: this.editPayrollData.startdate,
        note: this.editPayrollData.note,
        profilePic: this.editPayrollData.profilePic,
        departments:this.selectedDepartments
      });

      this.selectedDepartments = this.editPayrollData.departments;
      this.updateCheckboxSelection();
    } else {
      this.PayrollForm.reset();
      this.selectedDepartments = [];
    }
  }

  onCheckboxChange(event: any, dept: string) {
    if (!Array.isArray(this.selectedDepartments)) {
      this.selectedDepartments = [];
    }
    if (event.target.checked) {
      if (!this.selectedDepartments.includes(dept)) {
        this.selectedDepartments.push(dept);
      }
    } else {
      this.selectedDepartments = this.selectedDepartments.filter(d => d !== dept);
    }
  
    this.PayrollForm.controls['departments'].setValue([...this.selectedDepartments]);
  }
  

  updateCheckboxSelection() {
    this.PayrollForm.controls['departments'].setValue(this.selectedDepartments);
  }

  isEdit(){
    return this.editStateService.getIsEdit();
  }

  onSubmit() {
    if (this.isEdit()) {
      this.updatePayroll();
    } else {
      this.addNewPayroll();
    }
  }

  addNewPayroll() {
    if (this.PayrollForm.valid) {
      const formData = this.PayrollForm.getRawValue();
      this.createService.submitForm(formData).subscribe({
        next: (response) => {
          console.log('Form Submitted Successfully:', response);
          this.formSubmitted.emit(formData);
        },
        error: (error) => {
          console.error('Error submitting form:', error);
          console.log('Failed to submit form!');
        }
      });
    } else {
      console.log("Form is invalid");
    }
  }

  updatePayroll() {
    if (this.PayrollForm.valid) {
      const updatedData: Payroll = {
        id: this.editStateService.getPersonId(),
        name: this.PayrollForm.value.name ?? "",
        startdate: this.PayrollForm.value.startdate ?? "",
        gender: this.PayrollForm.value.gender ?? "",
        salary: this.PayrollForm.value.salary ?? "",
        departments: this.PayrollForm.value.departments ?? [],
        profilePic: this.PayrollForm.value.profilePic ?? "",
        note: this.PayrollForm.value.note ?? ""
      };
      this.editService.editData(updatedData).subscribe({
        next: (response) => {
          console.log("Payroll Updated Successfully:", response);
          this.formSubmitted.emit(updatedData);
          this.closeForm.emit();
        },
        error: (error) => {
          console.error("Error updating Payroll:", error);
          console.log("Failed to update Payroll!");
        }
      });
    } else {
      console.log("Form is invalid");
    }
  }
}
