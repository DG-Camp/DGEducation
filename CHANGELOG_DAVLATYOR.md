# 5.3 Dars Ko‘rish & 5.4 Test/Quiz Moduli — O‘zgarishlar va Yangiliklar

**Muallif:** Davlatyor Xaitov (xaitovdavlatyor6@gmail.com)  
**Loyiha:** [DG-Camp / DGEducation](https://github.com/DG-Camp/DGEducation)  
**Modul papkasi:** `/davlatyor/`

---

## 📌 Asosiy Bajarilgan Ishlar va Qo‘shilgan Imkoniyatlar

Ushbu modul **Digital Generation Edu** platformasi uchun **5.3 Dars Ko‘rish Sahifasi** va **5.4 Test/Quiz Interaktiv Tizimi**ni o‘z ichiga olgan to‘liq, mustaqil va jamoaviy ishlashga qulay arxitekturada yaratildi.

Barcha fayllar hech qanday ortiqcha bog‘liqliklarsiz yagona **`/davlatyor/`** papkasida jamlangan.

---

## 📂 Loyiha Strukturasi (`/davlatyor/`)

```bash
davlatyor/
├── index.ts                     # Modulning yagona asosiy eksport nuqtasi
├── types.ts                     # Darslar, Quiz, Savollar, Qaydlar bo‘yicha to‘liq TypeScript tiplari
├── data/
│   └── mockCourses.ts           # Frontend & Backend amaliy kurslari, video darslar va test savollari
├── quiz/                        # 5.4 Test/Quiz moduli
│   ├── QuizComponent.tsx        # Interaktiv savollar, timer, variantlar tanlash, javoblar tahlili va natijalar
│   ├── QuizModal.tsx            # Testni modal oyna ko‘rinishida ochish
│   ├── LessonQuizView.tsx       # Dars va test integratsiyalashgan sahifa
│   └── index.ts                 # Quiz komponentlari eksporti
└── lessons/                     # 5.3 Dars Ko‘rish moduli
    ├── LessonViewPage.tsx       # Asosiy dars ko‘rish sahifasi va darslararo navigatsiya
    ├── index.ts                 # Lessons komponentlari eksporti
    └── components/
        ├── VideoPlayer.tsx      # Video darslar uchun moslashtirilgan player
        ├── LessonContent.tsx    # Dars tavsifi, rejasi va test chaqiruvi
        ├── LessonSidebar.tsx    # Modullar mundarijasi va umumiy progress hisobi
        ├── LessonNotes.tsx      # Dars davomida shaxsiy qaydlar yozish va saqlash
        └── LessonResources.tsx  # PDF qo‘llanmalar, slaydlar va foydali manbalar
```

---

## 🚀 Funksionalliklar

### 1. 5.3 Dars Ko‘rish Sahifasi (`/davlatyor/lessons/`)
* **Video Player**: Video oqimi boshqaruvi, vaqt hisobi, to‘liq ekran va dars tugaganda avtomatik progress belgilash.
* **Mavzu Mundarijasi (Sidebar)**: Barcha modullar va darslar ro‘yxati, tugallangan darslar statusi va foiz ko‘rsatkichi.
* **Tablar tizimi**:
  - **Mavzu Tafsiloti**: Dars maqsadi va qisqacha ma'lumotlar.
  - **5.4 Test / Quiz**: To‘g‘ridan-to‘g‘ri dars ichida test topshirish.
  - **Qaydlar**: Dars bo‘yicha shaxsiy izohlarni saqlash va boshqarish.
  - **Resurslar**: Yuklab olinadigan PDF materiallar, starter kodlar va GitHub havolalari.

### 2. 5.4 Test / Quiz Moduli (`/davlatyor/quiz/`)
* **Vaqt chegarasi (Timer)**: Har bir test uchun belgilangan vaqt hisoblagichi.
* **Kod namunalari (Code snippet)**: Dasturlash savollari uchun sintaksis rangli bloklar.
* **Natijalar tahlili**: O‘tish bali (`passPercentage`), to‘g‘ri/noto‘g‘ri javoblar ko‘rsatkichi, tushuntirish izohlari (`explanation`) va qayta topshirish imkoniyati.
* **Konfetti animatsiyasi**: Muvaffaqiyatli o‘tganda tabriklash effekti.

---

## 🛠 GitHub ga Yuklash / Branch Yaratish Ko‘rsatmasi

Jamoaviy repozitoriyga (`https://github.com/DG-Camp/DGEducation`) qo‘shish uchun:

```bash
# 1. Yangi branch yarating
git checkout -b feature/davlatyor-lessons-and-quiz

# 2. Fayllarni qo'shing
git add davlatyor/ src/App.tsx CHANGELOG_DAVLATYOR.md

# 3. Commit qiling
git commit -m "feat(davlatyor): implement 5.3 Lesson View and 5.4 Quiz interactive modules"

# 4. Repozitoriyga push qiling
git push origin feature/davlatyor-lessons-and-quiz
```
