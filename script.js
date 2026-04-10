// --- State & Storage ---
let currentLang = localStorage.getItem('lang') || 'ar';  // ✅ Language Persistence
let theme = localStorage.getItem('theme') || 'dark';
let logs = JSON.parse(localStorage.getItem('logs')) || [];
let flaggedPerson = JSON.parse(localStorage.getItem('flaggedPerson')) || [];
let flaggedCars = JSON.parse(localStorage.getItem('flaggedCars')) || [];
let reasons = JSON.parse(localStorage.getItem('reasons')) || ["Theft / سرقة", "Wanted / مطلوب"];
let registeredRegistry = JSON.parse(localStorage.getItem('registeredRegistry')) || [];
let currentLogFilter = 'person';
let lastSearchQuery = '';

// ✅ Full Bilingual Translations (All UI elements)
const translations = {
    ar: {
        admin_btn: "الأدمن",
        app_title: "أورورا X PRO",
        app_subtitle: "عقدة التدقيق والمراقبة",
        persons_search: "بحث الأشخاص",
        cars_search: "بحث السيارات",
        persons_search_title: "التحقق من الهوية",
        cars_search_title: "تتبع المركبة",
        search: "تحليل",
        admin_panel: "التحكم المتقدم",
        tab_flag_person: "إدراج هوية",
        tab_flag_car: "إدراج مركبة",
        log_col_name: "الاسم / اللوحة",
        log_col_info: "المعلومات",
        log_col_time: "التوقيت",
        log_col_status: "الحالة",
        log_tab_persons: "الأشخاص",
        log_tab_cars: "السيارات",
        from_date: "من:",
        to_date: "إلى:",
        flagged_persons_list: "قائمة الأشخاص المدرجين",
        flagged_cars_list: "قائمة السيارات المدرجة",
        th_name: "الاسم",
        th_reason: "السبب",
        th_delete: "حذف",
        th_plate: "اللوحة / الهيكل",
        tab_settings: "الإعدادات",
        upload_logo: "تغيير شعار النظام",
        remove_logo: "حذف الشعار واستعادة الأصلي",
        last_update: "آخر تحديث:",
        scan_id: "مسح رخصة / بطاقة هوية (OCR)",
        scanning: "جارِ التحليل، يرجى الانتظار...",
        scan_failed: "فشل التحليل، يرجى ملء البيانات يدوياً.",
        label_firstname: "الاسم الأول",
        label_lastname: "اللقب",
        lbl_reason: "سبب الطلب",
        plate_number: "رقم اللوحة",
        chassis_number: "رقم الهيكل",
        dob: "تاريخ الميلاد",
        add: "تأكيد الإدراج",
        status_safe: "✓ آمن",
        status_flagged: "مطلوب",
        status_new: "جديد — تم التسجيل",
        add_reason_placeholder: "أضف سبب جديد...",
        manage_reasons_title: "إدارة أسباب الطلب",
        audit_log_title: "سجل العمليات",
        person_placeholder_fn: "الاسم الأول",
        person_placeholder_ln: "اللقب",
        plate_placeholder: "رقم اللوحة",
        chassis_placeholder: "رقم الهيكل",
        ap_fname_ar: "الاسم (عربي)",
        ap_fname_fr: "الاسم (فرنسي)",
        ap_lname_ar: "اللقب (عربي)",
        ap_lname_fr: "اللقب (فرنسي)",
    },
    fr: {
        admin_btn: "Admin",
        app_title: "AURORA X PRO",
        app_subtitle: "Audit & Surveillance Node",
        persons_search: "Recherche ID",
        cars_search: "Suivi Véhicules",
        persons_search_title: "Vérification ID",
        cars_search_title: "Suivi Véhicules",
        search: "Analyser",
        admin_panel: "Contrôle Avancé",
        tab_flag_person: "Inclure ID",
        tab_flag_car: "Inclure Véhicule",
        log_col_name: "Nom / Plaque",
        log_col_info: "Infos",
        log_col_time: "Heure",
        log_col_status: "Statut",
        log_tab_persons: "Personnes",
        log_tab_cars: "Véhicules",
        from_date: "De:",
        to_date: "À:",
        flagged_persons_list: "Liste des Personnes Signalées",
        flagged_cars_list: "Liste des Véhicules Signalés",
        th_name: "Nom",
        th_reason: "Raison",
        th_delete: "Supprimer",
        th_plate: "Plaque / Châssis",
        tab_settings: "Paramètres",
        upload_logo: "Changer le logo",
        remove_logo: "Supprimer le logo",
        last_update: "Dernière mise à jour: ",
        scan_id: "Scanner ID / Permis (OCR)",
        scanning: "Analyse en cours...",
        scan_failed: "Échec, veuillez saisir manuellement.",
        label_firstname: "Prénom",
        label_lastname: "Nom",
        lbl_reason: "Raison",
        plate_number: "N° Matricule",
        chassis_number: "N° Châssis",
        dob: "Date de Naissance",
        add: "Confirmer",
        status_safe: "✓ Sécurisé",
        status_flagged: "RECHERCHÉ",
        status_new: "Nouveau — Enregistré",
        add_reason_placeholder: "Ajouter une raison...",
        manage_reasons_title: "Gestion des Raisons",
        audit_log_title: "Journal des Opérations",
        person_placeholder_fn: "Prénom",
        person_placeholder_ln: "Nom",
        plate_placeholder: "N° Matricule",
        chassis_placeholder: "N° Châssis",
        ap_fname_ar: "Prénom (AR)",
        ap_fname_fr: "Prénom (FR)",
        ap_lname_ar: "Nom (AR)",
        ap_lname_fr: "Nom (FR)",
    }
};

