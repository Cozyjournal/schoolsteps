# SchoolSteps 🎒

> **Run it. Track it. Report it. — All in one place.**  
> The complete school management system for Pakistani schools.

SchoolSteps is designed specifically for school owners and teachers tired of paper registers, diary marks, and manual report card preparation. This repository contains the complete **SchoolSteps** web application.

---

## 🚀 Core Features & Modules

### 👥 Module 1: Student & Parent Database (M1)
- **Single Source of Truth**: Enrolled student profiles with roll number, class, section, date of birth, admission number, and status.
- **Parent & Guardian Contact**: Father and mother names, emergency contacts, home address, and WhatsApp contact numbers.
- **Management Operations**: Add new students, edit existing details, and delete records with instant reactive updates.
- **Search & Filtering**: Search in real time by student name, father name, or roll number; filter by Class and Section.
- **Plan Enforcement**: Maximum 200 active students on Trial/Basic plans; unlimited on Pro.

### 📋 Module 2: Smart Attendance + Parent WhatsApp Alerts (M2)
- **Mobile-First Touch Roster**: Big touch-friendly buttons for **Present**, **Absent**, and **Late** (with arrival timestamp log).
- **Teacher Convenience**: "⚡ All Present" one-tap shortcut so teachers only need to mark absentees.
- **Daily Summary**: Real-time counters showing total enrolled, present count & percentage, absent count, and late count.
- **Parent WhatsApp Notification Hub**: Tailored WhatsApp messages with direct `wa.me` links.
- **Class-wise Monthly Attendance Sheet (New)**:
  - Complete monthly attendance register with interactive P/A/L calendar grid (1..31 days) for any selected class, section, and month.
  - Per-student attendance summaries (Present, Absent, Late totals, and attendance percentage).
  - Clean distinction between marked days and unrecorded / holiday / future days.
  - **A4 Landscape Print Layout**: Generates an official, print-ready attendance register featuring school branding, recorded days counter, and teacher/principal signature blocks.

### 📊 Module 3: Test Marks Entry & Branded Report Cards (M3 Basic)
- **Subject Marks Entry Sheet**: Total/Max marks, passing marks, live percentages, grading (`A+`, `A`, `B`, `C`, `D`, `F`), and teacher remarks.
- **School-Branded Report Card (Printable A4 Portrait)**: White-label letterhead, crest/logo, motto, marks breakdown, class positions, official seal, and signature lines.

### 💳 Module 10: Fees & Financial Tracking (Admin-Only)
- **Fee Structure Setup**: School-wide default monthly fees per class (Class 1 to 10) with custom per-student override support.
- **Overview Dashboard**: Expected revenue, collected amount, pending balance, and collection percentage.
- **Payment Records & Receipts**: Record single or partial installment payments with instant WhatsApp payment receipts.
- **Defaulters List**: Instant overview of unpaid and partial students for any month with one-tap Urdu WhatsApp reminder messages and printable defaulters list.
- **Fee Vouchers (Single & Class Bulk Print) (New)**:
  - Generate official school fee vouchers for any month with customizable due date (default: 10th of the month).
  - **Dual-Copy Print Layout**: Produces two side-by-side copies on a single portrait A4 page ("Parent Copy" and "School Copy") separated by a dashed cut line with scissor icon.
  - Deterministic voucher numbering (`VCH-<YYYYMM>-<rollNo>`), fee particulars breakdown, amount in words in Pakistani Rupees (`numberToWordsPKR`), and cashier/bank/parent signature spaces.
  - **Class Bulk Print**: Print vouchers for an entire class at once, with an option to filter out already paid students.

### 📚 Module 8: Academic Syllabus Manager
- Class-wise academic syllabus builder for Classes 1–10.
- Manage subjects, recommended books, and curriculum topics paced by month.
- Role-friendly: Both Admins and Teachers can add and edit syllabus topics and mark completion.
- Official printable syllabus overview document.

### 🏫 White-Label School Profile & Customization
- Built-in school profile settings allow schools to configure their school name, logo, motto/tagline, brand color, and campus contact details. Multi-tenant isolation ensures each school sees only its own records.

---

## 🎨 Design Language

Built using the warm **HomeSteps** design family:
- **Palette**: Warm Cream (`#FFF8F0`), Peach / Terracotta (`#C96F4A`), Sage Green (`#7FB069`), Golden Sun (`#F4B942`), and WhatsApp Green (`#25D366`).
- **Typography**: Friendly, readable fonts (`Fredoka` for headings, `Nunito` for content).
- **Mobile-First UX**: Generous touch targets (>= 48px), fixed mobile bottom bar, and responsive layouts designed for teachers on smartphones.
- **Full English UI**.

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
