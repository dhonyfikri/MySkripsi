import {useBackHandler} from '@react-native-community/hooks';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CreateAdditionalAttachment from '../../../components/CreateAdditionalAttachment';
import CreateIdeaDescription from '../../../components/CreateIdeaDescription';
import CreateLeanCanvas from '../../../components/CreateLeanCanvas';
import CreateStoryBehind from '../../../components/CreateStoryBehind';
import CreateTeams from '../../../components/CreateTeams';
import Divider from '../../../components/Divider';
import Gap from '../../../components/Gap';
import Header from '../../../components/Header';
import LoadingProcessFull from '../../../components/LoadingProcessFull';
import ModalMessage from '../../../components/ModalMessage';
import RefreshFull from '../../../components/RefreshFull';
import {ApiGatewayBaseUrl} from '../../../config/Environment.cfg';
import {CreateIdeaAPI, GetIdeasAPI} from '../../../config/RequestAPI/IdeaAPI';
import {
  getAsyncStorageObject,
  storeAsyncStorageObject,
} from '../../../utils/AsyncStorage/StoreAsyncStorage';
import {colors} from '../../../utils/ColorsConfig/Colors';
import {dateToText} from '../../../utils/DateConfig/DateConvert';
import fonts from '../../../utils/FontsConfig/Fonts';