// ✅ Helper: Safely get input value (never undefined)
function safeVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

// ✅ Helper: Check if a value is meaningful
function isValid(val) {
    return val && val !== 'undefined' && val.length > 0;
}

// --- Theme ---
function updateTheme(newTheme) {
    theme = newTheme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    document.querySelector('#theme-toggle i').className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
}

// ✅ Deep Language Application (saves to localStorage)
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);                // ✅ Persist across F5

    document.documentElement.lang = lang;
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.getElementById('lang-switch').textContent = lang === 'ar' ? 'FR' : 'AR';

    // Translate all i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) el.textContent = translations[lang][key];
    });

    // ✅ Translate placeholders
    const phMap = {
        'p-first-name': 'person_placeholder_fn',
        'p-last-name': 'person_placeholder_ln',
        'c-plate': 'plate_placeholder',
        'c-chassis': 'chassis_placeholder',
        'ap-fname-ar': 'ap_fname_ar',
        'ap-fname-fr': 'ap_fname_fr',
        'ap-lname-ar': 'ap_lname_ar',
        'ap-lname-fr': 'ap_lname_fr',
        'new-reason-input': 'add_reason_placeholder',
        'ac-plate': 'plate_placeholder',
        'ac-chassis': 'chassis_placeholder',
    };
    Object.entries(phMap).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el && translations[lang][key]) el.placeholder = translations[lang][key];
    });

    // ✅ Translate Modal titles
    const reasonsTitle = document.getElementById('modal-reasons-title');
    const logsTitle = document.getElementById('modal-logs-title');
    if (reasonsTitle) reasonsTitle.textContent = translations[lang].manage_reasons_title;
    if (logsTitle) logsTitle.textContent = translations[lang].audit_log_title;

    // ✅ Back icon direction
    ['back-icon-p', 'back-icon-c'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.className = lang === 'ar' ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left';
    });

    // Re-render components with language specific text
    if (document.getElementById('modal-logs').classList.contains('show')) {
        renderLogsTable();
    }
    renderFlaggedLists();
    renderLastActivity();
}

// --- Branding & Logo Upload ---
function renderLogo() {
    const logoData = localStorage.getItem('appLogo');
    const imgId = document.getElementById('app-logo-img');
    const textId = document.getElementById('app-logo-text');
    if (imgId && textId) {
        if (logoData) {
            imgId.src = logoData;
            imgId.style.display = 'block';
            textId.style.display = 'none';
        } else {
            imgId.style.display = 'none';
            textId.style.display = 'block';
        }
    }
}

