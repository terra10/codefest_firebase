import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

interface MockItem {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  ip_address: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'firebaseCodefest';

  items: Observable<MockItem[]>;

  constructor(private readonly db: AngularFirestore) {
    this.items = db.collection<MockItem>('items').valueChanges();
  }

  search(searchValue: string): void {
    this.items = this.db.collection<MockItem>('items', (ref) => ref.where('first_name', '==', searchValue)).valueChanges();
  }
}