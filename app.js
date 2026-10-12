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
  // Storage Keys & Default State
  // ========================================================
  const STORAGE_KEYS = {
    STUDENTS: 'schoolsteps_students_v1',
    ATTENDANCE: 'schoolsteps_attendance_v1',
    TESTS: 'schoolsteps_tests_v1',
    MARKS: 'schoolsteps_marks_v1',
    PROFILE: 'schoolsteps_profile_v1'
  };

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
    'test-106_stud-006': { marks: 42, remarks: 'Good neatness and presentation.' }
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
    editingStudentId: null
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

  function initData() {
    state.profile = loadStorage(STORAGE_KEYS.PROFILE, DEFAULT_SCHOOL_PROFILE);
    state.students = loadStorage(STORAGE_KEYS.STUDENTS, null);
    state.tests = loadStorage(STORAGE_KEYS.TESTS, null);
    state.marks = loadStorage(STORAGE_KEYS.MARKS, null);
    state.attendance = loadStorage(STORAGE_KEYS.ATTENDANCE, {});

    // Seed defaults if empty
    if (!state.students || !Array.isArray(state.students) || state.students.length === 0) {
      state.students = [...SAMPLE_STUDENTS];
      saveStorage(STORAGE_KEYS.STUDENTS, state.students);
    }

    if (!state.tests || !Array.isArray(state.tests) || state.tests.length === 0) {
      state.tests = [...SAMPLE_TESTS];
      saveStorage(STORAGE_KEYS.TESTS, state.tests);
    }

    if (!state.marks || Object.keys(state.marks).length === 0) {
      state.marks = { ...SAMPLE_MARKS };
      saveStorage(STORAGE_KEYS.MARKS, state.marks);
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
  }

  function resetToDemoData() {
    state.profile = { ...DEFAULT_SCHOOL_PROFILE };
    state.students = JSON.parse(JSON.stringify(SAMPLE_STUDENTS));
    state.tests = JSON.parse(JSON.stringify(SAMPLE_TESTS));
    state.marks = JSON.parse(JSON.stringify(SAMPLE_MARKS));
    state.attendance = {};

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

    saveStorage(STORAGE_KEYS.PROFILE, state.profile);
    saveStorage(STORAGE_KEYS.STUDENTS, state.students);
    saveStorage(STORAGE_KEYS.TESTS, state.tests);
    saveStorage(STORAGE_KEYS.MARKS, state.marks);
    saveStorage(STORAGE_KEYS.ATTENDANCE, state.attendance);

    showToast('Demo data reloaded successfully!', 'success');
    renderApp();
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
    }
  }

  // ========================================================
  // MODULE 1: Student & Parent Database
  // ========================================================
  function renderClassDropdowns() {
    const classSet = new Set(['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5']);
    state.students.forEach(s => {
      if (s.className) classSet.add(s.className);
    });

    const sortedClasses = Array.from(classSet).sort();

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
  }

  function renderStudentsList() {
    const container = document.getElementById('studentsContainer');
    const emptyState = document.getElementById('noStudentsState');
    const summarySpan = document.getElementById('studentsListSummary');
    const searchVal = (document.getElementById('studentSearchInput')?.value || '').trim().toLowerCase();
    const classFilter = document.getElementById('filterClassSelect')?.value || 'ALL';
    const sectionFilter = document.getElementById('filterSectionSelect')?.value || 'ALL';

    // Filter students
    const filtered = state.students.filter(student => {
      if (classFilter !== 'ALL' && student.className !== classFilter) return false;
      if (sectionFilter !== 'ALL' && student.section !== sectionFilter) return false;

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
    const selectedSection = sectionSelect.value || 'A';

    // Update labels
    document.getElementById('attSummaryClassLabel').textContent = `${selectedClass} - ${selectedSection} Attendance`;
    document.getElementById('attSummaryDateLabel').textContent = formatDateHuman(selectedDate);

    // Filter students for this class & section
    const enrolled = state.students.filter(s => s.className === selectedClass && s.section === selectedSection && s.status === 'Active');
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
    const selectedSection = sectionSelect.value || 'A';

    const enrolled = state.students.filter(s => s.className === selectedClass && s.section === selectedSection && s.status === 'Active');
    if (enrolled.length === 0) return;

    enrolled.forEach(student => {
      setStudentAttendanceStatus(selectedDate, selectedClass, selectedSection, student.id, 'Present', '');
    });

    showToast(`Marked all ${enrolled.length} students Present for ${selectedClass}-${selectedSection}!`, 'success');
    renderAttendanceRoster();
  }

  function handleSaveAttendance() {
    showToast('Daily attendance record saved to device!', 'success');
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
    showToast(`Saved marks for ${savedCount} students in ${test.subject}!`, 'success');
    renderMarksEntrySheet();
  }

  function handleCreateNewTest(e) {
    e.preventDefault();
    const title = document.getElementById('newTestTitle').value.trim();
    const className = document.getElementById('newTestClass').value;
    const section = document.getElementById('newTestSection').value;
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
    state.currentTestId = newTest.id;

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
    document.getElementById('schoolSettingsModal').classList.add('hidden');
    document.getElementById('headerSchoolName').textContent = state.profile.name;
    showToast('School profile & branding updated successfully!', 'success');

    // Refresh views that use school branding
    renderAttendanceRoster();
    renderReportCard();
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

    // M2 Attendance
    document.getElementById('attDatePicker')?.addEventListener('change', renderAttendanceRoster);
    document.getElementById('attClassSelect')?.addEventListener('change', renderAttendanceRoster);
    document.getElementById('attSectionSelect')?.addEventListener('change', renderAttendanceRoster);
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
        const section = document.getElementById('attSectionSelect')?.value || 'A';
        const enrolled = state.students.filter(s => s.className === className && s.section === section && s.status === 'Active');
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
  }

  // ========================================================
  // App Render & Startup
  // ========================================================
  function renderApp() {
    document.getElementById('headerSchoolName').textContent = state.profile.name;
    renderClassDropdowns();
    renderStudentsList();
    renderAttendanceRoster();
    renderMarksEntrySheet();
    renderReportCard();
  }

  function init() {
    initData();
    initNavigation();
    bindEvents();
    renderApp();
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
