import axios from 'axios';
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
import {ApiGatewayBaseUrl} from '../../../config/Environment.cfg';
import {GetIdeasAPI} from '../../../config/RequestAPI/IdeaAPI';
import {getAsyncStorageObject} from '../../../utils/AsyncStorage/StoreAsyncStorage';
import {colors} from '../../../utils/ColorsConfig/Colors';
import {dateToText} from '../../../utils/DateConfig/DateConvert';
import fonts from '../../../utils/FontsConfig/Fonts';

const PromotionManagement = ({navigation, route}) => {
  const decodedJwt = jwtDecode(route.params?.userToken.authToken);
  const [ideaDataList, setIdeaDataList] = useState([]);
  const [listUserData, setListUserData] = useState([]);
  const [ideasValues, setIdeasValues] = useState([]);
  const [loading, setLoading] = useState({
    visible: false,
    message: 'Please wait',
  });
  const [showRefreshBUtton, setShowRefreshButton] = useState(false);

  const fetchIdeas = () => {
    setLoading({...loading, visible: true});
    GetIdeasAPI(route.params?.userToken?.authToken).then(res => {
      if (res.status === 'SUCCESS') {
        let fixResult = [];
        let uniqueUserId = [];
        res.data.map(item => {
          uniqueUserId.push(item.createdBy);
          item.like.map(item => {
            uniqueUserId.push(item.createdBy);
          });
          item.comment.map(item => {
            uniqueUserId.push(item.createdBy);
          });
        });
        uniqueUserId.push(
          jwtDecode(route.params?.userToken?.authToken).data.id,
        );
        // dapat semua id unik user
        if (res.data.length > 0) {
          uniqueUserId = [...new Set(uniqueUserId)];
        }

        const request = userId => {
          return axios.get(`${ApiGatewayBaseUrl}/users/profile/${userId}`, {
            headers: {
              Authorization: `Bearer ${route.params?.userToken?.authToken}`,
              Tenant: `https://${
                jwtDecode(route.params?.userToken?.authToken).data
                  .tenantSubdomain
              }.ideaboxapp.com`,
            },
          });
        };

        const requestDetailIdea = ideaId => {
          return axios.get(`${ApiGatewayBaseUrl}/ideas/${ideaId}`, {
            headers: {
              Authorization: `Bearer ${route.params?.userToken?.authToken}`,
              Tenant: `https://${
                jwtDecode(route.params?.userToken?.authToken).data
                  .tenantSubdomain
              }.ideaboxapp.com`,
            },
          });
        };

        const listUser = [];
        const listGetUserRequest = [];

        const listDetailIdea = [];
        const listGetDetailIdeaRequest = [];

        uniqueUserId.map(item => {
          listGetUserRequest.push(request(item));
        });

        res.data.map(item => {
          listGetDetailIdeaRequest.push(requestDetailIdea(item.id));
        });

        getAsyncStorageObject('@PELENGKAP_DATA_USER').then(
          resPelengkapDataUser => {
            axios
              .all(listGetUserRequest)
              .then(
                axios.spread((...responses) => {
                  responses.map(item => {
                    if (item.data.data.length > 0) {
                      // dapat semua data lengkap user
                      listUser.push({
                        ...item.data.data[0],
                        ...resPelengkapDataUser?.filter(
                          itemPelengkap =>
                            itemPelengkap.id === item.data.data[0].id,
                        )[0],
                        bio: item.data.data[0]?.bio,
                        numberOfIdea: res.data.filter(
                          ideaItem =>
                            ideaItem.createdBy === item.data.data[0].id,
                        ).length,
                        numberOfLike: res.data
                          .filter(
                            ideaItem =>
                              ideaItem.createdBy === item.data.data[0].id,
                          )
                          .reduce((accumulator, object) => {
                            return accumulator + parseInt(object.totalLike);
                          }, 0),
                        numberOfComment: res.data
                          .filter(
                            ideaItem =>
                              ideaItem.createdBy === item.data.data[0].id,
                          )
                          .reduce((accumulator, object) => {
                            return accumulator + parseInt(object.totalComment);
                          }, 0),
                      });
                    }
                  });
                  //   console.log(listUser);
                  axios
                    .all(listGetDetailIdeaRequest)
                    .then(
                      axios.spread((...responses) => {
                        // console.log(responses[0].data.data.lc);
                        responses.map(detailIdeaItem => {
                          listDetailIdea.push({
                            ideaId: detailIdeaItem.data.data.id,
                            lc: detailIdeaItem.data.data.lc,
                          });
                        });
                        getAsyncStorageObject('@PROMOTION_DATA').then(
                          dataPrpmotion => {
                            const promotedIdeasId = [];
                            dataPrpmotion.map(item => {
                              promotedIdeasId.push(item.ideaId);
                            });
                            getAsyncStorageObject('@PELENGKAP_DATA_IDEA').then(
                              dataPelengkapIdea => {
                                res.data.map(item => {
                                  if (!promotedIdeasId.includes(item.id)) {
                                    const dataPasanganPelengkap =
                                      dataPelengkapIdea.filter(
                                        itemPasangan =>
                                          itemPasangan.ideaId.toString() ===
                                          item.id,
                                      )[0];
                                    const dataDetailIdea =
                                      listDetailIdea.filter(
                                        detailIdeaItem =>
                                          detailIdeaItem.ideaId === item.id,
                                      )[0];
                                    let tempItem = item;
                                    if (dataPasanganPelengkap) {
                                      tempItem.desc[2].value =
                                        dataPasanganPelengkap.cover;
                                      tempItem = {
                                        ...tempItem,
                                        lc: dataDetailIdea.lc,
                                        teams: dataPasanganPelengkap.teams,
                                        files: dataPasanganPelengkap.files,
                                        createdDate:
                                          dataPasanganPelengkap.createdDate,
                                        updatedDate:
                                          dataPasanganPelengkap.updatedDate,
                                      };
                                    }
                                    listUser.map(item => {
                                      if (item.id === tempItem.createdBy) {
                                        tempItem.user = item;
                                      }
                                    });
                                    fixResult.push(tempItem);
                                  }
                                });
                                // console.log(fixResult[0]);
                                setIdeaDataList(fixResult);

                                const tempIdeasValues = [];
                                fixResult.map(item => {
                                  tempIdeasValues.push([
                                    (new Date(dateToText(new Date(), 'dash')) -
                                      new Date(item.createdDate)) /
                                      (1000 * 60 * 60 * 24),
                                    parseInt(item.totalLike),
                                    parseInt(item.totalComment),
                                    (parseInt(item.totalLike) +
                                      parseInt(item.totalComment)) /
                                      ((new Date(
                                        dateToText(new Date(), 'dash'),
                                      ) -
                                        new Date(item.createdDate)) /
                                        (1000 * 60 * 60 * 24)),
                                    item.user.numberOfIdea,
                                    item.user.numberOfLike,
                                    item.user.numberOfComment,
                                    item.user.achievements
                                      ? item.user.achievements?.length
                                      : 0,
                                    item.lc.filter(
                                      lcItem => lcItem.field === 'customers',
                                    ).length,
                                    item.lc.filter(
                                      lcItem => lcItem.field === 'problems',
                                    ).length,
                                    item.lc.filter(
                                      lcItem =>
                                        lcItem.field === 'earlyAdopters',
                                    ).length,
                                    item.lc.filter(
                                      lcItem =>
                                        lcItem.field === 'existingSolutions',
                                    ).length,
                                    item.lc.filter(
                                      lcItem => lcItem.field === 'uniqueValues',
                                    ).length,
                                    item.lc.filter(
                                      lcItem =>
                                        lcItem.field === 'proposedSolutions',
                                    ).length,
                                    item.teams.filter(
                                      teamItem =>
                                        teamItem.status === 'Approved',
                                    ).length,
                                    item.files?.length,
                                  ]);
                                });
                                setListUserData(listUser);
                                setIdeasValues(tempIdeasValues);

                                setLoading({...loading, visible: false});
                              },
                            );
                          },
                        );
                      }),
                    )
                    .catch(errors => {
                      setLoading({...loading, visible: false});
                      setShowRefreshButton(true);
                      console.log(errors);
                    });
                }),
              )
              .catch(errors => {
                setLoading({...loading, visible: false});
                setShowRefreshButton(true);
                console.log(errors);
              });
          },
        );
      } else if (
        res.status === 'SOMETHING_WRONG' ||
        res.status === 'NOT_FOUND' ||
        res.status === 'UNDEFINED_HEADER' ||
        res.status === 'UNAUTHORIZED' ||
        res.status === 'SERVER_ERROR'
      ) {
        setLoading({...loading, visible: false});
        setShowRefreshButton(true);
      }
    });
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

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
              <Text>Nama Ide = {item.desc[0].value}</Text>
              <Text>
                Hari Publikasi ={' '}
                {(new Date(dateToText(new Date(), 'dash')) -
                  new Date(item.createdDate)) /
                  (1000 * 60 * 60 * 24)}
              </Text>
              <Text>Jumlah Suka = {item.totalLike}</Text>
              <Text>Jumlah Komentar = {item.totalComment}</Text>
              <Text>
                Bounce Rate ={' '}
                {(parseInt(item.totalLike) + parseInt(item.totalComment)) /
                  ((new Date(dateToText(new Date(), 'dash')) -
                    new Date(item.createdDate)) /
                    (1000 * 60 * 60 * 24))}
              </Text>
              <Text>Jumlah Ide Kreator = {item.user.numberOfIdea}</Text>
              <Text>Jumlah Suka Kreator = {item.user.numberOfLike}</Text>
              <Text>Jumlah Komentar Kreator = {item.user.numberOfComment}</Text>
              <Text>
                Pencapaian Kreator ={' '}
                {item.user.achievements ? item.user.achievements?.length : 0}
              </Text>
              <Text>
                Lean Canvas Customer ={' '}
                {item.lc.filter(lcItem => lcItem.field === 'customers').length}
              </Text>
              <Text>
                Lean Canvas Problem ={' '}
                {item.lc.filter(lcItem => lcItem.field === 'problems').length}
              </Text>
              <Text>
                Lean Canvas Early Adopter ={' '}
                {
                  item.lc.filter(lcItem => lcItem.field === 'earlyAdopters')
                    .length
                }
              </Text>
              <Text>
                Lean Canvas Existing Solution ={' '}
                {
                  item.lc.filter(lcItem => lcItem.field === 'existingSolutions')
                    .length
                }
              </Text>
              <Text>
                Lean Canvas Unique Value ={' '}
                {
                  item.lc.filter(lcItem => lcItem.field === 'uniqueValues')
                    .length
                }
              </Text>
              <Text>
                Lean Canvas Proposed Solution ={' '}
                {
                  item.lc.filter(lcItem => lcItem.field === 'proposedSolutions')
                    .length
                }
              </Text>
              <Text>
                Jumlah Tim ={' '}
                {
                  item.teams.filter(teamItem => teamItem.status === 'Approved')
                    .length
                }
              </Text>
              <Text>Jumlah Lampiran = {item.files?.length}</Text>
            </View>
          )}
        />
      </ScrollView>
      <View style={styles.actionButtonContainer}>
        <Text>Type Comparison Criteria</Text>
        <Gap height={8} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            disabled={ideasValues.length === 0}
            style={styles.actionButton(
              ideasValues.length > 0 ? 'finish' : 'finishDisabled',
            )}
            onPress={() => {
              navigation.navigate('CriteriaPreferenceSetterDefault', {
                userToken: route.params?.userToken,
                ideaDataList: ideaDataList,
                ideasValues: ideasValues,
                listUserData: listUserData,
              });
            }}>
            <Text style={styles.actionButtonText('finish')}>Pair</Text>
          </TouchableOpacity>
          <Gap width={8} />
          <TouchableOpacity
            disabled={ideasValues.length === 0}
            style={styles.actionButton(
              ideasValues.length > 0 ? 'finish' : 'finishDisabled',
            )}
            onPress={() => {
              navigation.navigate('CriteriaPreferenceSetter', {
                userToken: route.params?.userToken,
                ideaDataList: ideaDataList,
                ideasValues: ideasValues,
                listUserData: listUserData,
              });
            }}>
            <Text style={styles.actionButtonText('finish')}>Direct</Text>
          </TouchableOpacity>
        </View>
      </View>
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

export default PromotionManagement;

const styles = StyleSheet.create({
  actionButtonContainer: {
    height: 90,
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  actionButton: (type = 'discard') => ({
    width: 102,
    paddingVertical: 12,
    paddingHorizontal: 20,
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
    fontSize: 14,
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
