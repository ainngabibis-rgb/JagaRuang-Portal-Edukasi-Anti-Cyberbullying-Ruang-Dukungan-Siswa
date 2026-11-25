// Isi URL Web App Google Apps Script setelah deployment.
// Kosongkan ("") jika ingin menguji mode penyimpanan lokal sementara sebelum deploy.
const APPS_SCRIPT_URL = "";

const eduData = [
  {
    category: "verbal",
    badge: "Komentar & Intimidasi",
    title: "Ejekan Berulang & Ancaman Pesan",
    desc: "Pesan menghina, mempermalukan, atau mengancam yang dikirim berulang kali melalui komentar, DM, atau pesan langsung.",
    tips: [
      "Simpan tangkapan layar beserta tanggal dan akun pengirim sebagai bukti.",
      "Jangan membalas dengan emosi yang memancing konflik lanjutan.",
      "Blokir dan laporkan akun ke platform terkait."
    ]
  },
  {
    category: "privasi",
    badge: "Penyebaran Data/Konten",
    title: "Membagikan Foto atau Informasi Tanpa Izin",
    desc: "Mengunggah foto, chat pribadi, atau data seseorang tanpa persetujuan untuk mempermalukan atau menekan korban.",
    tips: [
      "Dokumentasikan bukti penyebaran secara aman tanpa menyebarkannya ulang.",
      "Segera hubungi orang tua, wali kelas, atau guru BK untuk pendampingan.",
      "Perketat pengaturan privasi akun dan verifikasi dua langkah."
    ]
  },
  {
    category: "sosial",
    badge: "Pengucilan Daring",
    title: "Mengucilkan dari Grup & Rumor Terkoordinasi",
    desc: "Mengeluarkan seseorang dari grup secara tiba-tiba atau menyebarkan narasi negatif agar dijauhi lingkungan pertemanan.",
    tips: [
      "Cari dukungan dari teman tepercaya, konselor sekolah, atau keluarga.",
      "Hindari menyebarkan balasan rumor yang belum terverifikasi faktanya.",
      "Catat dampak emosional yang dirasakan dan minta bantuan bila mulai mengganggu tidur atau belajar."
    ]
  }
];

const aiSimulations = {
  komentar: {
    label: "Simulasi Edukasi — Komentar Berulang",
    steps: [
      "Ambil napas sejenak dan beri jeda sebelum membalas pesan.",
      "Ambil tangkapan layar (screenshot) bukti komentar beserta konteks waktunya.",
      "Gunakan fitur blokir/batasi komentar dan ceritakan kejadian ini kepada guru BK atau orang tua."
    ],
    verificationNote: "Diverifikasi secara manual: saran menekankan keselamatan digital dan pendampingan orang dewasa tepercaya, bukan diagnosis psikologis."
  },
  grup: {
    label: "Simulasi Edukasi — Pengucilan di Grup",
    steps: [
      "Ingat bahwa diperlakukan tidak adil di ruang digital bukan berarti nilai dirimu rendah.",
      "Simpan informasi penting yang relevan dengan pelajaran bila diperlukan.",
      "Diskusikan situasi ini dengan wali kelas atau guru BK agar dinamika kelas bisa ditangani secara sehat."
    ],
    verificationNote: "Diverifikasi secara manual: bahasa dibuat empatik dan mengarah pada penyelesaian yang konstruktif di sekolah."
  },
  foto: {
    label: "Simulasi Edukasi — Penyebaran Konten Tanpa Izin",
    steps: [
      "Hentikan penyebaran lanjutan dan simpan bukti tautan/tangkapan layar secara hati-hati.",
      "Segera beri tahu orang tua atau guru BK agar dapat mengambil langkah perlindungan secepatnya.",
      "Laporkan pelanggaran privasi/konten ke layanan platform dan perbarui keamanan akun."
    ],
    verificationNote: "Diverifikasi secara manual: mengutamakan perlindungan keamanan dan eskalasi ke pihak berwenang/sekolah."
  },
  ancaman: {
    label: "Simulasi Edukasi — Pesan Ancaman",
    steps: [
      "Jangan memenuhi tuntutan ancaman atau mengirimkan uang/data pribadi apa pun.",
      "Simpan seluruh bukti pesan dan segera laporkan ke orang tua, pihak sekolah, atau kanal bantuan resmi.",
      "Jika merasa keselamatan terancam secara langsung, segera minta bantuan darurat melalui orang dewasa/pihak berwenang."
    ],
    verificationNote: "Diverifikasi secara manual: prioritas tinggi pada keselamatan fisik dan pelaporan segera ke pihak tepercaya."
  }
};

