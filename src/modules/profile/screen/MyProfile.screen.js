import {useBackHandler} from '@react-native-community/hooks';
import {useNavigationState} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import ActionMyAchievements from '../../../components/ActionMyAchievements';
import AddMyAchievements from '../../../components/AddMyAchievements';
import AddMySkills from '../../../components/AddMySkills';
import CardDetailProfileContent from '../../../components/CardDetailProfileContent';
import CardMyAchivements from '../../../components/CardMyAchivements';
import CardMyIdeas from '../../../components/CardMyIdeas';
import CardMySkills from '../../../components/CardMySkills';
import CardProfileMainContent from '../../../components/CardProfileMainContent';
import ContactDetail from '../../../components/ContactDetail';
import EditMyAbout from '../../../components/EditMyAbout';
import EditMyAchievements from '../../../components/EditMyAchievements';
import EditMyBackgroundPhoto from '../../../components/EditMyBackgroundPhoto';
import EditMyProfile from '../../../components/EditMyProfile';
import EditMySkills from '../../../components/EditMySkills';
import Gap from '../../../components/Gap';
import Header from '../../../components/Header';
import LoadingProcessFull from '../../../components/LoadingProcessFull';
import ModalEditProfile from '../../../components/ModalEditProfile';
import RefreshFull from '../../../components/RefreshFull';
import {GetUserById} from '../../../config/RequestAPI/UserAPI';
import {
  getAsyncStorageObject,
  storeAsyncStorageObject,
} from '../../../utils/AsyncStorage/StoreAsyncStorage';
import {colors} from '../../../utils/ColorsConfig/Colors';
import fonts from '../../../utils/FontsConfig/Fonts';
import {RecomendationSkills} from '../../../utils/SupportData/SupportData';

