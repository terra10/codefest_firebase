# 03 Authentication

Official documentation: https://firebase.google.com/docs/auth

## 01 Out of the box Google login

- Navigate to the [firebase console](https://console.firebase.google.com/), authentication area
- Enable Google Authentication in the list of identity providers
- Update the app.module.ts file with the AngularFireAuthModule
  ``` ts
  import { AngularFireAuthModule } from '@angular/fire/auth';

  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule // Dont forget to add it to the module imports list
  ],
  ```
- Extend the app.component.ts file with the Auth logic (*Note: You dont want this all in 1 angular component, but for simplicity in this lab we will.*)
  - Import the required dependencies
    ``` ts
    import { AngularFireAuth } from '@angular/fire/auth';
    import { auth } from 'firebase';
    ```
  - Inject the dependency into the class by extending the arguments of the constructor
    ``` ts
    constructor(
        private readonly db: AngularFirestore,
        public fireAuth: AngularFireAuth // :)
    ) {
        this.items = db.collection<MockItem>('items').valueChanges();
    }
    ```
  - Final part for the component.. add the login/logout logic to the class
    ``` ts
    login() {
        // This auth.GoogleAuthProvider can be any OAuth Provider combined with the Popup
        this.fireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }
    logout() {
        this.fireAuth.auth.signOut();
    }
    ```
- With the authentication logic done for now, let's bind it to the template
  - Somewhere in your app.component.html
    ``` html
    <div *ngIf="fireAuth.user | async as user; else showLogin">
        <h1>Hello {{ user.displayName || user.email }}!</h1>
         <button (click)="logout()">Logout</button>
    </div>
    <ng-template #showLogin>
    <p>Please login.</p>
    <button (click)="login()">Login with Google</button>
    </ng-template>
    ```
- Should be able to login with Google by clicking the button now!

## 02 Own user base (e-mail/password)

- Navigate to the [firebase console](https://console.firebase.google.com/), authentication area
- Enable e-mail/password in the list of identity providers
- Change the app.component.ts to support the new identity provider
  - Create a new signup function
    ``` ts
    signUp(email: string, pw: string) {
        this.fireAuth.auth.createUserWithEmailAndPassword(email, pw)
    }
    ```
  - And let's change the login functions to have a seperate one for Google Login
    ``` ts
    login(email: string, pw: string) {
        this.fireAuth.auth.signInWithEmailAndPassword(email, pw);
    }

    loginWithGoogle() {
        this.fireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }
    ```
- Add some (very) simple input fields to sign up and login with email/password
    ``` html
    <ng-template #showLogin>
        <p>Please login, or sign up!</p>
        <button (click)="loginWithGoogle()">Login with Google</button>
        <div>
            <input #email placeholder="email">
            <input #pw placeholder="password" type="password">
            <button (click)="login(email.value, pw.value)">Login with email/password</button>
        </div>
        <br>
        <div>
            <input #signUpEmail placeholder="email">
            <input #signUpPw placeholder="password" type="password">
            <button (click)="signUp(signUpEmail.value, signUpPw.value)">Sign me up!</button>
        </div>
        <br>
    </ng-template>
   ```
- **If you use the same email as the google acount you used earlier, you have to delete that user in the firebase console to make it work.**
- It all looks a bit better when we move the Database view within the logged in section:
  ``` html
    <div *ngIf="fireAuth.user | async as user; else showLogin">
        <h1>Hello {{ user.displayName || user.email }}!</h1>
        <button (click)="logout()">Logout</button>
        <!-- move the database items so we only see them when logged in -->
        <div>
            <input #searchInput>
            <button (click)="search(searchInput.value)">SEARCH</button>
            <ul>
                <li *ngFor="let item of items | async">
                {{item.ip_address}} ---
                {{ item.first_name }}
                {{ item.last_name}}
                </li>
            </ul>
        </div>
        <!-- move the database items so we only see them when logged in -->
    </div>
  ```
## 03 Making sure only authenticated users can see our data
- Now that we have some form of authentication, we can update the rules in our fireStore as well.
- Navigate to the firebase console, database section
- Go to rules and switch it to
  ```
    match /{document=**} {
      allow read, write: if request.auth.uid != null;
    }
  ```
- Now only authenticated users can see the data :) try it out!

## 04 Explore!
Go to the [docs](https://firebase.google.com/docs/auth) and explore more of the features.
  Some suggestions: 
- [Login with Microsoft Azure AD](https://firebase.google.com/docs/auth/web/microsoft-oauth)
- [Email Link Authentication (Passwordless)](https://firebase.google.com/docs/auth/web/email-link-auth)
- [Link multiple Auth providers](https://firebase.google.com/docs/auth/web/account-linking)
