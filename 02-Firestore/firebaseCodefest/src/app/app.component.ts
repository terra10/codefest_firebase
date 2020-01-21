import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'firebaseCodefest';

  items: Observable<any>;

  constructor(private readonly db: AngularFirestore) {
    this.items = db.collection<any>('items').valueChanges();
  }

  search(searchValue: string): void {
    this.items = this.db.collection<any>('items', (ref) => ref.where('first_name', '==', searchValue)).valueChanges();
  }
}