const logoInput = document.getElementById('logo-input');
if (logoInput) {
    logoInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (evt) {
                const b64 = evt.target.result;
                if (b64.length > 2500000) { // Limit to ~1.8MB
                    alert(currentLang === 'ar' ? 'مساحة الصورة كبيرة جداً (أقصى حد 2 مب)' : 'Image trop volumineuse (max 2MB)');
                    return;
                }
                localStorage.setItem('appLogo', b64);
                renderLogo();
                alert(currentLang === 'ar' ? '✓ تم تحديث الشعار' : '✓ Logo mis à jour');
            };
            reader.readAsDataURL(file);
        }
    });
}

function removeLogo() {
    if (!confirm(currentLang === 'ar' ? 'استعادة الشعار الأصلي ؟' : 'Restaurer le logo original?')) return;
    localStorage.removeItem('appLogo');
    renderLogo();
    document.getElementById('logo-input').value = '';
}

// --- Last Admin Activity Timestamp ---
function updateLastAdminActivity() {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    localStorage.setItem('lastAdminActivity', `${dateStr} ${timeStr}`);
    renderLastActivity();
}

function renderLastActivity() {
    const lastActive = localStorage.getItem('lastAdminActivity');
    const displayEl = document.getElementById('home-last-update');
    if (displayEl) {
        if (lastActive) {
            const prefix = translations[currentLang].last_update || "آخر تحديث لقاعدة البيانات:";
            displayEl.innerHTML = `<i class="fa-solid fa-clock-rotate-left" style="margin-inline-end: 5px;"></i>${prefix} <strong style="color:var(--primary); margin-inline-start: 5px;">${lastActive}</strong>`;
        } else {
            displayEl.innerHTML = '';
        }
    }
}

// --- Navigation & Tabs ---
function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(`${screenId}-screen`).classList.remove('hidden');
}

function switchAdminTab(tabId) {
    document.querySelectorAll('.admin-tab-content').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.premium-tabs .p-tab').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.remove('hidden');
    event.currentTarget.classList.add('active');
}

// --- Modals ---
function openModal(id) {
    document.getElementById(id).classList.add('show');
    if (id === 'modal-logs') renderLogsTable();
    if (id === 'modal-reasons') renderReasonsList();
}

function closeModal(id) {
    document.getElementById(id).classList.remove('show');
}

// --- Audit Logging ---
function addLog(data, status, type) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const timestamp = `${dateStr} ${timeStr}`;
    const timestampMs = now.getTime();

    // Prevent duplicate logs within 5 minutes
    const isDuplicate = logs.some(l => {
        if (l.type !== type || !l.timestampMs) return false;

        // Check time difference (300,000 ms = 5 mins)
        if (timestampMs - l.timestampMs > 300000) return false;

        const d1 = l.data || {};
        const d2 = data || {};

        if (type === 'person') {
            return d1.fn === d2.fn && d1.ln === d2.ln && d1.dob === d2.dob;
        } else {
            return d1.plate === d2.plate && d1.chassis === d2.chassis;
        }
    });

    if (isDuplicate) return; // Skip logging

    logs.unshift({ data, status, type, timestamp, timestampMs });
    localStorage.setItem('logs', JSON.stringify(logs));
}