const eduCardsEl = document.getElementById("eduCards");
const filterButtons = document.querySelectorAll(".filter-btn");
const scenarioSelect = document.getElementById("scenarioSelect");
const generateSimBtn = document.getElementById("generateSimBtn");
const simResultEl = document.getElementById("simResult");
const reportForm = document.getElementById("reportForm");
const formStatusEl = document.getElementById("formStatus");

function renderEduCards(category = "semua") {
  const filtered = category === "semua"
    ? eduData
    : eduData.filter((item) => item.category === category);

  eduCardsEl.innerHTML = filtered.map((item) => `
    <article class="card">
      <span class="card-badge">${item.badge}</span>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
      <ul>
        ${item.tips.map((tip) => `<li>${tip}</li>`).join("")}
      </ul>
    </article>
  `).join("");
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderEduCards(btn.dataset.category);
  });
});

generateSimBtn.addEventListener("click", () => {
  const selectedKey = scenarioSelect.value;
  const data = aiSimulations[selectedKey];

  simResultEl.innerHTML = `
    <p><strong>${data.label}</strong></p>
    <ol style="padding-left: 1.2rem; margin-block: 0.5rem; display: grid; gap: 0.35rem;">
      ${data.steps.map((step) => `<li>${step}</li>`).join("")}
    </ol>
    <p class="muted" style="font-size: 0.85rem;">${data.verificationNote}</p>
  `;
});

reportForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const aliasName = document.getElementById("aliasName").value.trim();
  const incidentType = document.getElementById("incidentType").value;
  const summary = document.getElementById("summary").value.trim();
  const consentChecked = document.getElementById("consentCheck").checked;

  if (!aliasName || !incidentType || !summary || !consentChecked) {
    formStatusEl.textContent = "Lengkapi semua kolom wajib dan centang pernyataan simulasi.";
    formStatusEl.style.color = "#b91c1c";
    return;
  }

  const payload = {
    aliasName,
    incidentType,
    summary,
    mode: "SIMULASI_EDUKASI",
    timestamp: new Date().toISOString()
  };

  formStatusEl.textContent = "Mengirim catatan simulasi...";
  formStatusEl.style.color = "#526071";

  try {
    if (!APPS_SCRIPT_URL) {
      const existing = JSON.parse(localStorage.getItem("jagaruang_sim_reports") || "[]");
      existing.push(payload);
      localStorage.setItem("jagaruang_sim_reports", JSON.stringify(existing));

      formStatusEl.textContent = "Tersimpan di browser (mode uji lokal). Hubungkan URL Apps Script untuk mengirim ke Google Sheets.";
      formStatusEl.style.color = "#0f766e";
      reportForm.reset();
      return;
    }

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    formStatusEl.textContent = "Catatan simulasi berhasil dikirim ke Google Sheets.";
    formStatusEl.style.color = "#0f766e";
    reportForm.reset();
  } catch (err) {
    formStatusEl.textContent = "Gagal mengirim data. Periksa koneksi atau konfigurasi Google Apps Script.";
    formStatusEl.style.color = "#b91c1c";
  }
});

renderEduCards();
