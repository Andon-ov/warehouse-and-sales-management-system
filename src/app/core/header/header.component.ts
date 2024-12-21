
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FirestoreUser } from 'src/app/shared/interfaces/interfaces';
import { UserService } from 'src/app/shared/services/userService/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Form group for search input
  searchForm = this.fb.group({
    search: [''],
  });

  // Flag to track whether the menu is open or closed
  isMenuOpen = false;

  // Flag to track whether the search menu is open or closed
  isSearchOpen: boolean = false;

  // User data
  userData: FirestoreUser | null | undefined;

  // Subject to hold user data
  private userDataSubject: BehaviorSubject<FirestoreUser | null> =
    new BehaviorSubject<FirestoreUser | null>(null);

  // Subscription to user data changes
  userDataSubscription: Subscription | undefined;

  /**
   * @param userService Service for managing user data
   * @param router Angular router service for navigation
   * @param fb FormBuilder service for creating reactive forms
   * @param elementRef Reference to the host element of the component
   * @param formErrorCheckService Service for handling form errors
   * @param globalErrorHandler Service for handling global errors
   */
  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    private elementRef: ElementRef,

  ) {
    // Subscribe to user data changes
    this.userDataSubscription = this.userDataSubject.subscribe((value) => {
      this.userData = value;
    });
  }

   ngOnInit(): void {
    // Subscribe to user data changes from UserService
    this.userService.userData$.subscribe({
      next: (value) => {
        if (value) {
          // If user data is available, update userDataSubject
          this.userDataSubject.next(value);
          console.log('You have a user!', value);
        } else {
          // If user data is null, update userDataSubject with null
          this.userDataSubject.next(null);
          console.log('You have no user!');
        }
      },
      error: (error) => {
        // Handle errors from UserService
        console.error(error)
      },
    });

    // Subscribe to router events to close the menu on navigation
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // If navigation is complete, close the menu
        const navbarCollapse =
          this.elementRef.nativeElement.querySelector('#navbarScroll');
        if (navbarCollapse) {
          navbarCollapse.classList.remove('show');
        }
      }
    });
  }

  // Form submission handler for search
  async onSubmit() {
    if (this.searchForm.valid) {
      // Ако формата е валидна, навигирайте към страницата за търсене на рецепти
      let query = this.searchForm.value;
      if (query && query.search) {
        await this.router.navigate(['/recipe-search'], {
          queryParams: { search: query.search.trim() },
        });
        // Ресетирайте формата след навигацията
        this.searchForm.reset();
      } else {
        // Ако стойността за търсене е празна или невалидна
        console.error('Query search value is null or undefined.');
      }
    } else {
      // Ако формата не е валидна, показвате съобщение за грешка
      console.error('Form is invalid.');
    }
  }
  

  // Unsubscribe from user data changes to prevent memory leaks
  ngOnDestroy() {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }

  // Logout method
  async logout() {
    await this.userService.logoutUser();
  }

  // Method to get user display name
  getUserDisplayName(): string {
    return this.userData ? this.userData.lastName : 'Anonymous';
  }

  // Toggler for mobile menu bar
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Close mobile menu after click
  closeMenu(): void {
    this.isMenuOpen = false;
  }

  // Toggler for search
  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }
}