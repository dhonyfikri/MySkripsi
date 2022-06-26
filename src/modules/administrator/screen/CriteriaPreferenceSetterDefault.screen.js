import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CardSlideDoubleValueSetter from '../../../components/CardSlideDoubleValueSetter';
import Gap from '../../../components/Gap';
import Header from '../../../components/Header';
import LoadingProcessFull from '../../../components/LoadingProcessFull';
import ahpIteratingCustom from '../../../utils/AhpOperation/AhpIteratingCustom';
import ahpIteratingDefault from '../../../utils/AhpOperation/AhpIteratingDefault';
import {colors} from '../../../utils/ColorsConfig/Colors';
import fonts from '../../../utils/FontsConfig/Fonts';

const CriteriaPreferenceSetterDefault = ({navigation, route}) => {
  const [rangkingResult, setRankingResult] = useState(null);
  const [loading, setLoading] = useState({
    visible: false,
    message: 'Please wait',
  });

  const [isKonsisten, setIsKonsisten] = useState(null);
  const [indikatorKonsisten, setIndikatorKonsisten] = useState('');

  const [valueKeterbaruanToTrending, setValueKeterbaruanToTrending] =
    useState(0);
  const [valueKeterbaruanToProfilKreator, setValueKeterbaruanToProfilKreator] =
    useState(0);
  const [valueKeterbaruanToLeanCanvas, setValueKeterbaruanToLeanCanvas] =
    useState(0);
  const [valueKeterbaruanToJumlahTeam, setValueKeterbaruanToJumlahTeam] =
    useState(0);
  const [
    valueKeterbaruanToJumlahAttachment,
    setValueKeterbaruanToJumlahAttachment,
  ] = useState(0);
  const [valueTrendingToProfilKreator, setValueTrendingToProfilKreator] =
    useState(0);
  const [valueTrendingToLeanCanvas, setValueTrendingToLeanCanvas] = useState(0);
  const [valueTrendingToJumlahTeam, setValueTrendingToJumlahTeam] = useState(0);
  const [valueTrendingToJumlahAttachment, setValueTrendingToJumlahAttachment] =
    useState(0);
  const [valueProfilKreatorToLeanCanvas, setValueProfilKreatorToLeanCanvas] =
    useState(0);
  const [valueProfilKreatorToJumlahTeam, setValueProfilKreatorToJumlahTeam] =
    useState(0);
  const [
    valueProfilKreatorToJumlahAttachment,
    setValueProfilKreatorToJumlahAttachment,
  ] = useState(0);
  const [valueLeanCanvasToJumlahTeam, setValueLeanCanvasToJumlahTeam] =
    useState(0);
  const [
    valueLeanCanvasToJumlahAttachment,
    setValueLeanCanvasToJumlahAttachment,
  ] = useState(0);
  const [
    valueJumlahTeamToJumlahAttachment,
    setValueJumlahTeamToJumlahAttachment,
  ] = useState(0);

  const [valueLikeToComment, setValueLikeToComment] = useState(0);
  const [valueLikeToBounceRate, setValueLikeToBounceRate] = useState(0);
  const [valueCommentToBounceRate, setValueCommentToBounceRate] = useState(0);

  const [valueJumlahIdeToJumlahLike, setValueJumlahIdeToJumlahLike] =
    useState(0);
  const [valueJumlahIdeToJumlahKomentar, setValueJumlahIdeToJumlahKomentar] =
    useState(0);
  const [
    valueJumlahIdeToJumlahAchievement,
    setValueJumlahIdeToJumlahAchievement,
  ] = useState(0);
  const [valueJumlahLikeToJumlahKomentar, setValueJumlahLikeToJumlahKomentar] =
    useState(0);
  const [
    valueJumlahLikeToJumlahAchievement,
    setValueJumlahLikeToJumlahAchievement,
  ] = useState(0);
  const [
    valueJumlahKomentarToJumlahAchievement,
    setValueJumlahKomentarToJumlahAchievement,
  ] = useState(0);

  const [valueCustomerToProblem, setValueCustomerToProblem] = useState(0);
  const [valueCustomerToEarlyAdopter, setValueCustomerToEarlyAdopter] =
    useState(0);
  const [valueCustomerToExistingSolution, setValueCustomerToExistingSolution] =
    useState(0);
  const [valueCustomerToUniqueValue, setValueCustomerToUniqueValue] =
    useState(0);
  const [valueCustomerToProposedSolution, setValueCustomerToProposedSolution] =
    useState(0);
  const [valueProblemToEarlyAdopter, setValueProblemToEarlyAdopter] =
    useState(0);
  const [valueProblemToExistingSolution, setValueProblemToExistingSolution] =
    useState(0);
  const [valueProblemToUniqueValue, setValueProblemToUniqueValue] = useState(0);
  const [valueProblemToProposedSolution, setValueProblemToProposedSolution] =
    useState(0);
  const [
    valueEarlyAdopterToExistingSolution,
    setValueEarlyAdopterToExistingSolution,
  ] = useState(0);
  const [valueEarlyAdopterToUniqueValue, setValueEarlyAdopterToUniqueValue] =
    useState(0);
  const [
    valueEarlyAdopterToProposedSolution,
    setValueEarlyAdopterToProposedSolution,
  ] = useState(0);
  const [
    valueExistingSolutionToUniqueValue,
    setValueExistingSolutionToUniqueValue,
  ] = useState(0);
  const [
    valueExistingSolutionToProposedSolution,
    setValueExistingSolutionToProposedSolution,
  ] = useState(0);
  const [
    valueUniqueValueToProposedSolution,
    setValueUniqueValueToProposedSolution,
  ] = useState(0);

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
    const rataRata = ahpIteratingDefault([
      valueKeterbaruanToTrending,
      valueKeterbaruanToProfilKreator,
      valueKeterbaruanToLeanCanvas,
      valueKeterbaruanToJumlahTeam,
      valueKeterbaruanToJumlahAttachment,
      valueTrendingToProfilKreator,
      valueTrendingToLeanCanvas,
      valueTrendingToJumlahTeam,
      valueTrendingToJumlahAttachment,
      valueProfilKreatorToLeanCanvas,
      valueProfilKreatorToJumlahTeam,
      valueProfilKreatorToJumlahAttachment,
      valueLeanCanvasToJumlahTeam,
      valueLeanCanvasToJumlahAttachment,
      valueJumlahTeamToJumlahAttachment,
    ]);

    const bobotKriteriaKeterbaruan = rataRata.rataRata[0];

    const rataRataSubTrending = ahpIteratingDefault([
      valueLikeToComment,
      valueLikeToBounceRate,
      valueCommentToBounceRate,
    ]);
    const bobotKriteriaLike =
      rataRataSubTrending.rataRata[0] * rataRata.rataRata[1];
    const bobotKriteriaComment =
      rataRataSubTrending.rataRata[1] * rataRata.rataRata[1];
    const bobotKriteriaBounceRate =
      rataRataSubTrending.rataRata[2] * rataRata.rataRata[1];

    const rataRataSubProfilKreator = ahpIteratingDefault([
      valueJumlahIdeToJumlahLike,
      valueJumlahIdeToJumlahKomentar,
      valueJumlahIdeToJumlahAchievement,
      valueJumlahLikeToJumlahKomentar,
      valueJumlahLikeToJumlahAchievement,
      valueJumlahKomentarToJumlahAchievement,
    ]);
    const bobotKriteriaJumlahIde =
      rataRataSubProfilKreator.rataRata[0] * rataRata.rataRata[2];
    const bobotKriteriaPerolehanLike =
      rataRataSubProfilKreator.rataRata[1] * rataRata.rataRata[2];
    const bobotKriteriaPerolehanKomentar =
      rataRataSubProfilKreator.rataRata[2] * rataRata.rataRata[2];
    const bobotKriteriaJumlahAchievement =
      rataRataSubProfilKreator.rataRata[3] * rataRata.rataRata[2];

    const rataRataSubLeanCanvas = ahpIteratingDefault([
      valueCustomerToProblem,
      valueCustomerToEarlyAdopter,
      valueCustomerToExistingSolution,
      valueCustomerToUniqueValue,
      valueCustomerToProposedSolution,
      valueProblemToEarlyAdopter,
      valueProblemToExistingSolution,
      valueProblemToUniqueValue,
      valueProblemToProposedSolution,
      valueEarlyAdopterToExistingSolution,
      valueEarlyAdopterToUniqueValue,
      valueEarlyAdopterToProposedSolution,
      valueExistingSolutionToUniqueValue,
      valueExistingSolutionToProposedSolution,
      valueUniqueValueToProposedSolution,
    ]);
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
        title="Default AHP Preference Setter"
        withNotification={false}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={{padding: 16}}>
        <Text>Main Criteria</Text>
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          titleLeft="Keterbaruan"
          titleRight="Trending"
          value={valueKeterbaruanToTrending}
          onValueChange={res => setValueKeterbaruanToTrending(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          titleLeft="Keterbaruan"
          titleRight="Profil Kreator"
          value={valueKeterbaruanToProfilKreator}
          onValueChange={res => setValueKeterbaruanToProfilKreator(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          titleLeft="Keterbaruan"
          titleRight="Lean Cavas"
          value={valueKeterbaruanToLeanCanvas}
          onValueChange={res => setValueKeterbaruanToLeanCanvas(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          titleLeft="Keterbaruan"
          titleRight="Jumlah Team"
          value={valueKeterbaruanToJumlahTeam}
          onValueChange={res => setValueKeterbaruanToJumlahTeam(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          titleLeft="Keterbaruan"
          titleRight="Jumlah Attachment"
          value={valueKeterbaruanToJumlahAttachment}
          onValueChange={res => setValueKeterbaruanToJumlahAttachment(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          titleLeft="Trending"
          titleRight="Profil Kreator"
          value={valueTrendingToProfilKreator}
          onValueChange={res => setValueTrendingToProfilKreator(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          titleLeft="Trending"
          titleRight="Lean Canvas"
          value={valueTrendingToLeanCanvas}
          onValueChange={res => setValueTrendingToLeanCanvas(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          titleLeft="Trending"
          titleRight="Jumlah Team"
          value={valueTrendingToJumlahTeam}
          onValueChange={res => setValueTrendingToJumlahTeam(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          titleLeft="Trending"
          titleRight="Jumlah Attachment"
          value={valueTrendingToJumlahAttachment}
          onValueChange={res => setValueTrendingToJumlahAttachment(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          titleLeft="Profil Kreator"
          titleRight="Lean Canvas"
          value={valueProfilKreatorToLeanCanvas}
          onValueChange={res => setValueProfilKreatorToLeanCanvas(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          titleLeft="Profil Kreator"
          titleRight="Jumlah Team"
          value={valueProfilKreatorToJumlahTeam}
          onValueChange={res => setValueProfilKreatorToJumlahTeam(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          titleLeft="Profil Kreator"
          titleRight="Jumlah Attachment"
          value={valueProfilKreatorToJumlahAttachment}
          onValueChange={res => setValueProfilKreatorToJumlahAttachment(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          titleLeft="Lean Canvas"
          titleRight="Jumlah Team"
          value={valueLeanCanvasToJumlahTeam}
          onValueChange={res => setValueLeanCanvasToJumlahTeam(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          titleLeft="Lean Canvas"
          titleRight="Jumlah Attachment"
          value={valueLeanCanvasToJumlahAttachment}
          onValueChange={res => setValueLeanCanvasToJumlahAttachment(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          titleLeft="Jumlah Team"
          titleRight="Jumlah Attachment"
          value={valueJumlahTeamToJumlahAttachment}
          onValueChange={res => setValueJumlahTeamToJumlahAttachment(res)}
        />
        <Gap height={8} />
        <Text>Sub Criteria Trending</Text>
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Jumlah Like"
          titleRight="Jumlah Komentar"
          value={valueLikeToComment}
          onValueChange={res => setValueLikeToComment(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Jumlah Like"
          titleRight="Bounce Rate"
          value={valueLikeToBounceRate}
          onValueChange={res => setValueLikeToBounceRate(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Jumlah Komentar"
          titleRight="Bounce Rate"
          value={valueCommentToBounceRate}
          onValueChange={res => setValueCommentToBounceRate(res)}
        />
        <Gap height={8} />
        <Text>Sub Criteria Profil Kreator</Text>
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Jumlah Idea"
          titleRight="Perolehan Like"
          value={valueJumlahIdeToJumlahLike}
          onValueChange={res => setValueJumlahIdeToJumlahLike(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Jumlah Ide"
          titleRight="Perolehan Komentar"
          value={valueJumlahIdeToJumlahKomentar}
          onValueChange={res => setValueJumlahIdeToJumlahKomentar(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Jumlah Ide"
          titleRight="Achievement"
          value={valueJumlahIdeToJumlahAchievement}
          onValueChange={res => setValueJumlahIdeToJumlahAchievement(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Perolehan Like"
          titleRight="Perolehan Komentar"
          value={valueJumlahLikeToJumlahKomentar}
          onValueChange={res => setValueJumlahLikeToJumlahKomentar(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Perolehan Like"
          titleRight="Achievement"
          value={valueJumlahLikeToJumlahAchievement}
          onValueChange={res => setValueJumlahLikeToJumlahAchievement(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Perolehan Komentar"
          titleRight="Achievement"
          value={valueJumlahKomentarToJumlahAchievement}
          onValueChange={res => setValueJumlahKomentarToJumlahAchievement(res)}
        />
        <Gap height={8} />
        <Text>Sub Criteria Lean Canvas</Text>
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Customer"
          titleRight="Problem"
          value={valueCustomerToProblem}
          onValueChange={res => setValueCustomerToProblem(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Customer"
          titleRight="Early Adopter"
          value={valueCustomerToEarlyAdopter}
          onValueChange={res => setValueCustomerToEarlyAdopter(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Customer"
          titleRight="Existing Solution"
          value={valueCustomerToExistingSolution}
          onValueChange={res => setValueCustomerToExistingSolution(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Customer"
          titleRight="Unique Value"
          value={valueCustomerToUniqueValue}
          onValueChange={res => setValueCustomerToUniqueValue(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Customer"
          titleRight="Proposed Solution"
          value={valueCustomerToProposedSolution}
          onValueChange={res => setValueCustomerToProposedSolution(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Problem"
          titleRight="Early Adopter"
          value={valueProblemToEarlyAdopter}
          onValueChange={res => setValueProblemToEarlyAdopter(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Problem"
          titleRight="Existing Solution"
          value={valueProblemToExistingSolution}
          onValueChange={res => setValueProblemToExistingSolution(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Problem"
          titleRight="Unique Value"
          value={valueProblemToUniqueValue}
          onValueChange={res => setValueProblemToUniqueValue(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Problem"
          titleRight="Proposed Solution"
          value={valueProblemToProposedSolution}
          onValueChange={res => setValueProblemToProposedSolution(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Early Adopter"
          titleRight="Existing Solution"
          value={valueEarlyAdopterToExistingSolution}
          onValueChange={res => setValueEarlyAdopterToExistingSolution(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Early Adopter"
          titleRight="Unique Value"
          value={valueEarlyAdopterToUniqueValue}
          onValueChange={res => setValueEarlyAdopterToUniqueValue(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Early Adopter"
          titleRight="Proposed Solution"
          value={valueEarlyAdopterToProposedSolution}
          onValueChange={res => setValueEarlyAdopterToProposedSolution(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Existing Solution"
          titleRight="Unique Value"
          value={valueExistingSolutionToUniqueValue}
          onValueChange={res => setValueExistingSolutionToUniqueValue(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Existing Solution"
          titleRight="Proposed Solution"
          value={valueExistingSolutionToProposedSolution}
          onValueChange={res => setValueExistingSolutionToProposedSolution(res)}
        />
        <Gap height={8} />
        <CardSlideDoubleValueSetter
          tingkatHierarki={1}
          titleLeft="Unique Value"
          titleRight="Proposed Solution"
          value={valueUniqueValueToProposedSolution}
          onValueChange={res => setValueUniqueValueToProposedSolution(res)}
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
            }}
            disabled={false}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: true ? colors.primary : colors.divider,
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
            disabled={false}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: true ? colors.primary : colors.divider,
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

export default CriteriaPreferenceSetterDefault;

const styles = StyleSheet.create({});
