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

  const [isKonsisten, setIsKonsisten] = useState(null);
  const [indikatorKonsisten, setIndikatorKonsisten] = useState('');

  const [keterbaruanActiveStatus, setKeterbaruanActiveStatus] = useState(true);
  const [trendingActiveStatus, setTrendingActiveStatus] = useState(true);
  const [profilKreatorActiveStatus, setProfilKreatorActiveStatus] =
    useState(true);
  const [leanCanvasActiveStatus, setLeanCanvasActiveStatus] = useState(true);
  const [teamActiveStatus, setTeamActiveStatus] = useState(true);
  const [attachmentActiveStatus, setAttachmentActiveStatus] = useState(true);

  const [jumLikeActiveStatus, setJumLikeActiveStatus] = useState(true);
  const [jumKomentarActiveStatus, setJumKomentarActiveStatus] = useState(true);
  const [bounceRateActiveStatus, setBounceRateActiveStatus] = useState(true);

  const [jumIdeActiveStatus, setJumIdeActiveStatus] = useState(true);
  const [perLikeActiveStatus, setPerLikeActiveStatus] = useState(true);
  const [perKomentarActiveStatus, setPerKomentarActiveStatus] = useState(true);
  const [jumAchievementActiveStatus, setJumAchievementActiveStatus] =
    useState(true);

  const [customerActiveStatus, setCustomerActiveStatus] = useState(true);
  const [problemActiveStatus, setProblemActiveStatus] = useState(true);
  const [earlyAdopterActiveStatus, setEarlyAdopterActiveStatus] =
    useState(true);
  const [existingSolutionActiveStatus, setExistingSolutionActiveStatus] =
    useState(true);
  const [uniqueValueActiveStatus, setUniqueValueActiveStatus] = useState(true);
  const [proposedSolutionActiveStatus, setProposedSolutionActiveStatus] =
    useState(true);

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

  const criteriaIteration = async (fullAHP = false, multipleData = 1) => {
    var t0 = performance.now();
    setLoading({...loading, visible: true});
    const rataRata = ahpIteratingCustom(
      [
        valueKeterbaruan,
        valueTrending,
        valueProfilKreator,
        valueLeanCanvas,
        valueJumlahTeam,
        valueJumlahAttachment,
        // 1, 0, 0,
      ],
      [
        keterbaruanActiveStatus,
        trendingActiveStatus,
        profilKreatorActiveStatus,
        leanCanvasActiveStatus,
        teamActiveStatus,
        attachmentActiveStatus,
        // true,
        // true,
        // true,
      ],
    );

    console.log(rataRata.rataRata);
    // console.log(rataRata.consistentValue);
    // console.log(rataRata.konsisten);

    const bobotKriteriaKeterbaruan = rataRata.rataRata[0];

    const rataRataSubTrending = ahpIteratingCustom(
      [valueLike, valueComment, valueBounceRate],
      [jumLikeActiveStatus, jumKomentarActiveStatus, bounceRateActiveStatus],
    );
    const bobotKriteriaLike =
      rataRataSubTrending.rataRata[0] * rataRata.rataRata[1];
    const bobotKriteriaComment =
      rataRataSubTrending.rataRata[1] * rataRata.rataRata[1];
    const bobotKriteriaBounceRate =
      rataRataSubTrending.rataRata[2] * rataRata.rataRata[1];

    const rataRataSubProfilKreator = ahpIteratingCustom(
      [
        valueJumlahIde,
        valuePerolehanLike,
        valuePerolehanKomentar,
        valueJumlahAchievement,
      ],
      [
        jumIdeActiveStatus,
        perLikeActiveStatus,
        perKomentarActiveStatus,
        jumAchievementActiveStatus,
      ],
    );
    const bobotKriteriaJumlahIde =
      rataRataSubProfilKreator.rataRata[0] * rataRata.rataRata[2];
    const bobotKriteriaPerolehanLike =
      rataRataSubProfilKreator.rataRata[1] * rataRata.rataRata[2];
    const bobotKriteriaPerolehanKomentar =
      rataRataSubProfilKreator.rataRata[2] * rataRata.rataRata[2];
    const bobotKriteriaJumlahAchievement =
      rataRataSubProfilKreator.rataRata[3] * rataRata.rataRata[2];

    const rataRataSubLeanCanvas = ahpIteratingCustom(
      [
        valueCustomer,
        valueProblem,
        valueEarlyAdopter,
        valueExistingSolution,
        valueUniqueValue,
        valueProposedSolution,
      ],
      [
        customerActiveStatus,
        problemActiveStatus,
        earlyAdopterActiveStatus,
        existingSolutionActiveStatus,
        uniqueValueActiveStatus,
        proposedSolutionActiveStatus,
      ],
    );
    const bobotKriteriaCustomer =
      rataRataSubLeanCanvas.rataRata[0] * rataRata.rataRata[3];
    const bobotKriteriaProblem =
      rataRataSubLeanCanvas.rataRata[1] * rataRata.rataRata[3];
    const bobotKriteriaEarlyAdopter =
      rataRataSubLeanCanvas.rataRata[2] * rataRata.rataRata[3];
    const bobotKriteriaExistingSolution =
      rataRataSubLeanCanvas.rataRata[3] * rataRata.rataRata[3];
    const bobotKriteriaUniqueValue =
      rataRataSubLeanCanvas.rataRata[4] * rataRata.rataRata[3];
    const bobotKriteriaProposedSolution =
      rataRataSubLeanCanvas.rataRata[5] * rataRata.rataRata[3];

    const bobotKriteriaJumlahTeam = rataRata.rataRata[4];

    const bobotKriteriaJumlahAttachment = rataRata.rataRata[5];

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

    // console.log(pembobotan);

    let statusKonsistensi = true;
    if (
      !rataRata.konsisten ||
      !rataRataSubTrending.konsisten ||
      !rataRataSubProfilKreator.konsisten ||
      !rataRataSubLeanCanvas.konsisten
    ) {
      statusKonsistensi = false;
    }

    setIsKonsisten(statusKonsistensi);

    if (statusKonsistensi) {
      const BC = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      let norm = null;
      let ideasValues = [];
      for (let i = 0; i < multipleData; i++) {
        ideasValues = ideasValues.concat(route.params?.ideasValues);
      }

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

      // let ideasValues = [];
      // for (let i = 0; i < multipleData; i++) {
      //   ideasValues = ideasValues.concat(route.params?.ideasValues);
      // }

      let originalIdea = [];
      for (let i = 0; i < multipleData; i++) {
        originalIdea = originalIdea.concat(route.params?.ideaDataList);
      }

      let result = [];
      originalIdea.map((ideaData, index) => {
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
      setRankingResult(result);
    }

    setIndikatorKonsisten(
      `${parseFloat(rataRata.consistentValue.toFixed(3))} - ${parseFloat(
        rataRataSubTrending.consistentValue.toFixed(3),
      )} - ${parseFloat(
        rataRataSubProfilKreator.consistentValue.toFixed(3),
      )} - ${parseFloat(rataRataSubLeanCanvas.consistentValue.toFixed(3))}`,
    );
    setLoading({...loading, visible: false});
    var t1 = performance.now();
    console.log('Call to doSomething took ' + (t1 - t0) + ' milliseconds.');
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
    return isValid;
  };

  const iteratingTimeTest = async (fullAhp = false) => {
    var t0 = performance.now();
    for (let i = 0; i < 10000; i++) {
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
          isActive={keterbaruanActiveStatus}
          onCbPress={res => setKeterbaruanActiveStatus(res)}
        />
        <Gap height={8} />
        <CardSlideSingleValueSetter
          title="Trending"
          value={valueTrending}
          onValueChange={res => setValueTrending(res)}
          isActive={trendingActiveStatus}
          onCbPress={res => setTrendingActiveStatus(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Jumlah Like"
          value={valueLike}
          onValueChange={res => setValueLike(res)}
          isActive={jumLikeActiveStatus}
          onCbPress={res => setJumLikeActiveStatus(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Jumlah Komentar"
          value={valueComment}
          onValueChange={res => setValueComment(res)}
          isActive={jumKomentarActiveStatus}
          onCbPress={res => setJumKomentarActiveStatus(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Bounce Rate"
          value={valueBounceRate}
          onValueChange={res => setValueBounceRate(res)}
          isActive={bounceRateActiveStatus}
          onCbPress={res => setBounceRateActiveStatus(res)}
        />
        <Gap height={8} />
        <CardSlideSingleValueSetter
          title="Profil Kreator"
          value={valueProfilKreator}
          onValueChange={res => setValueProfilKreator(res)}
          isActive={profilKreatorActiveStatus}
          onCbPress={res => setProfilKreatorActiveStatus(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Jumlah Ide"
          value={valueJumlahIde}
          onValueChange={res => setValueJumlahIde(res)}
          isActive={jumIdeActiveStatus}
          onCbPress={res => setJumIdeActiveStatus(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Perolehan Like"
          value={valuePerolehanLike}
          onValueChange={res => setValuePerolehanLike(res)}
          isActive={perLikeActiveStatus}
          onCbPress={res => setPerLikeActiveStatus(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Perolehan Komentar"
          value={valuePerolehanKomentar}
          onValueChange={res => setValuePerolehanKomentar(res)}
          isActive={perKomentarActiveStatus}
          onCbPress={res => setPerKomentarActiveStatus(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Jumlah Achievement"
          value={valueJumlahAchievement}
          onValueChange={res => setValueJumlahAchievement(res)}
          isActive={jumAchievementActiveStatus}
          onCbPress={res => setJumAchievementActiveStatus(res)}
        />
        <Gap height={8} />
        <CardSlideSingleValueSetter
          title="Lean Canvas"
          value={valueLeanCanvas}
          onValueChange={res => setValueLeanCanvas(res)}
          isActive={leanCanvasActiveStatus}
          onCbPress={res => setLeanCanvasActiveStatus(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Customer"
          value={valueCustomer}
          onValueChange={res => setValueCustomer(res)}
          isActive={customerActiveStatus}
          onCbPress={res => setCustomerActiveStatus(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Problem"
          value={valueProblem}
          onValueChange={res => setValueProblem(res)}
          isActive={problemActiveStatus}
          onCbPress={res => setProblemActiveStatus(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Early Adopter"
          value={valueEarlyAdopter}
          onValueChange={res => setValueEarlyAdopter(res)}
          isActive={earlyAdopterActiveStatus}
          onCbPress={res => setEarlyAdopterActiveStatus(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Existing Solution"
          value={valueExistingSolution}
          onValueChange={res => setValueExistingSolution(res)}
          isActive={existingSolutionActiveStatus}
          onCbPress={res => setExistingSolutionActiveStatus(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Unique Value"
          value={valueUniqueValue}
          onValueChange={res => setValueUniqueValue(res)}
          isActive={uniqueValueActiveStatus}
          onCbPress={res => setUniqueValueActiveStatus(res)}
        />
        <CardSlideSingleValueSetter
          tingkatHierarki={1}
          title="Proposed Solution"
          value={valueProposedSolution}
          onValueChange={res => setValueProposedSolution(res)}
          isActive={proposedSolutionActiveStatus}
          onCbPress={res => setProposedSolutionActiveStatus(res)}
        />
        <Gap height={8} />
        <CardSlideSingleValueSetter
          title="Jumlah Team"
          value={valueJumlahTeam}
          onValueChange={res => setValueJumlahTeam(res)}
          isActive={teamActiveStatus}
          onCbPress={res => setTeamActiveStatus(res)}
        />
        <Gap height={8} />
        <CardSlideSingleValueSetter
          title="Jumlah Attachment"
          value={valueJumlahAttachment}
          onValueChange={res => setValueJumlahAttachment(res)}
          isActive={attachmentActiveStatus}
          onCbPress={res => setAttachmentActiveStatus(res)}
        />
        {/* <Gap height={25} /> */}
      </ScrollView>
      <View style={{padding: 16}}>
        {isKonsisten !== null && isKonsisten !== undefined && (
          <>
            <Text
              style={{
                fontFamily: fonts.secondary[500],
                fontSize: 15,
                color: isKonsisten ? colors.success : colors.reject,
              }}>
              {isKonsisten ? `Consistent Statement` : `Inconsistent Statement`}
            </Text>
            <Text
              style={{
                fontFamily: fonts.secondary[500],
                fontSize: 15,
                color: isKonsisten ? colors.success : colors.reject,
              }}>
              {`CR = ${indikatorKonsisten}`}
            </Text>
            <Gap height={16} />
          </>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              criteriaIteration(true);
              // iteratingTimeTest(true);
            }}
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
              // iteratingTimeTest(false);
            }}
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
          disabled={rangkingResult === null || !isKonsisten}
          style={{
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
            backgroundColor:
              rangkingResult !== null && isKonsisten
                ? colors.success
                : colors.divider,
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
      </View>
      <LoadingProcessFull visible={loading.visible} message={loading.message} />
    </View>
  );
};

export default CriteriaPreferenceSetter;

const styles = StyleSheet.create({});
