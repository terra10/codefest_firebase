import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'firebaseCodefest';

  items: Observable<any>;

  constructor(private readonly db: AngularFirestore, public fireAuth: AngularFireAuth) {
    this.items = db.collection<any>('items').valueChanges();
  }

  search(searchValue: string): void {
    this.items = this.db.collection<any>('items', (ref) => ref.where('first_name', '==', searchValue)).valueChanges();
  }

  signUp(email: string, pw: string) {
    this.fireAuth.auth.createUserWithEmailAndPassword(email, pw)
  }

  login(email: string, pw: string) {
    this.fireAuth.auth.signInWithEmailAndPassword(email, pw);
  }

  loginWithGoogle() {
    this.fireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logout() {
    this.fireAuth.auth.signOut();
  }
}


