import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/userService/user.service';

/**
 * LoginComponent handles user login functionality.
 * It provides a form interface for users to input their credentials and log in.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  // FormGroup for the login form
  logInForm: FormGroup;
  // Error message to display in case of login failure
  loginError: string | null = null;
  // URL to redirect to after successful login
  returnUrl: string | null = null;

  /**
   * @param userService Service for user authentication
   * @param fb FormBuilder service for creating reactive forms
   * @param route ActivatedRoute for retrieving route parameters
   * @param router Router service for navigation
   */
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialize the login form with form controls and validators
    this.logInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Lifecycle hook called after component initialization.
   * Retrieves the returnUrl from the query parameters.
   */
  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';
  }

  /**
   * Handles form submission for user login.
   * Marks the form as touched, checks for form validity,
   * and attempts to log in the user using provided credentials.
   * Redirects the user to the returnUrl after successful login.
   */
  async submitLogInForm() {
    // Mark the form as touched to trigger form validation
    this.markFormGroupTouched(this.logInForm);

    if (this.logInForm.valid) {
      const { email, password } = this.logInForm.value;

      try {
        // Attempt to login the user using provided email and password
        await this.userService.loginUser(email, password);

        // Redirect the user to the returnUrl after successful login
        const targetUrl = this.returnUrl || '/';
        await this.router.navigateByUrl(targetUrl);
      } catch (error) {
        // Handle login errors
        console.error(error);
      }
    } else {
      // If form is invalid, display form errors
      this.displayFormErrors(this.logInForm);
    }
  }

  // Mark all form controls as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Display form errors
  displayFormErrors(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key) as AbstractControl;

      // Проверяваме дали control.errors съществува с non-null assertion operator
      if (control.errors) {
        Object.keys(control.errors).forEach((errorKey) => {
          const errorMessage = this.getErrorMessage(
            errorKey,
            control.errors![errorKey]
          );
          console.error(`${key}: ${errorMessage}`);
        });
      }
    });
  }

  // Get human-readable error message based on error type
  getErrorMessage(errorKey: string, errorValue: any): string {
    switch (errorKey) {
      case 'required':
        return 'This field is required';
      case 'minlength':
        return `Minimum length is ${errorValue.requiredLength}`;
      case 'email':
        return 'Please enter a valid email address';
      default:
        return 'Invalid input';
    }
  }
}