const MyProfile = ({navigation, route}) => {
  const editableProfile =
    route.params.editable !== undefined ? route.params.editable : true;
  const openModalDiscardEditBackgroundPhotoReff = useRef(null);
  const openModalDiscardEditProfileReff = useRef(null);
  const openModalDiscardEditAboutReff = useRef(null);
  const openModalDiscardEditSkillReff = useRef(null);
  const openModalDiscardAddSkillReff = useRef(null);
  const openModalDiscardAddAchievementReff = useRef(null);
  const openModalDiscardEditAchievementReff = useRef(null);

  const [profileData, setProfileData] = useState(
    route.params?.existingProfileData !== undefined
      ? route.params?.existingProfileData
      : {},
  );

  const [modalEditBackgroundPhotoVisible, setModalEditBackgroundPhotoVisible] =
    useState(false);
  const [modalEditProfileVisible, setModalEditProfileVisible] = useState(false);
  const [modalContactInfoVisible, setModalContactInfoVisible] = useState(false);
  const [modalEditAboutVisible, setModalEditAboutVisible] = useState(false);
  const [modalAddSkillsVisible, setModalAddSkillsVisible] = useState(false);
  const [modalEditSkillsVisible, setModalEditSkillsVisible] = useState(false);
  const [modalAddAchievemensVisible, setModalAddAchievemensVisible] =
    useState(false);
  const [modalActionAchievemensVisible, setModalActionAchievemensVisible] =
    useState(false);
  const [modalEditAchievemensVisible, setModalEditAchievemensVisible] =
    useState(false);
  const [showAllMyIdeas, setShowAllMyIdeas] = useState(false);

  const [achievementIndexToEdit, setAchievementIndexToEdit] = useState(null);

  const [showRefreshBUtton, setShowRefreshButton] = useState(false);
  const [loading, setLoading] = useState({
    visible: route.params?.existingProfileData !== undefined ? false : true,
    message: 'Please wait',
  });
  const [isChanged, setIsChanged] = useState(false);

  const myIdeaList = route.params?.ideaData?.filter(
    item => item.createdBy === route.params?.userId,
  );

  let countLike = 0;
  let countComment = 0;
  myIdeaList?.map(item => {
    countLike = countLike + parseInt(item.totalLike);
    countComment = countComment + parseInt(item.totalComment);
  });

  // example to get route index
  const routeIndex = useNavigationState(state => state.index);

  const fetchUserData = () => {
    setLoading({...loading, visible: true});
    GetUserById(route.params?.userToken, route.params?.userId).then(res => {
      setLoading({...loading, visible: false});
      if (res.status === 'SUCCESS') {
        if (res.data.length > 0) {
          getAsyncStorageObject('@PELENGKAP_DATA_USER').then(
            resPelengkapDataUser => {
              setProfileData({
                ...res.data[0],
                ...resPelengkapDataUser?.filter(
                  item => item.id === res.data[0].id,
                )[0],
                bio: res.data[0]?.bio,
              });
            },
          );
        }
      } else if (
        res.status === 'SOMETHING_WRONG' ||
        res.status === 'FAILED' ||
        res.status === 'SERVER_ERROR'
      ) {
        setShowRefreshButton(true);
      }
    });
  };

  const setChanged = () => {
    if (!isChanged) {
      setIsChanged(true);
    }
  };

  const backToPreviousPage = () => {
    if (routeIndex > 0) {
      if (route.params?.fromPage === 'USER_SCREEN') {
        if (isChanged) {
          navigation.navigate('TabNavigation', {
            screen: 'Profile',
            params: {
              updatedProfileData: profileData,
              userToken: route.params?.userToken,
              ideaData: route.params?.ideaData,
            },
          });
        } else {
          navigation.goBack();
        }
      } else {
        navigation.goBack();
      }
    } else {
      navigation.replace('TabNavigation');
    }
  };

  useEffect(() => {
    if (profileData.id === undefined) {
      fetchUserData();
    }
  }, []);

  useBackHandler(() => {
    backToPreviousPage();
    return true;
  });

  return (
    <View style={styles.container}>
      <Header
        backButton
        onBackPress={backToPreviousPage}
        backText="Back"
        onNotificationPress={() =>
          navigation.navigate('Notification', {
            userToken: route.params?.userToken,
          })
        }
      />
      <ScrollView>
        <CardProfileMainContent
          editable={editableProfile}
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
          numberOfIdeas={myIdeaList?.length}
          numberOfLikes={countLike}
          numberOfComments={countComment}
          onEditBackgroundPhotoPress={() =>
            setModalEditBackgroundPhotoVisible(true)
          }
          onEditProfilePress={() => setModalEditProfileVisible(true)}
          onContactInfoPress={() => setModalContactInfoVisible(true)}
        />
        <View style={styles.profileOptions}>
          <CardDetailProfileContent
            editable={editableProfile}
            title="About"
            withEditButton
            onEditPress={() => setModalEditAboutVisible(true)}>
            {profileData.bio !== undefined && (
              <Text
                style={{
                  ...styles.aboutText,
                  textAlign: profileData.bio !== '' ? 'justify' : 'center',
                }}>
                {profileData.bio !== '' ? profileData.bio : 'No Biography'}
              </Text>
            )}
          </CardDetailProfileContent>
          <Gap height={16} />
          <CardDetailProfileContent
            editable={editableProfile}
            title="My Skills"
            withAddButton
            withEditButton={profileData.skills?.length > 0}
            onAddPress={() => setModalAddSkillsVisible(true)}
            onEditPress={() => setModalEditSkillsVisible(true)}>
            <CardMySkills skills={profileData.skills} />
          </CardDetailProfileContent>
          <Gap height={16} />
          <CardDetailProfileContent
            editable={editableProfile}
            title="Achievement"
            withAddButton
            withEditButton={profileData.achievements?.length > 0}
            onAddPress={() => setModalAddAchievemensVisible(true)}
            onEditPress={() => setModalActionAchievemensVisible(true)}>
            <CardMyAchivements achievement={profileData.achievements} />
          </CardDetailProfileContent>
          <Gap height={16} />
          <CardDetailProfileContent
            title="Ideas"
            withTextAction={!showAllMyIdeas}
            textAction="View All Ideas"
            onTextActionPress={() => setShowAllMyIdeas(true)}>
            <CardMyIdeas myIdeas={myIdeaList} showAll={showAllMyIdeas} />
          </CardDetailProfileContent>
        </View>
      </ScrollView>

      {/* modal edit background photo */}
      <ModalEditProfile
        title="Edit Background Photo"
        visible={modalEditBackgroundPhotoVisible}
        onRequestClose={() => openModalDiscardEditBackgroundPhotoReff.current()}
        onCloseButtonPress={() =>
          openModalDiscardEditBackgroundPhotoReff.current()
        }>
        <EditMyBackgroundPhoto
          openModalDiscardReff={openModalDiscardEditBackgroundPhotoReff}
          backgroundPhoto={profileData.background}
          onSavePress={newBackgroundPhoto => {
            getAsyncStorageObject('@PELENGKAP_DATA_USER').then(res => {
              let data = {
                ...profileData,
                background: newBackgroundPhoto,
              };
              storeAsyncStorageObject(
                '@PELENGKAP_DATA_USER',
                res
                  ? res
                      .filter(item => item.id !== profileData.id)
                      .concat([data])
                  : [data],
              ).then(() => {
                setProfileData(data);
                setModalEditBackgroundPhotoVisible(false);
                setChanged();
              });
            });
          }}
          onDiscardPress={() => setModalEditBackgroundPhotoVisible(false)}
        />
      </ModalEditProfile>

      {/* modal edit profile */}
      <ModalEditProfile
        title="Edit Personal Information"
        visible={modalEditProfileVisible}
        onRequestClose={() => openModalDiscardEditProfileReff.current()}
        onCloseButtonPress={() => openModalDiscardEditProfileReff.current()}>
        <EditMyProfile
          openModalDiscardReff={openModalDiscardEditProfileReff}
          profileData={profileData}
          onSavePress={(newProfileData, photoProfileChanged) => {
            getAsyncStorageObject('@PELENGKAP_DATA_USER').then(res => {
              let data = null;
              if (photoProfileChanged) {
                //with update photo
                console.log('with update photo');
                data = newProfileData;
              } else {
                //without update photo
                console.log('without update photo');
                data = {
                  ...profileData,
                  ...newProfileData,
                  pictures: profileData.pictures,
                };
              }
              storeAsyncStorageObject(
                '@PELENGKAP_DATA_USER',
                res
                  ? res
                      .filter(item => item.id !== profileData.id)
                      .concat([data])
                  : [data],
              ).then(() => {
                setProfileData(data);
                setModalEditProfileVisible(false);
                setChanged();
              });
            });
          }}
          onDiscardPress={() => setModalEditProfileVisible(false)}
        />
      </ModalEditProfile>

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

      {/* modal edit my about */}
      <ModalEditProfile
        title="Edit About Myself"
        visible={modalEditAboutVisible}
        onRequestClose={() => openModalDiscardEditAboutReff.current()}
        onCloseButtonPress={() => openModalDiscardEditAboutReff.current()}>
        <EditMyAbout
          openModalDiscardReff={openModalDiscardEditAboutReff}
          userToken={route.params?.userToken}
          text={profileData.bio}
          onSavePress={newAbout => {
            setModalEditAboutVisible(false);
            setProfileData({...profileData, bio: newAbout});
            setChanged();
          }}
          onDiscardPress={() => setModalEditAboutVisible(false)}
        />
      </ModalEditProfile>

      {/* modal add my skills */}
      <ModalEditProfile
        title="Add My Skills"
        visible={modalAddSkillsVisible}
        onRequestClose={() => openModalDiscardAddSkillReff.current()}
        onCloseButtonPress={() => openModalDiscardAddSkillReff.current()}>
        <AddMySkills
          openModalDiscardReff={openModalDiscardAddSkillReff}
          recomendationSkills={RecomendationSkills}
          mySkills={profileData.skills}
          onSavePress={newSkills => {
            getAsyncStorageObject('@PELENGKAP_DATA_USER').then(res => {
              let data = {
                ...profileData,
                skills: [
                  ...new Set([
                    ...(profileData.skills ? profileData.skills : []),
                    ...newSkills,
                  ]),
                ],
              };
              storeAsyncStorageObject(
                '@PELENGKAP_DATA_USER',
                res
                  ? res
                      .filter(item => item.id !== profileData.id)
                      .concat([data])
                  : [data],
              ).then(() => {
                setProfileData(data);
                setModalAddSkillsVisible(false);
                setChanged();
              });
            });
          }}
          onDiscardPress={() => setModalAddSkillsVisible(false)}
        />
      </ModalEditProfile>

      {/* modal edit my skills */}
      <ModalEditProfile
        title="Edit My Skills"
        visible={modalEditSkillsVisible}
        onRequestClose={() => openModalDiscardEditSkillReff.current()}
        onCloseButtonPress={() => openModalDiscardEditSkillReff.current()}>
        <EditMySkills
          openModalDiscardReff={openModalDiscardEditSkillReff}
          skills={profileData.skills}
          onSavePress={newSkills => {
            getAsyncStorageObject('@PELENGKAP_DATA_USER').then(res => {
              let data = {
                ...profileData,
                skills: newSkills,
              };
              storeAsyncStorageObject(
                '@PELENGKAP_DATA_USER',
                res
                  ? res
                      .filter(item => item.id !== profileData.id)
                      .concat([data])
                  : [data],
              ).then(() => {
                setProfileData(data);
                setModalEditSkillsVisible(false);
                setChanged();
              });
            });
          }}
          onDiscardPress={() => setModalEditSkillsVisible(false)}
        />
      </ModalEditProfile>

      {/* modal add my achievements */}
      <ModalEditProfile
        title="Add My Achievements"
        visible={modalAddAchievemensVisible}
        onRequestClose={() => openModalDiscardAddAchievementReff.current()}
        onCloseButtonPress={() => openModalDiscardAddAchievementReff.current()}>
        <AddMyAchievements
          openModalDiscardReff={openModalDiscardAddAchievementReff}
          onDiscardPress={() => setModalAddAchievemensVisible(false)}
          onSavePress={newAchievements => {
            getAsyncStorageObject('@PELENGKAP_DATA_USER').then(res => {
              let data = {
                ...profileData,
                achievements: profileData.achievements
                  ? profileData.achievements.concat([newAchievements])
                  : [newAchievements],
              };
              storeAsyncStorageObject(
                '@PELENGKAP_DATA_USER',
                res
                  ? res
                      .filter(item => item.id !== profileData.id)
                      .concat([data])
                  : [data],
              ).then(() => {
                setProfileData(data);
                setModalAddAchievemensVisible(false);
                setChanged();
              });
            });
          }}
        />
      </ModalEditProfile>

      {/* modal action my achievements */}
      <ModalEditProfile
        title="Edit My Achievements"
        visible={modalActionAchievemensVisible}
        onRequestClose={() => setModalActionAchievemensVisible(false)}
        onCloseButtonPress={() => setModalActionAchievemensVisible(false)}>
        <ActionMyAchievements
          achievements={profileData.achievements}
          onItemEdit={achievementIndexToEdit => {
            setModalActionAchievemensVisible(false);
            setAchievementIndexToEdit(achievementIndexToEdit);
            setModalEditAchievemensVisible(true);
          }}
          onItemDelete={achievementIndexToDelete => {
            const tempMyAchievements = [...profileData.achievements];
            tempMyAchievements.splice(achievementIndexToDelete, 1);
            getAsyncStorageObject('@PELENGKAP_DATA_USER').then(res => {
              let data = {
                ...profileData,
                achievements: tempMyAchievements,
              };
              storeAsyncStorageObject(
                '@PELENGKAP_DATA_USER',
                res
                  ? res
                      .filter(item => item.id !== profileData.id)
                      .concat([data])
                  : [data],
              ).then(() => {
                if (profileData.achievements?.length <= 1) {
                  setModalActionAchievemensVisible(false);
                }
                setProfileData(data);
                setChanged();
              });
            });
          }}
        />
      </ModalEditProfile>

      {/* modal edit my achievements */}
      <ModalEditProfile
        title="Edit My Achievements"
        visible={modalEditAchievemensVisible}
        onRequestClose={() => openModalDiscardEditAchievementReff.current()}
        onCloseButtonPress={() =>
          openModalDiscardEditAchievementReff.current()
        }>
        <EditMyAchievements
          openModalDiscardReff={openModalDiscardEditAchievementReff}
          achievementsToEdit={
            profileData.achievements?.[achievementIndexToEdit]
          }
          onDiscardPress={() => {
            setModalEditAchievemensVisible(false);
            setModalActionAchievemensVisible(true);
          }}
          onSavePress={editedAchievementItem => {
            setModalEditAchievemensVisible(false);

            const tempAchievements = [...profileData.achievements];
            tempAchievements[achievementIndexToEdit] = editedAchievementItem;

            getAsyncStorageObject('@PELENGKAP_DATA_USER').then(res => {
              let data = {
                ...profileData,
                achievements: tempAchievements,
              };
              storeAsyncStorageObject(
                '@PELENGKAP_DATA_USER',
                res
                  ? res
                      .filter(item => item.id !== profileData.id)
                      .concat([data])
                  : [data],
              ).then(() => {
                setModalActionAchievemensVisible(true);
                setProfileData(data);
                setChanged();
              });
            });
          }}
        />
      </ModalEditProfile>

      <LoadingProcessFull visible={loading.visible} message={loading.message} />

      <RefreshFull
        visible={showRefreshBUtton}
        onPress={() => {
          setShowRefreshButton(false);
          fetchUserData();
        }}
        onOffsetTouch={() => navigation.goBack()}
      />
    </View>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF'},
  profileOptions: {
    padding: 16,
  },
  aboutText: {
    fontFamily: fonts.primary[400],
    fontSize: 12,
    lineHeight: 22,
    color: colors.text.secondary,
    textAlign: 'justify',
  },
});
