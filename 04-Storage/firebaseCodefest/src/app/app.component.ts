import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

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
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  items: Observable<MockItem[]>;

  constructor(private readonly db: AngularFirestore, public fireAuth: AngularFireAuth, private storage: AngularFireStorage) {
    this.items = db.collection<MockItem>('items').valueChanges();
  }

  search(searchValue: string): void {
    this.items = this.db.collection<MockItem>('items', (ref) => ref.where('first_name', '==', searchValue)).valueChanges();
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

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = `/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => this.downloadURL = fileRef.getDownloadURL())
    )
      .subscribe()
  }
}


