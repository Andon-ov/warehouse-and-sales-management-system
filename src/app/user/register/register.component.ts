import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/userService/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      isActive: [true, Validators.required],
      isAdmin: [false, Validators.required],
      favoriteRecipes: this.fb.array([]),
    });
  }

  /**
   * Marks all controls within a form group as touched recursively.
   * @param formGroup The form group to mark as touched
   */
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Retrieves error messages for all controls within a form group.
   * @param formGroup The form group to check for errors
   * @returns A string containing all error messages
   */
  getFormGroupErrors(formGroup: FormGroup): string {
    let errorMessage = '';
    Object.keys(formGroup.controls).forEach((key) => {
      const controlErrors = formGroup.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach((keyError) => {
          errorMessage += `${key} ${this.getControlErrorMessage(
            keyError,
            controlErrors[keyError]
          )}\n`;
        });
      }
    });
    return errorMessage;
  }

  /**
   * Retrieves the error message for a specific control error.
   * @param errorKey The key of the error
   * @param errorValue The value of the error
   * @returns The error message corresponding to the error key and value
   */
  private getControlErrorMessage(errorKey: string, errorValue: any): string {
    switch (errorKey) {
      case 'required':
        return '-> this field is required.';
      case 'minlength':
        return `-> Minimum length is ${errorValue.requiredLength}.`;
      case 'maxlength':
        return `-> Maximum length is ${errorValue.requiredLength}.`;
      default:
        return '';
    }
  }

  async submitRegisterForm() {
    if (this.registerForm.invalid) {
      // Mark the form controls as touched to display validation errors
      this.markFormGroupTouched(this.registerForm);
      
      // Get and log the error messages
      const errorMessages = this.getFormGroupErrors(this.registerForm);
      console.error(errorMessages);
      return;
    }

    const { email, password, repeatPassword, ...additionalAuthData } = this.registerForm.value;

    if (password !== repeatPassword) {
      console.error('Password do not match!');
      return;
    }

    try {
      // Register the user with the provided credentials and additional data
      await this.userService.registerUser(email, password, additionalAuthData);
    } catch (error) {
      console.error(error);
    }
  }
}
