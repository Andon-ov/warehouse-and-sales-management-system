import { Component } from '@angular/core';

import {  OnInit } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Component({
  selector: 'app-test-firestore',
  templateUrl: './test-firestore.component.html',
  styleUrls: ['./test-firestore.component.css']
})
export class TestFirestoreComponent  implements OnInit {
  private firestore: Firestore = inject(Firestore);

  constructor() { }

  ngOnInit(): void {
    this.testFirestore();
  }

  async testFirestore() {
    try {
      const docRef = await addDoc(collection(this.firestore, 'products'), {
        name: 'Test Product',
        price: 100,
        dateAdded: new Date()
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }
}
