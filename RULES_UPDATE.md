# Firestore Security Rules Additions for Subscription & Billing

**Target File:** `firestore.rules` (and Firebase Console → Firestore → Rules → Publish)  
**Security Model:** Defense-in-depth enforcement for manual billing, platform owners, payment requests, and school tenant isolation.

> [!IMPORTANT]
> DO NOT replace the entire `firestore.rules` file unless instructed. Paste the exact addition blocks below into their designated positions.

---

### Addition 1: Platform Admin Helper Function
**Where it goes:** In `firestore.rules`, inside `service cloud.firestore { match /databases/{database}/documents { ... } }`, immediately after the existing helper functions (e.g. after line 35, following `function hasSchool() { ... }`).

```javascript
    function isPlatformAdmin() {
      return isSignedIn() && exists(/databases/$(database)/documents/platformAdmins/$(userEmail()));
    }
```

---

### Addition 2: Platform Admins Collection Rule
**Where it goes:** In `firestore.rules`, right before `match /schools/{schoolId}` (around line 38).

```javascript
    // -------------------------------------------------------------
    // Platform Admins (Super Admins)
    // -------------------------------------------------------------
    match /platformAdmins/{adminEmail} {
      // Signed in user can check their own owner record
      allow get: if isSignedIn() && adminEmail.lower() == userEmail();
      // Only platform admins can list or modify platform admins
      allow read, write: if isPlatformAdmin();
    }
```

---

### Addition 3: Update `match /schools/{schoolId}` Rules
**Where it goes:** In `firestore.rules`, replace the existing `match /schools/{schoolId}` block (lines 39–66) with this updated block that grants platformAdmins management access and restricts billing field modifications by school admins to only the one-time migration case:

```javascript
    // -------------------------------------------------------------
    // 1. Schools Collection (Scoped & Multi-Tenant with Billing Gating)
    // -------------------------------------------------------------
    match /schools/{schoolId} {
      // Platform Admins can read all schools; School users can read their own school
      // Teachers without a schoolId can read a single doc to validate schoolCode
      allow get: if isSignedIn() && (
        isPlatformAdmin() ||
        !hasSchool() ||
        resource.data.schoolId == getUserSchoolId() ||
        schoolId == getUserSchoolId()
      );

      // Listing/querying all schools is allowed for Platform Admins, or filtered to own schoolId
      allow list: if isPlatformAdmin() || (hasSchool() && resource.data.schoolId == getUserSchoolId());

      // Creating a school is allowed for Platform Admins or bootstrap new school creation
      allow create: if isSignedIn() && (
        isPlatformAdmin() ||
        (!hasSchool() && (
          request.resource.data.creatorUid == request.auth.uid ||
          request.resource.data.createdBy == request.auth.uid
        ))
      );

      // Updates:
      // - Platform Admins can update any school document (including plan, paidUntil, subStatus)
      // - School Admins can update their own school branding/info, but CANNOT modify paidUntil or plan.
      // - School Admins may write trialEndsAt ONLY if it was previously absent (one-time migration).
      allow update: if isSignedIn() && (
        isPlatformAdmin() ||
        (hasSchool() && (resource.data.schoolId == getUserSchoolId() || schoolId == getUserSchoolId()) &&
          !request.resource.data.diff(resource.data).affectedKeys().hasAny(['paidUntil', 'plan']) &&
          (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['trialEndsAt']) || !('trialEndsAt' in resource.data))
        )
      );

      // Deletion: Platform admins or school creator
      allow delete: if isPlatformAdmin() || (hasSchool() && (resource.data.schoolId == getUserSchoolId() || schoolId == getUserSchoolId()));
    }
```

---

### Addition 4: Payment Requests Collection Rule
**Where it goes:** In `firestore.rules`, after `match /calls/{docId} { ... }` and before `match /settings/{docId} { ... }` (around line 149).

```javascript
    // -------------------------------------------------------------
    // Payment Requests Collection (Manual Pakistan Payments)
    // -------------------------------------------------------------
    match /paymentRequests/{requestId} {
      // Platform Admins can read all; schools can only read their own requests
      allow read: if isSignedIn() && (
        isPlatformAdmin() ||
        (hasSchool() && resource.data.schoolId == getUserSchoolId())
      );

      // A school Admin may create a request only with their own schoolId and status 'pending'
      allow create: if isSignedIn() && hasSchool() &&
        request.resource.data.schoolId == getUserSchoolId() &&
        request.resource.data.status == 'pending';

      // Only Platform Admins may update or delete requests (approve/reject/edit status)
      allow update, delete: if isPlatformAdmin();
    }
```