function filterLogs(type) {
    currentLogFilter = type;
    document.querySelectorAll('.log-filter-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(`log-tab-${type}`).classList.add('active');
    renderLogsTable();
}

function renderLogsTable() {
    const tbody = document.getElementById('logs-tbody');
    const thead = document.querySelector('#logs-table thead tr');

    if (currentLogFilter === 'person') {
        thead.innerHTML = `
            <th>#</th>
            <th>${translations[currentLang].label_firstname}</th>
            <th>${translations[currentLang].label_lastname}</th>
            <th>${translations[currentLang].dob}</th>
            <th>${translations[currentLang].log_col_time}</th>
            <th>${translations[currentLang].log_col_status}</th>
        `;
    } else {
        thead.innerHTML = `
            <th>#</th>
            <th>${translations[currentLang].plate_number}</th>
            <th>${translations[currentLang].chassis_number}</th>
            <th>${translations[currentLang].log_col_time}</th>
            <th>${translations[currentLang].log_col_status}</th>
        `;
    }

    const fromStr = document.getElementById('log-from-date') ? document.getElementById('log-from-date').value : '';
    const toStr = document.getElementById('log-to-date') ? document.getElementById('log-to-date').value : '';

    let fromMs = 0;
    let toMs = Infinity;

    if (fromStr) fromMs = new Date(fromStr + 'T00:00:00').getTime();
    if (toStr) toMs = new Date(toStr + 'T23:59:59').getTime();

    const filteredLogs = logs.filter(l => {
        if (l.type !== currentLogFilter) return false;

        let lMs = l.timestampMs;
        if (!lMs && l.timestamp) {
            const cleanT = l.timestamp.replace(' ', 'T') + ':00';
            lMs = new Date(cleanT).getTime();
        }

        if (lMs) {
            if (fromStr && lMs < fromMs) return false;
            if (toStr && lMs > toMs) return false;
        }
        return true;
    });

    if (filteredLogs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-dim); padding: 2rem;">${currentLang === 'ar' ? 'لا توجد سجلات بعد' : 'No records yet'}</td></tr>`;
        return;
    }

    tbody.innerHTML = filteredLogs.map((l, index) => {
        const statusKey = l.status === 'Flagged' ? 'status_flagged' : l.status === 'Safe' ? 'status_safe' : 'status_new';
        const statusClass = l.status === 'Flagged' ? 'status-row-flagged' : 'status-row-safe';

        let colsHtml = '';
        const data = l.data || {};

        if (currentLogFilter === 'person') {
            let fn = data.fn || '';
            let ln = data.ln || '';
            let dob = data.dob || '';
            // Backward compatibility
            if (l.subject && !data.fn) { fn = l.subject.split(' ')[0] || ''; ln = l.subject.split(' ').slice(1).join(' ') || ''; dob = l.info || ''; }
            colsHtml = `<td>${fn || '—'}</td><td>${ln || '—'}</td><td>${dob || '—'}</td>`;
        } else {
            let plate = data.plate || '';
            let chassis = data.chassis || '';
            // Backward compatibility
            if (l.subject && !data.plate) { plate = l.subject || ''; chassis = l.info || ''; }
            colsHtml = `<td>${plate || '—'}</td><td>${chassis || '—'}</td>`;
        }

        return `
            <tr>
                <td>${index + 1}</td>
                ${colsHtml}
                <td style="font-family: monospace; white-space: nowrap;">${l.timestamp || '—'}</td>
                <td class="${statusClass}">${translations[currentLang][statusKey]}</td>
            </tr>
        `;
    }).join('');
}

// --- Reasons Management ---
function addNewReason() {
    const val = safeVal('new-reason-input');
    if (!isValid(val)) return;
    reasons.push(val);
    localStorage.setItem('reasons', JSON.stringify(reasons));
    document.getElementById('new-reason-input').value = '';
    renderReasonsList();
    populateDropdowns();
}

function deleteReason(index) {
    reasons.splice(index, 1);
    localStorage.setItem('reasons', JSON.stringify(reasons));
    renderReasonsList();
    populateDropdowns();
}

function renderReasonsList() {
    const list = document.getElementById('reasons-list');
    if (reasons.length === 0) {
        list.innerHTML = `<p style="text-align:center; color: var(--text-dim); padding: 1rem;">${currentLang === 'ar' ? 'لا توجد أسباب محددة بعد' : 'No reasons defined yet'}</p>`;
        return;
    }
    list.innerHTML = reasons.map((r, i) => `
        <div class="managed-item">
            <span>${r}</span>
            <button class="icon-btn" onclick="deleteReason(${i})" style="color: var(--danger);"><i class="fa-solid fa-trash-can"></i></button>
        </div>
    `).join('');
}

function populateDropdowns() {
    const html = reasons.length > 0
        ? reasons.map(r => `<option value="${r}">${r}</option>`).join('')
        : `<option value="">${currentLang === 'ar' ? '— اختر سبباً —' : '— Select a reason —'}</option>`;
    document.querySelectorAll('.reason-dropdown').forEach(d => d.innerHTML = html);
}

