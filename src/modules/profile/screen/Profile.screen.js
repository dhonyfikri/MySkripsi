import {useIsFocused} from '@react-navigation/native';
import jwtDecode from 'jwt-decode';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CardProfileMainContent from '../../../components/CardProfileMainContent';
import ContactDetail from '../../../components/ContactDetail';
import Gap from '../../../components/Gap';
import ModalEditProfile from '../../../components/ModalEditProfile';
import ProfileOptionItem from '../../../components/ProfileOptionItem';
import RefreshFull from '../../../components/RefreshFull';
import {GetIdeasAPI} from '../../../config/RequestAPI/IdeaAPI';
import {GetUserById} from '../../../config/RequestAPI/UserAPI';
import {
  getAsyncStorageObject,
  removeAsyncStorageItem,
} from '../../../utils/AsyncStorage/StoreAsyncStorage';
import {colors} from '../../../utils/ColorsConfig/Colors';
import fonts from '../../../utils/FontsConfig/Fonts';

const Profile = ({navigation, route}) => {
  const decodedJwt = route.params?.userToken
    ? jwtDecode(route.params.userToken.authToken)
    : {};
  const [profileData, setProfileData] = useState({});
  const [ideaData, setIdeaData] = useState(null);
  const [modalContactInfoVisible, setModalContactInfoVisible] = useState(false);
  const [showRefreshBUtton, setShowRefreshButton] = useState(false);
  const [loading, setLoading] = useState(true);

  const myIdeaList = ideaData?.filter(
    item => item.createdBy === decodedJwt.data?.id,
  );

  let countLike = 0;
  let countComment = 0;
  myIdeaList?.map(item => {
    countLike = countLike + parseInt(item.totalLike);
    countComment = countComment + parseInt(item.totalComment);
  });

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const handleFadeIn = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchUserData = () => {
    setLoading(true);
    getAsyncStorageObject('@PELENGKAP_DATA_USER').then(resPelengkapDataUser => {
      GetUserById(route.params?.userToken, decodedJwt.data.id).then(res => {
        setLoading(false);
        if (res.status === 'SUCCESS') {
          if (res.data.length > 0) {
            setProfileData({
              ...res.data[0],
              ...resPelengkapDataUser?.filter(
                item => item.id === res.data[0].id,
              )[0],
              bio: res.data[0]?.bio,
            });
            fetchIdeas(true);
          }
        } else if (
          res.status === 'SOMETHING_WRONG' ||
          res.status === 'FAILED' ||
          res.status === 'SERVER_ERROR'
        ) {
          setShowRefreshButton(true);
        }
      });
    });
  };

  const fetchIdeas = withIndicator => {
    if (withIndicator) {
      setLoading(true);
    }
    GetIdeasAPI(route.params?.userToken?.authToken).then(res => {
      if (res.status === 'SUCCESS') {
        setIdeaData(res.data);
      } else if (
        res.status === 'SOMETHING_WRONG' ||
        res.status === 'NOT_FOUND' ||
        res.status === 'UNDEFINED_HEADER' ||
        res.status === 'UNAUTHORIZED' ||
        res.status === 'SERVER_ERROR'
      ) {
        setShowRefreshButton(true);
      }
      setLoading(false);
    });
  };

  // useEffect(() => {
  //   setProfileData({
  //     profilePhoto: {
  //       uri: 'https://cdn0-production-images-kly.akamaized.net/S9AM35Gly7_IQDK9cwINANo5qoU=/1200x900/smart/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/957804/original/067365400_1439796663-thom_yorke.jpg',
  //     },
  //     backgroundPhoto: {
  //       uri: 'https://www.cufonfonts.com/images/thumb/6571/paranoid-android-741x415-1762fc0191.jpg',
  //     },
  //     name: 'Elon Murz',
  //     nip: '2317345',
  //     phone: '081289058901',
  //     email: 'elon@gmail.com',
  //     birthOfDate: '22/03/1999',
  //     job: 'Product Owner IdeaBox',
  //     workingLocation: 'Jakarta',
  //     teamStructure: 'Hacker',
  //     unit: 'Ideabox2',
  //     location: 'Karawang, Jawa Barat, Indonesia',
  //     numberOfIdeas: '36',
  //     numberOfLikes: '402',
  //     numberOfComments: '381',
  //   });

  //   handleFadeIn();
  // }, []);

  useEffect(() => {
    if (route.params?.userToken) {
      fetchUserData();
    }
  }, []);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      // handleFadeIn();
    }
  }, [isFocused]);

  useEffect(() => {
    if (route.params?.updatedProfileData !== undefined) {
      setProfileData({...profileData, ...route.params?.updatedProfileData});
    }
  }, [route.params?.updatedProfileData]);

  useEffect(() => {
    if (route.params?.refresh?.status) {
      fetchUserData();
    }
    if (route.params?.refresh?.status) {
      navigation.setParams({
        ...route.params,
        refresh: {status: false},
      });
    }
  }, [route.params?.refresh]);

  return (
    <Animated.View style={{...styles.container, opacity: fadeAnim}}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            progressViewOffset={50}
            onRefresh={() => fetchUserData()}
            colors={['#085D7A']} // add more array value to switching colors while progressing
          />
        }>
        <View>
          <CardProfileMainContent
            profilePhoto={profileData.pictures}
            backgroundPhoto={profileData.background}
            name={profileData.name}
            teamStructure={profileData.teamStructure}
            job={
              profileData.pekerjaan !== '' && profileData.pekerjaan !== null
                ? profileData.pekerjaan
                : 'Job Unknown'
            }
            location={
              profileData.workingLocation !== '' &&
              profileData.workingLocation !== null &&
              profileData.workingLocation !== undefined
                ? profileData.workingLocation
                : 'Location Unknown'
            }
            numberOfIdeas={myIdeaList !== undefined ? myIdeaList?.length : 0}
            numberOfLikes={countLike}
            numberOfComments={countComment}
            onContactInfoPress={() => setModalContactInfoVisible(true)}
          />
          {showRefreshBUtton && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#00000044',
              }}>
              <TouchableOpacity
                style={{
                  width: 150,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  backgroundColor: colors.primary,
                  borderRadius: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setShowRefreshButton(false);
                  fetchUserData();
                }}>
                <Image
                  style={{width: 20, height: 20}}
                  source={require('../../../assets/image/refresh.png')}
                />
                <Text
                  style={{
                    fontFamily: fonts.secondary[500],
                    color: 'white',
                    marginLeft: 10,
                    fontSize: 12,
                    lineHeight: 15,
                  }}>
                  Refresh
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.profileOptions}>
          <ProfileOptionItem
            singleData={{
              itemTitle: 'My Profile',
              onPress: () =>
                profileData.id !== undefined &&
                ideaData !== null &&
                !loading.visible
                  ? navigation.navigate('MyProfile', {
                      fromPage: 'USER_SCREEN',
                      existingProfileData: profileData,
                      userToken: route.params?.userToken,
                      userId: decodedJwt.data.id,
                      ideaData: ideaData,
                    })
                  : {},
            }}
          />
          <Gap height={16} />
          <ProfileOptionItem
            title="My Ideas"
            multiItems
            multiData={[
              {
                itemTitle: 'Submitted Idea',
                onPress: () =>
                  navigation.navigate('SubmittedIdea', {
                    userToken: route.params?.userToken,
                  }),
              },
              {
                itemTitle: 'Joined Idea',
                onPress: () =>
                  navigation.navigate('JoinedIdea', {
                    userToken: route.params?.userToken,
                  }),
              },
            ]}
          />
          <Gap height={16} />
          <ProfileOptionItem
            title="Tallent Approval"
            singleData={{
              itemTitle: 'Talent Approval',
              onPress: () => navigation.navigate('TalentApproval'),
            }}
          />
          {profileData?.roleId === '3' && (
            <>
              <Gap height={16} />
              <ProfileOptionItem
                title="Administrations"
                multiItems
                multiData={[
                  {
                    itemTitle: 'Idea Management',
                    onPress: () =>
                      navigation.navigate('IdeaManagement', {
                        userToken: route.params?.userToken,
                      }),
                  },
                  {
                    itemTitle: 'Event Management',
                    // onPress: () =>
                    //   navigation.navigate('SubmittedIdea', {
                    //     userToken: route.params?.userToken,
                    //   }),
                  },
                  {
                    itemTitle: 'Talent Management',
                    // onPress: () =>
                    //   navigation.navigate('SubmittedIdea', {
                    //     userToken: route.params?.userToken,
                    //   }),
                  },
                  {
                    itemTitle: 'Category Management',
                    onPress: () =>
                      navigation.navigate('CategoryManagement', {
                        userToken: route.params?.userToken,
                      }),
                  },
                ]}
              />
            </>
          )}
          <Gap height={16} />
          <ProfileOptionItem
            title="General Info"
            singleData={{
              itemTitle: 'FAQ',
              // onPress: () => console.log('FAQ Clicked'),
              onPress: () => {
                getAsyncStorageObject('@PELENGKAP_DATA_USER').then(res =>
                  console.log(res),
                );
              },
            }}
          />
          <Gap height={32} />
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              removeAsyncStorageItem('@USER_TOKEN').then(res => {
                navigation.replace('Login');
              });
            }}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
          <Gap height={30.5} />
        </View>
      </ScrollView>

      {/* modal contact info */}
      <ModalEditProfile
        title={profileData.name?.replace(/(?:^|\s)\S/g, function (a) {
          return a.toUpperCase();
        })}
        visible={modalContactInfoVisible}
        onRequestClose={() => setModalContactInfoVisible(false)}
        onCloseButtonPress={() => setModalContactInfoVisible(false)}>
        <ContactDetail email={profileData.email} phone={profileData.noTelp} />
        <Gap height={14} />
      </ModalEditProfile>

      <RefreshFull
        visible={showRefreshBUtton}
        onPress={() => {
          setShowRefreshButton(false);
          fetchUserData();
        }}
        onBackPress={() => navigation.goBack()}
      />
    </Animated.View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF'},
  profileOptions: {
    padding: 16,
  },
  logoutButton: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    padding: 12,
  },
  logoutButtonText: {
    color: colors.white,
    fontFamily: fonts.secondary[600],
    fontSize: 16,
    lineHeight: 20,
  },
});
