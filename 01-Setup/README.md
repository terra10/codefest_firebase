# 01 Setup

- Install [NodeJS](https://nodejs.org/en/) if you dont have it
- Install the angular cli
  - `npm i -g @angular/cli` 
- Set up a new Angular project
  - `ng new my-cool-app-name`
  - Routing and Css preprocessor optional. Defaults are fine.
  - Change to the app directory and add firebase dependencies
    - `cd my-cool-app-name`
    - `npm install firebase @angular/fire --save`
  - Add the new module to src/app/app.module.ts
    ``` ts
        import { AngularFireModule } from '@angular/fire';
        import { AngularFirestoreModule } from '@angular/fire/firestore';

        const firebaseConfig = {
            // Your soon to be firebase config
        };
        
        imports: [
            BrowserModule,
            AppRoutingModule,
            AngularFireModule.initializeApp(firebaseConfig), // Add this
            AngularFirestoreModule // Add this
        ],
    ```
- Go to your project in the [firebase console](https://console.firebase.google.com/)
- Add a web-app to the project and go through the steps. Hosting is optional.
- Copy/paste the config received into the file previously set up.
