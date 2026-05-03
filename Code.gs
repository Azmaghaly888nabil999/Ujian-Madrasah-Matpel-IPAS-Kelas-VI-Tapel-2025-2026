function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('Asesmen Madrasah IPAS 2025/2026')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function processExam(formData) {
  const FOLDER_ID = "1LY3ker_gQaSW5q_cIIDnaSh64DkKwqlF"; // ID dari link Drive Anda
  const keys = [
    "A","B","C","C","D","D","B","A","C","B", // 1-10
    "D","B","A","C","A","B,D","A,B","C,D","B,D","B,C", // 11-20
    "B,S,S","S,B,B","S,B,S","B,S,S","B,S,B", // 21-25 (B=True, S=False)
    "1B,2A,3C","1C,2B,3A","1B,2C,3A","1B,2B,3A","1A,2B,3C", // 26-30
    "Kunci31","Kunci32","Kunci33","Kunci34","Kunci35", // 31-35 (Uraian)
    "A","B","C","D","A","B","C","D","A","B","C","D","A","B","C" // 36-50 (Tambahan)
  ];

  let score = calculateScore(formData, keys);
  let fileName = "Hasil_" + formData.nisn + "_" + formData.nama + ".pdf";
  
  // Logika pembuatan PDF hasil dan simpan ke Drive
  let blob = createResultBlob(formData, score);
  let folder = DriveApp.getFolderById(FOLDER_ID);
  folder.createFile(blob).setName(fileName);

  return {score: score, status: "Success"};
}

function calculateScore(data, keys) {
  let correct = 0;
  // Logika sederhana: Menghitung total benar / total soal * 100
  // Untuk implementasi praktis, setiap soal memiliki bobot 2 poin (50 x 2 = 100)
  for(let i=1; i<=50; i++) {
    if(data['q'+i] == keys[i-1]) correct++;
  }
  return (correct / 50) * 100;
}

function createResultBlob(data, score) {
  let html = `<h1>Hasil Ujian IPAS</h1>
              <p>Nama: ${data.nama}</p>
              <p>Kelas: ${data.kelas}</p>
              <p>NISN: ${data.nisn}</p>
              <hr>
              <h2>Skor Akhir: ${score} / 100</h2>`;
  return Utilities.newBlob(html, 'text/html', 'hasil.html').getAs('application/pdf');
}
