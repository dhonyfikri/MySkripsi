const ahpIteratingCustom = (criteria = [], activeStatus) => {
  const ri = [
    0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49, 1.51, 1.48, 1.56, 1.57,
    1.59,
  ];

  let activeIndex = new Array(criteria.length).fill(true);
  if (
    activeStatus !== null &&
    activeStatus !== undefined &&
    activeStatus.length === criteria.length
  ) {
    activeIndex = activeStatus;
  }

  const kriteria = criteria.filter((_, index) => activeIndex[index] === true);
  const jumlahKriteria = kriteria.length;
  let totalNilaiKriteria = 0;
  kriteria.map(item => {
    totalNilaiKriteria += item;
  });
  const pengaliKonvert = 8 / totalNilaiKriteria; //ini akumulasi semuanya

  let iterasiArray = kriteria.map((item1, index1) => {
    return kriteria.map((item2, index2) => {
      let cellValue = item1 - item2;
      // const pengaliKonvert = 8 / (item1 + item2); //ini akumulasi perbandingan cell
      if (cellValue >= 0) {
        cellValue = (item1 - item2) * pengaliKonvert + 1;
      } else {
        cellValue = 1 / ((item1 - item2) * pengaliKonvert * -1 + 1);
      }
      return cellValue;
    });
  });

  console.log(iterasiArray);

  let total = new Array(kriteria.length).fill(0);
  iterasiArray.map((item1, index1) => {
    item1.map((item2, index2) => {
      total[index2] += item2;
    });
  });

  let rataRata = new Array(kriteria.length).fill(0);
  iterasiArray.map((item1, index1) => {
    item1.map((item2, index2) => {
      // rataRata[index1] += parseFloat(
      //   (item2 / total[index2] / kriteria.length).toFixed(4),
      // );
      rataRata[index1] += item2 / total[index2] / jumlahKriteria;
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

  let cr = 0;
  if (kriteria.length > 2) {
    if (kriteria.length <= 15) {
      cr = ci / ri[kriteria.length - 1];
    } else {
      cr = ci / ri.slice(-1)[0];
    }
  }

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

  const fixRataRata = [];
  let rataRataReadPointer = 0;
  for (let i = 0; i < activeIndex.length; i++) {
    if (activeIndex[i] === true) {
      fixRataRata.push(rataRata[rataRataReadPointer]);
      rataRataReadPointer += 1;
    } else {
      fixRataRata.push(0);
    }
  }

  // console.log(fixRataRata);

  return {
    rataRata: fixRataRata,
    konsisten: cr <= 0.1 || jumlahKriteria <= 2,
    consistentValue: cr,
  };
};

export default ahpIteratingCustom;
