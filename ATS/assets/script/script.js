const threats = {
  "Server": [
    { value: "Spoofing1", text: "Pencurian identitas pengguna untuk akses ilegal ke sistem" },
    { value: "Spoofing2", text: "Penggunaan kredensial palsu untuk mengakses data sensitif" },
    { value: "Spoofing3", text: "Meniru perangkat atau alamat IP untuk menyamar sebagai pengguna sah" },
  ],
  "Database": [
    { value: "Tampering1", text: "Mengubah konfigurasi server secara tidak sah" },
    { value: "Tampering2", text: "Memodifikasi data transaksi di database tanpa izin" },
    { value: "Tampering3", text: "Manipulasi data log untuk menyembunyikan aktivitas ilegal" },
  ],
  "Data Pengguna": [
    { value: "InformationDisclosure1", text: "Pengungkapan data pribadi pengguna tanpa izin" },
    { value: "InformationDisclosure2", text: "Akses ke file sistem yang mengandung informasi rahasia" },
    { value: "InformationDisclosure3", text: "Kebocoran kredensial atau token autentikasi" },
  ],
  "API Eksternal": [
    { value: "DenialOfService1", text: "Pembanjiran permintaan ke server sehingga layanan terganggu" },
    { value: "DenialOfService2", text: "Serangan DDoS yang mencegah akses pengguna sah" },
    { value: "DenialOfService3", text: "Mengonsumsi sumber daya sistem hingga sistem tidak dapat berfungsi" },
  ],
};

// Populate threats based on asset
document.getElementById("asset").addEventListener("change", function () {
  const asset = this.value;
  const threatSelect = document.getElementById("threat");
  threatSelect.innerHTML = threats[asset].map((threat) => `<option value="${threat.value}">${threat.text}</option>`).join("");
});

// Initialize threats for default asset
document.getElementById("asset").dispatchEvent(new Event("change"));

// Mitigasi Risiko berdasarkan Kasus STRIDE
function getMitigation(threatValue) {
  const mitigations = {
    Spoofing1: "Gunakan autentikasi dua faktor untuk mencegah pencurian identitas.",
    Spoofing2: "Lakukan validasi kredensial pengguna dengan sistem keamanan tambahan.",
    Spoofing3: "Terapkan pemeriksaan IP dan perangkat untuk mendeteksi akses tidak sah.",
    Tampering1: "Aktifkan logging dan monitoring konfigurasi server.",
    Tampering2: "Lakukan hashing dan enkripsi untuk melindungi data transaksi.",
    Tampering3: "Pantau aktivitas data log secara berkala untuk mendeteksi manipulasi.",
    Repudiation1: "Gunakan tanda tangan digital untuk memastikan keaslian transaksi.",
    Repudiation2: "Rekam semua aktivitas login untuk memudahkan pelacakan.",
    Repudiation3: "Gunakan audit trail untuk memverifikasi data yang diterima atau dikirim.",
    InformationDisclosure1: "Terapkan kontrol akses untuk membatasi pengungkapan data pribadi.",
    InformationDisclosure2: "Gunakan enkripsi pada file yang mengandung informasi sensitif.",
    InformationDisclosure3: "Segera perbarui kredensial atau token yang bocor.",
    DenialOfService1: "Gunakan firewall untuk membatasi akses permintaan yang mencurigakan.",
    DenialOfService2: "Gunakan load balancer untuk mengelola permintaan dengan lebih baik.",
    DenialOfService3: "Pantau penggunaan sumber daya sistem untuk mencegah overload.",
    ElevationOfPrivilege1: "Terapkan pembaruan keamanan untuk mencegah eksploitasi kerentanan.",
    ElevationOfPrivilege2: "Batasi akses administratif hanya untuk pengguna tepercaya.",
    ElevationOfPrivilege3: "Lakukan penilaian keamanan berkala untuk mendeteksi risiko eskalasi.",
  };

  return mitigations[threatValue] || "Mitigasi tidak tersedia untuk ancaman ini.";
}

// Fungsi untuk mendapatkan kategori STRIDE dari ancaman
function getStrideCategory(threatValue) {
  if (threatValue.startsWith("Spoofing")) return "Spoofing";
  if (threatValue.startsWith("Tampering")) return "Tampering";
  if (threatValue.startsWith("Repudiation")) return "Repudiation";
  if (threatValue.startsWith("InformationDisclosure")) return "Information Disclosure";
  if (threatValue.startsWith("DenialOfService")) return "Denial of Service";
  if (threatValue.startsWith("ElevationOfPrivilege")) return "Elevation of Privilege";
  return "Kategori tidak diketahui";
}

// Handle Generate Button
document.getElementById('generate').addEventListener('click', function () {
  const asset = document.getElementById('asset').value;
  const threat = document.getElementById('threat').selectedOptions[0];
  const threatValue = threat.value; // Value dari ancaman
  const threatText = threat.text; // Deskripsi ancaman
  const strideCategory = getStrideCategory(threatValue); // Ambil kategori STRIDE
  const damage = parseInt(document.getElementById('damage').value);
  const reproducibility = parseInt(document.getElementById('reproducibility').value);
  const exploitability = parseInt(document.getElementById('exploitability').value);
  const affectedUsers = parseInt(document.getElementById('affectedUsers').value);
  const discoverability = parseInt(document.getElementById('discoverability').value);

  // Hitung Skor DREAD
  const dreadScore = damage + reproducibility + exploitability + affectedUsers + discoverability;

  // Generate Mitigasi Risiko
  const mitigation = getMitigation(threatValue);

  // Generate Review Berdasarkan Skor DREAD
  const review = dreadScore > 25
    ? "Risiko sangat tinggi! Tindakan segera diperlukan."
    : "Risiko dapat ditangani.";

  // Tambahkan ke tabel hasil
  const tableRow = `
    <tr>
      <td>${asset}</td>
      <td>${strideCategory}</td>
      <td>${threatText}</td>
      <td>${dreadScore}</td>
      <td>${mitigation}</td>
      <td>${review}</td>
    </tr>
  `;
  document.getElementById('resultTable').innerHTML += tableRow;

  // Tampilkan grafik
  const ctx = document.getElementById('dreadChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Damage', 'Reproducibility', 'Exploitability', 'Affected Users', 'Discoverability'],
      datasets: [{
        label: 'Nilai DREAD',
        data: [damage, reproducibility, exploitability, affectedUsers, discoverability],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)', // Merah muda
          'rgba(54, 162, 235, 0.2)', // Biru
          'rgba(255, 206, 86, 0.2)', // Kuning
          'rgba(75, 192, 192, 0.2)', // Hijau
          'rgba(153, 102, 255, 0.2)' // Ungu
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 10
        }
      }
    }
  });
});

