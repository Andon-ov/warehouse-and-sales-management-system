import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
  sendPasswordResetEmail,
  deleteUser,
  updateProfile,
} from 'firebase/auth';
import { BehaviorSubject, Observable, take } from 'rxjs';

import {
  Firestore,
  setDoc,
  doc,
  getDoc,
  arrayRemove,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from '@angular/fire/firestore';
import { FirestoreUser } from '../../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userDataSubject: BehaviorSubject<FirestoreUser | null> =
    new BehaviorSubject<FirestoreUser | null>(null);
  // Observable representing the current user data or null if no user is authenticated.
  userData$: Observable<FirestoreUser | null> =
    this.userDataSubject.asObservable();
  // The name of the Firestore collection where user authentication data is stored.
  collectionName = 'Auth';

  constructor(private firestore: Firestore, public router: Router) {
    const savedUserData = localStorage.getItem('user');
    if (savedUserData) {
      const parsedUserData = JSON.parse(savedUserData);
      this.userDataSubject.next(parsedUserData);
    }
  }
  async registerUser(
    email: string,
    password: string,
    additionalAuthData: FirestoreUser
  ) {
    try {
      const userCredential = await this.createUserWithEmailAndPassword(
        email,
        password
      );
      const uid = userCredential.user.uid;
      await this.addAdditionalAuthData(uid, additionalAuthData);
      await this.saveUserData(userCredential.user, additionalAuthData);
      this.router.navigate(['recipes-list']);
    } catch (error) {
      console.error(error);
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const userCredential = await this.signInWithEmailAndPassword(
        email,
        password
      );
      const uid = userCredential.user.uid;
      const additionalAuthData = await this.getAdditionalAuthDataById(uid);
      await this.saveUserData(userCredential.user, additionalAuthData);
      await this.router.navigate(['recipes-list']);
    } catch (error) {
      console.error(error)
    }
  }

  async logoutUser() {
    try {
      await this.signOutAuth();
      await this.clearUserData();
      this.router.navigate(['login']);
    } catch (error) {
      console.error(error);
    }
  }

  private createUserWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<UserCredential> {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password);
  }

  private signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<UserCredential> {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  }

  private signOutAuth(): Promise<void> {
    const auth = getAuth();
    return signOut(auth);
  }

  private addAdditionalAuthData(
    uid: string,
    additionalAuthData: FirestoreUser
  ): Promise<void> {
    return setDoc(
      doc(this.firestore, this.collectionName, uid),
      additionalAuthData
    );
  }

  private async getAdditionalAuthDataById(
    uid: string
  ): Promise<FirestoreUser | null> {
    const authDocRef = doc(this.firestore, this.collectionName, uid);
    const authSnapshot = await getDoc(authDocRef);

    if (authSnapshot.exists()) {
      return authSnapshot.data() as FirestoreUser;
    } else {
      return null;
    }
  }

  private saveUserData(
    user: User,
    additionalAuthData: FirestoreUser | null
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (user && additionalAuthData) {
        const fullAuthData = { ...user, ...additionalAuthData };
        localStorage.setItem('user', JSON.stringify(fullAuthData));
        this.userDataSubject.next(fullAuthData);
        resolve();
      } else {
        localStorage.setItem('user', 'null');
        this.userDataSubject.next(null);
        reject();
      }
    });
  }

  private clearUserData(): Promise<void> {
    return new Promise((resolve, reject) => {
      localStorage.removeItem('user');
      this.userDataSubject.next(null);
      resolve();
    });
  }

 

}
