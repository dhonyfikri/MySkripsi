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
import ahpIteratingCustom from '../../../utils/AhpOperation/AhpIteratingCustom';
import {colors} from '../../../utils/ColorsConfig/Colors';

const CriteriaManagement = ({navigation, route}) => {
  const [valueKeterbaruan, setValueKeterbaruan] = useState(30);
  const [valueTrending, setValueTrending] = useState(30);
  const [valueProfilKreator, setValueProfilKreator] = useState(30);
  const [valueLeanCanvas, setValueLeanCanvas] = useState(30);
  const [valueJumlahTeam, setValueJumlahTeam] = useState(30);
  const [valueJumlahAttachment, setValueJumlahAttachment] = useState(30);

  const [valueLike, setValueLike] = useState(30);
  const [valueComment, setValueComment] = useState(30);
  const [valueBounceRate, setValueBounceRate] = useState(30);

  const [valueJumlahIde, setValueJumlahIde] = useState(30);
  const [valuePerolehanLike, setValuePerolehanLike] = useState(30);
  const [valuePerolehanKomentar, setValuePerolehanKomentar] = useState(30);
  const [valueJumlahAchievement, setValueJumlahAchievement] = useState(30);

  const [valueCustomer, setValueCustomer] = useState(30);
  const [valueProblem, setValueProblem] = useState(30);
  const [valueEarlyAdopter, setValueEarlyAdopter] = useState(30);
  const [valueExistingSolution, setValueExistingSolution] = useState(30);
  const [valueUniqueValue, setValueUniqueValue] = useState(30);
  const [valueProposedSolution, setValueProposedSolution] = useState(30);

  const criteriaIteration = () => {
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
      valueKeterbaruan,
    ]).rataRata;
    const bobotKriteriaJumlahTeam = rataRataSubJumlahTeam[0] * rataRata[4];

    const rataRataSubJumlahAttachment = ahpIteratingCustom([
      valueKeterbaruan,
    ]).rataRata;
    const bobotKriteriaJumlahAttachment =
      rataRataSubJumlahAttachment[0] * rataRata[5];

    const bobotTotal =
      bobotKriteriaKeterbaruan +
      bobotKriteriaLike +
      bobotKriteriaComment +
      bobotKriteriaBounceRate +
      bobotKriteriaJumlahIde +
      bobotKriteriaPerolehanLike +
      bobotKriteriaPerolehanKomentar +
      bobotKriteriaJumlahAchievement +
      bobotKriteriaCustomer +
      bobotKriteriaProblem +
      bobotKriteriaEarlyAdopter +
      bobotKriteriaExistingSolution +
      bobotKriteriaUniqueValue +
      bobotKriteriaProposedSolution +
      bobotKriteriaJumlahTeam +
      bobotKriteriaJumlahAttachment;

    console.log(parseFloat(bobotTotal.toFixed(8)));
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <Header
        backButton
        onBackPress={() => navigation.goBack()}
        backText="Back"
        title="Preference Setting"
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
        <TouchableOpacity
          onPress={() => {
            criteriaIteration();
          }}
          style={{padding: 15, backgroundColor: colors.primary}}>
          <Text>Iterating</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CriteriaManagement;

const styles = StyleSheet.create({});
