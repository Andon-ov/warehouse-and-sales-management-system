import { Timestamp } from '@angular/fire/firestore';

/**
 * Represents a user object stored in Firestore.
 */
export interface FirestoreUser {
  accessToken: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: UserMetadata;
  phoneNumber: string;
  photoURL: string;
  uid: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isAdmin: boolean;
  favoriteRecipes: string[];
}

/**
 * Represents metadata associated with a user.
 */
interface UserMetadata {
  createdAt: string;
  creationTime: string;
  lastLoginAt: string;
  lastSignInTime: string;
}

