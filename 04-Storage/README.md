# 04 Storage

Official documentation: https://firebase.google.com/docs/storage

## 01 Upload with download URL to file

- In the firebase Console, storage section. Set up the default bucket
  - If you've managed to have some form of Authentication, use the proper security rules
    ```
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    ```
- Add the FireBaseStorage module to app.module.ts
    ``` ts
    import { AngularFireStorageModule } from '@angular/fire/storage';

    // Code abbreviated for readability
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule // Add this one!
    ],
    ```
- Extend the app.component.ts with the upload logic
  - Import the required depencies. We use *finalize* from rxjs to help with our download URL
    ``` ts
    import { AngularFireStorage } from '@angular/fire/storage';
    import { finalize } from 'rxjs/operators';
    ```
  - Inject the dependency into the class by extending the arguments of the constructor
    ``` ts
    constructor(
        private readonly db: AngularFirestore,
        public fireAuth: AngularFireAuth, 
        private storage: AngularFireStorage // Add this one!
    ) {}
    ```
  - And let's 2 properties to the class for our upload functionality
    ``` ts
    class AppComponent {
        
        //.. Rest of code abbreviated

        uploadPercent: Observable<number>;
        downloadURL: Observable<string>;
    }
    ```
  - Now all we need is the actual upload function
    ``` ts
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
        ).subscribe()
    }
    ```
- Looks good in the component area, let's update the template to send a file event to the uploadFile function
    ``` html
    <div>
        <input type="file" (change)="uploadFile($event)" />
        <div>{{ uploadPercent | async }}</div>
        <a [href]="downloadURL | async">{{ downloadURL | async }}</a>
    </div>
    ```
- Try it out, and check out the Firebase console as well to see your files in the storage section.

## 02 Simple List of files

- Add an extra property to the class for the files
  ``` ts
    class AppComponent {
        files: string[]
    }
  ```
- To show a list of the files in a storage reference we simply need to call the listAll() function.
  We can add the call to the constructor so it fires when initialized
  ``` ts
  this.storage.storage.ref('/').listAll()
    .then(res => this.files = res.items.map(file => file.fullPath));
  ```
- And a very simple html template
  ``` html
    <ul>
        <li *ngFor="let file of files"> {{file}}</li>
    </ul>
  ```

## 03 Explore!
Go to the [docs](https://firebase.google.com/docs/storage) and explore more of the features.
  Some suggestions: 
- [Use File Metadata](https://firebase.google.com/docs/storage/web/file-metadata)
- [Delete Files](https://firebase.google.com/docs/storage/web/delete-files)
