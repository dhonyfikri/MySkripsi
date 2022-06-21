import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CardSlideSingleValueSetter from '../../../components/CardSlideSingleValueSetter';
import Gap from '../../../components/Gap';
import Header from '../../../components/Header';
import LoadingProcessFull from '../../../components/LoadingProcessFull';
import ahpIteratingCustom from '../../../utils/AhpOperation/AhpIteratingCustom';
import {colors} from '../../../utils/ColorsConfig/Colors';
import fonts from '../../../utils/FontsConfig/Fonts';

const CriteriaPreferenceSetter = ({navigation, route}) => {
  const [rangkingResult, setRankingResult] = useState(null);
  const [loading, setLoading] = useState({
    visible: false,
    message: 'Please wait',
  });

  const [valueKeterbaruan, setValueKeterbaruan] = useState(50);
  const [valueTrending, setValueTrending] = useState(50);
  const [valueProfilKreator, setValueProfilKreator] = useState(50);
  const [valueLeanCanvas, setValueLeanCanvas] = useState(50);
  const [valueJumlahTeam, setValueJumlahTeam] = useState(50);
  const [valueJumlahAttachment, setValueJumlahAttachment] = useState(50);

  const [valueLike, setValueLike] = useState(50);
  const [valueComment, setValueComment] = useState(50);
  const [valueBounceRate, setValueBounceRate] = useState(50);

  const [valueJumlahIde, setValueJumlahIde] = useState(50);
  const [valuePerolehanLike, setValuePerolehanLike] = useState(50);
  const [valuePerolehanKomentar, setValuePerolehanKomentar] = useState(50);
  const [valueJumlahAchievement, setValueJumlahAchievement] = useState(50);

  const [valueCustomer, setValueCustomer] = useState(50);
  const [valueProblem, setValueProblem] = useState(50);
  const [valueEarlyAdopter, setValueEarlyAdopter] = useState(50);
  const [valueExistingSolution, setValueExistingSolution] = useState(50);
  const [valueUniqueValue, setValueUniqueValue] = useState(50);
  const [valueProposedSolution, setValueProposedSolution] = useState(50);

  const arrayTranspose = arr => {
    const dimens = [arr.length, arr.reduce((x, y) => Math.max(x, y.length), 0)];
    const transpose = [];
    for (let i = 0; i < dimens[1]; i++) {
      transpose.push([]);
      for (let j = 0; j < dimens[0]; j++) {
        transpose[i].push(arr[j][i]);
      }
    }
    return transpose;
  };

  const criteriaIteration = (fullAHP = false) => {
    setLoading({...loading, visible: true});
    const rataRata = ahpIteratingCustom([
      valueKeterbaruan,
      valueTrending,
      valueProfilKreator,
      valueLeanCanvas,
      valueJumlahTeam,
      valueJumlahAttachment,
    ]).rataRata;

    const rataRataSubKeterbaruan = ahpIteratingCustom([
      valueKeterbaruan,
    ]).rataRata;
    const bobotKriteriaKeterbaruan = rataRataSubKeterbaruan[0] * rataRata[0];

    const rataRataSubTrending = ahpIteratingCustom([
      valueLike,
      valueComment,
      valueBounceRate,
    ]).rataRata;
    const bobotKriteriaLike = rataRataSubTrending[0] * rataRata[1];
    const bobotKriteriaComment = rataRataSubTrending[1] * rataRata[1];
    const bobotKriteriaBounceRate = rataRataSubTrending[2] * rataRata[1];

    const rataRataSubProfilKreator = ahpIteratingCustom([
      valueJumlahIde,
      valuePerolehanLike,
      valuePerolehanKomentar,
      valueJumlahAchievement,
    ]).rataRata;
    const bobotKriteriaJumlahIde = rataRataSubProfilKreator[0] * rataRata[2];
    const bobotKriteriaPerolehanLike =
      rataRataSubProfilKreator[1] * rataRata[2];
    const bobotKriteriaPerolehanKomentar =
      rataRataSubProfilKreator[2] * rataRata[2];
    const bobotKriteriaJumlahAchievement =
      rataRataSubProfilKreator[3] * rataRata[2];

    const rataRataSubLeanCanvas = ahpIteratingCustom([
      valueCustomer,
      valueProblem,
      valueEarlyAdopter,
      valueExistingSolution,
      valueUniqueValue,
      valueProposedSolution,
    ]).rataRata;
    const bobotKriteriaCustomer = rataRataSubLeanCanvas[0] * rataRata[3];
    const bobotKriteriaProblem = rataRataSubLeanCanvas[1] * rataRata[3];
    const bobotKriteriaEarlyAdopter = rataRataSubLeanCanvas[2] * rataRata[3];
    const bobotKriteriaExistingSolution =
      rataRataSubLeanCanvas[3] * rataRata[3];
    const bobotKriteriaUniqueValue = rataRataSubLeanCanvas[4] * rataRata[3];
    const bobotKriteriaProposedSolution =
      rataRataSubLeanCanvas[5] * rataRata[3];

    const rataRataSubJumlahTeam = ahpIteratingCustom([
      valueJumlahTeam,
    ]).rataRata;
    const bobotKriteriaJumlahTeam = rataRataSubJumlahTeam[0] * rataRata[4];

    const rataRataSubJumlahAttachment = ahpIteratingCustom([
      valueJumlahAttachment,
    ]).rataRata;
    const bobotKriteriaJumlahAttachment =
      rataRataSubJumlahAttachment[0] * rataRata[5];

    // const bobotTotal =
    //   bobotKriteriaKeterbaruan +
    //   bobotKriteriaLike +
    //   bobotKriteriaComment +
    //   bobotKriteriaBounceRate +
    //   bobotKriteriaJumlahIde +
    //   bobotKriteriaPerolehanLike +
    //   bobotKriteriaPerolehanKomentar +
    //   bobotKriteriaJumlahAchievement +
    //   bobotKriteriaCustomer +
    //   bobotKriteriaProblem +
    //   bobotKriteriaEarlyAdopter +
    //   bobotKriteriaExistingSolution +
    //   bobotKriteriaUniqueValue +
    //   bobotKriteriaProposedSolution +
    //   bobotKriteriaJumlahTeam +
    //   bobotKriteriaJumlahAttachment;
    // console.log(parseFloat(bobotTotal.toFixed(8)));

    const pembobotan = [
      bobotKriteriaKeterbaruan,
      bobotKriteriaLike,
      bobotKriteriaComment,
      bobotKriteriaBounceRate,
      bobotKriteriaJumlahIde,
      bobotKriteriaPerolehanLike,
      bobotKriteriaPerolehanKomentar,
      bobotKriteriaJumlahAchievement,
      bobotKriteriaCustomer,
      bobotKriteriaProblem,
      bobotKriteriaEarlyAdopter,
      bobotKriteriaExistingSolution,
      bobotKriteriaUniqueValue,
      bobotKriteriaProposedSolution,
      bobotKriteriaJumlahTeam,
      bobotKriteriaJumlahAttachment,
    ];

    console.log(pembobotan);

    const BC = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    let norm = null;
    const ideasValues = route.params?.ideasValues;
    for (let i = 0; i < ideasValues.length; i++) {
      if (i === 0) {
        norm = [...ideasValues[i]];
      } else {
        for (let j = 0; j < ideasValues[i].length; j++) {
          if (BC[j] === 0) {
            if (ideasValues[i][j] < norm[j]) {
              norm[j] = ideasValues[i][j];
            }
          } else {
            if (ideasValues[i][j] > norm[j]) {
              norm[j] = ideasValues[i][j];
            }
          }
        }
      }
    }

    let afterNorm = [];
    for (let i = 0; i < ideasValues.length; i++) {
      afterNorm.push([]);
      for (let j = 0; j < ideasValues[i].length; j++) {
        if (BC[j] === 0) {
          afterNorm[i].push(
            parseFloat((norm[j] / ideasValues[i][j]).toFixed(4)),
          );
        } else {
          afterNorm[i].push(
            parseFloat((ideasValues[i][j] / norm[j]).toFixed(4)),
          );
        }
      }
    }

    if (fullAHP) {
      // const aa = [
      //   [1, 2, 3, 4],
      //   [5, 6, 7, 8],
      //   [9, 10, 11, 12],
      // ];
      // const transposeAa = arrayTranspose([...aa]);
      // const iteratedAa = [];
      // for (let i = 0; i < transposeAa.length; i++) {
      //   iteratedAa.push(ahpIteratingCustom(transposeAa[i]).rataRata);
      // }
      // console.log(iteratedAa);
      // console.log(arrayTranspose([...iteratedAa]));

      const transposedAfterNorm = arrayTranspose([...afterNorm]);
      const iteratedTransposedAfterNorm = [];
      for (let i = 0; i < transposedAfterNorm.length; i++) {
        iteratedTransposedAfterNorm.push(
          ahpIteratingCustom(transposedAfterNorm[i]).rataRata,
        );
      }
      afterNorm = arrayTranspose([...iteratedTransposedAfterNorm]);
    }

    const scoreList = [];
    afterNorm.map(item => {
      let tempScore = 0;
      item.map((item2, index2) => {
        tempScore = tempScore + item2 * pembobotan[index2];
      });
      scoreList.push(tempScore);
    });

    let result = [];
    route.params?.ideaDataList.map((ideaData, index) => {
      result.push({
        ...ideaData,
        score: scoreList[index],
        pembobotan: pembobotan,
        normValue: afterNorm[index],
      });
    });

    result = result.sort((a, b) => {
      return b.score - a.score;
    });

    setLoading({...loading, visible: false});
    setRankingResult(result);
  };

  const validatingValue = () => {
    let isValid = true;
    if (
      valueKeterbaruan +
        valueTrending +
        valueProfilKreator +
        valueLeanCanvas +
        valueJumlahTeam +
        valueJumlahAttachment ===
      0
    ) {
      isValid = false;
    }
    if (valueKeterbaruan === 0) {
      isValid = false;
    }
    if (valueLike + valueComment + valueBounceRate === 0) {
      isValid = false;
    }
    if (
      valueJumlahIde +
        valuePerolehanLike +
        valuePerolehanKomentar +
        valueJumlahAchievement ===
      0
    ) {
      isValid = false;
    }
    if (
      valueCustomer +
        valueProblem +
        valueEarlyAdopter +
        valueExistingSolution +
        valueUniqueValue +
        valueProposedSolution ===
      0
    ) {
      isValid = false;
    }
    if (valueJumlahTeam === 0) {
      isValid = false;
    }
    if (valueJumlahAttachment === 0) {
      isValid = false;
    }
    return isValid;
  };

  const iteratingTimeTest = (fullAhp = false) => {
    var t0 = performance.now();
    for (let i = 0; i < 1000; i++) {
      criteriaIteration(fullAhp);
    }
    var t1 = performance.now();
    console.log('Call to doSomething took ' + (t1 - t0) + ' milliseconds.');
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <Header
        backButton
        onBackPress={() => navigation.goBack()}
        backText="Back"
        title="Preference Setter"
        withNotification={false}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 16}}>
        <CardSlideSingleValueSetter
          title="Keterbaruan"
          value={valueKeterbaruan}
          onValueChange={res => setValueKeterbaruan(res)}
        />
        <Gap height={8} />
        <CardSlideSingleValueSetter
          title="Trending"
          value={valueTrending}
          onValueChange={res => setValueTrending(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Jumlah Like"
          value={valueLike}
          onValueChange={res => setValueLike(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Jumlah Komentar"
          value={valueComment}
          onValueChange={res => setValueComment(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Bounce Rate"
          value={valueBounceRate}
          onValueChange={res => setValueBounceRate(res)}
        />
        <Gap height={8} />
        <CardSlideSingleValueSetter
          title="Profil Kreator"
          value={valueProfilKreator}
          onValueChange={res => setValueProfilKreator(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Jumlah Ide"
          value={valueJumlahIde}
          onValueChange={res => setValueJumlahIde(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Perolehan Like"
          value={valuePerolehanLike}
          onValueChange={res => setValuePerolehanLike(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Perolehan Komentar"
          value={valuePerolehanKomentar}
          onValueChange={res => setValuePerolehanKomentar(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Jumlah Achievement"
          value={valueJumlahAchievement}
          onValueChange={res => setValueJumlahAchievement(res)}
        />
        <Gap height={8} />
        <CardSlideSingleValueSetter
          title="Lean Canvas"
          value={valueLeanCanvas}
          onValueChange={res => setValueLeanCanvas(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Customer"
          value={valueCustomer}
          onValueChange={res => setValueCustomer(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Problem"
          value={valueProblem}
          onValueChange={res => setValueProblem(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Early Adopter"
          value={valueEarlyAdopter}
          onValueChange={res => setValueEarlyAdopter(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Existing Solution"
          value={valueExistingSolution}
          onValueChange={res => setValueExistingSolution(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Unique Value"
          value={valueUniqueValue}
          onValueChange={res => setValueUniqueValue(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Proposed Solution"
          value={valueProposedSolution}
          onValueChange={res => setValueProposedSolution(res)}
        />
        <Gap height={8} />
        <CardSlideSingleValueSetter
          title="Jumlah Team"
          value={valueJumlahTeam}
          onValueChange={res => setValueJumlahTeam(res)}
        />
        <Gap height={8} />
        <CardSlideSingleValueSetter
          title="Jumlah Attachment"
          value={valueJumlahAttachment}
          onValueChange={res => setValueJumlahAttachment(res)}
        />
        <Gap height={30} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              criteriaIteration(true);
            }}
            // onLongPress={() => iteratingTimeTest(true)}
            disabled={!validatingValue()}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: validatingValue()
                ? colors.primary
                : colors.divider,
            }}>
            <Text
              style={{
                fontFamily: fonts.secondary[500],
                fontSize: 15,
                color: colors.white,
              }}>
              Iterating AHP
            </Text>
          </TouchableOpacity>
          <Gap width={8} />
          <TouchableOpacity
            onPress={() => {
              criteriaIteration(false);
            }}
            // onLongPress={() => iteratingTimeTest(false)}
            disabled={!validatingValue()}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: validatingValue()
                ? colors.primary
                : colors.divider,
            }}>
            <Text
              style={{
                fontFamily: fonts.secondary[500],
                fontSize: 15,
                color: colors.white,
              }}>
              Iterating AHP SAW
            </Text>
          </TouchableOpacity>
        </View>
        <Gap height={8} />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ResultRank', {
              userToken: route.params?.userToken,
              listUserData: route.params?.listUserData,
              newIdeaDataList: rangkingResult,
            });
          }}
          disabled={rangkingResult === null}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
            backgroundColor:
              rangkingResult !== null ? colors.success : colors.divider,
          }}>
          <Text
            style={{
              fontFamily: fonts.secondary[500],
              fontSize: 15,
              color: colors.white,
            }}>
            View Result
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <LoadingProcessFull visible={loading.visible} message={loading.message} />
    </View>
  );
};

export default CriteriaPreferenceSetter;

const styles = StyleSheet.create({});