// --- OCR Logic ---
const ocrPersonUpload = document.getElementById('ocr-person-upload');
if (ocrPersonUpload) {
    ocrPersonUpload.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const btnText = document.getElementById('ocr-btn-text');
        btnText.innerText = translations[currentLang].scanning || "جارِ التحليل...";
        
        try {
            if (typeof Tesseract === 'undefined') throw new Error("Tesseract not loaded");
            const result = await Tesseract.recognize(file, 'fra+eng', {
                logger: m => {
                    if (m.status === 'recognizing text' && m.progress > 0) {
                        btnText.innerText = `${translations[currentLang].scanning} ${Math.round(m.progress * 100)}%`;
                    }
                }
            });
            
            parsePersonOCR(result.data.text);
        } catch (err) {
            console.error("OCR Error: ", err);
            alert(translations[currentLang].scan_failed || "فشل التحليل");
        } finally {
            btnText.innerText = translations[currentLang].scan_id;
            e.target.value = '';
        }
    });
}

function parsePersonOCR(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    let lName = "", fName = "";

    const dateMatch = text.match(/\b(\d{2})[\.\-\/](\d{2})[\.\-\/](\d{4})\b/);
    if (dateMatch) {
         document.getElementById('p-dob').value = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
    }

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (!lName && /^[1Ili\|\!]\s*[\.\,\-]?\s+(.+)$/.test(line)) {
            const val = line.replace(/^[1Ili\|\!]\s*[\.\,\-]?\s+/, '').trim();
            if (val.length > 1) lName = val;
        } else if (!fName && /^[2Zz]\s*[\.\,\-]?\s+(.+)$/.test(line)) {
            const val = line.replace(/^[2Zz]\s*[\.\,\-]?\s+/, '').trim();
            if (val.length > 1) fName = val;
        }
    }

    if (!lName || !fName) {
        const capsWords = lines.filter(l => /^[A-Z\s]+$/.test(l) && l.length > 2);
        if (capsWords.length >= 2) {
            if (!lName) lName = capsWords[0];
            if (!fName) fName = capsWords[1];
        }
    }

    if (fName) document.getElementById('p-first-name').value = fName;
    if (lName) document.getElementById('p-last-name').value = lName;
}

// --- Search: Persons ---
document.getElementById('person-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const fn = safeVal('p-first-name');
    const ln = safeVal('p-last-name');
    const dob = safeVal('p-dob');
    const resEl = document.getElementById('person-result');

    // ✅ Block empty searches
    if (!isValid(fn) || !isValid(ln) || !isValid(dob)) {
        resEl.classList.remove('hidden');
        resEl.className = 'status-badge status-new';
        resEl.innerHTML = `<i class="fa-solid fa-exclamation-triangle" style="font-size:2rem; margin-bottom: 10px;"></i><br>${currentLang === 'ar' ? 'يرجى ملء جميع الحقول' : 'Veuillez remplir tous les champs'}`;
        return;
    }

    const queryStr = `${fn}|${ln}|${dob}`.toLowerCase();
    if (lastSearchQuery === queryStr) {
        alert(currentLang === 'ar' ? 'تم إظهار النتيجة مسبقاً' : 'Résultat déjà affiché');
        return;
    }
    lastSearchQuery = queryStr;

    resEl.classList.remove('hidden');

    const flagged = flaggedPerson.find(p => {
        const fMatch = fn.toLowerCase() === (p.fAr || '').toLowerCase() || fn.toLowerCase() === (p.fFr || '').toLowerCase();
        const lMatch = ln.toLowerCase() === (p.lAr || '').toLowerCase() || ln.toLowerCase() === (p.lFr || '').toLowerCase();
        return fMatch && lMatch;
    });

    const name = `${fn} ${ln}`.trim();

    if (flagged) {
        addLog({ fn, ln, dob }, 'Flagged', 'person');
        resEl.className = 'status-badge status-flagged';
        resEl.innerHTML = `<i class="fa-solid fa-skull-crossbones" style="font-size:2.5rem; margin-bottom:10px;"></i><h3>${translations[currentLang].status_flagged} - ${name}</h3><p style="margin-top:8px;">${flagged.reason}</p>`;
    } else {
        const finger = `${fn}|${ln}|${dob}`.toLowerCase();
        const isSafe = registeredRegistry.includes(finger);
        if (!isSafe) registeredRegistry.push(finger);
        localStorage.setItem('registeredRegistry', JSON.stringify(registeredRegistry));

        const stKey = isSafe ? 'Safe' : 'New';
        addLog({ fn, ln, dob }, stKey, 'person');

        resEl.className = isSafe ? 'status-badge status-safe' : 'status-badge status-new';
        const icon = isSafe ? 'fa-shield-check' : 'fa-fingerprint';
        resEl.innerHTML = `<i class="fa-solid ${icon}" style="font-size:2.5rem; margin-bottom:10px;"></i><h3>${translations[currentLang][isSafe ? 'status_safe' : 'status_new']} - ${name}</h3>`;
    }
});

