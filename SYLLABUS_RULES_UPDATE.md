# Firestore Security Rules Update for Syllabus Module (M8)

Add the following rule block inside `match /databases/{database}/documents` alongside the other tenant-isolated data collections (e.g. after the `feePayments` collection block) in Firebase Console -> Firestore -> Rules:

```javascript
    match /syllabi/{docId} {
      allow read, delete: if hasSchool() && resource.data.schoolId == getUserSchoolId();
      allow create: if hasSchool() && request.resource.data.schoolId == getUserSchoolId();
      allow update: if hasSchool() && resource.data.schoolId == getUserSchoolId() && request.resource.data.schoolId == getUserSchoolId();
    }
```
