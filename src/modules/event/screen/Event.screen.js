import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Gap from '../../../components/Gap';
import ModalMessage from '../../../components/ModalMessage';
import {ApiGatewayBaseUrl} from '../../../config/Environment.cfg';
import {GetIdeasAPI} from '../../../config/RequestAPI/IdeaAPI';
import {getAsyncStorageObject} from '../../../utils/AsyncStorage/StoreAsyncStorage';
import {colors} from '../../../utils/ColorsConfig/Colors';
import fonts from '../../../utils/FontsConfig/Fonts';

const Event = ({navigation, route}) => {
  const [data, setData] = useState({isSet: false, data: []});
  const [listUserData, setListUserData] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [messageModal, setMessageModal] = useState({
    visible: false,
    message: undefined,
    title: undefined,
    type: 'smile',
    onClose: () => {},
  });

  const isFocused = useIsFocused();

  const fetchIdeas = withIndicator => {
    if (withIndicator) {
      setFetchLoading(true);
    }
    GetIdeasAPI(route.params?.userToken?.authToken).then(res => {
      if (res.status === 'SUCCESS') {
        // ini untuk mensiasati API get all user yang belum bisa digunakan. jadi list user hanya diambil dari orang yang sudah pernah submit ide
        // ya Allah... masa nyusun data yang harusnya di BE malah diakalin dari FE :'(
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

        const listUser = [];
        const listGetUserRequest = [];

        uniqueUserId.map(item => {
          listGetUserRequest.push(request(item));
        });

        getAsyncStorageObject('@PELENGKAP_DATA_USER').then(
          resPelengkapDataUser => {
            axios
              .all(listGetUserRequest)
              .then(
                axios.spread((...responses) => {
                  setFetchLoading(false);
                  responses.map(item => {
                    if (item.data.data.length > 0) {
                      listUser.push({
                        ...item.data.data[0],
                        ...resPelengkapDataUser?.filter(
                          itemPelengkap =>
                            itemPelengkap.id === item.data.data[0].id,
                        )[0],
                        bio: item.data.data[0]?.bio,
                      });
                    }
                  });
                  // console.log(listUser);
                  getAsyncStorageObject('@PROMOTION_DATA').then(
                    dataPrpmotion => {
                      const promotedIdeasId = [];
                      dataPrpmotion.map(item => {
                        promotedIdeasId.push(item.ideaId);
                      });
                      getAsyncStorageObject('@PELENGKAP_DATA_IDEA').then(
                        dataPelengkapIdea => {
                          res.data.map(item => {
                            if (promotedIdeasId.includes(item.id)) {
                              const dataPasanganPelengkap =
                                dataPelengkapIdea.filter(
                                  itemPasangan =>
                                    itemPasangan.ideaId.toString() === item.id,
                                )[0];
                              let tempItem = item;
                              if (dataPasanganPelengkap) {
                                tempItem.desc[2].value =
                                  dataPasanganPelengkap.cover;
                                tempItem = {
                                  ...tempItem,
                                  teams: dataPasanganPelengkap.teams,
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
                          setData({isSet: true, data: fixResult});
                          setListUserData(listUser);
                        },
                      );
                    },
                  );
                }),
              )
              .catch(errors => {
                setFetchLoading(false);
                console.log(errors);
                setData({...data, isSet: true});
              });
          },
        );

        // setData({isSet: true, data: res.data});
      } else if (
        res.status === 'SOMETHING_WRONG' ||
        res.status === 'NOT_FOUND' ||
        res.status === 'UNDEFINED_HEADER' ||
        res.status === 'UNAUTHORIZED' ||
        res.status === 'SERVER_ERROR'
      ) {
        setFetchLoading(false);
        setMessageModal({
          ...messageModal,
          visible: true,
          title: 'Failed',
          message: res.message,
          type: 'confused',
        });
      }
    });
  };

  useEffect(() => {
    if (route.params?.userToken) {
      fetchIdeas(true);
    }
  }, []);

  // ini cara untuk memicu refresh ketika dibutuhkan.
  useEffect(() => {
    if (route.params?.refresh?.status) {
      fetchIdeas(true);
    }
    if (route.params?.refresh?.status) {
      navigation.setParams({
        ...route.params,
        refresh: {status: false},
      });
    }
  }, [route.params?.refresh]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={fetchLoading}
            onRefresh={() => fetchIdeas(true)}
            colors={['#085D7A']} // add more array value to switching colors while progressing
          />
        }
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: data.isSet && data.data.length === 0 ? 20 : 0,
          padding: 16,
          paddingBottom: 20,
        }}>
        {data.isSet && data.data.length === 0 ? (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 15,
              color: colors.text.secondary,
              fontFamily: fonts.secondary[400],
            }}>
            List of ideas not yet available
          </Text>
        ) : (
          <>
            <FlatList
              data={data.data}
              keyExtractor={(_, index) => index.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              inverted={false}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('DetailIdea', {
                      ideaId: item.id,
                      userToken: route.params?.userToken,
                      creatorData: item.user,
                      listUser: listUserData,
                      ideaDataList: data.data,
                    });
                  }}
                  style={{
                    padding: 16,
                    elevation: 4,
                    margin: 4,
                    backgroundColor: colors.dot,
                    marginBottom: 10,
                    borderRadius: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.secondary[500],
                        fontSize: 15,
                        color: colors.text.secondary,
                      }}>
                      Promoted Idea
                    </Text>
                    <Gap width={16} />
                    <Text
                      style={{
                        fontFamily: fonts.secondary[500],
                        fontSize: 12,
                        color: colors.text.secondary,
                      }}>
                      12/02/2022
                    </Text>
                  </View>
                  <Gap height={16} />
                  <Image
                    style={{
                      width: '100%',
                      height: 200,
                      resizeMode: 'cover',
                      borderRadius: 8,
                    }}
                    source={item.desc[2].value}
                  />
                  <Gap height={16} />
                  <Text
                    numberOfLines={2}
                    style={{
                      fontFamily: fonts.secondary[700],
                      fontSize: 15,
                      color: colors.text.secondary,
                    }}>
                    {item.desc[0].value}
                  </Text>
                  <Gap height={8} />
                  <Text
                    numberOfLines={4}
                    style={{
                      fontFamily: fonts.secondary[400],
                      fontSize: 12,
                      color: colors.text.secondary,
                    }}>
                    {item.desc[1].value}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </ScrollView>
      {/* modal message */}
      <ModalMessage
        visible={messageModal.visible && isFocused}
        withIllustration
        illustrationType={messageModal.type}
        title={messageModal.title}
        message={messageModal.message}
        withBackButton
        onBack={() => {
          setMessageModal({...messageModal, visible: false});
          messageModal.onClose();
        }}
        onRequestClose={() => {
          setMessageModal({...messageModal, visible: false});
          messageModal.onClose();
        }}
      />
    </View>
  );
};

export default Event;

const styles = StyleSheet.create({});
