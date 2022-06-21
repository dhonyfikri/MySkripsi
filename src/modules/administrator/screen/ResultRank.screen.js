import jwtDecode from 'jwt-decode';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Gap from '../../../components/Gap';
import Header from '../../../components/Header';
import LoadingProcessFull from '../../../components/LoadingProcessFull';
import RefreshFull from '../../../components/RefreshFull';
import {
  getAsyncStorageObject,
  storeAsyncStorageObject,
} from '../../../utils/AsyncStorage/StoreAsyncStorage';
import {colors} from '../../../utils/ColorsConfig/Colors';
import {dateToText} from '../../../utils/DateConfig/DateConvert';
import fonts from '../../../utils/FontsConfig/Fonts';

const ResultRank = ({navigation, route}) => {
  const decodedJwt = jwtDecode(route.params?.userToken.authToken);
  const [ideaDataList, setIdeaDataList] = useState([]);
  const [ideasValues, setIdeasValues] = useState([]);
  const [loading, setLoading] = useState({
    visible: false,
    message: 'Please wait',
  });
  const [showRefreshBUtton, setShowRefreshButton] = useState(false);
  // {"date": "10/6/2022", "desc": "Juara 2 KRI", "title": "Juara 2 Robotika"}

  const promoteIdea = idea => {
    // console.log(ideaId);
    getAsyncStorageObject('@PROMOTION_DATA').then(res => {
      const newDataPromotion = {
        id: Math.floor(
          Math.random() * Math.floor(Math.random() * Date.now()),
        ).toString(),
        ideaId: idea.id,
        dateCreated: dateToText(new Date()),
        dateUpdated: dateToText(new Date()),
      };
      storeAsyncStorageObject(
        '@PROMOTION_DATA',
        res ? res.concat([newDataPromotion]) : [newDataPromotion],
      ).then(() => {
        const approvedTeamsId = idea.teams
          .filter(item => item.status === 'Approved')
          .map(item => item.userId);

        getAsyncStorageObject('@PELENGKAP_DATA_USER').then(
          dataPelengkapUser => {
            let newDataPelengkapUser = [];
            dataPelengkapUser.map(dataUser => {
              if (approvedTeamsId.includes(dataUser.id)) {
                const newAchievement = {
                  title: `Promoted Idea (${idea.desc[0].value})`,
                  desc: `Pencapaian terhadap idea (${idea.desc[0].value}) yang dipromosikan`,
                  date: dateToText(new Date()),
                };
                let dataAfterAddAchievement = {...dataUser};
                dataAfterAddAchievement.achievements = dataUser.achievements
                  ? dataUser.achievements.concat([newAchievement])
                  : [newAchievement];
                newDataPelengkapUser.push(dataAfterAddAchievement);
              } else {
                newDataPelengkapUser.push(dataUser);
              }
              storeAsyncStorageObject(
                '@PELENGKAP_DATA_USER',
                newDataPelengkapUser,
              ).then(() => {
                navigation.navigate(
                  'TabNavigation',
                  {userToken: route.params?.userToken},
                  {
                    screen: 'Profile',
                    params: {
                      userToken: route.params?.userToken,
                      refresh: {status: true},
                    },
                  },
                );
              });
            });
          },
        );
      });
    });
  };

  useEffect(() => {
    if (route.params?.newIdeaDataList) {
      setIdeaDataList(route.params?.newIdeaDataList);
    }
  }, [route.params?.newIdeaDataList]);

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <Header
        backButton
        onBackPress={() => navigation.goBack()}
        backText="Back"
        title="Promotion Management"
        withNotification={false}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 16}}>
        <FlatList
          data={ideaDataList}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          inverted={false}
          renderItem={({item, index}) => (
            <View
              style={{
                padding: 16,
                backgroundColor: colors.dot,
                borderRadius: 8,
                marginBottom: 4,
              }}>
              <Text
                style={{
                  fontFamily: fonts.secondary[500],
                  fontSize: 15,
                  color: colors.primary,
                }}>
                Nama Ide = {item.desc[0].value}
              </Text>
              <Gap height={12} />
              <Text>
                Hari Publikasi ={' '}
                {(new Date(dateToText(new Date(), 'dash')) -
                  new Date(item.createdDate)) /
                  (1000 * 60 * 60 * 24)}{' '}
                = {parseFloat(item.normValue[0].toFixed(4))} *{' '}
                {parseFloat(item.pembobotan[0].toFixed(4))} ={' '}
                {parseFloat(
                  (item.normValue[0] * item.pembobotan[0]).toFixed(4),
                )}
              </Text>
              <Text>
                Jml Suka = {item.totalLike} ={' '}
                {parseFloat(item.normValue[1].toFixed(4))} *{' '}
                {parseFloat(item.pembobotan[1].toFixed(4))} ={' '}
                {parseFloat(
                  (item.normValue[1] * item.pembobotan[1]).toFixed(4),
                )}
              </Text>
              <Text>
                Jml Komentar = {item.totalComment} ={' '}
                {parseFloat(item.normValue[2].toFixed(4))} *{' '}
                {parseFloat(item.pembobotan[2].toFixed(4))} ={' '}
                {parseFloat(
                  (item.normValue[2] * item.pembobotan[2]).toFixed(4),
                )}
              </Text>
              <Text>
                Bnc Rate ={' '}
                {parseFloat(
                  (
                    (parseInt(item.totalLike) + parseInt(item.totalComment)) /
                    ((new Date(dateToText(new Date(), 'dash')) -
                      new Date(item.createdDate)) /
                      (1000 * 60 * 60 * 24))
                  ).toFixed(4),
                )}{' '}
                = {parseFloat(item.normValue[3].toFixed(4))} *{' '}
                {parseFloat(item.pembobotan[3].toFixed(4))} ={' '}
                {parseFloat(
                  (item.normValue[3] * item.pembobotan[3]).toFixed(4),
                )}
              </Text>
              <Text>
                Jml Ide Kreator = {item.user.numberOfIdea} ={' '}
                {parseFloat(item.normValue[4].toFixed(4))} *{' '}
                {parseFloat(item.pembobotan[4].toFixed(4))} ={' '}
                {parseFloat(
                  (item.normValue[4] * item.pembobotan[4]).toFixed(4),
                )}
              </Text>
              <Text>
                Jml Suka Kreator = {item.user.numberOfLike} ={' '}
                {parseFloat(item.normValue[5].toFixed(4))} *{' '}
                {parseFloat(item.pembobotan[5].toFixed(4))} ={' '}
                {parseFloat(
                  (item.normValue[5] * item.pembobotan[5]).toFixed(4),
                )}
              </Text>
              <Text>
                Jml Kmtr Kreator = {item.user.numberOfComment} ={' '}
                {parseFloat(item.normValue[6].toFixed(4))} *{' '}
                {parseFloat(item.pembobotan[6].toFixed(4))} ={' '}
                {parseFloat(
                  (item.normValue[6] * item.pembobotan[6]).toFixed(4),
                )}
              </Text>
              <Text>
                Pencapaian Kreator ={' '}
                {item.user.achievements ? item.user.achievements?.length : 0} ={' '}
                {parseFloat(item.normValue[7].toFixed(4))} *{' '}
                {parseFloat(item.pembobotan[7].toFixed(4))} ={' '}
                {parseFloat(
                  (item.normValue[7] * item.pembobotan[7]).toFixed(4),
                )}
              </Text>
              <Text>
                LC Customer ={' '}
                {item.lc.filter(lcItem => lcItem.field === 'customers').length}{' '}
                = {parseFloat(item.normValue[8].toFixed(4))} *{' '}
                {parseFloat(item.pembobotan[8].toFixed(4))} ={' '}
                {parseFloat(
                  (item.normValue[8] * item.pembobotan[8]).toFixed(4),
                )}
              </Text>
              <Text>
                LC Problem ={' '}
                {item.lc.filter(lcItem => lcItem.field === 'problems').length} ={' '}
                {parseFloat(item.normValue[9].toFixed(4))} *{' '}
                {parseFloat(item.pembobotan[9].toFixed(4))} ={' '}
                {parseFloat(
                  (item.normValue[9] * item.pembobotan[9]).toFixed(4),
                )}
              </Text>
              <Text>
                LC Early Adopter ={' '}
                {
                  item.lc.filter(lcItem => lcItem.field === 'earlyAdopters')
                    .length
                }{' '}
                = {parseFloat(item.normValue[10].toFixed(4))} *{' '}
                {parseFloat(item.pembobotan[10].toFixed(4))} ={' '}
                {parseFloat(
                  (item.normValue[10] * item.pembobotan[10]).toFixed(4),
                )}
              </Text>
              <Text>
                LC Existing Solution ={' '}
                {
                  item.lc.filter(lcItem => lcItem.field === 'existingSolutions')
                    .length
                }{' '}
                = {parseFloat(item.normValue[11].toFixed(4))} *{' '}
                {parseFloat(item.pembobotan[11].toFixed(4))} ={' '}
                {parseFloat(
                  (item.normValue[11] * item.pembobotan[11]).toFixed(4),
                )}
              </Text>
              <Text>
                LC Unique Value ={' '}
                {
                  item.lc.filter(lcItem => lcItem.field === 'uniqueValues')
                    .length
                }{' '}
                = {parseFloat(item.normValue[12].toFixed(4))} *{' '}
                {parseFloat(item.pembobotan[12].toFixed(4))} ={' '}
                {parseFloat(
                  (item.normValue[12] * item.pembobotan[12]).toFixed(4),
                )}
              </Text>
              <Text>
                LC Proposed Solution ={' '}
                {
                  item.lc.filter(lcItem => lcItem.field === 'proposedSolutions')
                    .length
                }{' '}
                = {parseFloat(item.normValue[13].toFixed(4))} *{' '}
                {parseFloat(item.pembobotan[13].toFixed(4))} ={' '}
                {parseFloat(
                  (item.normValue[13] * item.pembobotan[13]).toFixed(4),
                )}
              </Text>
              <Text>
                Jml Tim ={' '}
                {
                  item.teams.filter(teamItem => teamItem.status === 'Approved')
                    .length
                }{' '}
                = {parseFloat(item.normValue[14].toFixed(4))} *{' '}
                {parseFloat(item.pembobotan[14].toFixed(4))} ={' '}
                {parseFloat(
                  (item.normValue[14] * item.pembobotan[14]).toFixed(4),
                )}
              </Text>
              <Text>
                Jml Lampiran = {item.files?.length} ={' '}
                {parseFloat(item.normValue[15].toFixed(4))} *{' '}
                {parseFloat(item.pembobotan[15].toFixed(4))} ={' '}
                {parseFloat(
                  (item.normValue[15] * item.pembobotan[15]).toFixed(4),
                )}
              </Text>
              <Gap height={12} />
              <Text
                style={{
                  fontFamily: fonts.secondary[500],
                  fontSize: 15,
                  color: colors.pending,
                }}>
                Jml Score = {item.score}
              </Text>
              <Gap height={12} />
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('DetailIdea', {
                      ideaId: item.id,
                      userToken: route.params?.userToken,
                      creatorData: item.user,
                      listUser: route.params?.listUserData,
                      ideaDataList: ideaDataList,
                    });
                  }}
                  style={{
                    width: 70,
                    height: 40,
                    backgroundColor: colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                  }}>
                  <Text
                    style={{
                      color: colors.white,
                      fontFamily: fonts.secondary[400],
                    }}>
                    View
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    promoteIdea(item);
                  }}
                  style={{
                    width: 90,
                    height: 40,
                    backgroundColor: colors.success,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                  }}>
                  <Text
                    style={{
                      color: colors.white,
                      fontFamily: fonts.secondary[400],
                    }}>
                    Promote
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </ScrollView>
      <LoadingProcessFull visible={loading.visible} message={loading.message} />
      <RefreshFull
        visible={showRefreshBUtton}
        onPress={() => {
          setShowRefreshButton(false);
          fetchIdeas();
        }}
        onOffsetTouch={() => navigation.goBack()}
      />
    </View>
  );
};

export default ResultRank;

const styles = StyleSheet.create({
  actionButtonContainer: {
    height: 76,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButton: (type = 'discard') => ({
    width: 102,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: type === 'discard' ? 1 : 0,
    borderColor: type === 'finishDisabled' ? colors.border : colors.primary,
    borderRadius: 100,
    backgroundColor:
      type === 'discard'
        ? colors.white
        : type === 'finish'
        ? colors.primary
        : 'finishDisabled'
        ? colors.border
        : colors.primary,
  }),
  actionButtonText: (type = 'discard') => ({
    fontFamily: fonts.secondary[600],
    fontSize: 16,
    lineHeight: 20,
    color:
      type === 'discard'
        ? colors.primary
        : type === 'finish'
        ? colors.white
        : 'finishDisabled'
        ? colors.white
        : colors.white,
  }),
});
