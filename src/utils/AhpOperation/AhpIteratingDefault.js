const ahpIteratingDefault = (pairedValue = []) => {
  const ri = [
    0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49, 1.51, 1.48, 1.56, 1.57,
    1.59,
  ];
  // const kriteria = [Math.floor((Math.random() * 999) + 1), 1235, 423, 65, 756, 45, 788, 12];

  let jumlahKriteria = 0;
  for (let i = 0; i < 100; i++) {
    jumlahKriteria = i;
    if (pairedValue.length === i * ((i - 1) / 2)) {
      break;
    }
  }

  let iterasiArray = [];
  for (let i = 0; i < jumlahKriteria; i++) {
    iterasiArray.push([]);
    for (let j = 0; j < jumlahKriteria; j++) {
      iterasiArray[i].push(0);
    }
  }

  // pakai skala -8 sampai 8
  let counterReadPairedValueIndex = 0;
  for (let i = 0; i < jumlahKriteria; i++) {
    for (let j = 0; j < jumlahKriteria; j++) {
      if (i === j) {
        iterasiArray[i][j] = 1;
      }
      if (i < j) {
        let convertedValueToScale = 1;
        if (pairedValue[counterReadPairedValueIndex] < 0) {
          convertedValueToScale =
            1 / (pairedValue[counterReadPairedValueIndex] * -1 + 1);
        } else if (pairedValue[counterReadPairedValueIndex] > 0) {
          convertedValueToScale = pairedValue[counterReadPairedValueIndex] + 1;
        }
        iterasiArray[i][j] = convertedValueToScale;
        counterReadPairedValueIndex += 1;
      }
      if (i > j) {
        iterasiArray[i][j] = 1 / iterasiArray[j][i];
      }
    }
  }

  // iterasiArray.map(item => console.log(item));

  let total = new Array(jumlahKriteria).fill(0);
  iterasiArray.map((item1, index1) => {
    item1.map((item2, index2) => {
      total[index2] += item2;
    });
  });

  let rataRata = new Array(jumlahKriteria).fill(0);
  iterasiArray.map((item1, index1) => {
    item1.map((item2, index2) => {
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

  const ci = (pev - jumlahKriteria) / (jumlahKriteria - 1);

  const cr = ci / ri[jumlahKriteria - 1];

  // console.log('Jumlah kriteria =', jumlahKriteria);
  // console.log('///////// Iterasi //////////');
  // console.log(iterasiArray);
  // console.log('////////////////////////////');
  // console.log('Total =', total);
  // console.log('Rata-rata =', rataRata);
  // console.log('Total rata-rata =', parseFloat(totalRataRata.toFixed(8)));
  // console.log('PEV =', pev);
  // console.log('CI =', ci);
  // console.log('CR =', cr);
  return {
    rataRata: rataRata,
    konsisten: cr <= 0.1 || jumlahKriteria <= 2,
    consistentValue: cr,
  };
};

export default ahpIteratingDefault;
