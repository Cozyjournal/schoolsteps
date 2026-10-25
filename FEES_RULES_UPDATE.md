# Firestore Security Rules Update for Fees Module (M10)

Add the following rule block inside `match /databases/{database}/documents` alongside the other module blocks (e.g. after the `calls` collection block) in Firebase Console -> Firestore -> Rules:

```javascript
    match /feePayments/{docId} {
      allow read, delete: if hasSchool() && resource.data.schoolId == getUserSchoolId();
      allow create: if hasSchool() && request.resource.data.schoolId == getUserSchoolId();
      allow update: if hasSchool() && resource.data.schoolId == getUserSchoolId() && request.resource.data.schoolId == getUserSchoolId();
    }
```
