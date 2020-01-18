# 02 Firestore

Official documentation: https://firebase.google.com/docs/firestore

## 01 Simple live data 

- Add some data to your database. You can do this by hand and make your own or use the premade mock data [here](../utils)
- Use the imported firestore modules set up in [01-Setup](../01-Setup)
  - In app.component.ts add the required imports to the top of the file
      ``` ts
      import { AngularFirestore } from '@angular/fire/firestore';
      import { Observable } from 'rxjs';
      ``` 
  - Set up a component property for the data. Add this to the AppComponent Class
      ``` ts 
      items: Observable<any>;
      ```
  - Add a constructor to the class to finish the component for now.
      ``` ts
      constructor(db: AngularFirestore) {
         this.items = db.collection<any>('items').valueChanges();
      }
      ```
- Binding the data to the template
  - In your app.component.html, add the asynchronous binding to the items property
      ``` html
      <ul>
        <li *ngFor="let item of items | async">
            {{ item.ip_address }} ---
            {{ item.first_name }}
            {{ item.last_name }}
        </li>
      </ul>
      ```
- Enjoy instant updates from your database :)

## 02 Query

- Filter the collection by giving the collection() function a second parameter. **Note**: Even with query, you can still listen to valueChanges
  ``` ts
    this.items = this.db.collection<any>('items', (ref) => ref.where('first_name', '==', 'Lemar')).valueChanges();
  ```
- Let's wrap it in a function and call it from the template with some input.
  ``` ts
    export class AppComponent {
    // ...Code abbreviated for readability
        search(searchValue: string): void {
            this.items = this.db.collection<any>('items', (ref) => ref.where('first_name', '==', searchValue)).valueChanges();
        }
    }
  ```

  ``` html
    <input #searchInput>
    <button (click)="search(searchInput.value)">SEARCH</button>
  ```

## 03 Explore!
  Go to the [docs](https://firebase.google.com/docs/firestore) and explore more of the features.
  Some suggestions: 
  - [Add data](https://firebase.google.com/docs/firestore/manage-data/add-data)
  - [Delete data](https://firebase.google.com/docs/firestore/manage-data/delete-data)
  - [Order and limit data](https://firebase.google.com/docs/firestore/query-data/order-limit-data)
  - [Some solutions offered by Google](https://firebase.google.com/docs/firestore/solutions)
  