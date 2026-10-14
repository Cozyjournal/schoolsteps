# SchoolSteps 🎒

> **Run it. Track it. Report it. — All in one place.**  
> The complete school management system for Pakistani schools.

SchoolSteps is designed specifically for school owners and teachers tired of paper registers, diary marks, and manual report card preparation. This repository contains the complete **Phase 1 Pilot** implementation.

---

## 🚀 Phase 1 Pilot Scope (Included Modules)

Per the Product Requirements Document (`SchoolSteps_PRD_v1_0.pdf`):

### 👥 Module 1: Student & Parent Database (M1)
- **Single Source of Truth**: Enrolled student profiles with roll number, class, section, date of birth, admission number, and status.
- **Parent & Guardian Contact**: Father and mother names, emergency contacts, home address, and WhatsApp contact numbers.
- **Management Operations**: Add new students, edit existing details, and delete records with instant reactive updates.
- **Search & Filtering**: Search in real time by student name, father name, or roll number; filter by Class and Section.
- **Local Persistence & Cloud Sync**: Data stored securely in Cloud Firestore with multi-tenant isolation per school, backed by client `localStorage` caching for instant offline-first operation.

### 📋 Module 2: Smart Attendance + Parent WhatsApp Alerts (M2)
- **Mobile-First Touch Roster**: Big touch-friendly buttons for **Present**, **Absent**, and **Late** (with arrival timestamp log).
- **Teacher Convenience**: "⚡ All Present" one-tap shortcut so teachers only need to mark absentees.
- **Daily Summary**: Real-time counters showing total enrolled, present count & percentage, absent count, and late count.
- **Parent WhatsApp Notification Hub**:
  - Automatically generates authentic WhatsApp messages tailored per child and status:
    - *Present*: `"Assalam-o-Alaikum! Ahmed Raza (Class 3-A) is marked Present today..."`
    - *Absent*: `"Assalam-o-Alaikum! Ahmed Raza (Class 3-A) is marked ABSENT today. Please inform the class teacher if this is unexpected..."`
    - *Late*: `"Assalam-o-Alaikum! Ahmed Raza (Class 3-A) arrived Late today..."`
  - Live message preview cards with phone numbers formatted for instant delivery.
  - **Direct `wa.me` links** (`https://wa.me/<phone>?text=...`) to open WhatsApp directly with prefilled messages.
  - Quick message copy buttons and filtering by Absent, Late, or Present.

### 📊 Module 3: Test Marks Entry & Branded Report Cards (M3 Basic)
- **Subject Marks Entry Sheet**:
  - Assessment setup per subject (Mathematics, English, Urdu, General Science, Islamiat, Social Studies, Computer).
  - Configurable Total/Max Marks and Passing Marks.
  - Live percentage calculation, grading scheme (`A+`, `A`, `B`, `C`, `D`, `F`), and pass/fail status.
  - Individual teacher remarks with quick input.
- **Simple School-Branded Report Card (Printable A4)**:
  - White-label school letterhead: School Name, Crest/Logo, Motto, Campus Address & Contact.
  - Comprehensive student details: Roll No, Class, Father Name, Admission No, and Attendance rate.
  - Academic performance table with subject breakdowns, totals, overall percentage, and grade.
  - Class position (1st, 2nd, 3rd) and teacher remarks.
  - Grading legend and official signature lines (Class Teacher, Principal, Official Seal stamp).
  - Print-optimized CSS (`@media print`) for clean, single-page A4 printing or PDF export.

### 🏫 White-Label School Profile & Customization
- Built-in "School Profile" drawer allows schools to set their own school name, motto, principal signature name, and campus details, fulfilling the PRD white-label principle: *"ye aapke school ka apna system lagega."*

---

## 🎨 Design Language

Built using the warm **HomeSteps** design family:
- **Palette**: Warm Cream (`#FFF8F0`), Peach / Terracotta (`#C96F4A`), Sage Green (`#7FB069`), Golden Sun (`#F4B942`), and WhatsApp Green (`#25D366`).
- **Typography**: Friendly, readable fonts (`Fredoka` for headings, `Nunito` for content).
- **Mobile-First UX**: Generous touch targets (>= 48px), fixed mobile bottom bar, and responsive layouts designed for teachers on smartphones.
- **Full English UI**.

---

## 🚫 Out of Scope for Phase 1 Pilot (Per PRD)
- Multi-user authentication & role logins (scheduled for post-pilot roll-out).
- Cloud Firestore backend (pilot runs on client localStorage).
- Modules M4 through M9 (Auto-Delivery, PTM Scheduler, Communication Hub, Reviews, Syllabus Manager, Timetables).

---

## 💻 Getting Started

This is a zero-dependency web application:
1. Clone the repository:
   ```bash
   git clone https://github.com/Cozyjournal/schoolsteps.git
   ```
2. Open `index.html` directly in any modern web browser (Edge, Chrome, Safari, Firefox).
3. Sign up as an **Admin** to register your new school and receive a unique 6-character School Code, or sign up as a **Teacher** entering your school's code.

---

## 📄 License
MIT License.
