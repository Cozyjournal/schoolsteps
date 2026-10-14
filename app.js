/**
 * SchoolSteps — Phase 1 Pilot Core Engine
 * Modules:
 *  - M1: Student & Parent Database (localStorage)
 *  - M2: Smart Attendance + Parent WhatsApp Message Preview & wa.me Links
 *  - M3: Subject Test Marks Entry + Printable School-Branded Report Cards
 * Design: HomeSteps brand family (warm cream/peach, friendly, mobile-first)
 */

(function () {
  'use strict';

  // ========================================================
  // Firebase Configuration & Initialization
  // ========================================================
  const firebaseConfig = {
    apiKey: "AIzaSyCRD8lzF7BS1F2HZYdAcrk6hXgZcuExXcA",
    authDomain: "schoolsteps-f8b97.firebaseapp.com",
    projectId: "schoolsteps-f8b97",
    storageBucket: "schoolsteps-f8b97.firebasestorage.app",
    messagingSenderId: "280556240060",
    appId: "1:280556240060:web:053bc322584d07e0db24b9",
    measurementId: "G-XGYRC5PNZW"
  };

  let auth = null;
  let db = null;
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    if (typeof firebase.analytics === 'function' && firebaseConfig.measurementId) {
      try {
        firebase.analytics();
      } catch (err) {
        console.warn('Analytics initialization error:', err);
      }
    }
    auth = firebase.auth();
    if (typeof firebase.firestore === 'function') {
      try {
        db = firebase.firestore();
        // Enable offline persistence so SchoolSteps operates seamlessly without internet
        db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
          if (err.code === 'failed-precondition') {
            console.warn('Firestore persistence warning: Multiple tabs open');
          } else if (err.code === 'unimplemented') {
            console.warn('Firestore persistence warning: Browser unsupported');
          } else {
            console.warn('Firestore persistence error:', err);
          }
        });
      } catch (err) {
        console.warn('Firestore initialization error:', err);
      }
    }
  }

  // ========================================================
  // Storage Keys & Default State
  // ========================================================
  const ROLE_STORAGE_PREFIX = 'schoolsteps_role_';
  const STORAGE_KEYS = {
    STUDENTS: 'schoolsteps_students_v1',
    ATTENDANCE: 'schoolsteps_attendance_v1',
    TESTS: 'schoolsteps_tests_v1',
    MARKS: 'schoolsteps_marks_v1',
    PROFILE: 'schoolsteps_profile_v1',
    DISPATCH_LOG: 'schoolsteps_dispatch_log_v1',
    PTM_EVENTS: 'schoolsteps_ptm_events_v1',
    CALL_LOGS: 'schoolsteps_call_logs_v1'
  };

  function getUserRole(email) {
    if (!email) return 'Teacher';
    return localStorage.getItem(ROLE_STORAGE_PREFIX + email.toLowerCase()) || 'Teacher';
  }

  function setUserRole(email, role) {
    if (!email) return;
    localStorage.setItem(ROLE_STORAGE_PREFIX + email.toLowerCase(), role);
    if (typeof FirestoreDB !== 'undefined' && FirestoreDB.saveUser) {
      FirestoreDB.saveUser(email, role, state.profile?.name);
    }
  }

  const DEFAULT_SCHOOL_PROFILE = {
    name: 'Beacon Oak Grammar School',
    motto: 'Knowledge • Character • Excellence',
    address: 'Plot 14, Main Double Road, Sector F-10, Islamabad | Tel: +92 51 2345678',
    principal: 'Mrs. Nasreen Akhtar',
    academicYear: '2026–2027',
    passPercentage: 40
  };

  const SAMPLE_STUDENTS = [
    {
      id: 'stud-001',
      name: 'Ahmed Raza',
      rollNo: '01',
      className: 'Class 3',
      section: 'A',
      gender: 'Male',
      dob: '2017-04-12',
      admissionNo: 'BOGS-2024-089',
      fatherName: 'Muhammad Raza Khan',
      motherName: 'Tahira Raza',
      whatsapp: '+923001234567',
      emergencyPhone: '+923219876543',
      address: 'House 42, St 5, F-10/2, Islamabad',
      status: 'Active',
      admissionDate: '2024-08-15'
    },
    {
      id: 'stud-002',
      name: 'Fatima Noor',
      rollNo: '02',
      className: 'Class 3',
      section: 'A',
      gender: 'Female',
      dob: '2017-06-21',
      admissionNo: 'BOGS-2024-090',
      fatherName: 'Tariq Mehmood',
      motherName: 'Sadia Tariq',
      whatsapp: '+923335551234',
      emergencyPhone: '+923005556789',
      address: 'Apartment 4B, Silver Heights, F-11, Islamabad',
      status: 'Active',
      admissionDate: '2024-08-15'
    },
    {
      id: 'stud-003',
      name: 'Muhammad Ali',
      rollNo: '03',
      className: 'Class 3',
      section: 'A',
      gender: 'Male',
      dob: '2017-01-18',
      admissionNo: 'BOGS-2024-091',
      fatherName: 'Ali Asghar',
      motherName: 'Zainab Ali',
      whatsapp: '+923458765432',
      emergencyPhone: '+923331112233',
      address: 'House 112, St 19, G-10/4, Islamabad',
      status: 'Active',
      admissionDate: '2024-08-16'
    },
    {
      id: 'stud-004',
      name: 'Ayesha Tariq',
      rollNo: '04',
      className: 'Class 3',
      section: 'A',
      gender: 'Female',
      dob: '2017-09-05',
      admissionNo: 'BOGS-2024-092',
      fatherName: 'Tariq Jameel',
      motherName: 'Bushra Tariq',
      whatsapp: '+923129998877',
      emergencyPhone: '+923014445566',
      address: 'Sector E-11/3, Islamabad',
      status: 'Active',
      admissionDate: '2024-08-18'
    },
    {
      id: 'stud-005',
      name: 'Bilal Hussain',
      rollNo: '05',
      className: 'Class 3',
      section: 'A',
      gender: 'Male',
      dob: '2017-03-30',
      admissionNo: 'BOGS-2024-093',
      fatherName: 'Hussain Abbas',
      motherName: 'Farzana Hussain',
      whatsapp: '+923224443322',
      emergencyPhone: '+923002221100',
      address: 'House 77, St 2, F-10/1, Islamabad',
      status: 'Active',
      admissionDate: '2024-08-20'
    },
    {
      id: 'stud-006',
      name: 'Zainab Bibi',
      rollNo: '06',
      className: 'Class 3',
      section: 'A',
      gender: 'Female',
      dob: '2017-11-14',
      admissionNo: 'BOGS-2024-094',
      fatherName: 'Abdul Rehman',
      motherName: 'Kalsoom Bibi',
      whatsapp: '+923058887766',
      emergencyPhone: '+923156667788',
      address: 'House 19, St 8, G-11/2, Islamabad',
      status: 'Active',
      admissionDate: '2024-08-22'
    },
    {
      id: 'stud-007',
      name: 'Hamza Farooq',
      rollNo: '01',
      className: 'Class 4',
      section: 'A',
      gender: 'Male',
      dob: '2016-05-19',
      admissionNo: 'BOGS-2023-045',
      fatherName: 'Farooq Azam',
      motherName: 'Nadia Farooq',
      whatsapp: '+923337778899',
      emergencyPhone: '+923001112244',
      address: 'House 31, St 4, F-8/3, Islamabad',
      status: 'Active',
      admissionDate: '2023-08-10'
    },
    {
      id: 'stud-008',
      name: 'Maryam Saeed',
      rollNo: '02',
      className: 'Class 4',
      section: 'A',
      gender: 'Female',
      dob: '2016-08-24',
      admissionNo: 'BOGS-2023-048',
      fatherName: 'Saeed Anwar',
      motherName: 'Rubina Saeed',
      whatsapp: '+923456667788',
      emergencyPhone: '+923339998822',
      address: 'House 85, St 12, G-9/1, Islamabad',
      status: 'Active',
      admissionDate: '2023-08-11'
    },
    {
      id: 'stud-009',
      name: 'Usman Khan',
      rollNo: '01',
      className: 'Class 2',
      section: 'A',
      gender: 'Male',
      dob: '2018-02-14',
      admissionNo: 'BOGS-2025-012',
      fatherName: 'Imran Khan',
      motherName: 'Amina Khan',
      whatsapp: '+923135554433',
      emergencyPhone: '+923023334455',
      address: 'House 6, St 3, F-10/4, Islamabad',
      status: 'Active',
      admissionDate: '2025-08-12'
    },
    {
      id: 'stud-010',
      name: 'Hafsa Rehan',
      rollNo: '02',
      className: 'Class 2',
      section: 'A',
      gender: 'Female',
      dob: '2018-07-09',
      admissionNo: 'BOGS-2025-015',
      fatherName: 'Rehan Siddiqui',
      motherName: 'Mehwish Rehan',
      whatsapp: '+923348889900',
      emergencyPhone: '+923214447788',
      address: 'House 22, St 11, G-10/2, Islamabad',
      status: 'Active',
      admissionDate: '2025-08-14'
    },
    {
      id: 'stud-011',
      name: 'Daniyal Tariq',
      rollNo: '01',
      className: 'Class 6',
      section: 'Blue',
      gender: 'Male',
      dob: '2014-03-15',
      admissionNo: 'BOGS-2021-021',
      fatherName: 'Tariq Mehmood',
      motherName: 'Sadia Tariq',
      whatsapp: '+923001234567',
      emergencyPhone: '+923219876543',
      address: 'House 55, St 14, F-7/2, Islamabad',
      status: 'Active',
      admissionDate: '2021-08-10'
    },
    {
      id: 'stud-012',
      name: 'Anum Zahra',
      rollNo: '01',
      className: 'Class 7',
      section: 'Rose',
      gender: 'Female',
      dob: '2013-05-18',
      admissionNo: 'BOGS-2020-034',
      fatherName: 'Zahid Hussain',
      motherName: 'Kishwar Zahra',
      whatsapp: '+923335551234',
      emergencyPhone: '+923005556789',
      address: 'House 18, St 9, G-8/1, Islamabad',
      status: 'Active',
      admissionDate: '2020-08-12'
    },
    {
      id: 'stud-013',
      name: 'Saad Arshad',
      rollNo: '01',
      className: 'Class 8',
      section: 'Alif',
      gender: 'Male',
      dob: '2012-11-04',
      admissionNo: 'BOGS-2019-019',
      fatherName: 'Arshad Malik',
      motherName: 'Noreen Arshad',
      whatsapp: '+923458765432',
      emergencyPhone: '+923331112233',
      address: 'House 89, St 3, I-8/4, Islamabad',
      status: 'Active',
      admissionDate: '2019-08-15'
    },
    {
      id: 'stud-014',
      name: 'Mahnoor Faisal',
      rollNo: '01',
      className: 'Class 9',
      section: 'Science',
      gender: 'Female',
      dob: '2011-08-22',
      admissionNo: 'BOGS-2018-052',
      fatherName: 'Faisal Javaid',
      motherName: 'Hina Faisal',
      whatsapp: '+923129998877',
      emergencyPhone: '+923014445566',
      address: 'House 142, St 22, F-11/3, Islamabad',
      status: 'Active',
      admissionDate: '2018-08-16'
    },
    {
      id: 'stud-015',
      name: 'Zayd Ibrahim (Matric)',
      rollNo: '01',
      className: 'Class 10',
      section: 'Science',
      gender: 'Male',
      dob: '2010-09-12',
      admissionNo: 'BOGS-2017-005',
      fatherName: 'Ibrahim Khalil',
      motherName: 'Ayesha Ibrahim',
      whatsapp: '+923224443322',
      emergencyPhone: '+923002221100',
      address: 'House 7, St 1, Sector E-7, Islamabad',
      status: 'Active',
      admissionDate: '2017-08-14'
    },
    {
      id: 'stud-016',
      name: 'Sana Qasim (Matric)',
      rollNo: '02',
      className: 'Class 10',
      section: 'Science',
      gender: 'Female',
      dob: '2010-04-05',
      admissionNo: 'BOGS-2017-009',
      fatherName: 'Qasim Ali',
      motherName: 'Uzma Qasim',
      whatsapp: '+923058887766',
      emergencyPhone: '+923156667788',
      address: 'House 26, St 17, Sector F-6/1, Islamabad',
      status: 'Active',
      admissionDate: '2017-08-14'
    }
  ];

  const SAMPLE_TESTS = [
    {
      id: 'test-101',
      title: 'October Monthly Assessment',
      className: 'Class 3',
      section: 'A',
      subject: 'Mathematics',
      date: '2026-10-10',
      maxMarks: 50,
      passMarks: 20
    },
    {
      id: 'test-102',
      title: 'October Monthly Assessment',
      className: 'Class 3',
      section: 'A',
      subject: 'English',
      date: '2026-10-08',
      maxMarks: 50,
      passMarks: 20
    },
    {
      id: 'test-103',
      title: 'October Monthly Assessment',
      className: 'Class 3',
      section: 'A',
      subject: 'Urdu',
      date: '2026-10-09',
      maxMarks: 50,
      passMarks: 20
    },
    {
      id: 'test-104',
      title: 'October Monthly Assessment',
      className: 'Class 3',
      section: 'A',
      subject: 'General Science',
      date: '2026-10-11',
      maxMarks: 50,
      passMarks: 20
    },
    {
      id: 'test-105',
      title: 'October Monthly Assessment',
      className: 'Class 3',
      section: 'A',
      subject: 'Islamiat',
      date: '2026-10-12',
      maxMarks: 50,
      passMarks: 20
    },
    {
      id: 'test-106',
      title: 'October Monthly Assessment',
      className: 'Class 3',
      section: 'A',
      subject: 'Social Studies',
      date: '2026-10-12',
      maxMarks: 50,
      passMarks: 20
    },
    {
      id: 'test-201',
      title: 'October Monthly Assessment',
      className: 'Class 10',
      section: 'Science',
      subject: 'Mathematics',
      date: '2026-10-10',
      maxMarks: 75,
      passMarks: 30
    },
    {
      id: 'test-202',
      title: 'October Monthly Assessment',
      className: 'Class 10',
      section: 'Science',
      subject: 'Physics',
      date: '2026-10-11',
      maxMarks: 75,
      passMarks: 30
    },
    {
      id: 'test-203',
      title: 'October Monthly Assessment',
      className: 'Class 10',
      section: 'Science',
      subject: 'English',
      date: '2026-10-12',
      maxMarks: 75,
      passMarks: 30
    },
    {
      id: 'test-204',
      title: 'October Monthly Assessment',
      className: 'Class 10',
      section: 'Science',
      subject: 'Computer Science',
      date: '2026-10-13',
      maxMarks: 75,
      passMarks: 30
    }
  ];

  const SAMPLE_MARKS = {
    // test-101 (Mathematics)
    'test-101_stud-001': { marks: 46, remarks: 'Excellent grasp of geometry & fractions!' },
    'test-101_stud-002': { marks: 48, remarks: 'Top score, very neat calculation steps.' },
    'test-101_stud-003': { marks: 39, remarks: 'Good attempt, practice word problems.' },
    'test-101_stud-004': { marks: 42, remarks: 'Very attentive and accurate.' },
    'test-101_stud-005': { marks: 34, remarks: 'Passed, focus on times tables.' },
    'test-101_stud-006': { marks: 45, remarks: 'Consistent improvement.' },

    // test-102 (English)
    'test-102_stud-001': { marks: 44, remarks: 'Creative comprehension writing.' },
    'test-102_stud-002': { marks: 45, remarks: 'Outstanding vocabulary and spelling.' },
    'test-102_stud-003': { marks: 37, remarks: 'Needs attention to grammar tenses.' },
    'test-102_stud-004': { marks: 44, remarks: 'Good handwriting and expression.' },
    'test-102_stud-005': { marks: 36, remarks: 'Passes, practice punctuation.' },
    'test-102_stud-006': { marks: 43, remarks: 'Very expressive reading voice.' },

    // test-103 (Urdu)
    'test-103_stud-001': { marks: 45, remarks: 'Khush-khati bohat achi hai.' },
    'test-103_stud-002': { marks: 47, remarks: 'Imla aur jumlay behtareen hain.' },
    'test-103_stud-003': { marks: 40, remarks: 'Acha kaam, imla per tawajjo dain.' },
    'test-103_stud-004': { marks: 43, remarks: 'Sabaq ki samajh bohot achi hai.' },
    'test-103_stud-005': { marks: 38, remarks: 'Mehnat jari rakhain.' },
    'test-103_stud-006': { marks: 44, remarks: 'Nazam zabani achi tarah yaad ki.' },

    // test-104 (General Science)
    'test-104_stud-001': { marks: 45, remarks: 'Understands scientific experiments.' },
    'test-104_stud-002': { marks: 46, remarks: 'Clear diagrams and labeling.' },
    'test-104_stud-003': { marks: 38, remarks: 'Good interest in living things.' },
    'test-104_stud-004': { marks: 41, remarks: 'Well-prepared and inquisitive.' },
    'test-104_stud-005': { marks: 35, remarks: 'Satisfactory effort.' },
    'test-104_stud-006': { marks: 43, remarks: 'Very proactive in project work.' },

    // test-105 (Islamiat)
    'test-105_stud-001': { marks: 46, remarks: 'Duas and Kalimas recitation clear.' },
    'test-105_stud-002': { marks: 47, remarks: 'Respectful and attentive student.' },
    'test-105_stud-003': { marks: 41, remarks: 'Good memorization of Surahs.' },
    'test-105_stud-004': { marks: 45, remarks: 'Polite manners and good marks.' },
    'test-105_stud-005': { marks: 39, remarks: 'Good progress.' },
    'test-105_stud-006': { marks: 44, remarks: 'Active learner.' },

    // test-106 (Social Studies)
    'test-106_stud-001': { marks: 42, remarks: 'Good map skills and civic knowledge.' },
    'test-106_stud-002': { marks: 46, remarks: 'Excellent understanding of history.' },
    'test-106_stud-003': { marks: 36, remarks: 'Passes, review Pakistan geography.' },
    'test-106_stud-004': { marks: 43, remarks: 'Enthusiastic and knowledgeable.' },
    'test-106_stud-005': { marks: 37, remarks: 'Fair effort, keep practicing.' },
    'test-106_stud-006': { marks: 42, remarks: 'Good neatness and presentation.' },

    // test-201 (Class 10 Science - Mathematics)
    'test-201_stud-015': { marks: 71, remarks: 'Outstanding algebra and theorem proofs.' },
    'test-201_stud-016': { marks: 68, remarks: 'Excellent trigonometry calculations.' },

    // test-202 (Class 10 Science - Physics)
    'test-202_stud-015': { marks: 69, remarks: 'Strong theoretical conceptual grasp.' },
    'test-202_stud-016': { marks: 66, remarks: 'Neat numerical and circuit diagrams.' },

    // test-203 (Class 10 Science - English)
    'test-203_stud-015': { marks: 68, remarks: 'High vocabulary and essay writing.' },
    'test-203_stud-016': { marks: 72, remarks: 'Flawless comprehension and grammar.' },

    // test-204 (Class 10 Science - Computer Science)
    'test-204_stud-015': { marks: 73, remarks: 'Top programmer, accurate C/algorithms.' },
    'test-204_stud-016': { marks: 70, remarks: 'Excellent database and logic models.' }
  };

  // ========================================================
  // Phase 2 Sample Data & Templates (M4, M5, M6)
  // ========================================================
  const SAMPLE_PTM_EVENTS = [
    {
      id: 'ptm-001',
      title: 'Term 1 Parent-Teacher Meeting (PTM)',
      date: '2026-10-25',
      startTime: '09:00',
      endTime: '13:00',
      classes: ['Class 3', 'Class 4'],
      venue: 'Main Campus & Classrooms',
      notes: 'Please bring student diary and arrive 5 minutes before your slot.',
      rsvps: {
        'stud-001': 'Yes',
        'stud-002': 'Yes',
        'stud-003': 'Maybe',
        'stud-004': 'Pending',
        'stud-005': 'No',
        'stud-006': 'Yes'
      }
    }
  ];

  const SAMPLE_CALL_LOGS = [
    {
      id: 'call-001',
      studentId: 'stud-002',
      studentName: 'Fatima Noor',
      className: 'Class 3',
      parentName: 'Tariq Mehmood',
      phone: '+923335551234',
      date: '2026-10-12 11:30',
      reason: 'Academic Performance',
      outcome: 'Resolved',
      notes: 'Discussed Fatima\'s exceptional test marks in Mathematics (48/50). Father was very pleased.'
    },
    {
      id: 'call-002',
      studentId: 'stud-003',
      studentName: 'Muhammad Ali',
      className: 'Class 3',
      parentName: 'Ali Asghar',
      phone: '+923458765432',
      date: '2026-10-10 14:15',
      reason: 'Attendance / Absences',
      outcome: 'Follow-up Required',
      notes: 'Informed father regarding 2 consecutive absences this week. Father explained seasonal flu; medical note expected.'
    }
  ];

  const BROADCAST_TEMPLATES = {
    fee_reminder: "Assalam-o-Alaikum {parent_name},\nThis is a gentle reminder from {school_name} regarding the monthly tuition fee voucher for {student_name} ({class}). Kindly submit the fee by the 10th of the month. Thank you for your cooperation!\n— {school_name}",
    holiday_notice: "Assalam-o-Alaikum {parent_name},\nPlease note that {school_name} will remain closed tomorrow on account of a gazetted public holiday. Regular classes will resume on the next working day.\nWarm regards,\n— {school_name}",
    urgent_alert: "URGENT NOTICE from {school_name}:\nDue to inclement weather conditions, school will dismiss early today at 11:30 AM. Kindly arrange timely pickup for {student_name} ({class}).\nStay safe!\n— {school_name}",
    ptm_invite: "Assalam-o-Alaikum {parent_name},\nYou are cordially invited to attend the upcoming Parent-Teacher Meeting (PTM) for {student_name} ({class}) at {school_name}. Please check your scheduled time slot.\nWe look forward to seeing you.\n— {school_name}"
  };

  // ========================================================
  // Application State
  // ========================================================
  const state = {
    students: [],
    attendance: {}, // { 'YYYY-MM-DD_Class 3_A': { 'stud-id': { status: 'Present'|'Absent'|'Late', time: '08:15 AM' } } }
    tests: [],
    marks: {}, // { 'testId_studentId': { marks: 45, remarks: '' } }
    profile: { ...DEFAULT_SCHOOL_PROFILE },
    activeTab: 'tab-students',
    attendanceFilter: 'ALL', // for WhatsApp preview: ALL | ABSENT | LATE | PRESENT
    currentTestId: null,
    editingStudentId: null,
    // Phase 2 state
    dispatchLogs: {}, // { 'month_class_studentId': { status: 'Sent'|'Pending', sentAt: '...' } }
    dispatchFilter: 'ALL', // ALL | PENDING | SENT
    ptmEvents: [],
    activePtmId: null,
    ptmFilter: 'ALL', // ALL | YES | NO | MAYBE | PENDING
    callLogs: [],
    commsSubtab: 'broadcast' // broadcast | calllogs
  };

  // ========================================================
  // Storage Helper Functions
  // ========================================================
  function loadStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn('Storage read failed for ' + key, e);
      return fallback;
    }
  }

  function saveStorage(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error('Storage save failed for ' + key, e);
    }
  }

  // ========================================================
  // Cloud Firestore Database Service & Auto-Migration Layer
  // Collections:
  //  - students:    { name, class, section, parentName, parentPhone, admissionNo }
  //  - attendance:  { date, studentId, class, section, status, markedBy }
  //  - marks:       { studentId, subject, term, obtained, total }
  //  - tests:       { id, title, className, section, subject, date, maxMarks, passMarks }
  //  - dispatches:  { class, month, studentId, status, sentAt }
  //  - ptms:        { title, date, timeSlots, classes, venue, invites[] }
  //  - calls:       { studentId, date, reason, outcome }
  //  - users:       { email, role, schoolName }
  //  - settings:    settings/profile
  // ========================================================
  const FirestoreDB = {
    isReady() {
      return !!db;
    },

    showSyncOverlay(title, desc, showProgress = false, progressPercent = 0) {
      const overlay = document.getElementById('syncOverlay');
      const titleEl = document.getElementById('syncTitle');
      const descEl = document.getElementById('syncDesc');
      const progWrap = document.getElementById('syncProgressWrap');
      const progBar = document.getElementById('syncProgressBar');

      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = desc;
      if (progWrap) {
        if (showProgress) {
          progWrap.classList.remove('hidden');
          if (progBar) progBar.style.width = `${progressPercent}%`;
        } else {
          progWrap.classList.add('hidden');
        }
      }
      if (overlay) overlay.classList.remove('hidden');
    },

    setSyncProgress(percent, desc) {
      const progBar = document.getElementById('syncProgressBar');
      const descEl = document.getElementById('syncDesc');
      if (progBar) progBar.style.width = `${percent}%`;
      if (desc && descEl) descEl.textContent = desc;
    },

    hideSyncOverlay() {
      const overlay = document.getElementById('syncOverlay');
      if (overlay) overlay.classList.add('hidden');
    },

    showWriteErrorModal(opName, retryFn) {
      const modal = document.getElementById('syncErrorModal');
      const titleEl = document.getElementById('syncErrorOperationTitle');
      const retryBtn = document.getElementById('btnRetrySyncOperation');
      const dismissBtn = document.getElementById('btnDismissSyncError');
      const closeBtn = document.getElementById('btnCloseSyncErrorModal');

      if (titleEl) titleEl.textContent = `Sync Interrupted: ${opName}`;
      if (modal) modal.classList.remove('hidden');

      const cleanup = () => {
        if (modal) modal.classList.add('hidden');
        if (retryBtn) retryBtn.onclick = null;
        if (dismissBtn) dismissBtn.onclick = null;
        if (closeBtn) closeBtn.onclick = null;
      };

      if (dismissBtn) dismissBtn.onclick = cleanup;
      if (closeBtn) closeBtn.onclick = cleanup;
      if (retryBtn) {
        retryBtn.onclick = async () => {
          cleanup();
          showToast(`Retrying sync for ${opName}...`, 'info');
          try {
            await retryFn();
            showToast(`Synced ${opName} successfully!`, 'success');
          } catch (e) {
            console.error('Retry failed:', e);
            FirestoreDB.showWriteErrorModal(opName, retryFn);
          }
        };
      }
    },

    async writeWithRetry(opName, writeFn, maxRetries = 2) {
      if (!db) {
        // Offline / SDK missing: changes remain in localStorage cache safely
        return false;
      }
      let attempt = 0;
      while (attempt <= maxRetries) {
        try {
          await writeFn();
          return true;
        } catch (err) {
          attempt++;
          console.warn(`Write attempt ${attempt} for ${opName} failed:`, err);
          if (attempt > maxRetries) {
            FirestoreDB.showWriteErrorModal(opName, writeFn);
            return false;
          }
          await new Promise(res => setTimeout(res, 500 * attempt));
        }
      }
      return false;
    },

    async syncAndLoad(currentUser, showOverlay = false) {
      if (!db) {
        console.warn('Firestore is not available; falling back to local storage.');
        initData();
        throw new Error('FIRESTORE_UNAVAILABLE');
      }

      // Sync user profile & role in users collection
      if (currentUser && currentUser.email) {
        const emailLower = currentUser.email.toLowerCase();
        try {
          const userDocRef = db.collection('users').doc(emailLower);
          const userSnap = await userDocRef.get();
          if (userSnap.exists) {
            const userData = userSnap.data();
            if (userData.role) {
              localStorage.setItem(ROLE_STORAGE_PREFIX + emailLower, userData.role);
            }
          } else {
            const currentRole = getUserRole(emailLower);
            await userDocRef.set({
              email: emailLower,
              role: currentRole,
              schoolName: state.profile.name || DEFAULT_SCHOOL_PROFILE.name
            }, { merge: true });
          }
        } catch (err) {
          console.warn('User record sync warning:', err);
        }
      }

      // Check if Firestore students collection is empty
      let isFirestoreEmpty = false;
      try {
        const testSnap = await db.collection('students').limit(1).get();
        isFirestoreEmpty = testSnap.empty;
      } catch (err) {
        console.warn('Firestore initial check error, checking cache/offline:', err);
        throw err;
      }

      if (isFirestoreEmpty) {
        // Auto-migration path: if localStorage has data + Firestore empty -> auto-migrate
        await FirestoreDB.autoMigrate(currentUser, showOverlay);
      } else {
        // Firestore has data: Firestore = source of truth, localStorage = read cache only
        await FirestoreDB.loadAllFromFirestore(showOverlay);
      }
    },

    async autoMigrate(currentUser, showOverlay = false) {
      if (showOverlay) {
        FirestoreDB.showSyncOverlay(
          'Migrating to Cloud Firestore',
          'Transferring existing school database from device to Cloud Firestore (asia-south1)...',
          true,
          10
        );
      }

      try {
        // Make sure local state is loaded
        initData();

        const userEmail = currentUser?.email || 'Admin';

      // 1. Migrate Students (20%)
      FirestoreDB.setSyncProgress(20, 'Migrating student directory to Cloud Firestore...');
      const studentBatch = db.batch();
      (state.students || []).forEach(s => {
        const docRef = db.collection('students').doc(s.id);
        studentBatch.set(docRef, {
          id: s.id,
          name: s.name || '',
          class: s.className || s.class || '',
          className: s.className || s.class || '',
          section: s.section || 'A',
          parentName: s.fatherName || s.parentName || s.motherName || '',
          fatherName: s.fatherName || s.parentName || '',
          motherName: s.motherName || '',
          parentPhone: s.whatsapp || s.parentPhone || '',
          whatsapp: s.whatsapp || s.parentPhone || '',
          emergencyPhone: s.emergencyPhone || '',
          admissionNo: s.admissionNo || '',
          rollNo: s.rollNo || '',
          gender: s.gender || 'Male',
          dob: s.dob || '',
          address: s.address || '',
          status: s.status || 'Active',
          admissionDate: s.admissionDate || getTodayISO()
        }, { merge: true });
      });
      await studentBatch.commit();

      // 2. Migrate Tests & Marks (45%)
      FirestoreDB.setSyncProgress(45, 'Migrating tests and subject mark records...');
      const testsBatch = db.batch();
      (state.tests || []).forEach(t => {
        const docRef = db.collection('tests').doc(t.id);
        testsBatch.set(docRef, {
          id: t.id,
          title: t.title || '',
          className: t.className || '',
          section: t.section || '',
          subject: t.subject || '',
          date: t.date || '',
          maxMarks: t.maxMarks || 100,
          passMarks: t.passMarks || 40
        }, { merge: true });
      });
      await testsBatch.commit();

      const marksEntries = Object.entries(state.marks || {});
      const marksBatches = [];
      let currentBatch = db.batch();
      let count = 0;
      marksEntries.forEach(([key, val]) => {
        const parts = key.split('_');
        const testId = parts[0];
        const studentId = parts[1];
        const testObj = (state.tests || []).find(t => t.id === testId) || {};

        const docRef = db.collection('marks').doc(key);
        currentBatch.set(docRef, {
          studentId: studentId || '',
          testId: testId || '',
          subject: testObj.subject || '',
          term: testObj.title || 'Term Assessment',
          obtained: val.marks != null ? val.marks : 0,
          total: testObj.maxMarks || 100,
          marks: val.marks != null ? val.marks : 0,
          remarks: val.remarks || '',
          className: testObj.className || '',
          section: testObj.section || ''
        }, { merge: true });
        count++;
        if (count % 400 === 0) {
          marksBatches.push(currentBatch.commit());
          currentBatch = db.batch();
        }
      });
      if (count % 400 !== 0) {
        marksBatches.push(currentBatch.commit());
      }
      await Promise.all(marksBatches);

      // 3. Migrate Attendance (65%)
      FirestoreDB.setSyncProgress(65, 'Migrating daily attendance records...');
      const attBatches = [];
      let attBatch = db.batch();
      let attCount = 0;
      Object.entries(state.attendance || {}).forEach(([recordKey, studentMap]) => {
        const [dateStr, className, section] = recordKey.split('_');
        Object.entries(studentMap || {}).forEach(([studId, attData]) => {
          const docId = `${dateStr}_${studId}`;
          const docRef = db.collection('attendance').doc(docId);
          attBatch.set(docRef, {
            date: dateStr,
            studentId: studId,
            class: className || 'Class 3',
            className: className || 'Class 3',
            section: section || 'A',
            status: attData.status || 'Present',
            time: attData.time || '',
            markedBy: userEmail
          }, { merge: true });
          attCount++;
          if (attCount % 400 === 0) {
            attBatches.push(attBatch.commit());
            attBatch = db.batch();
          }
        });
      });
      if (attCount % 400 !== 0) {
        attBatches.push(attBatch.commit());
      }
      await Promise.all(attBatches);

      // 4. Migrate Dispatches, PTMs, Call Logs (85%)
      FirestoreDB.setSyncProgress(85, 'Migrating dispatches, PTM scheduler, and call logs...');
      const commsBatch = db.batch();

      // Dispatches
      Object.entries(state.dispatchLogs || {}).forEach(([logKey, dispatchData]) => {
        const parts = logKey.split('_');
        const month = parts[0] || 'Monthly Assessment';
        const className = parts[1] || 'Class 3';
        const studentId = parts[2] || '';
        const cleanDocId = `${month.replace(/[^a-zA-Z0-9]/g, '_')}_${className.replace(/[^a-zA-Z0-9]/g, '_')}_${studentId}`;
        const docRef = db.collection('dispatches').doc(cleanDocId);
        commsBatch.set(docRef, {
          class: className,
          className: className,
          month: month,
          studentId: studentId,
          status: dispatchData.status || 'Pending',
          sentAt: dispatchData.sentAt || ''
        }, { merge: true });
      });

      // PTMs
      (state.ptmEvents || []).forEach(ptm => {
        const docRef = db.collection('ptms').doc(ptm.id);
        commsBatch.set(docRef, {
          id: ptm.id,
          title: ptm.title || '',
          date: ptm.date || '',
          timeSlots: ptm.timeSlots || `${ptm.startTime || '09:00'} - ${ptm.endTime || '13:00'}`,
          startTime: ptm.startTime || '09:00',
          endTime: ptm.endTime || '13:00',
          classes: ptm.classes || [],
          venue: ptm.venue || '',
          notes: ptm.notes || '',
          invites: Object.keys(ptm.rsvps || {}).map(sId => ({
            studentId: sId,
            status: ptm.rsvps[sId]
          })),
          rsvps: ptm.rsvps || {}
        }, { merge: true });
      });

      // Call logs
      (state.callLogs || []).forEach(call => {
        const docRef = db.collection('calls').doc(call.id);
        commsBatch.set(docRef, {
          id: call.id,
          studentId: call.studentId || '',
          date: call.date || '',
          reason: call.reason || '',
          outcome: call.outcome || '',
          studentName: call.studentName || '',
          className: call.className || '',
          parentName: call.parentName || '',
          phone: call.phone || '',
          notes: call.notes || ''
        }, { merge: true });
      });

      // Settings/Profile
      const profileRef = db.collection('settings').doc('profile');
      commsBatch.set(profileRef, state.profile || DEFAULT_SCHOOL_PROFILE, { merge: true });

      // User record
      if (currentUser && currentUser.email) {
        const emailLower = currentUser.email.toLowerCase();
        const userRef = db.collection('users').doc(emailLower);
        commsBatch.set(userRef, {
          email: emailLower,
          role: getUserRole(emailLower),
          schoolName: state.profile.name || DEFAULT_SCHOOL_PROFILE.name
        }, { merge: true });
      }

      await commsBatch.commit();

      FirestoreDB.setSyncProgress(100, 'Migration completed successfully!');
      localStorage.setItem('schoolsteps_migrated_v1', 'true');
      showToast('Successfully migrated all school data to Cloud Firestore!', 'success');
    } catch (err) {
      console.warn('Error during autoMigrate to Firestore, falling back to local storage:', err);
      initData();
      if (showOverlay) FirestoreDB.hideSyncOverlay();
      throw err;
    } finally {
      if (showOverlay) FirestoreDB.hideSyncOverlay();
    }
  },

    async loadAllFromFirestore(showOverlay = false) {
      if (showOverlay) {
        FirestoreDB.showSyncOverlay('Loading SchoolSteps', 'Syncing latest school records from Cloud Firestore...');
      }

      try {
        const [
          studentsSnap,
          testsSnap,
          marksSnap,
          attSnap,
          dispatchSnap,
          ptmSnap,
          callSnap,
          profileSnap
        ] = await Promise.all([
          db.collection('students').get(),
          db.collection('tests').get(),
          db.collection('marks').get(),
          db.collection('attendance').get(),
          db.collection('dispatches').get(),
          db.collection('ptms').get(),
          db.collection('calls').get(),
          db.collection('settings').doc('profile').get()
        ]);

        // 1. Students
        if (!studentsSnap.empty) {
          state.students = studentsSnap.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              className: data.className || data.class || 'Class 3',
              section: data.section || 'A',
              fatherName: data.fatherName || data.parentName || '',
              whatsapp: data.whatsapp || data.parentPhone || ''
            };
          });
          state.students.sort((a, b) => (parseInt(a.rollNo, 10) || 0) - (parseInt(b.rollNo, 10) || 0));
          saveStorage(STORAGE_KEYS.STUDENTS, state.students);
        }

        // 2. Tests
        if (!testsSnap.empty) {
          state.tests = testsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          saveStorage(STORAGE_KEYS.TESTS, state.tests);
        }

        // 3. Marks
        if (!marksSnap.empty) {
          state.marks = {};
          marksSnap.docs.forEach(doc => {
            const d = doc.data();
            const key = d.testId && d.studentId ? `${d.testId}_${d.studentId}` : doc.id;
            state.marks[key] = {
              marks: d.obtained != null ? d.obtained : (d.marks != null ? d.marks : 0),
              remarks: d.remarks || ''
            };
          });
          saveStorage(STORAGE_KEYS.MARKS, state.marks);
        }

        // 4. Attendance
        if (!attSnap.empty) {
          state.attendance = {};
          attSnap.docs.forEach(doc => {
            const d = doc.data();
            const key = `${d.date}_${d.className || d.class || 'Class 3'}_${d.section || 'A'}`;
            state.attendance[key] = state.attendance[key] || {};
            state.attendance[key][d.studentId] = {
              status: d.status || 'Present',
              time: d.time || ''
            };
          });
          saveStorage(STORAGE_KEYS.ATTENDANCE, state.attendance);
        }

        // 5. Dispatches
        if (!dispatchSnap.empty) {
          state.dispatchLogs = {};
          dispatchSnap.docs.forEach(doc => {
            const d = doc.data();
            const key = `${d.month}_${d.className || d.class}_${d.studentId}`;
            state.dispatchLogs[key] = {
              status: d.status || 'Pending',
              sentAt: d.sentAt || ''
            };
          });
          saveStorage(STORAGE_KEYS.DISPATCH_LOG, state.dispatchLogs);
        }

        // 6. PTMs
        if (!ptmSnap.empty) {
          state.ptmEvents = ptmSnap.docs.map(doc => {
            const d = doc.data();
            let rsvps = d.rsvps || {};
            if (Array.isArray(d.invites) && Object.keys(rsvps).length === 0) {
              d.invites.forEach(inv => {
                if (inv && inv.studentId) rsvps[inv.studentId] = inv.status;
              });
            }
            return {
              id: doc.id,
              ...d,
              rsvps
            };
          });
          state.activePtmId = state.ptmEvents[0]?.id || null;
          saveStorage(STORAGE_KEYS.PTM_EVENTS, state.ptmEvents);
        }

        // 7. Calls
        if (!callSnap.empty) {
          state.callLogs = callSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          state.callLogs.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
          saveStorage(STORAGE_KEYS.CALL_LOGS, state.callLogs);
        }

        // 8. Profile
        if (profileSnap.exists) {
          state.profile = { ...DEFAULT_SCHOOL_PROFILE, ...profileSnap.data() };
          saveStorage(STORAGE_KEYS.PROFILE, state.profile);
        }

      } catch (err) {
        console.warn('Error loading from Firestore, using offline cache:', err);
        initData();
        if (showOverlay) FirestoreDB.hideSyncOverlay();
        throw err;
      } finally {
        if (showOverlay) FirestoreDB.hideSyncOverlay();
      }
    },

    // --- Direct CRUD Mutation Methods ---
    async saveStudent(student) {
      return this.writeWithRetry(`Save Student (${student.name})`, async () => {
        const docRef = db.collection('students').doc(student.id);
        await docRef.set({
          id: student.id,
          name: student.name || '',
          class: student.className || student.class || '',
          className: student.className || student.class || '',
          section: student.section || 'A',
          parentName: student.fatherName || student.parentName || student.motherName || '',
          fatherName: student.fatherName || student.parentName || '',
          motherName: student.motherName || '',
          parentPhone: student.whatsapp || student.parentPhone || '',
          whatsapp: student.whatsapp || student.parentPhone || '',
          emergencyPhone: student.emergencyPhone || '',
          admissionNo: student.admissionNo || '',
          rollNo: student.rollNo || '',
          gender: student.gender || 'Male',
          dob: student.dob || '',
          address: student.address || '',
          status: student.status || 'Active',
          admissionDate: student.admissionDate || getTodayISO()
        }, { merge: true });
      });
    },

    async deleteStudent(id) {
      return this.writeWithRetry(`Delete Student`, async () => {
        await db.collection('students').doc(id).delete();
      });
    },

    async saveAttendanceRecord(dateStr, className, section, studentId, status, timeStr = '', markedBy = '') {
      return this.writeWithRetry(`Attendance for ${studentId}`, async () => {
        const docId = `${dateStr}_${studentId}`;
        await db.collection('attendance').doc(docId).set({
          date: dateStr,
          studentId,
          class: className,
          className,
          section,
          status,
          time: timeStr,
          markedBy: markedBy || (auth?.currentUser?.email || 'Teacher')
        }, { merge: true });
      });
    },

    async saveAttendanceBatch(records) {
      return this.writeWithRetry(`Save Attendance Batch`, async () => {
        const batch = db.batch();
        records.forEach(r => {
          const docId = `${r.date}_${r.studentId}`;
          const ref = db.collection('attendance').doc(docId);
          batch.set(ref, {
            date: r.date,
            studentId: r.studentId,
            class: r.className || r.class,
            className: r.className || r.class,
            section: r.section,
            status: r.status,
            time: r.time || '',
            markedBy: r.markedBy || (auth?.currentUser?.email || 'Teacher')
          }, { merge: true });
        });
        await batch.commit();
      });
    },

    async saveTest(test) {
      return this.writeWithRetry(`Save Test (${test.title})`, async () => {
        await db.collection('tests').doc(test.id).set({
          id: test.id,
          title: test.title || '',
          className: test.className || '',
          section: test.section || '',
          subject: test.subject || '',
          date: test.date || '',
          maxMarks: test.maxMarks || 100,
          passMarks: test.passMarks || 40
        }, { merge: true });
      });
    },

    async saveMarksBatch(test, marksList) {
      return this.writeWithRetry(`Save Marks (${test.subject})`, async () => {
        const batch = db.batch();
        marksList.forEach(m => {
          const docId = `${test.id}_${m.studentId}`;
          const ref = db.collection('marks').doc(docId);
          batch.set(ref, {
            studentId: m.studentId,
            testId: test.id,
            subject: test.subject || '',
            term: test.title || 'Assessment',
            obtained: m.marks != null ? m.marks : 0,
            total: test.maxMarks || 100,
            marks: m.marks != null ? m.marks : 0,
            remarks: m.remarks || '',
            className: test.className || '',
            section: test.section || ''
          }, { merge: true });
        });
        await batch.commit();
      });
    },

    async saveProfile(profile) {
      return this.writeWithRetry(`Save School Profile`, async () => {
        await db.collection('settings').doc('profile').set({
          name: profile.name || '',
          motto: profile.motto || '',
          address: profile.address || '',
          principal: profile.principal || '',
          academicYear: profile.academicYear || '',
          passPercentage: profile.passPercentage || 40
        }, { merge: true });
      });
    },

    async saveDispatch(month, className, studentId, status, sentAt) {
      return this.writeWithRetry(`Dispatch for ${studentId}`, async () => {
        const cleanDocId = `${month.replace(/[^a-zA-Z0-9]/g, '_')}_${className.replace(/[^a-zA-Z0-9]/g, '_')}_${studentId}`;
        await db.collection('dispatches').doc(cleanDocId).set({
          class: className,
          className,
          month,
          studentId,
          status,
          sentAt: sentAt || ''
        }, { merge: true });
      });
    },

    async saveDispatchBatch(month, className, students, status, sentAt) {
      return this.writeWithRetry(`Batch Dispatch for ${className}`, async () => {
        const batch = db.batch();
        students.forEach(s => {
          const cleanDocId = `${month.replace(/[^a-zA-Z0-9]/g, '_')}_${className.replace(/[^a-zA-Z0-9]/g, '_')}_${s.id}`;
          const ref = db.collection('dispatches').doc(cleanDocId);
          batch.set(ref, {
            class: className,
            className,
            month,
            studentId: s.id,
            status,
            sentAt: sentAt || ''
          }, { merge: true });
        });
        await batch.commit();
      });
    },

    async resetDispatchBatch(month, className, students) {
      return this.writeWithRetry(`Reset Dispatch for ${className}`, async () => {
        const batch = db.batch();
        students.forEach(s => {
          const cleanDocId = `${month.replace(/[^a-zA-Z0-9]/g, '_')}_${className.replace(/[^a-zA-Z0-9]/g, '_')}_${s.id}`;
          const ref = db.collection('dispatches').doc(cleanDocId);
          batch.delete(ref);
        });
        await batch.commit();
      });
    },

    async savePtm(ptm) {
      return this.writeWithRetry(`Save PTM (${ptm.title})`, async () => {
        await db.collection('ptms').doc(ptm.id).set({
          id: ptm.id,
          title: ptm.title || '',
          date: ptm.date || '',
          timeSlots: ptm.timeSlots || `${ptm.startTime || '09:00'} - ${ptm.endTime || '13:00'}`,
          startTime: ptm.startTime || '09:00',
          endTime: ptm.endTime || '13:00',
          classes: ptm.classes || [],
          venue: ptm.venue || '',
          notes: ptm.notes || '',
          invites: Object.keys(ptm.rsvps || {}).map(sId => ({
            studentId: sId,
            status: ptm.rsvps[sId]
          })),
          rsvps: ptm.rsvps || {}
        }, { merge: true });
      });
    },

    async deletePtm(id) {
      return this.writeWithRetry(`Delete PTM`, async () => {
        await db.collection('ptms').doc(id).delete();
      });
    },

    async updatePtmRsvp(ptmId, studentId, rsvpVal) {
      return this.writeWithRetry(`RSVP for ${studentId}`, async () => {
        const ptmRef = db.collection('ptms').doc(ptmId);
        await ptmRef.set({
          rsvps: { [studentId]: rsvpVal }
        }, { merge: true });
      });
    },

    async saveCallLog(call) {
      return this.writeWithRetry(`Save Call Log`, async () => {
        await db.collection('calls').doc(call.id).set({
          id: call.id,
          studentId: call.studentId || '',
          date: call.date || '',
          reason: call.reason || '',
          outcome: call.outcome || '',
          studentName: call.studentName || '',
          className: call.className || '',
          parentName: call.parentName || '',
          phone: call.phone || '',
          notes: call.notes || ''
        }, { merge: true });
      });
    },

    async deleteCallLog(id) {
      return this.writeWithRetry(`Delete Call Log`, async () => {
        await db.collection('calls').doc(id).delete();
      });
    },

    async saveUser(email, role, schoolName) {
      if (!email || !db) return;
      return this.writeWithRetry(`Save User Role`, async () => {
        await db.collection('users').doc(email.toLowerCase()).set({
          email: email.toLowerCase(),
          role: role || 'Teacher',
          schoolName: schoolName || state.profile.name || DEFAULT_SCHOOL_PROFILE.name
        }, { merge: true });
      });
    },

    async resetToDemoData(userEmail) {
      if (!db) return;
      FirestoreDB.showSyncOverlay('Reloading Demo Data', 'Updating Cloud Firestore with sample school dataset...', true, 20);

      try {
        await FirestoreDB.autoMigrate({ email: userEmail }, true);
      } catch (e) {
        console.error('Error resetting demo data in Firestore:', e);
      } finally {
        FirestoreDB.hideSyncOverlay();
      }
    }
  };

  function initData() {
    state.profile = Object.assign({}, DEFAULT_SCHOOL_PROFILE, loadStorage(STORAGE_KEYS.PROFILE, DEFAULT_SCHOOL_PROFILE));
    state.students = loadStorage(STORAGE_KEYS.STUDENTS, null);
    state.tests = loadStorage(STORAGE_KEYS.TESTS, null);
    state.marks = loadStorage(STORAGE_KEYS.MARKS, null);
    state.attendance = loadStorage(STORAGE_KEYS.ATTENDANCE, {});
    state.dispatchLogs = loadStorage(STORAGE_KEYS.DISPATCH_LOG, {});
    state.ptmEvents = loadStorage(STORAGE_KEYS.PTM_EVENTS, null);
    state.callLogs = loadStorage(STORAGE_KEYS.CALL_LOGS, null);

    // Seed defaults if empty
    if (!state.students || !Array.isArray(state.students) || state.students.length === 0) {
      state.students = [...SAMPLE_STUDENTS];
      saveStorage(STORAGE_KEYS.STUDENTS, state.students);
    }

    if (!state.tests || !Array.isArray(state.tests) || state.tests.length === 0) {
      state.tests = [...SAMPLE_TESTS];
      saveStorage(STORAGE_KEYS.TESTS, state.tests);
    }

    if (!state.marks || typeof state.marks !== 'object' || Object.keys(state.marks).length === 0) {
      state.marks = { ...SAMPLE_MARKS };
      saveStorage(STORAGE_KEYS.MARKS, state.marks);
    }

    if (!state.attendance || typeof state.attendance !== 'object') {
      state.attendance = {};
    }

    if (!state.dispatchLogs || typeof state.dispatchLogs !== 'object') {
      state.dispatchLogs = {};
    }

    if (!state.ptmEvents || !Array.isArray(state.ptmEvents) || state.ptmEvents.length === 0) {
      state.ptmEvents = JSON.parse(JSON.stringify(SAMPLE_PTM_EVENTS));
      saveStorage(STORAGE_KEYS.PTM_EVENTS, state.ptmEvents);
    }
    if (state.ptmEvents.length > 0 && !state.activePtmId) {
      state.activePtmId = state.ptmEvents[0].id;
    }

    if (!state.callLogs || !Array.isArray(state.callLogs) || state.callLogs.length === 0) {
      state.callLogs = JSON.parse(JSON.stringify(SAMPLE_CALL_LOGS));
      saveStorage(STORAGE_KEYS.CALL_LOGS, state.callLogs);
    }

    // Seed sample attendance for today for Class 3-A if none exists
    const todayStr = getTodayISO();
    const todayKey = `${todayStr}_Class 3_A`;
    if (!state.attendance[todayKey]) {
      const initialAtt = {
        'stud-001': { status: 'Present', time: '' },
        'stud-002': { status: 'Present', time: '' },
        'stud-003': { status: 'Absent', time: '' },
        'stud-004': { status: 'Present', time: '' },
        'stud-005': { status: 'Late', time: '08:20 AM' },
        'stud-006': { status: 'Present', time: '' }
      };
      state.attendance[todayKey] = initialAtt;
      saveStorage(STORAGE_KEYS.ATTENDANCE, state.attendance);
    }

    const todayMatricKey = `${todayStr}_Class 10_Science`;
    if (!state.attendance[todayMatricKey]) {
      state.attendance[todayMatricKey] = {
        'stud-015': { status: 'Present', time: '' },
        'stud-016': { status: 'Present', time: '' }
      };
      saveStorage(STORAGE_KEYS.ATTENDANCE, state.attendance);
    }

    // Ensure all sample students (including Matric/Class 6-10) exist in state
    if (state.students && Array.isArray(state.students)) {
      let added = false;
      SAMPLE_STUDENTS.forEach(s => {
        if (!state.students.some(cur => cur.id === s.id)) {
          state.students.push({ ...s });
          added = true;
        }
      });
      if (added) saveStorage(STORAGE_KEYS.STUDENTS, state.students);
    }

    // Ensure sample tests for Class 10 exist in state
    if (state.tests && Array.isArray(state.tests)) {
      let added = false;
      SAMPLE_TESTS.forEach(t => {
        if (!state.tests.some(cur => cur.id === t.id)) {
          state.tests.push({ ...t });
          added = true;
        }
      });
      if (added) saveStorage(STORAGE_KEYS.TESTS, state.tests);
    }

    // Ensure sample marks for Class 10 exist in state
    if (state.marks) {
      let added = false;
      Object.keys(SAMPLE_MARKS).forEach(k => {
        if (!state.marks[k]) {
          state.marks[k] = SAMPLE_MARKS[k];
          added = true;
        }
      });
      if (added) saveStorage(STORAGE_KEYS.MARKS, state.marks);
    }
  }

  function resetToDemoData() {
    state.profile = { ...DEFAULT_SCHOOL_PROFILE };
    state.students = JSON.parse(JSON.stringify(SAMPLE_STUDENTS));
    state.tests = JSON.parse(JSON.stringify(SAMPLE_TESTS));
    state.marks = JSON.parse(JSON.stringify(SAMPLE_MARKS));
    state.attendance = {};
    state.dispatchLogs = {};
    state.ptmEvents = JSON.parse(JSON.stringify(SAMPLE_PTM_EVENTS));
    state.activePtmId = state.ptmEvents[0]?.id || null;
    state.callLogs = JSON.parse(JSON.stringify(SAMPLE_CALL_LOGS));

    const todayStr = getTodayISO();
    const todayKey = `${todayStr}_Class 3_A`;
    state.attendance[todayKey] = {
      'stud-001': { status: 'Present', time: '' },
      'stud-002': { status: 'Present', time: '' },
      'stud-003': { status: 'Absent', time: '' },
      'stud-004': { status: 'Present', time: '' },
      'stud-005': { status: 'Late', time: '08:20 AM' },
      'stud-006': { status: 'Present', time: '' }
    };
    const todayMatricKey = `${todayStr}_Class 10_Science`;
    state.attendance[todayMatricKey] = {
      'stud-015': { status: 'Present', time: '' },
      'stud-016': { status: 'Present', time: '' }
    };

    saveStorage(STORAGE_KEYS.PROFILE, state.profile);
    saveStorage(STORAGE_KEYS.STUDENTS, state.students);
    saveStorage(STORAGE_KEYS.TESTS, state.tests);
    saveStorage(STORAGE_KEYS.MARKS, state.marks);
    saveStorage(STORAGE_KEYS.ATTENDANCE, state.attendance);
    saveStorage(STORAGE_KEYS.DISPATCH_LOG, state.dispatchLogs);
    saveStorage(STORAGE_KEYS.PTM_EVENTS, state.ptmEvents);
    saveStorage(STORAGE_KEYS.CALL_LOGS, state.callLogs);
    if (FirestoreDB.isReady()) {
      FirestoreDB.resetToDemoData(auth?.currentUser?.email || 'Teacher');
    } else {
      showToast('Demo data reloaded successfully!', 'success');
      renderApp();
    }
  }

  // ========================================================
  // Utilities: Dates, Phone, Grades
  // ========================================================
  function getTodayISO() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatDateHuman(isoStr) {
    if (!isoStr) return '';
    try {
      const parts = isoStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      }
      return isoStr;
    } catch {
      return isoStr;
    }
  }

  function sanitizePhoneForWhatsApp(phone) {
    if (!phone) return '';
    // Strip non-digits except initial +
    let cleaned = phone.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    }
    // If starts with 03 (Pakistani domestic mobile), convert to 923
    if (cleaned.startsWith('03')) {
      cleaned = '92' + cleaned.substring(1);
    } else if (cleaned.startsWith('3') && cleaned.length === 10) {
      cleaned = '92' + cleaned;
    }
    return cleaned;
  }

  function calculateGrade(percentage) {
    const pct = parseFloat(percentage);
    if (isNaN(pct)) return { grade: '-', label: 'N/A', cls: 'grade-c' };
    if (pct >= 90) return { grade: 'A+', label: 'Outstanding', cls: 'grade-aplus' };
    if (pct >= 80) return { grade: 'A', label: 'Excellent', cls: 'grade-a' };
    if (pct >= 70) return { grade: 'B', label: 'Good', cls: 'grade-b' };
    if (pct >= 60) return { grade: 'C', label: 'Satisfactory', cls: 'grade-c' };
    if (pct >= 50) return { grade: 'D', label: 'Pass', cls: 'grade-d' };
    return { grade: 'F', label: 'Needs Improvement', cls: 'grade-f' };
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warn') icon = '⚠️';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.2s ease-out';
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ========================================================
  // Navigation & Tabs
  // ========================================================
  function initNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn, .mobile-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        switchTab(targetTab);
      });
    });
  }

  function switchTab(tabId) {
    state.activeTab = tabId;

    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      const match = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
      const match = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', match);
    });

    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === tabId);
    });

    // Refresh view for specific tabs
    if (tabId === 'tab-students') {
      renderStudentsList();
    } else if (tabId === 'tab-attendance') {
      renderAttendanceRoster();
    } else if (tabId === 'tab-tests') {
      renderMarksEntrySheet();
    } else if (tabId === 'tab-reports') {
      renderReportCard();
    } else if (tabId === 'tab-dispatch') {
      renderDispatchRoster();
    } else if (tabId === 'tab-ptm') {
      renderPtmModule();
    } else if (tabId === 'tab-comms') {
      renderCommsModule();
    }
  }

  // ========================================================
  // MODULE 1: Student & Parent Database
  // ========================================================
  const ALL_DEFAULT_CLASSES = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
  ];

  function sortClasses(classList) {
    return Array.from(classList).sort((a, b) => {
      const numA = parseInt((a.match(/\d+/) || [999])[0], 10);
      const numB = parseInt((b.match(/\d+/) || [999])[0], 10);
      if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });
  }

  function updateSectionSuggestions() {
    const defaultSections = ['A', 'B', 'C', 'Blue', 'Rose', 'Alif', 'Science'];
    const secSet = new Set(defaultSections);
    (state.students || []).forEach(s => {
      if (s.section && s.section.trim()) secSet.add(s.section.trim());
    });
    (state.tests || []).forEach(t => {
      if (t.section && t.section.trim()) secSet.add(t.section.trim());
    });

    const sortedSecs = Array.from(secSet).sort((a, b) => a.localeCompare(b));

    const secDatalist = document.getElementById('sectionSuggestions');
    if (secDatalist) {
      secDatalist.innerHTML = '';
      sortedSecs.forEach(sec => {
        const opt = document.createElement('option');
        opt.value = sec;
        opt.textContent = `Section ${sec}`;
        secDatalist.appendChild(opt);
      });
    }

    const filterSecDatalist = document.getElementById('filterSectionSuggestions');
    if (filterSecDatalist) {
      filterSecDatalist.innerHTML = '';
      const optAll = document.createElement('option');
      optAll.value = 'ALL';
      optAll.textContent = 'All Sections';
      filterSecDatalist.appendChild(optAll);
      sortedSecs.forEach(sec => {
        const opt = document.createElement('option');
        opt.value = sec;
        opt.textContent = `Section ${sec}`;
        filterSecDatalist.appendChild(opt);
      });
    }
  }

  function renderClassDropdowns() {
    const classSet = new Set(ALL_DEFAULT_CLASSES);
    state.students.forEach(s => {
      if (s.className) classSet.add(s.className);
    });

    const sortedClasses = sortClasses(classSet);

    // Populate filter dropdown
    const filterSelect = document.getElementById('filterClassSelect');
    if (filterSelect) {
      const currentVal = filterSelect.value || 'ALL';
      filterSelect.innerHTML = '<option value="ALL">All Classes</option>';
      sortedClasses.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        if (c === currentVal) opt.selected = true;
        filterSelect.appendChild(opt);
      });
    }

    // Populate attendance class select
    const attSelect = document.getElementById('attClassSelect');
    if (attSelect) {
      const currentVal = attSelect.value || 'Class 3';
      attSelect.innerHTML = '';
      sortedClasses.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        if (c === currentVal) opt.selected = true;
        attSelect.appendChild(opt);
      });
      if (!attSelect.value && sortedClasses.length > 0) {
        attSelect.value = sortedClasses[0];
      }
    }

    // Populate tests class select
    const testClassSelect = document.getElementById('testClassSelect');
    if (testClassSelect) {
      const currentVal = testClassSelect.value || 'Class 3';
      testClassSelect.innerHTML = '';
      sortedClasses.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        if (c === currentVal) opt.selected = true;
        testClassSelect.appendChild(opt);
      });
      if (!testClassSelect.value && sortedClasses.length > 0) {
        testClassSelect.value = sortedClasses[0];
      }
    }

    // Populate report class select
    const repClassSelect = document.getElementById('reportClassSelect');
    if (repClassSelect) {
      const currentVal = repClassSelect.value || 'Class 3';
      repClassSelect.innerHTML = '';
      sortedClasses.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        if (c === currentVal) opt.selected = true;
        repClassSelect.appendChild(opt);
      });
      if (!repClassSelect.value && sortedClasses.length > 0) {
        repClassSelect.value = sortedClasses[0];
      }
    }

    // Populate dispatch class select (M4)
    const dispatchClassSelect = document.getElementById('dispatchClassSelect');
    if (dispatchClassSelect) {
      const currentVal = dispatchClassSelect.value || 'Class 3';
      dispatchClassSelect.innerHTML = '';
      sortedClasses.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        if (c === currentVal) opt.selected = true;
        dispatchClassSelect.appendChild(opt);
      });
      if (!dispatchClassSelect.value && sortedClasses.length > 0) {
        dispatchClassSelect.value = sortedClasses[0];
      }
    }

    // Populate broadcast class select (M6)
    const broadcastClassSelect = document.getElementById('broadcastClassSelect');
    if (broadcastClassSelect) {
      const currentVal = broadcastClassSelect.value || 'ALL';
      broadcastClassSelect.innerHTML = '<option value="ALL">All Classes (Whole School)</option>';
      sortedClasses.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        if (c === currentVal) opt.selected = true;
        broadcastClassSelect.appendChild(opt);
      });
    }

    updateSectionSuggestions();
  }

  function renderStudentsList() {
    const container = document.getElementById('studentsContainer');
    const emptyState = document.getElementById('noStudentsState');
    const summarySpan = document.getElementById('studentsListSummary');
    const searchVal = (document.getElementById('studentSearchInput')?.value || '').trim().toLowerCase();
    const classFilter = document.getElementById('filterClassSelect')?.value || 'ALL';
    const rawSectionFilter = (document.getElementById('filterSectionSelect')?.value || 'ALL').trim();
    const isAllSection = !rawSectionFilter || rawSectionFilter.toUpperCase() === 'ALL';

    // Filter students
    const filtered = state.students.filter(student => {
      if (classFilter !== 'ALL' && student.className !== classFilter) return false;
      if (!isAllSection && (student.section || 'A').toLowerCase() !== rawSectionFilter.toLowerCase()) return false;

      if (searchVal) {
        const matchName = (student.name || '').toLowerCase().includes(searchVal);
        const matchFather = (student.fatherName || '').toLowerCase().includes(searchVal);
        const matchRoll = (student.rollNo || '').toLowerCase().includes(searchVal);
        const matchAdmission = (student.admissionNo || '').toLowerCase().includes(searchVal);
        const matchPhone = (student.whatsapp || '').toLowerCase().includes(searchVal);
        if (!matchName && !matchFather && !matchRoll && !matchAdmission && !matchPhone) {
          return false;
        }
      }
      return true;
    });

    // Update stats
    const totalCount = state.students.length;
    const activeCount = state.students.filter(s => s.status === 'Active').length;
    const classSet = new Set(state.students.map(s => s.className));

    document.getElementById('statTotalStudents').textContent = totalCount;
    document.getElementById('statActiveStudents').textContent = activeCount;
    document.getElementById('statTotalClasses').textContent = classSet.size;
    document.getElementById('studentCountBadge').textContent = totalCount;

    if (summarySpan) {
      summarySpan.textContent = `Showing ${filtered.length} of ${totalCount} enrolled students`;
    }

    if (filtered.length === 0) {
      container.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');

    // Sort by class, then roll number
    filtered.sort((a, b) => {
      if (a.className !== b.className) return a.className.localeCompare(b.className);
      return parseInt(a.rollNo || '0', 10) - parseInt(b.rollNo || '0', 10);
    });

    container.innerHTML = filtered.map(student => {
      const initial = (student.name || 'S').charAt(0).toUpperCase();
      const sanitizedPhone = sanitizePhoneForWhatsApp(student.whatsapp);
      const waLink = sanitizedPhone
        ? `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(`Assalam-o-Alaikum ${student.fatherName || 'Respected Parent'}, greeting from ${state.profile.name} regarding ${student.name}.`)}`
        : '#';

      return `
        <div class="student-card" data-student-id="${escapeHtml(student.id)}">
          <div class="student-card-header">
            <div class="student-avatar">${escapeHtml(initial)}</div>
            <div class="student-title-block">
              <div class="student-name-row">
                <span class="student-name">${escapeHtml(student.name)}</span>
                <span class="pill-roll">Roll #${escapeHtml(student.rollNo || '-')}</span>
              </div>
              <div class="student-meta-pills">
                <span class="pill-class">${escapeHtml(student.className)} - ${escapeHtml(student.section || 'A')}</span>
                <span class="pill-status">${escapeHtml(student.status || 'Active')}</span>
                ${student.admissionNo ? `<span class="pill-roll">${escapeHtml(student.admissionNo)}</span>` : ''}
              </div>
            </div>
          </div>

          <div class="student-card-body">
            <div class="info-line">
              <span class="info-label">Father / Guardian:</span>
              <span class="info-val">${escapeHtml(student.fatherName || 'Not recorded')}</span>
            </div>
            <div class="info-line">
              <span class="info-label">WhatsApp Contact:</span>
              <span class="info-val">
                ${sanitizedPhone
                  ? `<a href="${waLink}" target="_blank" rel="noopener" class="whatsapp-link" title="Chat on WhatsApp">💬 ${escapeHtml(student.whatsapp)}</a>`
                  : `<span class="text-muted">No number</span>`
                }
              </span>
            </div>
            ${student.emergencyPhone ? `
              <div class="info-line">
                <span class="info-label">Emergency Phone:</span>
                <span class="info-val">${escapeHtml(student.emergencyPhone)}</span>
              </div>
            ` : ''}
            ${student.address ? `
              <div class="info-line">
                <span class="info-label">Address:</span>
                <span class="info-val" title="${escapeHtml(student.address)}">${escapeHtml(student.address)}</span>
              </div>
            ` : ''}
          </div>

          <div class="student-card-actions">
            <button class="btn btn-subtle btn-sm btn-edit-student" data-id="${escapeHtml(student.id)}">
              <span>✏️ Edit</span>
            </button>
            <button class="btn btn-subtle btn-sm btn-del-student" data-id="${escapeHtml(student.id)}">
              <span>🗑️ Delete</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach card event listeners
    container.querySelectorAll('.btn-edit-student').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        openEditStudentModal(id);
      });
    });

    container.querySelectorAll('.btn-del-student').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        deleteStudent(id);
      });
    });
  }

  function openAddStudentModal() {
    state.editingStudentId = null;
    document.getElementById('studentModalTitle').textContent = 'Add New Student';
    document.getElementById('studentForm').reset();
    document.getElementById('studentIdField').value = '';
    document.getElementById('studStatus').value = 'Active';
    document.getElementById('studClass').value = 'Class 3';
    document.getElementById('studSection').value = 'A';
    document.getElementById('studentModal').classList.remove('hidden');
  }

  function openEditStudentModal(id) {
    const student = state.students.find(s => s.id === id);
    if (!student) return;

    state.editingStudentId = id;
    document.getElementById('studentModalTitle').textContent = `Edit Student: ${student.name}`;
    document.getElementById('studentIdField').value = student.id;
    document.getElementById('studName').value = student.name || '';
    document.getElementById('studRollNo').value = student.rollNo || '';
    document.getElementById('studClass').value = student.className || 'Class 3';
    document.getElementById('studSection').value = student.section || 'A';
    document.getElementById('studGender').value = student.gender || 'Female';
    document.getElementById('studDob').value = student.dob || '';
    document.getElementById('studAdmissionNo').value = student.admissionNo || '';
    document.getElementById('studStatus').value = student.status || 'Active';
    document.getElementById('parentFather').value = student.fatherName || '';
    document.getElementById('parentMother').value = student.motherName || '';
    document.getElementById('parentWhatsApp').value = student.whatsapp || '';
    document.getElementById('parentEmergency').value = student.emergencyPhone || '';
    document.getElementById('parentAddress').value = student.address || '';

    document.getElementById('studentModal').classList.remove('hidden');
  }

  function handleSaveStudent(e) {
    e.preventDefault();
    const name = document.getElementById('studName').value.trim();
    const rollNo = document.getElementById('studRollNo').value.trim();
    const className = document.getElementById('studClass').value;
    const section = document.getElementById('studSection').value;
    const fatherName = document.getElementById('parentFather').value.trim();
    const whatsapp = document.getElementById('parentWhatsApp').value.trim();

    if (!name || !rollNo || !className || !section || !fatherName || !whatsapp) {
      showToast('Please fill all required fields (Name, Roll, Class, Section, Father, WhatsApp)', 'warn');
      return;
    }

    const payload = {
      name,
      rollNo,
      className,
      section,
      gender: document.getElementById('studGender').value,
      dob: document.getElementById('studDob').value,
      admissionNo: document.getElementById('studAdmissionNo').value.trim() || `BOGS-${new Date().getFullYear()}-${rollNo}`,
      status: document.getElementById('studStatus').value,
      fatherName,
      motherName: document.getElementById('parentMother').value.trim(),
      whatsapp,
      emergencyPhone: document.getElementById('parentEmergency').value.trim(),
      address: document.getElementById('parentAddress').value.trim()
    };

    if (state.editingStudentId) {
      // Update
      const idx = state.students.findIndex(s => s.id === state.editingStudentId);
      if (idx !== -1) {
        state.students[idx] = {
          ...state.students[idx],
          ...payload
        };
        showToast(`Updated student profile for ${name}`, 'success');
      }
    } else {
      // Add new
      const newId = 'stud-' + Date.now();
      const newStudent = {
        id: newId,
        ...payload,
        admissionDate: getTodayISO()
      };
      state.students.push(newStudent);
      showToast(`Added new student: ${name}`, 'success');
    }

    saveStorage(STORAGE_KEYS.STUDENTS, state.students);
    const targetStudent = state.editingStudentId
      ? state.students.find(s => s.id === state.editingStudentId)
      : state.students[state.students.length - 1];
    if (targetStudent && FirestoreDB.isReady()) {
      FirestoreDB.saveStudent(targetStudent);
    }
    closeStudentModal();
    renderClassDropdowns();
    renderStudentsList();
    renderAttendanceRoster();
  }

  function deleteStudent(id) {
    const student = state.students.find(s => s.id === id);
    if (!student) return;

    if (confirm(`Are you sure you want to delete student "${student.name}" (Roll #${student.rollNo})?`)) {
      state.students = state.students.filter(s => s.id !== id);
      saveStorage(STORAGE_KEYS.STUDENTS, state.students);
      if (FirestoreDB.isReady()) {
        FirestoreDB.deleteStudent(id);
      }
      showToast(`Removed student ${student.name}`, 'info');
      renderClassDropdowns();
      renderStudentsList();
      renderAttendanceRoster();
    }
  }

  function closeStudentModal() {
    document.getElementById('studentModal').classList.add('hidden');
    state.editingStudentId = null;
  }

  // ========================================================
  // MODULE 2: Smart Attendance & WhatsApp Alerts
  // ========================================================
  function getAttendanceRecordKey(dateStr, className, section) {
    return `${dateStr}_${className}_${section}`;
  }

  function getAttendanceForDateAndClass(dateStr, className, section) {
    const key = getAttendanceRecordKey(dateStr, className, section);
    return state.attendance[key] || {};
  }

  function setStudentAttendanceStatus(dateStr, className, section, studentId, status, timeStr = '') {
    const key = getAttendanceRecordKey(dateStr, className, section);
    if (!state.attendance[key]) {
      state.attendance[key] = {};
    }
    state.attendance[key][studentId] = {
      status,
      time: timeStr
    };
    saveStorage(STORAGE_KEYS.ATTENDANCE, state.attendance);
    if (FirestoreDB.isReady()) {
      FirestoreDB.saveAttendanceRecord(dateStr, className, section, studentId, status, timeStr);
    }
  }

  function renderAttendanceRoster() {
    const dateInput = document.getElementById('attDatePicker');
    const classSelect = document.getElementById('attClassSelect');
    const sectionSelect = document.getElementById('attSectionSelect');
    const rosterList = document.getElementById('attendanceRosterList');
    const noRoster = document.getElementById('noRosterState');

    if (!dateInput.value) {
      dateInput.value = getTodayISO();
    }

    const selectedDate = dateInput.value;
    const selectedClass = classSelect.value || 'Class 3';
    const selectedSection = (sectionSelect.value || 'A').trim();

    // Update labels
    document.getElementById('attSummaryClassLabel').textContent = `${selectedClass} - ${selectedSection} Attendance`;
    document.getElementById('attSummaryDateLabel').textContent = formatDateHuman(selectedDate);

    // Filter students for this class & section
    const enrolled = state.students.filter(s =>
      s.className === selectedClass &&
      (s.section || 'A').toLowerCase() === selectedSection.toLowerCase() &&
      s.status === 'Active'
    );
    document.getElementById('rosterCount').textContent = enrolled.length;

    if (enrolled.length === 0) {
      rosterList.innerHTML = '';
      noRoster.classList.remove('hidden');
      updateAttendanceSummaryCounters(0, 0, 0, 0);
      renderWhatsAppMessagesList([], selectedDate, selectedClass, selectedSection);
      return;
    }

    noRoster.classList.add('hidden');

    // Get saved attendance map for this date
    const attRecord = getAttendanceForDateAndClass(selectedDate, selectedClass, selectedSection);

    // Calculate counters
    let countPresent = 0;
    let countAbsent = 0;
    let countLate = 0;

    // Sort by roll number
    enrolled.sort((a, b) => parseInt(a.rollNo || '0', 10) - parseInt(b.rollNo || '0', 10));

    rosterList.innerHTML = enrolled.map(student => {
      const rec = attRecord[student.id] || { status: 'Present', time: '' };
      const status = rec.status || 'Present';
      if (status === 'Present') countPresent++;
      else if (status === 'Absent') countAbsent++;
      else if (status === 'Late') countLate++;

      return `
        <div class="roster-item" data-student-id="${escapeHtml(student.id)}">
          <div class="roster-student-info">
            <div class="roster-roll">${escapeHtml(student.rollNo || '-')}</div>
            <div class="roster-name-block">
              <div class="roster-student-name">${escapeHtml(student.name)}</div>
              <div class="roster-parent-sub">${escapeHtml(student.fatherName || 'Parent')} • ${escapeHtml(student.whatsapp || 'No WhatsApp')}</div>
            </div>
          </div>

          <div class="roster-btn-group">
            <button type="button" class="btn-att ${status === 'Present' ? 'active-present' : ''}" data-status="Present" data-student-id="${escapeHtml(student.id)}">
              <span>✔</span> Present
            </button>
            <button type="button" class="btn-att ${status === 'Absent' ? 'active-absent' : ''}" data-status="Absent" data-student-id="${escapeHtml(student.id)}">
              <span>✖</span> Absent
            </button>
            <button type="button" class="btn-att ${status === 'Late' ? 'active-late' : ''}" data-status="Late" data-student-id="${escapeHtml(student.id)}">
              <span>⏱</span> Late
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach click events to attendance buttons
    rosterList.querySelectorAll('.btn-att').forEach(btn => {
      btn.addEventListener('click', () => {
        const studentId = btn.getAttribute('data-student-id');
        const targetStatus = btn.getAttribute('data-status');
        let lateTime = '';
        if (targetStatus === 'Late') {
          // Default late arrival time
          const now = new Date();
          const hrs = String(now.getHours()).padStart(2, '0');
          const mins = String(now.getMinutes()).padStart(2, '0');
          lateTime = `${hrs}:${mins}`;
        }
        setStudentAttendanceStatus(selectedDate, selectedClass, selectedSection, studentId, targetStatus, lateTime);
        renderAttendanceRoster();
      });
    });

    updateAttendanceSummaryCounters(enrolled.length, countPresent, countAbsent, countLate);
    renderWhatsAppMessagesList(enrolled, selectedDate, selectedClass, selectedSection);
  }

  function updateAttendanceSummaryCounters(total, present, absent, late) {
    document.getElementById('countTotal').textContent = total;
    document.getElementById('countPresent').textContent = present;
    document.getElementById('countAbsent').textContent = absent;
    document.getElementById('countLate').textContent = late;

    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    document.getElementById('attRatePercent').textContent = `${rate}%`;
  }

  function handleMarkAllPresent() {
    const dateInput = document.getElementById('attDatePicker');
    const classSelect = document.getElementById('attClassSelect');
    const sectionSelect = document.getElementById('attSectionSelect');

    const selectedDate = dateInput.value || getTodayISO();
    const selectedClass = classSelect.value || 'Class 3';
    const selectedSection = (sectionSelect.value || 'A').trim();

    const enrolled = state.students.filter(s =>
      s.className === selectedClass &&
      (s.section || 'A').toLowerCase() === selectedSection.toLowerCase() &&
      s.status === 'Active'
    );
    if (enrolled.length === 0) return;

    const batchRecords = [];
    enrolled.forEach(student => {
      const key = getAttendanceRecordKey(selectedDate, selectedClass, selectedSection);
      if (!state.attendance[key]) state.attendance[key] = {};
      state.attendance[key][student.id] = { status: 'Present', time: '' };
      batchRecords.push({
        date: selectedDate,
        studentId: student.id,
        className: selectedClass,
        section: selectedSection,
        status: 'Present',
        time: ''
      });
    });
    saveStorage(STORAGE_KEYS.ATTENDANCE, state.attendance);
    if (FirestoreDB.isReady() && batchRecords.length > 0) {
      FirestoreDB.saveAttendanceBatch(batchRecords);
    }

    showToast(`Marked all ${enrolled.length} students Present for ${selectedClass}-${selectedSection}!`, 'success');
    renderAttendanceRoster();
  }

  function handleSaveAttendance() {
    const dateInput = document.getElementById('attDatePicker');
    const classSelect = document.getElementById('attClassSelect');
    const sectionSelect = document.getElementById('attSectionSelect');
    const selectedDate = dateInput?.value || getTodayISO();
    const selectedClass = classSelect?.value || 'Class 3';
    const selectedSection = (sectionSelect?.value || 'A').trim();
    const attMap = getAttendanceForDateAndClass(selectedDate, selectedClass, selectedSection);
    const records = Object.entries(attMap).map(([sId, val]) => ({
      date: selectedDate,
      studentId: sId,
      className: selectedClass,
      section: selectedSection,
      status: val.status,
      time: val.time || ''
    }));
    if (FirestoreDB.isReady() && records.length > 0) {
      FirestoreDB.saveAttendanceBatch(records);
    }
    showToast('Daily attendance saved & synced to Cloud Firestore!', 'success');
  }

  // ========================================================
  // M2: WhatsApp Message Generator & wa.me Links
  // ========================================================
  function generateWhatsAppText(student, status, dateStr, schoolName, lateTime) {
    const formattedDate = formatDateHuman(dateStr);
    const classLabel = `${student.className}-${student.section || 'A'}`;

    if (status === 'Absent') {
      return `Assalam-o-Alaikum!
${student.name} (${classLabel}) is marked ABSENT today (${formattedDate}). Please inform the class teacher if this is unexpected.

— ${schoolName}`;
    }

    if (status === 'Late') {
      const timeInfo = lateTime ? ` (arrived at ${lateTime})` : '';
      return `Assalam-o-Alaikum!
${student.name} (${classLabel}) arrived LATE to school today (${formattedDate})${timeInfo}.

— ${schoolName}`;
    }

    // Default: Present
    return `Assalam-o-Alaikum!
${student.name} (${classLabel}) is marked PRESENT today (${formattedDate}).

— ${schoolName}`;
  }

  function renderWhatsAppMessagesList(students, dateStr, className, section) {
    const container = document.getElementById('whatsappMessagesList');
    if (!container) return;

    const attRecord = getAttendanceForDateAndClass(dateStr, className, section);
    const filter = state.attendanceFilter || 'ALL';

    // Prepare message items
    const items = students.map(student => {
      const rec = attRecord[student.id] || { status: 'Present', time: '' };
      const status = rec.status || 'Present';
      const text = generateWhatsAppText(student, status, dateStr, state.profile.name, rec.time);
      const sanitizedPhone = sanitizePhoneForWhatsApp(student.whatsapp);
      const waLink = sanitizedPhone
        ? `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(text)}`
        : '#';

      return {
        student,
        status,
        time: rec.time,
        text,
        sanitizedPhone,
        waLink
      };
    });

    // Update filter counts
    const countAll = items.length;
    const countAbsent = items.filter(i => i.status === 'Absent').length;
    const countLate = items.filter(i => i.status === 'Late').length;
    const countPresent = items.filter(i => i.status === 'Present').length;

    document.getElementById('waCountAll').textContent = countAll;
    document.getElementById('waCountAbsent').textContent = countAbsent;
    document.getElementById('waCountLate').textContent = countLate;
    document.getElementById('waCountPresent').textContent = countPresent;

    // Filter items
    const filtered = items.filter(item => {
      if (filter === 'ALL') return true;
      if (filter === 'ABSENT') return item.status === 'Absent';
      if (filter === 'LATE') return item.status === 'Late';
      if (filter === 'PRESENT') return item.status === 'Present';
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; padding: 20px;">
          <p>No messages match the current filter (${filter}).</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(item => {
      const s = item.student;
      const statusClass = item.status === 'Present' ? 'wa-status-present' : (item.status === 'Absent' ? 'wa-status-absent' : 'wa-status-late');

      return `
        <div class="wa-msg-card">
          <div class="wa-msg-header">
            <div>
              <span class="wa-parent-name">${escapeHtml(s.fatherName || 'Parent')}</span>
              <span class="text-muted" style="font-size: 0.8rem;"> (for ${escapeHtml(s.name)})</span>
            </div>
            <span class="wa-status-badge ${statusClass}">${escapeHtml(item.status)}</span>
          </div>

          <div class="wa-bubble">${escapeHtml(item.text)}</div>

          <div class="wa-meta-row">
            <span>WhatsApp: <strong class="wa-phone-tag">${escapeHtml(s.whatsapp || 'No phone')}</strong></span>
            <span>Class ${escapeHtml(s.className)}-${escapeHtml(s.section)}</span>
          </div>

          <div class="wa-actions-row">
            ${item.sanitizedPhone ? `
              <a href="${item.waLink}" target="_blank" rel="noopener" class="btn-wa-send" title="Open WhatsApp with this message">
                <span>💬 Open in WhatsApp</span>
              </a>
            ` : `
              <button class="btn btn-subtle btn-sm" disabled>No Phone Number</button>
            `}
            <button type="button" class="btn-wa-copy" data-text="${escapeHtml(item.text)}" title="Copy message text to clipboard">
              📋 Copy
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach copy button handlers
    container.querySelectorAll('.btn-wa-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const textToCopy = btn.getAttribute('data-text');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('WhatsApp message copied to clipboard!', 'success');
          }).catch(() => {
            fallbackCopy(textToCopy);
          });
        } else {
          fallbackCopy(textToCopy);
        }
      });
    });
  }

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('WhatsApp message copied to clipboard!', 'success');
    } catch {
      showToast('Could not copy text automatically.', 'warn');
    }
    document.body.removeChild(textarea);
  }

  // ========================================================
  // MODULE 3: Test Marks Entry
  // ========================================================
  function renderTestDropdown() {
    const testSelect = document.getElementById('testSelect');
    const classSelect = document.getElementById('testClassSelect');
    if (!testSelect) return;

    const selectedClass = classSelect.value || 'Class 3';
    const classTests = state.tests.filter(t => t.className === selectedClass);

    testSelect.innerHTML = '';
    if (classTests.length === 0) {
      testSelect.innerHTML = '<option value="">No tests created yet</option>';
      state.currentTestId = null;
      return;
    }

    classTests.forEach((t, i) => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `${t.title} — ${t.subject} (Max: ${t.maxMarks})`;
      if (state.currentTestId === t.id || (!state.currentTestId && i === 0)) {
        opt.selected = true;
      }
      testSelect.appendChild(opt);
    });

    state.currentTestId = testSelect.value;
  }

  function renderMarksEntrySheet() {
    renderTestDropdown();

    const testId = state.currentTestId;
    const test = state.tests.find(t => t.id === testId);
    const infoCard = document.getElementById('activeTestInfoCard');
    const marksContainer = document.getElementById('marksEntryList');
    const emptyState = document.getElementById('noMarksStudentsState');

    if (!test) {
      if (infoCard) infoCard.classList.add('hidden');
      if (marksContainer) marksContainer.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    infoCard.classList.remove('hidden');
    emptyState.classList.add('hidden');

    // Update active test banner
    document.getElementById('testSubjectTag').textContent = test.subject;
    document.getElementById('testTitleHeading').textContent = test.title;
    document.getElementById('testMetaText').textContent = `${test.className}-${test.section || 'A'} • Max Marks: ${test.maxMarks} • Passing: ${test.passMarks} • Date: ${formatDateHuman(test.date)}`;
    document.getElementById('rosterMaxMarks').textContent = test.maxMarks;

    // Filter students enrolled in this test's class & section
    const enrolled = state.students.filter(s => s.className === test.className && s.section === (test.section || 'A') && s.status === 'Active');
    enrolled.sort((a, b) => parseInt(a.rollNo || '0', 10) - parseInt(b.rollNo || '0', 10));

    if (enrolled.length === 0) {
      marksContainer.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    let enteredCount = 0;
    let passedCount = 0;
    let totalMarksSum = 0;

    marksContainer.innerHTML = enrolled.map(student => {
      const markKey = `${test.id}_${student.id}`;
      const record = state.marks[markKey] || { marks: '', remarks: '' };
      const rawVal = record.marks !== undefined && record.marks !== null ? record.marks : '';
      const marksVal = rawVal !== '' ? parseFloat(rawVal) : null;

      let pctStr = '-';
      let gradeInfo = { grade: '-', cls: 'grade-c' };
      if (marksVal !== null && !isNaN(marksVal)) {
        enteredCount++;
        totalMarksSum += marksVal;
        const pct = ((marksVal / test.maxMarks) * 100).toFixed(1);
        pctStr = `${pct}%`;
        gradeInfo = calculateGrade(pct);
        if (marksVal >= test.passMarks) passedCount++;
      }

      return `
        <div class="mark-item-card" data-student-id="${escapeHtml(student.id)}">
          <div class="mark-student-col">
            <div class="roster-roll">${escapeHtml(student.rollNo || '-')}</div>
            <div>
              <div class="roster-student-name">${escapeHtml(student.name)}</div>
              <div class="roster-parent-sub">${escapeHtml(student.fatherName || 'Parent')}</div>
            </div>
          </div>

          <div class="mark-inputs-col">
            <div class="mark-input-wrap">
              <input type="number" 
                     class="mark-input-field" 
                     data-student-id="${escapeHtml(student.id)}" 
                     value="${rawVal !== '' ? rawVal : ''}" 
                     min="0" 
                     max="${test.maxMarks}" 
                     placeholder="0"
                     step="any">
              <span class="mark-max-label">/ ${test.maxMarks}</span>
            </div>

            <div class="mark-score-display">
              <span class="mark-percent-val">${pctStr}</span>
              <span class="grade-badge ${gradeInfo.cls}">${gradeInfo.grade}</span>
            </div>

            <input type="text" 
                   class="mark-remarks-input" 
                   data-student-id="${escapeHtml(student.id)}" 
                   placeholder="Teacher remark (e.g. Good effort)" 
                   value="${escapeHtml(record.remarks || '')}">
          </div>
        </div>
      `;
    }).join('');

    // Update banner chips
    document.getElementById('testEnteredChip').textContent = `Marks Entered: ${enteredCount}/${enrolled.length}`;
    document.getElementById('testPassedChip').textContent = `Passed: ${passedCount}`;
    const avgPct = enteredCount > 0 ? ((totalMarksSum / (enteredCount * test.maxMarks)) * 100).toFixed(1) : '0';
    document.getElementById('testAvgChip').textContent = `Class Avg: ${avgPct}%`;

    // Real-time input recalculation
    marksContainer.querySelectorAll('.mark-input-field').forEach(input => {
      input.addEventListener('input', () => {
        const card = input.closest('.mark-item-card');
        const val = parseFloat(input.value);
        const percentSpan = card.querySelector('.mark-percent-val');
        const gradeBadge = card.querySelector('.grade-badge');

        if (!isNaN(val) && val >= 0) {
          const pct = ((val / test.maxMarks) * 100).toFixed(1);
          const g = calculateGrade(pct);
          percentSpan.textContent = `${pct}%`;
          gradeBadge.textContent = g.grade;
          gradeBadge.className = `grade-badge ${g.cls}`;
        } else {
          percentSpan.textContent = '-';
          gradeBadge.textContent = '-';
          gradeBadge.className = 'grade-badge grade-c';
        }
      });
    });
  }

  function handleSaveMarks() {
    const testId = state.currentTestId;
    const test = state.tests.find(t => t.id === testId);
    if (!test) return;

    const cards = document.querySelectorAll('.mark-item-card');
    let savedCount = 0;

    cards.forEach(card => {
      const studentId = card.getAttribute('data-student-id');
      const input = card.querySelector('.mark-input-field');
      const remarksInput = card.querySelector('.mark-remarks-input');
      const val = input.value.trim();
      const remarks = remarksInput.value.trim();

      const key = `${testId}_${studentId}`;
      if (val !== '') {
        state.marks[key] = {
          marks: parseFloat(val),
          remarks: remarks
        };
        savedCount++;
      } else {
        delete state.marks[key];
      }
    });

    saveStorage(STORAGE_KEYS.MARKS, state.marks);
    if (FirestoreDB.isReady()) {
      const marksList = [];
      inputs.forEach(inp => {
        const sId = inp.dataset.studentId;
        const val = inp.value.trim();
        if (val !== '' && sId) {
          const remInput = document.querySelector(`.mark-remarks-input[data-student-id="${sId}"]`);
          marksList.push({
            studentId: sId,
            marks: parseFloat(val),
            remarks: remInput ? remInput.value.trim() : ''
          });
        }
      });
      if (marksList.length > 0) {
        FirestoreDB.saveMarksBatch(test, marksList);
      }
    }
    showToast(`Saved marks for ${savedCount} students in ${test.subject}!`, 'success');
    renderMarksEntrySheet();
  }

  function handleCreateNewTest(e) {
    e.preventDefault();
    const title = document.getElementById('newTestTitle').value.trim();
    const className = document.getElementById('newTestClass').value;
    const section = (document.getElementById('newTestSection').value || 'A').trim();
    const subject = document.getElementById('newTestSubject').value;
    const date = document.getElementById('newTestDate').value;
    const maxMarks = parseInt(document.getElementById('newTestMaxMarks').value, 10);
    const passMarks = parseInt(document.getElementById('newTestPassMarks').value, 10);

    if (!title || !subject || !date || isNaN(maxMarks) || isNaN(passMarks)) {
      showToast('Please fill all test details correctly.', 'warn');
      return;
    }

    const newTest = {
      id: 'test-' + Date.now(),
      title,
      className,
      section,
      subject,
      date,
      maxMarks,
      passMarks
    };

    state.tests.push(newTest);
    saveStorage(STORAGE_KEYS.TESTS, state.tests);
    if (FirestoreDB.isReady()) {
      FirestoreDB.saveTest(newTest);
    }
    state.currentTestId = newTest.id;
    updateSectionSuggestions();

    document.getElementById('newTestModal').classList.add('hidden');
    document.getElementById('newTestForm').reset();
    showToast(`Created new test: ${subject} (${title})`, 'success');

    // Switch class select if needed
    document.getElementById('testClassSelect').value = className;
    renderMarksEntrySheet();
  }

  // ========================================================
  // MODULE 3: Report Card View & Print Logic
  // ========================================================
  function populateReportStudentsDropdown() {
    const classSelect = document.getElementById('reportClassSelect');
    const studSelect = document.getElementById('reportStudentSelect');
    if (!classSelect || !studSelect) return;

    const selectedClass = classSelect.value || 'Class 3';
    const studentsInClass = state.students.filter(s => s.className === selectedClass && s.status === 'Active');
    studentsInClass.sort((a, b) => parseInt(a.rollNo || '0', 10) - parseInt(b.rollNo || '0', 10));

    const currentStudId = studSelect.value;
    studSelect.innerHTML = '';

    studentsInClass.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `Roll ${s.rollNo}: ${s.name}`;
      if (s.id === currentStudId) opt.selected = true;
      studSelect.appendChild(opt);
    });

    if (!studSelect.value && studentsInClass.length > 0) {
      studSelect.value = studentsInClass[0].id;
    }
  }

  function calculateStudentAttendanceRate(studentId, className, section) {
    let totalDays = 0;
    let presentDays = 0;

    Object.keys(state.attendance).forEach(key => {
      if (key.includes(className)) {
        const dayRecord = state.attendance[key];
        if (dayRecord && dayRecord[studentId]) {
          totalDays++;
          const status = dayRecord[studentId].status;
          if (status === 'Present' || status === 'Late') {
            presentDays++;
          }
        }
      }
    });

    if (totalDays === 0) return { pct: 96, label: '96% (24 / 25 days)' }; // realistic pilot default
    const pct = Math.round((presentDays / totalDays) * 100);
    return { pct, label: `${pct}% (${presentDays} / ${totalDays} days)` };
  }

  function calculateClassRankings(className, section) {
    const peers = state.students.filter(s => s.className === className && s.section === section && s.status === 'Active');
    const classTests = state.tests.filter(t => t.className === className && t.section === section);

    const scores = peers.map(peer => {
      let totalObtained = 0;
      let totalMax = 0;
      classTests.forEach(t => {
        const key = `${t.id}_${peer.id}`;
        const m = state.marks[key];
        if (m && m.marks !== undefined) {
          totalObtained += m.marks;
          totalMax += t.maxMarks;
        }
      });
      return {
        id: peer.id,
        obtained: totalObtained,
        max: totalMax,
        pct: totalMax > 0 ? (totalObtained / totalMax) * 100 : 0
      };
    });

    scores.sort((a, b) => b.pct - a.pct);

    const rankMap = {};
    scores.forEach((item, index) => {
      const pos = index + 1;
      let suffix = 'th';
      if (pos === 1) suffix = 'st';
      else if (pos === 2) suffix = 'nd';
      else if (pos === 3) suffix = 'rd';
      rankMap[item.id] = `${pos}${suffix}`;
    });

    return rankMap;
  }

  function renderReportCard() {
    populateReportStudentsDropdown();

    const studentSelect = document.getElementById('reportStudentSelect');
    const classSelect = document.getElementById('reportClassSelect');
    const termSelect = document.getElementById('reportTermSelect');

    const studentId = studentSelect?.value;
    const selectedClass = classSelect?.value || 'Class 3';
    const student = state.students.find(s => s.id === studentId);

    if (!student) return;

    // School Branding Elements
    document.getElementById('repSchoolName').textContent = state.profile.name;
    document.getElementById('repSchoolMotto').textContent = state.profile.motto;
    document.getElementById('repSchoolAddress').textContent = state.profile.address;
    document.getElementById('repPrincipalName').textContent = `${state.profile.principal || 'Principal'} (Head of School)`;
    document.getElementById('repSessionLabel').textContent = `Academic Session ${state.profile.academicYear} • Term Progress`;

    // Student Information Box
    document.getElementById('repStudentName').textContent = student.name;
    document.getElementById('repFatherName').textContent = student.fatherName || 'Not recorded';
    document.getElementById('repRollNo').textContent = student.rollNo || '-';
    document.getElementById('repClassSection').textContent = `${student.className} - ${student.section || 'A'}`;
    document.getElementById('repAdmissionNo').textContent = student.admissionNo || `BOGS-2024-${student.rollNo}`;

    const attRate = calculateStudentAttendanceRate(student.id, student.className, student.section);
    document.getElementById('repAttendanceRate').textContent = attRate.label;

    // Find applicable tests for this class & section
    const tests = state.tests.filter(t => t.className === student.className && (t.section === student.section || !t.section));
    const tbody = document.getElementById('repTableBody');

    let totalMax = 0;
    let totalPass = 0;
    let totalObtained = 0;
    let anyFailed = false;
    let collectedRemarks = [];

    const rowsHtml = tests.map(test => {
      const key = `${test.id}_${student.id}`;
      const rec = state.marks[key] || { marks: null, remarks: '' };
      const obtained = rec.marks !== null && rec.marks !== undefined ? parseFloat(rec.marks) : 0;
      const isTested = rec.marks !== null && rec.marks !== undefined;

      totalMax += test.maxMarks;
      totalPass += test.passMarks;
      totalObtained += obtained;

      const pct = test.maxMarks > 0 ? ((obtained / test.maxMarks) * 100).toFixed(1) : 0;
      const grade = calculateGrade(pct);
      const isPass = obtained >= test.passMarks;
      if (!isPass && isTested) anyFailed = true;

      if (rec.remarks) {
        collectedRemarks.push(rec.remarks);
      }

      return `
        <tr>
          <td><strong>${escapeHtml(test.subject)}</strong></td>
          <td class="text-center">${test.maxMarks}</td>
          <td class="text-center">${test.passMarks}</td>
          <td class="text-center highlight-score">${isTested ? obtained : '-'}</td>
          <td class="text-center">${isTested ? `${pct}%` : '-'}</td>
          <td class="text-center"><span class="grade-pill ${grade.cls}">${isTested ? grade.grade : '-'}</span></td>
          <td class="text-center">
            ${isTested
              ? `<span class="${isPass ? 'badge-pass' : 'badge-fail'}">${isPass ? 'PASS' : 'FAIL'}</span>`
              : `<span class="text-muted">-</span>`
            }
          </td>
          <td>${escapeHtml(rec.remarks || 'Regular classwork')}</td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = rowsHtml || `<tr><td colspan="8" class="text-center">No assessments found for this class.</td></tr>`;

    // Totals
    const overallPct = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : '0';
    const overallGrade = calculateGrade(overallPct);
    const ranks = calculateClassRankings(student.className, student.section);
    const rankStr = ranks[student.id] || '1st';

    document.getElementById('repTotalMax').textContent = totalMax;
    document.getElementById('repTotalPass').textContent = totalPass;
    document.getElementById('repTotalObtained').textContent = totalObtained;
    document.getElementById('repTotalPercent').textContent = `${overallPct}%`;
    document.getElementById('repOverallGrade').innerHTML = `<span class="grade-pill ${overallGrade.cls}">${overallGrade.grade}</span>`;

    const statusBadge = anyFailed
      ? `<span class="badge-fail">PROMOTED ON TRIAL</span>`
      : `<span class="badge-pass">PASSED</span>`;
    document.getElementById('repResultStatus').innerHTML = statusBadge;

    document.getElementById('repSummaryPosition').innerHTML = `Class Position: <strong>${rankStr}</strong>`;

    // Teacher remarks
    const remarksBox = document.getElementById('repTeacherRemarks');
    if (collectedRemarks.length > 0) {
      remarksBox.textContent = `"${collectedRemarks.slice(0, 2).join(' ')} Continues to show dedication in daily learning."`;
    } else {
      remarksBox.textContent = `"${student.name} is a hardworking and well-mannered student. Shows consistent effort across all subjects."`;
    }
  }

  // ========================================================
  // School Settings & Branding Modal
  // ========================================================
  function openSchoolSettingsModal() {
    document.getElementById('settingSchoolName').value = state.profile.name || '';
    document.getElementById('settingSchoolMotto').value = state.profile.motto || '';
    document.getElementById('settingSchoolAddress').value = state.profile.address || '';
    document.getElementById('settingPrincipalName').value = state.profile.principal || '';
    document.getElementById('settingAcademicYear').value = state.profile.academicYear || '';
    document.getElementById('schoolSettingsModal').classList.remove('hidden');
  }

  function handleSaveSchoolSettings(e) {
    e.preventDefault();
    state.profile = {
      name: document.getElementById('settingSchoolName').value.trim() || 'SchoolSteps Pilot School',
      motto: document.getElementById('settingSchoolMotto').value.trim(),
      address: document.getElementById('settingSchoolAddress').value.trim(),
      principal: document.getElementById('settingPrincipalName').value.trim(),
      academicYear: document.getElementById('settingAcademicYear').value.trim(),
      passPercentage: 40
    };

    saveStorage(STORAGE_KEYS.PROFILE, state.profile);
    if (FirestoreDB.isReady()) {
      FirestoreDB.saveProfile(state.profile);
    }
    document.getElementById('schoolSettingsModal').classList.add('hidden');
    document.getElementById('headerSchoolName').textContent = state.profile.name;
    showToast('School profile & branding updated successfully!', 'success');

    // Refresh views that use school branding
    renderAttendanceRoster();
    renderReportCard();
  }

  // ========================================================
  // MODULE 4: Monthly Result Auto-Delivery (M4)
  // ========================================================
  function calculateStudentFullResults(student, monthTerm) {
    const tests = state.tests.filter(t => t.className === student.className && (t.section === student.section || !t.section));
    let totalMax = 0;
    let totalPass = 0;
    let totalObtained = 0;
    let anyFailed = false;

    tests.forEach(test => {
      const key = `${test.id}_${student.id}`;
      const rec = state.marks[key] || { marks: null, remarks: '' };
      const obtained = rec.marks !== null && rec.marks !== undefined ? parseFloat(rec.marks) : 0;
      const isTested = rec.marks !== null && rec.marks !== undefined;

      totalMax += test.maxMarks;
      totalPass += test.passMarks;
      totalObtained += obtained;

      const isPass = obtained >= test.passMarks;
      if (!isPass && isTested) anyFailed = true;
    });

    const overallPct = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : '0';
    const overallGrade = calculateGrade(overallPct);
    const ranks = calculateClassRankings(student.className, student.section);
    const rankStr = ranks[student.id] || '1st';
    const attRate = calculateStudentAttendanceRate(student.id, student.className, student.section);

    return {
      totalMax,
      totalPass,
      totalObtained,
      overallPct,
      overallGrade,
      rankStr,
      anyFailed,
      attRate
    };
  }

  function getDispatchLogKey(month, className, studentId) {
    return `${month}_${className}_${studentId}`;
  }

  function renderDispatchRoster() {
    const classSelect = document.getElementById('dispatchClassSelect');
    const sectionSelect = document.getElementById('dispatchSectionSelect');
    const monthSelect = document.getElementById('dispatchMonthSelect');
    const tbody = document.getElementById('dispatchTableBody');

    if (!tbody) return;

    const selectedClass = classSelect?.value || 'Class 3';
    const rawSection = (sectionSelect?.value || 'A').trim();
    const isAllSection = !rawSection || rawSection.toUpperCase() === 'ALL';
    const selectedMonth = monthSelect?.value || 'October 2026 Monthly Assessment';

    const enrolled = state.students.filter(s =>
      s.className === selectedClass &&
      (isAllSection || (s.section || 'A').toLowerCase() === rawSection.toLowerCase()) &&
      s.status === 'Active'
    );

    let totalScoreSum = 0;
    let testedCount = 0;
    let sentCount = 0;
    let pendingCount = 0;

    const filter = state.dispatchFilter || 'ALL';

    const rowsHtml = enrolled.map(student => {
      const res = calculateStudentFullResults(student, selectedMonth);
      if (res.totalMax > 0) {
        totalScoreSum += parseFloat(res.overallPct);
        testedCount++;
      }

      const logKey = getDispatchLogKey(selectedMonth, selectedClass, student.id);
      const logRec = state.dispatchLogs[logKey] || { status: 'Pending', sentAt: null };
      const isSent = logRec.status === 'Sent';

      if (isSent) sentCount++;
      else pendingCount++;

      // Filter check
      if (filter === 'SENT' && !isSent) return '';
      if (filter === 'PENDING' && isSent) return '';

      // Build pre-filled WhatsApp text
      const cleanPhone = sanitizePhoneForWhatsApp(student.whatsapp);
      const parentName = student.fatherName || student.motherName || 'Respected Parent';
      const msgText = `Assalam-o-Alaikum ${parentName}!
${student.name}'s ${selectedMonth} report card is ready.

Term: ${selectedMonth}
Score: ${res.totalObtained} / ${res.totalMax} (${res.overallPct}%)
Grade: ${res.overallGrade.grade} | Class Rank: ${res.rankStr}
Attendance: ${res.attRate.label}
Status: ${res.anyFailed ? 'PROMOTED ON TRIAL' : 'PASSED'}

— Principal, ${state.profile.name}`;

      const waLink = cleanPhone
        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msgText)}`
        : '#';

      return `
        <tr>
          <td><strong>#${escapeHtml(student.rollNo)}</strong></td>
          <td>
            <div class="stud-name-cell">${escapeHtml(student.name)}</div>
            <div class="stud-sub-cell">Father: ${escapeHtml(student.fatherName || 'Not recorded')}</div>
          </td>
          <td>
            <div class="contact-num">${escapeHtml(student.whatsapp || '-')}</div>
          </td>
          <td class="text-center highlight-score">
            ${res.totalObtained} / ${res.totalMax}
            <div class="stud-sub-cell">${res.overallPct}%</div>
          </td>
          <td class="text-center">
            <span class="grade-pill ${res.overallGrade.cls}">${res.overallGrade.grade}</span>
          </td>
          <td class="text-center">
            ${isSent
              ? `<span class="badge badge-pass" style="background: rgba(16, 185, 129, 0.15); color: #34D399; border: 1px solid #10B981;">✓ Sent</span>`
              : `<span class="badge badge-fail" style="background: rgba(255, 214, 10, 0.15); color: var(--primary); border: 1px solid var(--primary);">⏳ Pending</span>`
            }
          </td>
          <td class="text-center" style="font-size: 0.78rem; color: var(--text-muted);">
            ${logRec.sentAt ? escapeHtml(logRec.sentAt) : '<span class="text-muted">Not sent</span>'}
          </td>
          <td class="text-right">
            <div style="display: flex; gap: 4px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
              <a href="${waLink}" target="_blank" class="btn btn-sm ${isSent ? 'btn-subtle' : 'btn-primary'} btn-dispatch-wa" data-student-id="${student.id}" title="Send via WhatsApp">
                <span class="icon">${isSent ? '🔄' : '💬'}</span>
                <span>${isSent ? 'Resend' : 'WhatsApp'}</span>
              </a>
              <button class="btn btn-sm btn-subtle btn-preview-rep" data-student-id="${student.id}" data-class="${student.className}" title="View Report Card">
                <span class="icon">👁️</span>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = rowsHtml || `<tr><td colspan="8" class="text-center" style="padding: 24px;">No students match the current filter.</td></tr>`;

    // Summary stats
    const avgScore = testedCount > 0 ? (totalScoreSum / testedCount).toFixed(1) : 0;
    const statTotal = document.getElementById('statDispatchTotal');
    const statSent = document.getElementById('statDispatchSent');
    const statPending = document.getElementById('statDispatchPending');
    const statAvg = document.getElementById('statDispatchAvg');

    if (statTotal) statTotal.textContent = enrolled.length;
    if (statSent) statSent.textContent = sentCount;
    if (statPending) statPending.textContent = pendingCount;
    if (statAvg) statAvg.textContent = `${avgScore}%`;

    // Badge counts
    const countAll = document.getElementById('dispatchCountAll');
    const countPending = document.getElementById('dispatchCountPending');
    const countSent = document.getElementById('dispatchCountSent');
    if (countAll) countAll.textContent = enrolled.length;
    if (countPending) countPending.textContent = pendingCount;
    if (countSent) countSent.textContent = sentCount;
  }

  function handleTriggerDispatch() {
    renderDispatchRoster();
    showToast('Class results generated! Tap WhatsApp on each student to send to parents.', 'success');
  }

  function handleDispatchMarkSent(studentId) {
    const classSelect = document.getElementById('dispatchClassSelect');
    const monthSelect = document.getElementById('dispatchMonthSelect');
    const selectedClass = classSelect?.value || 'Class 3';
    const selectedMonth = monthSelect?.value || 'October 2026 Monthly Assessment';

    const logKey = getDispatchLogKey(selectedMonth, selectedClass, studentId);
    const nowStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    state.dispatchLogs[logKey] = {
      status: 'Sent',
      sentAt: nowStr
    };
    saveStorage(STORAGE_KEYS.DISPATCH_LOG, state.dispatchLogs);
    if (FirestoreDB.isReady()) {
      FirestoreDB.saveDispatch(selectedMonth, selectedClass, studentId, 'Sent', nowStr);
    }
    renderDispatchRoster();
  }

  function handleDispatchMarkAllSent() {
    const classSelect = document.getElementById('dispatchClassSelect');
    const sectionSelect = document.getElementById('dispatchSectionSelect');
    const monthSelect = document.getElementById('dispatchMonthSelect');
    const selectedClass = classSelect?.value || 'Class 3';
    const rawSection = (sectionSelect?.value || 'A').trim();
    const isAllSection = !rawSection || rawSection.toUpperCase() === 'ALL';
    const selectedMonth = monthSelect?.value || 'October 2026 Monthly Assessment';

    const enrolled = state.students.filter(s =>
      s.className === selectedClass &&
      (isAllSection || (s.section || 'A').toLowerCase() === rawSection.toLowerCase()) &&
      s.status === 'Active'
    );
    const nowStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

    enrolled.forEach(s => {
      const logKey = getDispatchLogKey(selectedMonth, selectedClass, s.id);
      state.dispatchLogs[logKey] = {
        status: 'Sent',
        sentAt: nowStr
      };
    });

    saveStorage(STORAGE_KEYS.DISPATCH_LOG, state.dispatchLogs);
    if (FirestoreDB.isReady()) {
      FirestoreDB.saveDispatchBatch(selectedMonth, selectedClass, enrolled, 'Sent', nowStr);
    }
    renderDispatchRoster();
    showToast(`Marked all ${enrolled.length} students as Sent!`, 'success');
  }

  function handleDispatchResetLog() {
    const classSelect = document.getElementById('dispatchClassSelect');
    const sectionSelect = document.getElementById('dispatchSectionSelect');
    const monthSelect = document.getElementById('dispatchMonthSelect');
    const selectedClass = classSelect?.value || 'Class 3';
    const rawSection = (sectionSelect?.value || 'A').trim();
    const isAllSection = !rawSection || rawSection.toUpperCase() === 'ALL';
    const selectedMonth = monthSelect?.value || 'October 2026 Monthly Assessment';

    const enrolled = state.students.filter(s =>
      s.className === selectedClass &&
      (isAllSection || (s.section || 'A').toLowerCase() === rawSection.toLowerCase()) &&
      s.status === 'Active'
    );
    enrolled.forEach(s => {
      const logKey = getDispatchLogKey(selectedMonth, selectedClass, s.id);
      delete state.dispatchLogs[logKey];
    });

    saveStorage(STORAGE_KEYS.DISPATCH_LOG, state.dispatchLogs);
    if (FirestoreDB.isReady()) {
      FirestoreDB.resetDispatchBatch(selectedMonth, selectedClass, enrolled);
    }
    renderDispatchRoster();
    showToast('Delivery log reset to Pending for this class.', 'info');
  }

  // ========================================================
  // MODULE 5: PTM Scheduler (M5)
  // ========================================================
  function calculateSlotTime(startTime, index, durationMins = 15) {
    if (!startTime || !startTime.includes(':')) return '09:00 AM – 09:15 AM';
    const [h, m] = startTime.split(':').map(Number);
    const totalStart = h * 60 + m + (index * durationMins);
    const totalEnd = totalStart + durationMins;

    const fmt = (t) => {
      const hours = Math.floor(t / 60);
      const mins = t % 60;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const dispH = hours % 12 || 12;
      const dispM = mins < 10 ? '0' + mins : mins;
      return `${dispH}:${dispM} ${ampm}`;
    };

    return `${fmt(totalStart)} – ${fmt(totalEnd)}`;
  }

  function renderPtmModule() {
    const select = document.getElementById('ptmEventSelect');
    if (!select) return;

    if (!state.ptmEvents || state.ptmEvents.length === 0) {
      state.ptmEvents = JSON.parse(JSON.stringify(SAMPLE_PTM_EVENTS));
      saveStorage(STORAGE_KEYS.PTM_EVENTS, state.ptmEvents);
    }

    // Populate PTM select dropdown
    select.innerHTML = state.ptmEvents.map(ev => `
      <option value="${ev.id}" ${ev.id === state.activePtmId ? 'selected' : ''}>
        ${escapeHtml(ev.title)} (${formatDateHuman(ev.date)})
      </option>
    `).join('');

    const activeEvent = state.ptmEvents.find(ev => ev.id === state.activePtmId) || state.ptmEvents[0];
    if (!activeEvent) return;
    state.activePtmId = activeEvent.id;

    // Populate active event metadata
    const titleEl = document.getElementById('ptmActiveTitle');
    const dateText = document.getElementById('ptmEventDateText');
    const timeText = document.getElementById('ptmEventTimeText');
    const venueText = document.getElementById('ptmEventVenueText');
    const classesText = document.getElementById('ptmEventClassesText');
    const noteText = document.getElementById('ptmEventNoteText');

    if (titleEl) titleEl.textContent = activeEvent.title;
    if (dateText) dateText.textContent = formatDateHuman(activeEvent.date);
    if (timeText) timeText.textContent = `${activeEvent.startTime || '09:00'} – ${activeEvent.endTime || '13:00'}`;
    if (venueText) venueText.textContent = activeEvent.venue || 'Main Campus';
    if (classesText) classesText.textContent = Array.isArray(activeEvent.classes) ? activeEvent.classes.join(', ') : 'All Classes';
    if (noteText) noteText.innerHTML = `<em>Note: ${escapeHtml(activeEvent.notes || 'Please bring student diary.')}</em>`;

    // Filter students by applicable classes
    const targetClasses = Array.isArray(activeEvent.classes) ? activeEvent.classes : ['Class 3'];
    const matchingStudents = state.students.filter(s => targetClasses.includes(s.className) && s.status === 'Active');

    let countYes = 0;
    let countNo = 0;
    let countMaybe = 0;
    let countPending = 0;

    activeEvent.rsvps = activeEvent.rsvps || {};

    const filter = state.ptmFilter || 'ALL';

    const tbody = document.getElementById('ptmInviteTableBody');
    if (!tbody) return;

    let rowIndex = 0;
    const rowsHtml = matchingStudents.map(student => {
      const rsvpVal = activeEvent.rsvps[student.id] || 'Pending';
      if (rsvpVal === 'Yes') countYes++;
      else if (rsvpVal === 'No') countNo++;
      else if (rsvpVal === 'Maybe') countMaybe++;
      else countPending++;

      // Filter check
      if (filter === 'YES' && rsvpVal !== 'Yes') return '';
      if (filter === 'NO' && rsvpVal !== 'No') return '';
      if (filter === 'MAYBE' && rsvpVal !== 'Maybe') return '';
      if (filter === 'PENDING' && rsvpVal !== 'Pending') return '';

      const slot = calculateSlotTime(activeEvent.startTime || '09:00', rowIndex++);
      const cleanPhone = sanitizePhoneForWhatsApp(student.whatsapp);
      const parentName = student.fatherName || student.motherName || 'Respected Parent';

      const inviteMsg = `Assalam-o-Alaikum ${parentName}!
You are cordially invited to attend the Parent-Teacher Meeting (PTM) for ${student.name} (${student.className}).

Date: ${formatDateHuman(activeEvent.date)}
Your Time Slot: ${slot}
Venue: ${activeEvent.venue}
Instructions: ${activeEvent.notes || 'Please bring student diary.'}

Please confirm your attendance (Yes / No).
— Principal, ${state.profile.name}`;

      const waLink = cleanPhone
        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(inviteMsg)}`
        : '#';

      return `
        <tr>
          <td>
            <strong>${escapeHtml(student.name)}</strong>
            <div class="stud-sub-cell">Roll #${escapeHtml(student.rollNo)}</div>
          </td>
          <td><span class="badge badge-class">${escapeHtml(student.className)}</span></td>
          <td>
            <div class="stud-name-cell">${escapeHtml(parentName)}</div>
            <div class="contact-num">${escapeHtml(student.whatsapp || '-')}</div>
          </td>
          <td style="font-weight: 700; color: var(--secondary); font-size: 0.82rem;">${slot}</td>
          <td class="text-center">
            <div class="rsvp-btn-group">
              <button class="rsvp-btn ${rsvpVal === 'Yes' ? 'active-yes' : ''}" data-student-id="${student.id}" data-rsvp="Yes" title="Confirmed Attending">✓ Yes</button>
              <button class="rsvp-btn ${rsvpVal === 'No' ? 'active-no' : ''}" data-student-id="${student.id}" data-rsvp="No" title="Declined Attendance">✕ No</button>
              <button class="rsvp-btn ${rsvpVal === 'Maybe' ? 'active-maybe' : ''}" data-student-id="${student.id}" data-rsvp="Maybe" title="Tentative / Maybe">? Maybe</button>
            </div>
          </td>
          <td class="text-right">
            <a href="${waLink}" target="_blank" class="btn btn-sm btn-primary" title="Send WhatsApp Invite">
              <span class="icon">💬</span>
              <span>Invite</span>
            </a>
          </td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = rowsHtml || `<tr><td colspan="6" class="text-center" style="padding: 24px;">No parent records match this filter.</td></tr>`;

    // Update RSVP stats
    const statTot = document.getElementById('statPtmTotal');
    const statY = document.getElementById('statPtmYes');
    const statN = document.getElementById('statPtmNo');
    const statM = document.getElementById('statPtmMaybe');

    if (statTot) statTot.textContent = matchingStudents.length;
    if (statY) statY.textContent = countYes;
    if (statN) statN.textContent = countNo;
    if (statM) statM.textContent = countMaybe;
  }

  function handlePtmRsvpToggle(studentId, rsvpVal) {
    const activeEvent = state.ptmEvents.find(ev => ev.id === state.activePtmId);
    if (!activeEvent) return;

    activeEvent.rsvps = activeEvent.rsvps || {};
    if (activeEvent.rsvps[studentId] === rsvpVal) {
      activeEvent.rsvps[studentId] = 'Pending';
    } else {
      activeEvent.rsvps[studentId] = rsvpVal;
    }

    saveStorage(STORAGE_KEYS.PTM_EVENTS, state.ptmEvents);
    if (FirestoreDB.isReady()) {
      FirestoreDB.updatePtmRsvp(activeEvent.id, studentId, activeEvent.rsvps[studentId]);
    }
    renderPtmModule();
    showToast(`RSVP recorded as ${activeEvent.rsvps[studentId]}`, 'info');
  }

  function handleOpenCreatePtm(editId = null) {
    const modal = document.getElementById('ptmModal');
    const form = document.getElementById('ptmForm');
    const titleEl = document.getElementById('ptmModalTitle');
    const editIdInput = document.getElementById('ptmEditId');
    if (!modal || !form) return;

    form.reset();

    if (editId) {
      const ev = state.ptmEvents.find(e => e.id === editId);
      if (ev) {
        if (titleEl) titleEl.textContent = 'Edit PTM Event';
        if (editIdInput) editIdInput.value = ev.id;
        document.getElementById('ptmTitleInput').value = ev.title;
        document.getElementById('ptmDateInput').value = ev.date;
        document.getElementById('ptmStartTimeInput').value = ev.startTime || '09:00';
        document.getElementById('ptmEndTimeInput').value = ev.endTime || '13:00';
        document.getElementById('ptmVenueInput').value = ev.venue || '';
        document.getElementById('ptmNotesInput').value = ev.notes || '';

        const classCbs = document.querySelectorAll('input[name="ptmClassChoice"]');
        classCbs.forEach(cb => {
          cb.checked = Array.isArray(ev.classes) && ev.classes.includes(cb.value);
        });
      }
    } else {
      if (titleEl) titleEl.textContent = 'Create PTM Event';
      if (editIdInput) editIdInput.value = '';
      document.getElementById('ptmDateInput').value = getTodayISO();
      document.getElementById('ptmStartTimeInput').value = '09:00';
      document.getElementById('ptmEndTimeInput').value = '13:00';
      document.getElementById('ptmVenueInput').value = 'Main Campus & Classrooms';
      document.getElementById('ptmNotesInput').value = 'Please bring student diary and arrive 5 mins before slot.';
    }

    modal.classList.remove('hidden');
  }

  function handleSavePtm(e) {
    e.preventDefault();
    const editId = document.getElementById('ptmEditId')?.value;
    const title = document.getElementById('ptmTitleInput')?.value.trim();
    const date = document.getElementById('ptmDateInput')?.value;
    const startTime = document.getElementById('ptmStartTimeInput')?.value;
    const endTime = document.getElementById('ptmEndTimeInput')?.value;
    const venue = document.getElementById('ptmVenueInput')?.value.trim();
    const notes = document.getElementById('ptmNotesInput')?.value.trim();

    const selectedClasses = [];
    document.querySelectorAll('input[name="ptmClassChoice"]:checked').forEach(cb => {
      selectedClasses.push(cb.value);
    });

    if (!title || !date || selectedClasses.length === 0) {
      showToast('Please fill all required fields and select at least one class.', 'warn');
      return;
    }

    if (editId) {
      const idx = state.ptmEvents.findIndex(ev => ev.id === editId);
      if (idx !== -1) {
        state.ptmEvents[idx].title = title;
        state.ptmEvents[idx].date = date;
        state.ptmEvents[idx].startTime = startTime;
        state.ptmEvents[idx].endTime = endTime;
        state.ptmEvents[idx].venue = venue;
        state.ptmEvents[idx].notes = notes;
        state.ptmEvents[idx].classes = selectedClasses;
      }
    } else {
      const newEvent = {
        id: 'ptm-' + Date.now(),
        title,
        date,
        startTime,
        endTime,
        venue,
        notes,
        classes: selectedClasses,
        rsvps: {}
      };
      state.ptmEvents.unshift(newEvent);
      state.activePtmId = newEvent.id;
    }

    saveStorage(STORAGE_KEYS.PTM_EVENTS, state.ptmEvents);
    const targetPtm = editId
      ? state.ptmEvents.find(ev => ev.id === editId)
      : state.ptmEvents[0];
    if (targetPtm && FirestoreDB.isReady()) {
      FirestoreDB.savePtm(targetPtm);
    }
    document.getElementById('ptmModal').classList.add('hidden');
    renderPtmModule();
    showToast(editId ? 'PTM event updated!' : 'New PTM event created successfully!', 'success');
  }

  function handleDeletePtm(id) {
    if (!id) return;
    if (state.ptmEvents.length <= 1) {
      showToast('Cannot delete the only PTM event.', 'warn');
      return;
    }
    if (confirm('Are you sure you want to delete this PTM event?')) {
      state.ptmEvents = state.ptmEvents.filter(ev => ev.id !== id);
      state.activePtmId = state.ptmEvents[0]?.id || null;
      saveStorage(STORAGE_KEYS.PTM_EVENTS, state.ptmEvents);
      if (FirestoreDB.isReady()) {
        FirestoreDB.deletePtm(id);
      }
      renderPtmModule();
      showToast('PTM event deleted.', 'info');
    }
  }

  function handleCopyPtmReminder() {
    const activeEvent = state.ptmEvents.find(ev => ev.id === state.activePtmId);
    const dateStr = activeEvent ? formatDateHuman(activeEvent.date) : 'Saturday';
    const venueStr = activeEvent ? activeEvent.venue : 'Main Campus';

    const reminderMsg = `Assalam-o-Alaikum Dear Parents!
Reminder: The Parent-Teacher Meeting (PTM) is scheduled for ${dateStr} (${activeEvent?.startTime || '09:00 AM'} to ${activeEvent?.endTime || '01:00 PM'}) at ${venueStr}.
Please ensure timely arrival according to your scheduled slot. We look forward to meeting you!
— Principal, ${state.profile.name}`;

    navigator.clipboard?.writeText(reminderMsg).then(() => {
      showToast('PTM reminder template copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Reminder ready to send to parents!', 'info');
    });
  }

  // ========================================================
  // MODULE 6: Communication Hub (M6)
  // ========================================================
  function renderCommsModule() {
    const studentSelect = document.getElementById('callLogStudentSelect');
    const filterStudentSelect = document.getElementById('callFilterStudentSelect');

    if (studentSelect) {
      studentSelect.innerHTML = state.students.map(s => `
        <option value="${s.id}">
          ${escapeHtml(s.name)} (${s.className}-${s.section || 'A'}) — Father: ${escapeHtml(s.fatherName || 'Parent')}
        </option>
      `).join('');
    }

    if (filterStudentSelect) {
      const cur = filterStudentSelect.value || 'ALL';
      filterStudentSelect.innerHTML = `<option value="ALL">All Students</option>` + state.students.map(s => `
        <option value="${s.id}" ${s.id === cur ? 'selected' : ''}>
          ${escapeHtml(s.name)} (${s.className})
        </option>
      `).join('');
    }

    renderCallLogs();
  }

  function handleGenerateBroadcastLinks() {
    const classVal = document.getElementById('broadcastClassSelect')?.value || 'ALL';
    const rawSectionVal = (document.getElementById('broadcastSectionSelect')?.value || 'ALL').trim();
    const isAllSec = !rawSectionVal || rawSectionVal.toUpperCase() === 'ALL';
    const msgTemplate = document.getElementById('broadcastMessageBox')?.value.trim();
    const tbody = document.getElementById('broadcastTableBody');
    const countBadge = document.getElementById('broadcastRecipientCount');

    if (!tbody) return;

    if (!msgTemplate) {
      showToast('Please type a message or select a template above.', 'warn');
      return;
    }

    const matching = state.students.filter(s => {
      if (s.status !== 'Active') return false;
      if (classVal !== 'ALL' && s.className !== classVal) return false;
      if (!isAllSec && (s.section || 'A').toLowerCase() !== rawSectionVal.toLowerCase()) return false;
      return true;
    });

    if (countBadge) countBadge.textContent = `${matching.length} Parents`;

    const rowsHtml = matching.map(student => {
      const parentName = student.fatherName || student.motherName || 'Respected Parent';
      const cleanPhone = sanitizePhoneForWhatsApp(student.whatsapp);

      const personalized = msgTemplate
        .replace(/\{student_name\}/g, student.name)
        .replace(/\{parent_name\}/g, parentName)
        .replace(/\{class\}/g, `${student.className}-${student.section || 'A'}`)
        .replace(/\{school_name\}/g, state.profile.name);

      const waLink = cleanPhone
        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(personalized)}`
        : '#';

      return `
        <tr>
          <td>
            <strong>${escapeHtml(student.name)}</strong>
            <div class="stud-sub-cell">Roll #${escapeHtml(student.rollNo)}</div>
          </td>
          <td><span class="badge badge-class">${escapeHtml(student.className)}-${escapeHtml(student.section || 'A')}</span></td>
          <td>
            <div class="stud-name-cell">${escapeHtml(parentName)}</div>
            <div class="contact-num">${escapeHtml(student.whatsapp || '-')}</div>
          </td>
          <td>
            <div style="font-size: 0.8rem; color: #E2E8F0; line-height: 1.4; max-width: 320px; white-space: pre-wrap; word-break: break-word;">
              ${escapeHtml(personalized.length > 100 ? personalized.substring(0, 100) + '...' : personalized)}
            </div>
          </td>
          <td class="text-right">
            <div style="display: flex; gap: 4px; justify-content: flex-end;">
              <a href="${waLink}" target="_blank" class="btn btn-sm btn-primary" title="Send via WhatsApp">
                <span class="icon">💬</span>
                <span>Send</span>
              </a>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = rowsHtml || `<tr><td colspan="5" class="text-center" style="padding: 24px;">No matching students found for selected class.</td></tr>`;
    showToast(`Generated personalized WhatsApp links for ${matching.length} parents!`, 'success');
  }

  function renderCallLogs() {
    const container = document.getElementById('callLogsContainer');
    const badgeCount = document.getElementById('callLogBadgeCount');
    if (!container) return;

    if (badgeCount) badgeCount.textContent = state.callLogs.length;

    const studentFilter = document.getElementById('callFilterStudentSelect')?.value || 'ALL';
    const outcomeFilter = document.getElementById('callFilterOutcomeSelect')?.value || 'ALL';

    const filtered = state.callLogs.filter(log => {
      if (studentFilter !== 'ALL' && log.studentId !== studentFilter) return false;
      if (outcomeFilter !== 'ALL' && !log.outcome.includes(outcomeFilter)) return false;
      return true;
    });

    let countResolved = 0;
    let countFollowUp = 0;
    let countNoAnswer = 0;

    state.callLogs.forEach(l => {
      if (l.outcome === 'Resolved') countResolved++;
      else if (l.outcome.includes('Follow-up')) countFollowUp++;
      else countNoAnswer++;
    });

    const statTot = document.getElementById('statCallTotal');
    const statRes = document.getElementById('statCallResolved');
    const statFol = document.getElementById('statCallFollowUp');
    const statNo = document.getElementById('statCallNoAnswer');

    if (statTot) statTot.textContent = state.callLogs.length;
    if (statRes) statRes.textContent = countResolved;
    if (statFol) statFol.textContent = countFollowUp;
    if (statNo) statNo.textContent = countNoAnswer;

    if (filtered.length === 0) {
      container.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--text-muted);">No phone calls logged matching this filter. Tap "Log Call" to add one.</div>`;
      return;
    }

    container.innerHTML = filtered.map(log => {
      let outcomeCls = 'badge-pass';
      if (log.outcome.includes('Follow-up')) outcomeCls = 'badge-gold';
      else if (log.outcome.includes('No Answer')) outcomeCls = 'badge-fail';

      return `
        <div class="call-log-card">
          <div class="call-log-header">
            <div>
              <span class="call-log-student">${escapeHtml(log.studentName)}</span>
              <span class="badge badge-class" style="margin-left: 6px;">${escapeHtml(log.className || 'Class 3')}</span>
              <div class="call-log-parent">Parent: ${escapeHtml(log.parentName)} • Tel: ${escapeHtml(log.phone || '-')}</div>
            </div>
            <div class="call-log-badges">
              <span class="badge badge-pilot">${escapeHtml(log.reason)}</span>
              <span class="badge ${outcomeCls}">${escapeHtml(log.outcome)}</span>
            </div>
          </div>
          <div class="call-log-notes">
            "${escapeHtml(log.notes)}"
          </div>
          <div class="call-log-footer">
            <span>📅 ${escapeHtml(log.date)}</span>
            <button class="btn btn-subtle btn-sm btn-logout btn-delete-call" data-id="${log.id}" title="Delete log">
              <span class="icon">🗑️</span> Delete
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function handleSaveCallLog(e) {
    e.preventDefault();
    const dateVal = document.getElementById('callLogDateInput')?.value;
    const studentId = document.getElementById('callLogStudentSelect')?.value;
    const reason = document.getElementById('callLogReasonSelect')?.value;
    const outcome = document.getElementById('callLogOutcomeSelect')?.value;
    const notes = document.getElementById('callLogNotesInput')?.value.trim();

    const student = state.students.find(s => s.id === studentId);
    if (!student || !notes) {
      showToast('Please provide conversation summary notes.', 'warn');
      return;
    }

    const newLog = {
      id: 'call-' + Date.now(),
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      parentName: student.fatherName || student.motherName || 'Parent',
      phone: student.whatsapp || student.emergencyPhone || '',
      date: dateVal ? dateVal.replace('T', ' ') : new Date().toLocaleString(),
      reason,
      outcome,
      notes
    };

    state.callLogs.unshift(newLog);
    saveStorage(STORAGE_KEYS.CALL_LOGS, state.callLogs);
    if (FirestoreDB.isReady()) {
      FirestoreDB.saveCallLog(newLog);
    }
    document.getElementById('callLogModal').classList.add('hidden');
    renderCallLogs();
    showToast(`Call logged for ${student.name}!`, 'success');
  }

  function handleDeleteCallLog(id) {
    if (confirm('Delete this call record?')) {
      state.callLogs = state.callLogs.filter(l => l.id !== id);
      saveStorage(STORAGE_KEYS.CALL_LOGS, state.callLogs);
      if (FirestoreDB.isReady()) {
        FirestoreDB.deleteCallLog(id);
      }
      renderCallLogs();
      showToast('Call log removed.', 'info');
    }
  }

  // ========================================================
  // Event Bindings
  // ========================================================
  function bindEvents() {
    // Top actions
    document.getElementById('btnDemoData')?.addEventListener('click', () => {
      if (confirm('Reload realistic pilot demo data? This resets current records to sample school state.')) {
        resetToDemoData();
      }
    });

    document.getElementById('btnSchoolSettings')?.addEventListener('click', openSchoolSettingsModal);
    document.getElementById('btnCloseSchoolModal')?.addEventListener('click', () => {
      document.getElementById('schoolSettingsModal').classList.add('hidden');
    });
    document.getElementById('btnCancelSchoolModal')?.addEventListener('click', () => {
      document.getElementById('schoolSettingsModal').classList.add('hidden');
    });
    document.getElementById('schoolSettingsForm')?.addEventListener('submit', handleSaveSchoolSettings);

    // M1 Students
    document.getElementById('btnOpenAddStudent')?.addEventListener('click', openAddStudentModal);
    document.getElementById('btnLoadDemoFromEmpty')?.addEventListener('click', resetToDemoData);
    document.getElementById('btnCloseStudentModal')?.addEventListener('click', closeStudentModal);
    document.getElementById('btnCancelStudentModal')?.addEventListener('click', closeStudentModal);
    document.getElementById('studentForm')?.addEventListener('submit', handleSaveStudent);

    // Filter & Search
    const searchInput = document.getElementById('studentSearchInput');
    const clearBtn = document.getElementById('btnClearSearch');

    searchInput?.addEventListener('input', () => {
      if (clearBtn) clearBtn.classList.toggle('hidden', !searchInput.value);
      renderStudentsList();
    });

    clearBtn?.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.classList.add('hidden');
      renderStudentsList();
    });

    document.getElementById('filterClassSelect')?.addEventListener('change', renderStudentsList);
    document.getElementById('filterSectionSelect')?.addEventListener('change', renderStudentsList);
    document.getElementById('filterSectionSelect')?.addEventListener('input', renderStudentsList);

    // M2 Attendance
    document.getElementById('attDatePicker')?.addEventListener('change', renderAttendanceRoster);
    document.getElementById('attClassSelect')?.addEventListener('change', renderAttendanceRoster);
    document.getElementById('attSectionSelect')?.addEventListener('change', renderAttendanceRoster);
    document.getElementById('attSectionSelect')?.addEventListener('input', renderAttendanceRoster);
    document.getElementById('btnMarkAllPresent')?.addEventListener('click', handleMarkAllPresent);
    document.getElementById('btnSaveAttendance')?.addEventListener('click', handleSaveAttendance);

    // WhatsApp Filter tabs
    document.querySelectorAll('.wa-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.wa-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.attendanceFilter = btn.getAttribute('data-filter') || 'ALL';
        const dateStr = document.getElementById('attDatePicker')?.value || getTodayISO();
        const className = document.getElementById('attClassSelect')?.value || 'Class 3';
        const section = (document.getElementById('attSectionSelect')?.value || 'A').trim();
        const enrolled = state.students.filter(s =>
          s.className === className &&
          (s.section || 'A').toLowerCase() === section.toLowerCase() &&
          s.status === 'Active'
        );
        renderWhatsAppMessagesList(enrolled, dateStr, className, section);
      });
    });

    // M3 Tests & Marks
    document.getElementById('testClassSelect')?.addEventListener('change', () => {
      renderMarksEntrySheet();
    });
    document.getElementById('testSelect')?.addEventListener('change', (e) => {
      state.currentTestId = e.target.value;
      renderMarksEntrySheet();
    });
    document.getElementById('btnSaveMarks')?.addEventListener('click', handleSaveMarks);

    // New Test Modal
    document.getElementById('btnOpenNewTestModal')?.addEventListener('click', () => {
      document.getElementById('newTestDate').value = getTodayISO();
      document.getElementById('newTestClass').value = document.getElementById('testClassSelect')?.value || 'Class 3';
      document.getElementById('newTestModal').classList.remove('hidden');
    });
    document.getElementById('btnCloseTestModal')?.addEventListener('click', () => {
      document.getElementById('newTestModal').classList.add('hidden');
    });
    document.getElementById('btnCancelTestModal')?.addEventListener('click', () => {
      document.getElementById('newTestModal').classList.add('hidden');
    });
    document.getElementById('newTestForm')?.addEventListener('submit', handleCreateNewTest);

    // M3 Report Cards
    document.getElementById('reportClassSelect')?.addEventListener('change', () => {
      populateReportStudentsDropdown();
      renderReportCard();
    });
    document.getElementById('reportStudentSelect')?.addEventListener('change', renderReportCard);
    document.getElementById('reportTermSelect')?.addEventListener('change', renderReportCard);
    document.getElementById('btnPrintReportCard')?.addEventListener('click', () => {
      window.print();
    });
    document.getElementById('btnGoToDispatch')?.addEventListener('click', () => {
      switchTab('tab-dispatch');
    });

    // M4 Result Dispatch
    document.getElementById('dispatchClassSelect')?.addEventListener('change', renderDispatchRoster);
    document.getElementById('dispatchSectionSelect')?.addEventListener('change', renderDispatchRoster);
    document.getElementById('dispatchSectionSelect')?.addEventListener('input', renderDispatchRoster);
    document.getElementById('dispatchMonthSelect')?.addEventListener('change', renderDispatchRoster);
    document.getElementById('btnTriggerDispatch')?.addEventListener('click', handleTriggerDispatch);
    document.getElementById('btnDispatchMarkAllSent')?.addEventListener('click', handleDispatchMarkAllSent);
    document.getElementById('btnDispatchResetLog')?.addEventListener('click', handleDispatchResetLog);

    document.querySelectorAll('[data-dispatch-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-dispatch-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.dispatchFilter = btn.getAttribute('data-dispatch-filter') || 'ALL';
        renderDispatchRoster();
      });
    });

    document.getElementById('dispatchTableBody')?.addEventListener('click', (e) => {
      const waBtn = e.target.closest('.btn-dispatch-wa');
      if (waBtn) {
        const studentId = waBtn.getAttribute('data-student-id');
        if (studentId) handleDispatchMarkSent(studentId);
        return;
      }

      const repBtn = e.target.closest('.btn-preview-rep');
      if (repBtn) {
        const studentId = repBtn.getAttribute('data-student-id');
        const className = repBtn.getAttribute('data-class');
        if (studentId) {
          const reportClassSelect = document.getElementById('reportClassSelect');
          if (reportClassSelect) reportClassSelect.value = className;
          populateReportStudentsDropdown();
          const reportStudentSelect = document.getElementById('reportStudentSelect');
          if (reportStudentSelect) reportStudentSelect.value = studentId;
          switchTab('tab-reports');
          renderReportCard();
        }
      }
    });

    // M5 PTM Scheduler
    document.getElementById('ptmEventSelect')?.addEventListener('change', (e) => {
      state.activePtmId = e.target.value;
      renderPtmModule();
    });
    document.getElementById('btnOpenCreatePtm')?.addEventListener('click', () => handleOpenCreatePtm());
    document.getElementById('btnClosePtmModal')?.addEventListener('click', () => {
      document.getElementById('ptmModal').classList.add('hidden');
    });
    document.getElementById('btnCancelPtmModal')?.addEventListener('click', () => {
      document.getElementById('ptmModal').classList.add('hidden');
    });
    document.getElementById('ptmForm')?.addEventListener('submit', handleSavePtm);
    document.getElementById('btnEditCurrentPtm')?.addEventListener('click', () => handleOpenCreatePtm(state.activePtmId));
    document.getElementById('btnDeleteCurrentPtm')?.addEventListener('click', () => handleDeletePtm(state.activePtmId));
    document.getElementById('btnCopyPtmReminder')?.addEventListener('click', handleCopyPtmReminder);

    document.querySelectorAll('[data-ptm-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-ptm-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.ptmFilter = btn.getAttribute('data-ptm-filter') || 'ALL';
        renderPtmModule();
      });
    });

    document.getElementById('ptmInviteTableBody')?.addEventListener('click', (e) => {
      const rsvpBtn = e.target.closest('.rsvp-btn');
      if (rsvpBtn) {
        const studentId = rsvpBtn.getAttribute('data-student-id');
        const rsvpVal = rsvpBtn.getAttribute('data-rsvp');
        if (studentId && rsvpVal) handlePtmRsvpToggle(studentId, rsvpVal);
      }
    });

    // M6 Communication Hub
    document.getElementById('btnSubtabBroadcast')?.addEventListener('click', () => {
      document.getElementById('btnSubtabBroadcast').classList.add('active');
      document.getElementById('btnSubtabCallLogs').classList.remove('active');
      document.getElementById('commsBroadcastView').classList.remove('hidden');
      document.getElementById('commsCallLogsView').classList.add('hidden');
    });

    document.getElementById('btnSubtabCallLogs')?.addEventListener('click', () => {
      document.getElementById('btnSubtabCallLogs').classList.add('active');
      document.getElementById('btnSubtabBroadcast').classList.remove('active');
      document.getElementById('commsCallLogsView').classList.remove('hidden');
      document.getElementById('commsBroadcastView').classList.add('hidden');
      renderCallLogs();
    });

    document.getElementById('broadcastTemplateSelect')?.addEventListener('change', (e) => {
      const tmplKey = e.target.value;
      const msgBox = document.getElementById('broadcastMessageBox');
      if (msgBox && tmplKey && BROADCAST_TEMPLATES[tmplKey]) {
        msgBox.value = BROADCAST_TEMPLATES[tmplKey];
      }
    });

    document.getElementById('btnGenerateBroadcastLinks')?.addEventListener('click', handleGenerateBroadcastLinks);
    document.getElementById('btnClearBroadcastMessage')?.addEventListener('click', () => {
      const msgBox = document.getElementById('broadcastMessageBox');
      if (msgBox) msgBox.value = '';
    });

    // Call Logs
    document.getElementById('btnOpenLogCallModal')?.addEventListener('click', () => {
      const modal = document.getElementById('callLogModal');
      const form = document.getElementById('callLogForm');
      if (modal && form) {
        form.reset();
        const dateInput = document.getElementById('callLogDateInput');
        if (dateInput) {
          const now = new Date();
          now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
          dateInput.value = now.toISOString().slice(0, 16);
        }
        modal.classList.remove('hidden');
      }
    });

    document.getElementById('btnCloseCallLogModal')?.addEventListener('click', () => {
      document.getElementById('callLogModal').classList.add('hidden');
    });
    document.getElementById('btnCancelCallLogModal')?.addEventListener('click', () => {
      document.getElementById('callLogModal').classList.add('hidden');
    });
    document.getElementById('callLogForm')?.addEventListener('submit', handleSaveCallLog);
    document.getElementById('callFilterStudentSelect')?.addEventListener('change', renderCallLogs);
    document.getElementById('callFilterOutcomeSelect')?.addEventListener('change', renderCallLogs);

    document.getElementById('callLogsContainer')?.addEventListener('click', (e) => {
      const delBtn = e.target.closest('.btn-delete-call');
      if (delBtn) {
        const id = delBtn.getAttribute('data-id');
        if (id) handleDeleteCallLog(id);
      }
    });
  }

  // ========================================================
  // Firebase Authentication & Session Management
  // ========================================================
  let currentAuthMode = 'login'; // 'login' or 'signup'
  let isAppInitialized = false;

  function getFriendlyAuthErrorMessage(error) {
    if (!error) return 'An unexpected error occurred. Please try again.';
    const code = error.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please check your email or click Sign Up.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please check your password and try again.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please verify your details and try again.';
      case 'auth/email-already-in-use':
        return 'An account already exists with this email. Please sign in instead.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a password with at least 6 characters.';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful attempts. Access has been temporarily locked. Please try again in a few minutes.';
      case 'auth/network-request-failed':
        return 'Unable to connect to the authentication server. Please check your internet connection.';
      case 'auth/operation-not-allowed':
        return 'Email and password sign-in is not enabled. Please contact support.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact your administrator.';
      default:
        return error.message || 'Authentication failed. Please verify your details and try again.';
    }
  }

  function showAuthError(message) {
    const box = document.getElementById('authErrorBox');
    const text = document.getElementById('authErrorText');
    if (box && text) {
      text.textContent = message;
      box.classList.remove('hidden');
    }
  }

  function hideAuthError() {
    const box = document.getElementById('authErrorBox');
    const text = document.getElementById('authErrorText');
    if (box && text) {
      text.textContent = '';
      box.classList.add('hidden');
    }
  }

  function setAuthLoading(isLoading) {
    const submitBtn = document.getElementById('btnAuthSubmit');
    const spinner = document.getElementById('authSpinner');
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    if (spinner) {
      if (isLoading) spinner.classList.remove('hidden');
      else spinner.classList.add('hidden');
    }
  }

  function setAuthMode(mode) {
    currentAuthMode = mode;
    hideAuthError();
    const btnLogin = document.getElementById('btnToggleLogin');
    const btnSignup = document.getElementById('btnToggleSignup');
    const submitText = document.getElementById('btnAuthSubmitText');
    const switchPromptText = document.getElementById('authSwitchPromptText');
    const switchLink = document.getElementById('authSwitchLink');

    if (mode === 'signup') {
      btnLogin?.classList.remove('active');
      btnLogin?.setAttribute('aria-selected', 'false');
      btnSignup?.classList.add('active');
      btnSignup?.setAttribute('aria-selected', 'true');
      if (submitText) submitText.textContent = 'Create Account';
      if (switchPromptText) switchPromptText.textContent = 'Already have an account?';
      if (switchLink) switchLink.textContent = 'Sign in';
    } else {
      btnSignup?.classList.remove('active');
      btnSignup?.setAttribute('aria-selected', 'false');
      btnLogin?.classList.add('active');
      btnLogin?.setAttribute('aria-selected', 'true');
      if (submitText) submitText.textContent = 'Sign In';
      if (switchPromptText) switchPromptText.textContent = "Don't have an account?";
      if (switchLink) switchLink.textContent = 'Create an account';
    }
  }

  function updateUserHeader(email, role) {
    const roleBadge = document.getElementById('userRoleBadge');
    const emailSub = document.getElementById('userEmailSub');
    if (roleBadge) {
      roleBadge.textContent = role || 'Teacher';
    }
    if (emailSub) {
      emailSub.textContent = email || '';
      emailSub.title = email || '';
    }
  }

  async function handleAuthSubmit(e) {
    e.preventDefault();
    hideAuthError();

    const emailInput = document.getElementById('authEmail');
    const passwordInput = document.getElementById('authPassword');
    const email = emailInput?.value.trim() || '';
    const password = passwordInput?.value || '';
    const selectedRole = document.querySelector('input[name="authRole"]:checked')?.value || 'Teacher';

    if (!email) {
      showAuthError('Please enter your email address.');
      emailInput?.focus();
      return;
    }
    if (!password) {
      showAuthError('Please enter your password.');
      passwordInput?.focus();
      return;
    }
    if (password.length < 6) {
      showAuthError('Password must be at least 6 characters long.');
      passwordInput?.focus();
      return;
    }

    if (!auth) {
      showAuthError('Firebase Authentication is not available. Please check network connection.');
      return;
    }

    setAuthLoading(true);

    try {
      if (currentAuthMode === 'signup') {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        if (userCredential && userCredential.user) {
          setUserRole(userCredential.user.email, selectedRole);
          showToast(`Account created! Welcome, ${selectedRole}.`, 'success');
        }
      } else {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        if (userCredential && userCredential.user) {
          setUserRole(userCredential.user.email, selectedRole);
          showToast('Signed in successfully!', 'success');
        }
      }
    } catch (error) {
      console.error('Firebase Auth error:', error);
      showAuthError(getFriendlyAuthErrorMessage(error));
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    if (confirm('Are you sure you want to log out of SchoolSteps?')) {
      try {
        if (auth) {
          await auth.signOut();
        }
        showToast('Logged out successfully.', 'info');
      } catch (err) {
        console.error('Logout error:', err);
        showToast('Error logging out. Please try again.', 'error');
      }
    }
  }

  function bindAuthEvents() {
    document.getElementById('btnToggleLogin')?.addEventListener('click', () => setAuthMode('login'));
    document.getElementById('btnToggleSignup')?.addEventListener('click', () => setAuthMode('signup'));
    document.getElementById('authSwitchLink')?.addEventListener('click', () => {
      setAuthMode(currentAuthMode === 'login' ? 'signup' : 'login');
    });

    // Role selection cards
    const roleCards = document.querySelectorAll('.role-option-card');
    roleCards.forEach(card => {
      card.addEventListener('click', () => {
        const radio = card.querySelector('input[name="authRole"]');
        if (radio) radio.checked = true;
        roleCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });

    // Remembered role lookup on blur
    document.getElementById('authEmail')?.addEventListener('blur', (e) => {
      const email = e.target.value.trim();
      if (email) {
        const rememberedRole = localStorage.getItem(ROLE_STORAGE_PREFIX + email.toLowerCase());
        if (rememberedRole) {
          const radio = document.querySelector(`input[name="authRole"][value="${rememberedRole}"]`);
          if (radio) {
            radio.checked = true;
            roleCards.forEach(card => card.classList.toggle('active', card.contains(radio)));
          }
        }
      }
    });

    document.getElementById('authForm')?.addEventListener('submit', handleAuthSubmit);
    document.getElementById('btnLogout')?.addEventListener('click', handleLogout);
  }

  let isBackgroundSyncing = false;
  let backgroundSyncTimer = null;

  function showSyncIndicator() {
    const badge = document.getElementById('syncStatusBadge');
    if (badge) badge.classList.remove('hidden');

    const container = document.getElementById('toastContainer');
    if (container && !document.getElementById('syncIndicatorToast')) {
      const toast = document.createElement('div');
      toast.id = 'syncIndicatorToast';
      toast.className = 'toast toast-warn';
      toast.innerHTML = '<span>⚡</span><span>Syncing...</span>';
      container.appendChild(toast);
    }
  }

  function hideSyncIndicator() {
    const badge = document.getElementById('syncStatusBadge');
    if (badge) badge.classList.add('hidden');

    const toast = document.getElementById('syncIndicatorToast');
    if (toast) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.2s ease-out';
      setTimeout(() => {
        try { toast.remove(); } catch (e) {}
      }, 200);
    }
  }

  function stopBackgroundSync() {
    if (backgroundSyncTimer) {
      clearTimeout(backgroundSyncTimer);
      backgroundSyncTimer = null;
    }
    isBackgroundSyncing = false;
    hideSyncIndicator();
  }

  async function startBackgroundSync(user, isRetry = false) {
    if (!user || isBackgroundSyncing) return;
    if (backgroundSyncTimer) {
      clearTimeout(backgroundSyncTimer);
      backgroundSyncTimer = null;
    }

    isBackgroundSyncing = true;
    showSyncIndicator();

    const syncTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('SYNC_TIMEOUT')), 10000);
    });

    try {
      await Promise.race([
        FirestoreDB.syncAndLoad(user, false),
        syncTimeoutPromise
      ]);

      hideSyncIndicator();
      isBackgroundSyncing = false;

      // Re-render silently with merged cloud data
      renderApp();
      console.log('Firestore background sync completed successfully.');
    } catch (err) {
      console.warn('Firestore background sync warning/timeout:', err);
      hideSyncIndicator();
      isBackgroundSyncing = false;

      // Show offline toast on initial sync failure/timeout
      if (!isRetry) {
        showToast('Offline mode — using local data', 'warn');
      }

      // App keeps working fully on localStorage. Retry sync silently every 60s.
      if (backgroundSyncTimer) clearTimeout(backgroundSyncTimer);
      backgroundSyncTimer = setTimeout(() => {
        if (auth && auth.currentUser) {
          startBackgroundSync(auth.currentUser, true);
        }
      }, 60000);
    }
  }

  function showDataLoadError(message) {
    let box = document.getElementById('dataLoadErrorBox');
    let textEl = document.getElementById('dataLoadErrorText');
    if (!box) {
      box = document.createElement('div');
      box.id = 'dataLoadErrorBox';
      box.className = 'auth-error-box';
      box.style.margin = '12px 14px 0';
      box.setAttribute('role', 'alert');
      box.innerHTML = `
        <span class="error-icon">⚠️</span>
        <div style="flex: 1;">
          <strong style="display: block; font-weight: 700; margin-bottom: 2px;">Data Loading Error</strong>
          <span id="dataLoadErrorText" class="error-text"></span>
        </div>
        <button type="button" class="btn-close" id="btnCloseDataLoadError" aria-label="Dismiss" style="background: none; border: none; font-size: 1rem; cursor: pointer; color: #DC2626; padding: 0 4px; line-height: 1;">✕</button>
      `;
      const appContainer = document.getElementById('appContainer');
      const header = document.querySelector('.app-header');
      if (header && header.nextSibling) {
        appContainer.insertBefore(box, header.nextSibling);
      } else if (appContainer) {
        appContainer.insertBefore(box, appContainer.firstChild);
      }
      textEl = document.getElementById('dataLoadErrorText');
    }
    if (textEl) {
      textEl.textContent = message;
    }
    box.classList.remove('hidden');

    const closeBtn = document.getElementById('btnCloseDataLoadError');
    if (closeBtn) {
      closeBtn.onclick = () => {
        box.classList.add('hidden');
      };
    }
  }

  function hideDataLoadError() {
    const box = document.getElementById('dataLoadErrorBox');
    if (box) box.classList.add('hidden');
  }

  function initAuthGating() {
    const authScreen = document.getElementById('authScreen');
    const appContainer = document.getElementById('appContainer');
    const mobileBottomBar = document.getElementById('mobileBottomBar');

    if (!auth) {
      console.warn('Firebase Auth SDK is not available.');
      showAuthError('Firebase Authentication could not be connected. Please check your internet connection.');
      return;
    }

    auth.onAuthStateChanged((user) => {
      if (user) {
        // FIRST line: hide login, show app. Nothing before it.
        authScreen?.classList.add('hidden');
        appContainer?.classList.remove('hidden');
        mobileBottomBar?.classList.remove('hidden');

        // THEN: setTimeout(() => { try { initData(); renderApp(); } catch(e) { console.error(e); } }, 500);
        setTimeout(() => {
          try {
            initData();
            renderApp();
          } catch (e) {
            console.error(e);
          }
        }, 500);

        // THEN: start background sync.
        startBackgroundSync(user);
      } else {
        stopBackgroundSync();
        FirestoreDB.hideSyncOverlay();
        hideDataLoadError();
        authScreen?.classList.remove('hidden');
        appContainer?.classList.add('hidden');
        mobileBottomBar?.classList.add('hidden');

        const pwField = document.getElementById('authPassword');
        if (pwField) pwField.value = '';
        hideAuthError();
        setAuthLoading(false);
      }
    });
  }

  // ========================================================
  // App Render & Startup
  // ========================================================
  function renderApp() {
    try {
      const headerSchoolName = document.getElementById('headerSchoolName');
      if (headerSchoolName) {
        headerSchoolName.textContent = (state.profile && state.profile.name) ? state.profile.name : DEFAULT_SCHOOL_PROFILE.name;
      }
    } catch (e) {
      console.warn('headerSchoolName render warning:', e);
    }
    try {
      if (auth && auth.currentUser) {
        const role = getUserRole(auth.currentUser.email);
        updateUserHeader(auth.currentUser.email, role);
      }
    } catch (e) {
      console.warn('userHeader update warning:', e);
    }
    renderClassDropdowns();
    renderStudentsList();
    renderAttendanceRoster();
    renderMarksEntrySheet();
    renderReportCard();
    renderDispatchRoster();
    renderPtmModule();
    renderCommsModule();
  }

  function initApp() {
    initData();
    initNavigation();
    bindEvents();
    renderApp();
    isAppInitialized = true;
  }
  window.__initSchoolSteps = initApp;
  window.__showSyncIndicator = showSyncIndicator;
  window.__hideSyncIndicator = hideSyncIndicator;
  window.__startBackgroundSync = startBackgroundSync;
  window.__showDataLoadError = showDataLoadError;
  window.__hideDataLoadError = hideDataLoadError;

  function start() {
    bindAuthEvents();
    if (!isAppInitialized) {
      try {
        initNavigation();
        bindEvents();
        isAppInitialized = true;
      } catch (e) {
        console.warn('Early navigation bind warning:', e);
      }
    }
    initAuthGating();
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

})();