// --- Search: Cars ---
document.getElementById('car-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const plate = safeVal('c-plate');
    const vin = safeVal('c-chassis');
    const resEl = document.getElementById('car-result');

    // ✅ Block empty searches
    if (!isValid(plate) || !isValid(vin)) {
        resEl.classList.remove('hidden');
        resEl.className = 'status-badge status-new';
        resEl.innerHTML = `<i class="fa-solid fa-exclamation-triangle" style="font-size:2rem; margin-bottom:10px;"></i><br>${currentLang === 'ar' ? 'يرجى ملء جميع الحقول' : 'Veuillez remplir tous les champs'}`;
        return;
    }

    const queryStr = `${plate}|${vin}`.toLowerCase();
    if (lastSearchQuery === queryStr) {
        alert(currentLang === 'ar' ? 'تم إظهار النتيجة مسبقاً' : 'Résultat déjà affiché');
        return;
    }
    lastSearchQuery = queryStr;

    resEl.classList.remove('hidden');

    const flagged = flaggedCars.find(c =>
        (c.plate || '').toLowerCase() === plate.toLowerCase() ||
        (c.chassis || '').toLowerCase() === vin.toLowerCase()
    );

    if (flagged) {
        addLog({ plate, chassis: vin }, 'Flagged', 'car');
        resEl.className = 'status-badge status-flagged';
        resEl.innerHTML = `<i class="fa-solid fa-skull-crossbones" style="font-size:2.5rem; margin-bottom:10px;"></i><h3>${translations[currentLang].status_flagged} - ${plate}</h3><p style="margin-top:8px;">${flagged.reason}</p>`;
    } else {
        const finger = `${plate}|${vin}`.toLowerCase();
        const isSafe = registeredRegistry.includes(finger);
        if (!isSafe) registeredRegistry.push(finger);
        localStorage.setItem('registeredRegistry', JSON.stringify(registeredRegistry));

        const stKey = isSafe ? 'Safe' : 'New';
        addLog({ plate, chassis: vin }, stKey, 'car');

        resEl.className = isSafe ? 'status-badge status-safe' : 'status-badge status-new';
        const icon = isSafe ? 'fa-shield-check' : 'fa-car';
        resEl.innerHTML = `<i class="fa-solid ${icon}" style="font-size:2.5rem; margin-bottom:10px;"></i><h3>${translations[currentLang][isSafe ? 'status_safe' : 'status_new']} - ${plate}</h3>`;
    }
});

// --- Admin: Add Person ---
document.getElementById('admin-person-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const fAr = safeVal('ap-fname-ar');
    const fFr = safeVal('ap-fname-fr');
    const lAr = safeVal('ap-lname-ar');
    const lFr = safeVal('ap-lname-fr');
    const dob = safeVal('ap-dob');          // ✅ تاريخ الميلاد
    const reason = safeVal('ap-reason-select');

    if (!isValid(fAr) && !isValid(fFr) && !isValid(lAr) && !isValid(lFr) && !isValid(dob)) {
        alert(currentLang === 'ar' ? 'يرجى إدخال معلومة واحدة على الأقل' : 'Veuillez saisir au moins une information');
        return;
    }

    flaggedPerson.push({ fAr, fFr, lAr, lFr, dob, reason });
    localStorage.setItem('flaggedPerson', JSON.stringify(flaggedPerson));
    updateLastAdminActivity();
    alert(currentLang === 'ar' ? '✓ تم الإدراج في قاعدة البيانات' : '✓ Record added to database');
    this.reset();
    renderFlaggedLists();
});

