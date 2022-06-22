import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import Gap from '../../../components/Gap';
import ModalMessage from '../../../components/ModalMessage';
import {ApiGatewayBaseUrl} from '../../../config/Environment.cfg';
import {GetIdeasAPI} from '../../../config/RequestAPI/IdeaAPI';
import {getAsyncStorageObject} from '../../../utils/AsyncStorage/StoreAsyncStorage';
import {colors} from '../../../utils/ColorsConfig/Colors';
import {textToDate} from '../../../utils/DateConfig/DateConvert';
import fonts from '../../../utils/FontsConfig/Fonts';

const DashboardPage = ({navigation, route}) => {
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
                  getAsyncStorageObject('@PELENGKAP_DATA_IDEA').then(
                    dataPelengkapIdea => {
                      res.data.map(item => {
                        const dataPasanganPelengkap = dataPelengkapIdea.filter(
                          itemPasangan =>
                            itemPasangan.ideaId.toString() === item.id,
                        )[0];
                        let tempItem = item;
                        if (dataPasanganPelengkap) {
                          tempItem.desc[2].value = dataPasanganPelengkap.cover;
                          tempItem = {
                            ...tempItem,
                            teams: dataPasanganPelengkap.teams,
                            createdDate: dataPasanganPelengkap.createdDate,
                            updatedDate: dataPasanganPelengkap.updatedDate,
                          };
                        }
                        listUser.map(item => {
                          if (item.id === tempItem.createdBy) {
                            tempItem.user = item;
                          }
                        });
                        fixResult.push(tempItem);
                      });
                      setData({isSet: true, data: fixResult});
                      setListUserData(listUser);
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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={fetchLoading}
            onRefresh={() => fetchIdeas(true)}
            colors={['#085D7A']} // add more array value to switching colors while progressing
          />
        }
        contentContainerStyle={{padding: 16}}>
        <View
          style={{
            padding: 16,
            elevation: 4,
            margin: 4,
            backgroundColor: colors.dot,
            borderRadius: 10,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{
                width: 100,
                height: 100,
                resizeMode: 'cover',
                borderRadius: 8,
              }}
              source={require('../../../assets/image/UserIllustration.png')}
            />
            <Gap width={16} />
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: fonts.secondary[500],
                  fontSize: 14,
                  color: colors.text.secondary,
                }}>
                Number of Active Users
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[900],
                  fontSize: 30,
                  color: colors.primary,
                }}>
                {listUserData.length}
              </Text>
            </View>
          </View>
        </View>
        <Gap height={8} />
        <View
          style={{
            padding: 16,
            elevation: 4,
            margin: 4,
            backgroundColor: colors.dot,
            borderRadius: 10,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{
                width: 100,
                height: 100,
                resizeMode: 'cover',
                borderRadius: 8,
              }}
              source={require('../../../assets/image/IdeaIllustration.jpg')}
            />
            <Gap width={16} />
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: fonts.secondary[500],
                  fontSize: 14,
                  color: colors.text.secondary,
                }}>
                Number of Submitted Idea
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[900],
                  fontSize: 30,
                  color: colors.primary,
                }}>
                {data.data.length}
              </Text>
            </View>
          </View>
        </View>
        <Gap height={16} />
        <Text
          style={{
            fontFamily: fonts.secondary[700],
            fontSize: 18,
            color: colors.primary,
            textAlign: 'center',
          }}>
          Submitted Idea per Month
        </Text>
        <LineChart
          data={{
            labels: [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Ags',
              'Sep',
              'Okt',
              'Nov',
              'Des',
            ],
            datasets: [
              {
                data: [
                  data.data.filter(
                    item => textToDate(item.createdDate).getMonth() === 1,
                  ).length,
                  data.data.filter(
                    item => textToDate(item.createdDate).getMonth() === 2,
                  ).length,
                  data.data.filter(
                    item => textToDate(item.createdDate).getMonth() === 3,
                  ).length,
                  data.data.filter(
                    item => textToDate(item.createdDate).getMonth() === 4,
                  ).length,
                  data.data.filter(
                    item => textToDate(item.createdDate).getMonth() === 5,
                  ).length,
                  data.data.filter(
                    item => textToDate(item.createdDate).getMonth() === 6,
                  ).length,
                  data.data.filter(
                    item => textToDate(item.createdDate).getMonth() === 7,
                  ).length,
                  data.data.filter(
                    item => textToDate(item.createdDate).getMonth() === 8,
                  ).length,
                  data.data.filter(
                    item => textToDate(item.createdDate).getMonth() === 9,
                  ).length,
                  data.data.filter(
                    item => textToDate(item.createdDate).getMonth() === 10,
                  ).length,
                  data.data.filter(
                    item => textToDate(item.createdDate).getMonth() === 11,
                  ).length,
                  data.data.filter(
                    item => textToDate(item.createdDate).getMonth() === 12,
                  ).length,
                ],
              },
            ],
          }}
          fromZero
          segments={10}
          width={Dimensions.get('window').width - 16 * 2} // from react-native
          height={280}
          // yAxisLabel="$"
          // yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: colors.primary,
            backgroundGradientFrom: colors.primary,
            backgroundGradientTo: colors.border2,
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: colors.primary,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
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

export default DashboardPage;

const styles = StyleSheet.create({});