const CreateIdeaStep = ({navigation, route}) => {
  const decodedJwt = jwtDecode(route.params?.userToken.authToken);
  const onNextCreateIdeaDescriptionReff = useRef(null);
  const onNextCreateStoryBehindReff = useRef(null);
  const onNextCreateLeanCanvasReff = useRef(null);
  const onNextCreateTeamsReff = useRef(null);
  const onNextCreateAdditionalAttachmentReff = useRef(null);
  const stepSessionRef = useRef(null);
  const formSessionRef = useRef(null);
  const [eachFormSessionHeight, setEachFormSessionHeight] = useState([
    0, 0, 0, 0, 0,
  ]);
  const [eachFormSessionCompleted, setEachFormSessionCompleted] = useState([
    false,
    false,
    false,
    false,
    true,
  ]);
  const [indexActive, setIndexActive] = useState(0);
  const [contentMounted, setContentMounted] = useState(false);
  const [submittedIdea, setSubmittedIdea] = useState(false);
  const [edited, setEdited] = useState(false);
  const [
    messageDiscardCreateModalVisible,
    setMessageDiscardCreateModalVisible,
  ] = useState(false);
  const [
    messageOpenNotificationRequestModalVisible,
    setMessageOpenNotificationRequestModalVisible,
  ] = useState(false);
  const [messageSuccessModalVisible, setMessageSuccessModalVisible] =
    useState(false);
  const [listIdea, setListIdea] = useState({isSet: false, data: []});
  const [listUserData, setListUserData] = useState([]);
  const [loading, setLoading] = useState({
    visible: true,
    message: 'Please Wait',
  });
  const [showRefreshBUtton, setShowRefreshButton] = useState(false);
  const [messageModal, setMessageModal] = useState({
    visible: false,
    message: undefined,
    title: undefined,
    type: 'smile',
    onClose: () => {},
  });

  const [idea, setIdea] = useState({
    ideaDescription: {
      title: '',
      cover: null,
      category: null,
      description: '',
      allowToJoin: true,
    },
    storyBehind: {
      why: '',
      how: '',
      what: '',
    },
    leanCanvas: {
      customer: [],
      problem: [],
      earlyAdopter: [],
      existingSolution: [],
      uniqueValue: [],
      proposedSolution: [],
    },
    inviteUsers: [],
    // attachment: [],
    additionalFileLinkAttachment: [],
    saveAttachment: [],
  });

  const stepSession = [
    {key: '1', title: 'Idea Description', mandatory: true},
    {key: '1.5', title: ''},
    {key: '2', title: 'Story Behind', mandatory: true},
    {key: '2.5', title: ''},
    {key: '3', title: 'Lean Canvas', mandatory: true},
    {key: '3.5', title: ''},
    {key: '4', title: 'Teams', mandatory: true},
    {key: '4.5', title: ''},
    {key: '5', title: 'Additional Attachment', mandatory: false},
  ];

  const formSession = [
    {key: '1'},
    {key: '2'},
    {key: '3'},
    {key: '4'},
    {key: '5'},
  ];

  const formFieldConpletingHandler = (index, isCompleted) => {
    if (eachFormSessionCompleted[index] !== isCompleted) {
      let tempEachFormSessionCompleted = [...eachFormSessionCompleted];
      tempEachFormSessionCompleted[index] = isCompleted;
      setEachFormSessionCompleted(tempEachFormSessionCompleted);
    }
  };

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
                  res.data.map(item => {
                    const tempItem = item;
                    listUser.map(item => {
                      if (item.id === tempItem.createdBy) {
                        tempItem.user = item;
                      }
                    });
                    fixResult.push(tempItem);
                  });
                  setListIdea(fixResult);
                  setListUserData(listUser);
                  setLoading({...loading, visible: false});
                }),
              )
              .catch(errors => {
                setLoading({...loading, visible: false});
                setShowRefreshButton(true);
                console.log(errors);
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
        setLoading({...loading, visible: false});
        setShowRefreshButton(true);
      }
    });
  };

  const cancelCreateIdea = () => {
    if (edited) {
      setMessageDiscardCreateModalVisible(true);
    } else {
      navigation.goBack();
    }
  };

  const postCreateIdea = () => {
    setLoading({...loading, visible: true, message: 'Uploading your idea'});
    CreateIdeaAPI(route.params?.userToken.authToken, idea).then(res => {
      setLoading({...loading, visible: false});
      setSubmittedIdea(false);
      if (res.status === 'SUCCESS' || res.status === 'BACKEND_ERROR') {
        setLoading({...loading, visible: true, message: 'Processing'});
        GetIdeasAPI(route.params?.userToken?.authToken).then(res => {
          setLoading({...loading, visible: false});
          if (res.status === 'SUCCESS') {
            const ideaIdList = [];
            res.data.map(item => {
              ideaIdList.push(parseInt(item.id));
            });
            const latestIdeaId = Math.max(...ideaIdList);
            let dateCreated = new Date();
            dateCreated.setDate(
              dateCreated.getDate() -
                Math.floor(
                  Math.random() *
                    ((new Date(dateToText(new Date(), 'dash')) -
                      new Date('2022-01-01')) /
                      (1000 * 60 * 60 * 24)) +
                    1,
                ),
            );

            getAsyncStorageObject('@PELENGKAP_DATA_IDEA').then(res => {
              let files = [];
              idea.saveAttachment.map(item => {
                files.push({...item, uploadedDate: dateToText(dateCreated)});
              });
              const data = {
                ideaId: latestIdeaId.toString(),
                cover: {uri: idea.ideaDescription.cover.uri},
                files: files,
                teams: [
                  {
                    ...idea.inviteUsers.filter(
                      item => item.userId === decodedJwt.data.id,
                    )[0],
                    id: Math.floor(
                      Math.random() * Math.floor(Math.random() * Date.now()),
                    ).toString(),
                    status: 'Approved',
                    createdDate: dateToText(dateCreated),
                    approvedDate: dateToText(dateCreated),
                  },
                ],
                createdDate: dateToText(dateCreated, 'dash'),
                updatedDate: dateToText(dateCreated, 'dash'),
              };
              storeAsyncStorageObject(
                '@PELENGKAP_DATA_IDEA',
                res ? res.concat([data]) : [data],
              ).then(() => {
                setMessageSuccessModalVisible(true);
              });
            });
          } else if (
            res.status === 'SOMETHING_WRONG' ||
            res.status === 'NOT_FOUND' ||
            res.status === 'UNDEFINED_HEADER' ||
            res.status === 'UNAUTHORIZED' ||
            res.status === 'SERVER_ERROR'
          ) {
            setMessageModal({
              ...messageModal,
              visible: true,
              title: 'Failed',
              message: res.message,
              type: 'confused',
            });
          }
        });
      } else if (
        res.status === 'SOMETHING_WRONG' ||
        res.status === 'UNAUTHORIZED' ||
        res.status === 'VALIDATION_ERROR' ||
        res.status === 'SERVER_ERROR'
      ) {
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

  const goHomeAndRefresh = () => {
    navigation.navigate('TabNavigation', {
      screen: 'Home',
      params: {
        userToken: route.params?.userToken,
        refresh: {status: true},
      },
    });
  };

  useBackHandler(() => {
    cancelCreateIdea();
    return true;
  });

  useEffect(() => {
    stepSessionRef.current?.scrollToIndex({
      index: indexActive * 2,
      animated: true,
      viewOffset: 0,
      viewPosition: 0.5,
    });
    formSessionRef.current?.scrollToIndex({
      index: indexActive,
      animated: true,
      viewOffset: 0,
      viewPosition: 0.5,
    });
  }, [indexActive, contentMounted]);

  useEffect(() => {
    if (submittedIdea) {
      // setSubmittedIdea(false);
      // console.log(idea);
      postCreateIdea();
    }
  }, [submittedIdea]);

  useEffect(() => {
    fetchIdeas();
  }, []);

  return (
    <View style={styles.page}>
      <Header
        backButton
        onBackPress={() => cancelCreateIdea()}
        backText="Back"
        onNotificationPress={() => {
          if (edited) {
            setMessageOpenNotificationRequestModalVisible(true);
          } else {
            navigation.replace('Notification');
          }
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Gap height={16} />
          <FlatList
            ref={stepSessionRef}
            data={stepSession}
            keyExtractor={item => item.key}
            initialScrollIndex={indexActive * 2}
            scrollEnabled={false}
            // onContentSizeChange={() => {
            //   if (!contentMounted) {
            //     setContentMounted(true);
            //   }
            // }}
            contentContainerStyle={{
              paddingHorizontal: Dimensions.get('screen').width,
              height: 32,
            }}
            showsHorizontalScrollIndicator={false}
            horizontal
            renderItem={({item, index}) => {
              return (
                <View style={styles.indicatorStepItemWrapper}>
                  {item.title === '' ? (
                    <Divider
                      width={24}
                      lineColors={colors.text.primary}
                      marginVertical={0}
                    />
                  ) : (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View
                        style={styles.indicatorStepNumberContainer(
                          index === indexActive * 2,
                        )}>
                        <Text
                          style={styles.indicatorStepNumberText(
                            index === indexActive * 2,
                          )}>
                          {item.key}
                        </Text>
                      </View>
                      <Gap width={8} />
                      <Text
                        style={styles.indicatorStepTitle(
                          index === indexActive * 2,
                        )}>
                        {item.title}{' '}
                        {item.mandatory && (
                          <Text style={{color: colors.alert}}>*</Text>
                        )}
                      </Text>
                    </View>
                  )}
                </View>
              );
            }}
          />
          <Gap height={16} />
          <FlatList
            ref={formSessionRef}
            data={formSession}
            keyExtractor={item => item.key}
            initialScrollIndex={indexActive}
            scrollEnabled={false}
            contentContainerStyle={{
              paddingHorizontal: Dimensions.get('screen').width,
              height: eachFormSessionHeight[indexActive],
            }}
            onContentSizeChange={() => {
              if (!contentMounted) {
                setContentMounted(true);
              }
            }}
            showsHorizontalScrollIndicator={false}
            horizontal
            renderItem={({item, index}) => {
              return (
                <ScrollView
                  onContentSizeChange={(_, height) => {
                    const _eachSessionHeight = [...eachFormSessionHeight];
                    _eachSessionHeight[index] = height;
                    setEachFormSessionHeight(_eachSessionHeight);
                  }}>
                  {item.key === '1' && (
                    <View style={styles.sessionComponentWrapper}>
                      <CreateIdeaDescription
                        onNextReff={onNextCreateIdeaDescriptionReff}
                        onEdited={() => {
                          if (!edited) {
                            setEdited(true);
                          }
                        }}
                        onUpdate={isCompleted => {
                          formFieldConpletingHandler(index, isCompleted);
                        }}
                        onNextRequest={newIdeaDescription => {
                          setIdea({
                            ...idea,
                            ideaDescription: newIdeaDescription,
                          });
                        }}
                      />
                    </View>
                  )}
                  {item.key === '2' && (
                    <View style={styles.sessionComponentWrapper}>
                      <CreateStoryBehind
                        onNextReff={onNextCreateStoryBehindReff}
                        onUpdate={isCompleted => {
                          formFieldConpletingHandler(index, isCompleted);
                        }}
                        onNextRequest={newStoryBehind => {
                          setIdea({
                            ...idea,
                            storyBehind: newStoryBehind,
                          });
                        }}
                      />
                    </View>
                  )}
                  {item.key === '3' && (
                    <View style={styles.sessionComponentWrapper}>
                      <CreateLeanCanvas
                        onNextReff={onNextCreateLeanCanvasReff}
                        onUpdate={isCompleted => {
                          formFieldConpletingHandler(index, isCompleted);
                        }}
                        onNextRequest={newLeanCanvas => {
                          setIdea({
                            ...idea,
                            leanCanvas: newLeanCanvas,
                          });
                        }}
                      />
                    </View>
                  )}
                  {item.key === '4' && (
                    <View style={styles.sessionComponentWrapper}>
                      <CreateTeams
                        onNextReff={onNextCreateTeamsReff}
                        listUserData={listUserData}
                        myId={decodedJwt?.data.id}
                        onUpdate={isCompleted => {
                          formFieldConpletingHandler(index, isCompleted);
                        }}
                        onNextRequest={newTeams => {
                          setIdea({
                            ...idea,
                            inviteUsers: newTeams,
                          });
                        }}
                      />
                    </View>
                  )}
                  {item.key === '5' && (
                    <View style={styles.sessionComponentWrapper}>
                      <CreateAdditionalAttachment
                        onNextReff={onNextCreateAdditionalAttachmentReff}
                        onUpdate={isCompleted => {
                          formFieldConpletingHandler(index, isCompleted);
                        }}
                        onNextRequest={(
                          newFileAttachment,
                          newLinkAttachment,
                        ) => {
                          let saveAttachment = [];
                          newLinkAttachment.map(item => {
                            saveAttachment.push({
                              id: Math.floor(
                                Math.random() *
                                  Math.floor(Math.random() * Date.now()),
                              ).toString(),
                              field: 'additionalFileLinkAttachment',
                              value: {
                                name: item.name,
                                extension: null,
                                link: item.link,
                              },
                              uploadedById: decodedJwt.data.id,
                              uploadedDate: dateToText(new Date()),
                            });
                          });
                          newFileAttachment.map(item => {
                            saveAttachment.push({
                              id: Math.floor(
                                Math.random() *
                                  Math.floor(Math.random() * Date.now()),
                              ).toString(),
                              field: 'additionalFileAttachment',
                              value: {
                                name: item.name,
                                extension: item.extension,
                                link: item.link,
                              },
                              uploadedById: decodedJwt.data.id,
                              uploadedDate: dateToText(new Date()),
                            });
                          });
                          setIdea({
                            ...idea,
                            additionalFileLinkAttachment: newLinkAttachment,
                            saveAttachment: saveAttachment,
                          });
                        }}
                      />
                    </View>
                  )}
                </ScrollView>
              );
            }}
          />
          <Gap height={16} />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.actionButtonContainer}>
        <TouchableOpacity
          style={styles.actionButton('previous')}
          onPress={() => {
            if (indexActive <= 0) {
              cancelCreateIdea();
            } else {
              setIndexActive(indexActive - 1);
            }
          }}>
          <Text style={styles.actionButtonText('previous')}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton(
            eachFormSessionCompleted[indexActive] ? 'next' : 'nextDisabled',
          )}
          disabled={!eachFormSessionCompleted[indexActive]}
          onPress={() => {
            if (indexActive === 0) {
              onNextCreateIdeaDescriptionReff.current();
            } else if (indexActive === 1) {
              onNextCreateStoryBehindReff.current();
            } else if (indexActive === 2) {
              onNextCreateLeanCanvasReff.current();
            } else if (indexActive === 3) {
              onNextCreateTeamsReff.current();
            } else if (indexActive === 4) {
              onNextCreateAdditionalAttachmentReff.current();
            }
            if (indexActive < formSession.length - 1) {
              setIndexActive(indexActive + 1);
            } else {
              setSubmittedIdea(true);
            }
          }}>
          <Text style={styles.actionButtonText('next')}>
            {indexActive < 4 ? 'Next' : 'Finish'}
          </Text>
        </TouchableOpacity>
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

      {/* modal discard confirmation message */}
      <ModalMessage
        visible={messageDiscardCreateModalVisible}
        withIllustration
        illustrationType="confused"
        message={
          <Text
            style={{
              ...styles.customWarningMessageStyle,
              color: colors.text.primary,
            }}>
            Are you sure want to{' '}
            <Text style={styles.customWarningMessageStyle}>
              leave this page
            </Text>
            ? You will lose all unsaved progress.
          </Text>
        }
        withCancelButton
        withConfirmButton
        onCancel={() => setMessageDiscardCreateModalVisible(false)}
        onConfirm={() => {
          setMessageDiscardCreateModalVisible(false);
          navigation.goBack();
        }}
        onRequestClose={() => setMessageDiscardCreateModalVisible(false)}
      />

      {/* modal open notification request message */}
      <ModalMessage
        visible={messageOpenNotificationRequestModalVisible}
        withIllustration
        illustrationType="confused"
        message={
          <Text
            style={{
              ...styles.customWarningMessageStyle,
              color: colors.text.primary,
            }}>
            Are you sure want to{' '}
            <Text style={styles.customWarningMessageStyle}>
              leave this page
            </Text>
            ? You will lose all unsaved progress.
          </Text>
        }
        withCancelButton
        withConfirmButton
        onCancel={() => setMessageOpenNotificationRequestModalVisible(false)}
        onConfirm={() => {
          setMessageOpenNotificationRequestModalVisible(false);
          navigation.replace('Notification');
        }}
        onRequestClose={() =>
          setMessageOpenNotificationRequestModalVisible(false)
        }
      />

      {/* modal success message */}
      <ModalMessage
        visible={messageSuccessModalVisible}
        withIllustration
        illustrationType="smile"
        title="Success"
        message={
          <Text
            style={{
              ...styles.customSuccessMessageStyle,
              color: colors.text.primary,
            }}>
            You have{' '}
            <Text style={styles.customSuccessMessageStyle}>submitted</Text>{' '}
            about yourself!
          </Text>
        }
        withBackButton
        onBack={() => {
          setMessageSuccessModalVisible(false);
          goHomeAndRefresh();
        }}
        onRequestClose={() => {
          setMessageSuccessModalVisible(false);
          goHomeAndRefresh();
        }}
      />

      {/* modal message */}
      <ModalMessage
        visible={messageModal.visible}
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

export default CreateIdeaStep;

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: 'white'},
  indicatorStepItemWrapper: {
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  indicatorStepNumberContainer: active => ({
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: active ? colors.primary : '#00000000',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  indicatorStepNumberText: active => ({
    color: active ? colors.white : colors.primary,
    fontFamily: fonts.secondary[600],
    fontSize: 16,
    lineHeight: 22,
  }),
  indicatorStepTitle: active => ({
    color: active ? colors.text.primary : colors.text.tertiary,
    fontFamily: fonts.secondary[600],
    fontSize: 12,
    lineHeight: 15,
  }),
  sessionComponentWrapper: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 16,
  },
  actionButtonContainer: {
    height: 76,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: (type = 'next') => ({
    width: 102,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: type === 'previous' ? 1 : 0,
    borderColor: type === 'nextDisabled' ? colors.border : colors.primary,
    borderRadius: 100,
    backgroundColor:
      type === 'previous'
        ? colors.white
        : type === 'next'
        ? colors.primary
        : 'nextDisabled'
        ? colors.border
        : colors.primary,
  }),
  actionButtonText: (type = 'next') => ({
    fontFamily: fonts.secondary[600],
    fontSize: 16,
    lineHeight: 20,
    color:
      type === 'previous'
        ? colors.primary
        : type === 'next'
        ? colors.white
        : 'nextDisabled'
        ? colors.white
        : colors.white,
  }),
  customSuccessMessageStyle: {
    fontFamily: fonts.primary[400],
    fontSize: 12,
    lineHeight: 22,
    color: colors.success,
  },
  customWarningMessageStyle: {
    fontFamily: fonts.primary[400],
    fontSize: 12,
    lineHeight: 22,
    color: colors.danger,
  },
});