// --- Admin: Add Car ---
document.getElementById('admin-car-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const plate = safeVal('ac-plate');
    const chassis = safeVal('ac-chassis');
    const reason = safeVal('ac-reason-select');

    // ✅ Block if both plate and chassis are empty
    if (!isValid(plate) && !isValid(chassis)) {
        alert(currentLang === 'ar' ? 'يرجى إدخال رقم اللوحة أو الهيكل على الأقل' : 'Veuillez saisir au moins la plaque ou le châssis');
        return;
    }

    flaggedCars.push({ plate, chassis, reason });
    localStorage.setItem('flaggedCars', JSON.stringify(flaggedCars));
    updateLastAdminActivity();
    alert(currentLang === 'ar' ? '✓ تم تسجيل المركبة في قاعدة البيانات' : '✓ Vehicle flagged in database');
    this.reset();
    renderFlaggedLists();
});

// --- Admin: Render & Delete Flagged Lists ---
function renderFlaggedLists() {
    const pBody = document.getElementById('flagged-persons-tbody');
    if (pBody) {
        if (flaggedPerson.length === 0) {
            pBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-dim); padding: 1rem;">${currentLang === 'ar' ? 'لا يوجد أشخاص مدرجين' : 'Aucune personne signalée'}</td></tr>`;
        } else {
            pBody.innerHTML = flaggedPerson.map((p, i) => {
                const fn = p.fAr || p.fFr || '—';
                const ln = p.lAr || p.lFr || '—';
                return `
                <tr>
                    <td>${i + 1}</td>
                    <td>${fn}</td>
                    <td>${ln}</td>
                    <td>${p.dob || '—'}</td>
                    <td>${p.reason || '—'}</td>
                    <td><button class="icon-btn del-btn" onclick="deleteFlaggedPerson(${i})"><i class="fa-solid fa-trash-can"></i></button></td>
                </tr>`;
            }).join('');
        }
    }

    const cBody = document.getElementById('flagged-cars-tbody');
    if (cBody) {
        if (flaggedCars.length === 0) {
            cBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-dim); padding: 1rem;">${currentLang === 'ar' ? 'لا توجد سيارات مدرجة' : 'Aucun véhicule signalé'}</td></tr>`;
        } else {
            cBody.innerHTML = flaggedCars.map((c, i) => {
                return `
                <tr>
                    <td>${i + 1}</td>
                    <td style="font-family: monospace;">${c.plate || '—'}</td>
                    <td style="font-family: monospace;">${c.chassis || '—'}</td>
                    <td>${c.reason || '—'}</td>
                    <td><button class="icon-btn del-btn" onclick="deleteFlaggedCar(${i})"><i class="fa-solid fa-trash-can"></i></button></td>
                </tr>`;
            }).join('');
        }
    }
}

function deleteFlaggedPerson(index) {
    if (!confirm(currentLang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Confirmer la suppression?')) return;
    flaggedPerson.splice(index, 1);
    localStorage.setItem('flaggedPerson', JSON.stringify(flaggedPerson));
    renderFlaggedLists();
}

function deleteFlaggedCar(index) {
    if (!confirm(currentLang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Confirmer la suppression?')) return;
    flaggedCars.splice(index, 1);
    localStorage.setItem('flaggedCars', JSON.stringify(flaggedCars));
    renderFlaggedLists();
}

// --- Event Bindings ---
document.getElementById('theme-toggle').addEventListener('click', () => updateTheme(theme === 'dark' ? 'light' : 'dark'));
document.getElementById('lang-switch').addEventListener('click', () => setLanguage(currentLang === 'ar' ? 'fr' : 'ar'));
document.getElementById('logs-trigger').addEventListener('click', () => openModal('modal-logs'));
document.getElementById('reasons-trigger').addEventListener('click', () => openModal('modal-reasons'));
document.getElementById('admin-nav-btn').addEventListener('click', (e) => { e.preventDefault(); navigateTo('admin'); });

// Close overlays by clicking outside
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(overlay.id); });
});

// ✅ Initialize: apply saved language (survives F5)
updateTheme(theme);
renderLogo();
renderLastActivity();
setLanguage(currentLang);
renderFlaggedLists();
populateDropdowns();
