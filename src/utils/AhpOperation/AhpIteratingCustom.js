const ahpIteratingCustom = (criteria = []) => {
  const ri = [
    0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49, 1.51, 1.48, 1.56, 1.57,
    1.59,
  ];

  const kriteria = [...criteria];
  const jumlahKriteria = kriteria.length;
  let totalNilaiKriteria = 0;
  kriteria.map(item => {
    totalNilaiKriteria += item;
  });
  const pengaliKonvert = 8 / totalNilaiKriteria;

  let iterasiArray = kriteria.map((item1, index1) => {
    return kriteria.map((item2, index2) => {
      let cellValue = item1 - item2;
      if (cellValue >= 0) {
        cellValue = (item1 - item2) * pengaliKonvert + 1;
      } else {
        cellValue = 1 / ((item1 - item2) * pengaliKonvert * -1 + 1);
      }
      return cellValue;
    });
  });

  let total = new Array(kriteria.length).fill(0);
  iterasiArray.map((item1, index1) => {
    item1.map((item2, index2) => {
      total[index2] += item2;
    });
  });

  let rataRata = new Array(kriteria.length).fill(0);
  iterasiArray.map((item1, index1) => {
    item1.map((item2, index2) => {
      rataRata[index1] += parseFloat(
        (item2 / total[index2] / kriteria.length).toFixed(4),
      );
    });
  });

  let totalRataRata = 0;
  rataRata.map(item => {
    totalRataRata += item;
  });

  let pev = 0;
  total.map((item, index) => {
    pev += item * rataRata[index];
  });

  const ci = (pev - kriteria.length) / (kriteria.length - 1);

  const cr = ci / ri[kriteria.length - 1];

  // console.log('Jumlah kriteria =', jumlahKriteria);
  // console.log('Total nilai kriteria =', totalNilaiKriteria);
  // console.log('Pengali konvert =', pengaliKonvert);
  // console.log('Kriteria =', kriteria);
  // console.log('///////// Iterasi //////////');
  // console.log(iterasiArray);
  // console.log('////////////////////////////');
  // console.log('Total =', total);
  // console.log('Rata-rata =', rataRata);
  // console.log(totalRataRata.toFixed(8) == 1);
  // console.log('Total rata-rata =', parseFloat(totalRataRata.toFixed(8)));
  // console.log('PEV =', pev);
  // console.log('CI =', ci);
  // console.log('CR =', cr);
  return {rataRata: rataRata, konsisten: cr <= 0.1 || jumlahKriteria <= 2};
};

export default ahpIteratingCustom;
