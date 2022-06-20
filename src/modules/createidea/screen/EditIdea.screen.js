import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Animated,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Header from '../../../components/Header';
import DummyResponseDetailIdea from '../../riset/DummyResponseDetailIdea';
import {colors} from '../../../utils/ColorsConfig/Colors';
import fonts from '../../../utils/FontsConfig/Fonts';
import Gap from '../../../components/Gap';
import EditIdeaDescription from '../../../components/EditIdeaDescription';
import _ from 'lodash';
import EditStoryBehind from '../../../components/EditStoryBehind';
import EditLeanCanvas from '../../../components/EditLeanCanvas';
import EditTeams from '../../../components/EditTeams';
import EditAdditionalAttachment from '../../../components/EditAdditionalAttachment';
import ModalMessage from '../../../components/ModalMessage';
import jwtDecode from 'jwt-decode';
import {dateToText} from '../../../utils/DateConfig/DateConvert';
import LoadingProcessFull from '../../../components/LoadingProcessFull';
import RefreshFull from '../../../components/RefreshFull';
import {
  EditIdeaAPI,
  GetDetailIdeaAPI,
} from '../../../config/RequestAPI/IdeaAPI';
import {useBackHandler} from '@react-native-community/hooks';
import {
  getAsyncStorageObject,
  storeAsyncStorageObject,
} from '../../../utils/AsyncStorage/StoreAsyncStorage';

const EditIdea = ({navigation, route}) => {
  const decodedJwt = jwtDecode(route.params?.userToken.authToken);
  let ideaData = _.cloneDeep(DummyResponseDetailIdea);

  // only example
  ideaData = {
    ...ideaData,
    approval: [
      {
        id: '17',
        name: 'Fani Alisya',
        nik: '2523634643345',
        noTelp: '085735446657',
        email: 'fani@mandiri.com',
        teamStructure: 'Hipster',
        unit: 'Technical',
        status: 'approved',
        approvedDate: '05/05/2022',
        createdDate: '05/05/2022',
        updatedDate: '05/05/2022',
      },
      {
        id: '15',
        name: 'Yudi Pramudya',
        nik: '432632623452',
        noTelp: '085743770056',
        email: 'fani@yudi@mandiri.com',
        teamStructure: 'Hustler',
        unit: 'Managerial',
        status: 'approved',
        approvedDate: '10/05/2022',
        createdDate: '02/05/2022',
        updatedDate: '02/05/2022',
      },
    ],
    files: [
      {
        field: 'additionalFileAttachment',
        value: {
          name: '[upload] SPTJM Alfian Nur Fathoni L200190002 Telkom.pdf',
          extension: 'pdf',
          link: '1649927752_cd23eecb32ae54ddcbc2.pdf',
        },
        ideaId: '48',
        uploadedById: '17',
        uploadedByName: 'Fani Alisya',
        uploadedDate: '01/05/2022',
      },
      {
        field: 'additionalFileLinkAttachment',
        value: {
          name: 'dokumen 1',
          extension: null,
          link: 'http://lokasifile.com',
        },
        ideaId: '48',
        uploadedById: '17',
        uploadedByName: 'Fani Alisya',
        uploadedDate: '01/05/2022',
      },
      {
        field: 'additionalFileAttachment',
        value: {
          name: '1.1 [Format] SPTJM Mahasiswa MSIB Batch 2.pdf',
          extension: 'pdf',
          link: '1649927752_7dcdfa63d7f2da3d30f3.pdf',
        },
        ideaId: '48',
        uploadedById: '17',
        uploadedByName: 'Fani Alisya',
        uploadedDate: '01/05/2022',
      },
      {
        field: 'additionalFileLinkAttachment',
        value: {
          name: 'dokumen 21',
          extension: null,
          link: 'http://lokasifile222.com',
        },
        ideaId: '48',
        uploadedById: '17',
        uploadedByName: 'Fani Alisya',
        uploadedDate: '01/05/2022',
      },
    ],
  };

  const stepSession = [
    'Idea Description',
    'Story Behind',
    'Lean Canvas',
    'Teams',
    'Additional Attachment',
  ];

  const stepSessionRef = useRef(null);

  const [activeIndexOfContent, setActiveIndexOfContent] = useState(0);
  const [actualIdeaData, setActualIdeaData] = useState(null);
  const [currentIdeaData, setCurrentIdeaData] = useState(null);
  const [isFlatlistMounted, setIsFlatlistMounted] = useState(false);
  const [edited, setEdited] = useState(false);
  const [messageDiscardEditModalVisible, setMessageDiscardEditModalVisible] =
    useState(false);
  const [
    messageSuccessUpdateIdeaModalVisible,
    setMessageSuccessUpdateIdeaModalVisible,
  ] = useState(false);
  const [loading, setLoading] = useState({
    visible: true,
    message: 'Please wait',
  });
  const [messageModal, setMessageModal] = useState({
    visible: false,
    message: undefined,
    title: undefined,
    type: 'smile',
    onClose: () => {},
  });
  const [showRefreshBUtton, setShowRefreshButton] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
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

  const fetchIdea = () => {
    setLoading({...loading, visible: true, message: 'Please wait'});
    setShowRefreshButton(false);
    GetDetailIdeaAPI(
      route.params?.userToken?.authToken,
      route.params?.ideaId,
    ).then(res => {
      getAsyncStorageObject('@PELENGKAP_DATA_IDEA').then(pelengkapIdeaItems => {
        setLoading({...loading, visible: false});
        handleFadeIn();
        const pelengkapDataIdea = pelengkapIdeaItems.filter(
          item => item.ideaId.toString() === res.data.id,
        )[0];
        if (res.status === 'SUCCESS') {
          let fixData = null;
          fixData = {
            ...res.data,
            allowJoin: route.params?.allowJoin ? route.params?.allowJoin : '0',
            // approval: [
            //   {
            //     id: '17',
            //     name: 'Fani Alisya',
            //     nik: '2523634643345',
            //     noTelp: '085735446657',
            //     email: 'fani@mandiri.com',
            //     teamStructure: 'Hipster',
            //     unit: 'Technical',
            //     status: 'approved',
            //     approvedDate: '05/05/2022',
            //     createdDate: '05/05/2022',
            //     updatedDate: '05/05/2022',
            //   },
            //   {
            //     id: '15',
            //     name: 'Yudi Pramudya',
            //     nik: '432632623452',
            //     noTelp: '085743770056',
            //     email: 'fani@yudi@mandiri.com',
            //     teamStructure: 'Hustler',
            //     unit: 'Managerial',
            //     status: 'approved',
            //     approvedDate: '10/05/2022',
            //     createdDate: '02/05/2022',
            //     updatedDate: '02/05/2022',
            //   },
            // ],
            files: pelengkapDataIdea ? pelengkapDataIdea.files : [],
            approval: pelengkapDataIdea ? pelengkapDataIdea.teams : [],
          };
          fixData.desc[2].value = {
            uri: pelengkapDataIdea?.cover.uri,
            mime:
              'image/' + pelengkapDataIdea?.cover.uri?.split('.')?.slice(-1)[0],
            name: pelengkapDataIdea?.cover.uri?.split('/')?.slice(-1)[0],
          };
          setActualIdeaData(fixData);
          setCurrentIdeaData(fixData);
        } else if (res.status === 'SERVER_ERROR') {
          setShowRefreshButton(true);
        }
      });
    });
  };

  const convertDataIdeaToPost = () => {
    let inviteList = [];
    currentIdeaData?.approval?.map(item => {
      inviteList.push({
        userId: item.id,
        notes: 'yuk join',
        teamStructure: item.teamStructure,
      });
    });
    let linkAttachment = [];
    currentIdeaData?.files?.map(item => {
      if (item.field === 'additionalFileLinkAttachment') {
        linkAttachment.push({name: item.value.name, link: item.value.link});
      }
    });
    return {
      ideaDescription: {
        title: currentIdeaData?.desc[0].value,
        cover: currentIdeaData?.desc[2].value,
        category: currentIdeaData?.categoryIdea[0]?.id,
        description: currentIdeaData?.desc[1].value,
        allowToJoin: currentIdeaData?.allowJoin === '1' ? true : false,
      },
      storyBehind: {
        why: currentIdeaData?.gc[0].value,
        how: currentIdeaData?.gc[1].value,
        what: currentIdeaData?.gc[2].value,
      },
      leanCanvas: {
        customer: currentIdeaData?.lc
          .filter(item => item.field === 'customers')
          .map(item => item.value),
        problem: currentIdeaData?.lc
          .filter(item => item.field === 'problems')
          .map(item => item.value),
        earlyAdopter: currentIdeaData?.lc
          .filter(item => item.field === 'earlyAdopters')
          .map(item => item.value),
        existingSolution: currentIdeaData?.lc
          .filter(item => item.field === 'existingSolutions')
          .map(item => item.value),
        uniqueValue: currentIdeaData?.lc
          .filter(item => item.field === 'uniqueValues')
          .map(item => item.value),
        proposedSolution: currentIdeaData?.lc
          .filter(item => item.field === 'proposedSolutions')
          .map(item => item.value),
      },
      inviteUsers: inviteList,
      // attachment: [],
      additionalFileLinkAttachment: linkAttachment,
      saveAttachment: currentIdeaData.files,
      teams: currentIdeaData.approval,
    };
  };

  const handleSaveEdit = () => {
    const ideaDataToPostEdit = convertDataIdeaToPost();
    setLoading({...loading, visible: true, message: 'Updating your idea'});
    EditIdeaAPI(
      route.params?.userToken.authToken,
      route.params?.ideaId,
      ideaDataToPostEdit,
    ).then(res => {
      setLoading({...loading, visible: false});
      if (res.status === 'SUCCESS') {
        setLoading({...loading, visible: true, message: 'Processing'});
        getAsyncStorageObject('@PELENGKAP_DATA_IDEA').then(res => {
          setLoading({...loading, visible: false});
          const dataPelengkapIdeaBefore = res.filter(
            item => item.ideaId.toString() === currentIdeaData.id,
          )[0];
          const dataPelengkapIdeaAfter = {
            ...(dataPelengkapIdeaBefore ? dataPelengkapIdeaBefore : {}),
            ideaId: currentIdeaData.id,
            cover: {uri: ideaDataToPostEdit.ideaDescription.cover.uri},
            files: ideaDataToPostEdit.saveAttachment,
            teams: ideaDataToPostEdit.teams,
            updatedDate: dateToText(new Date(), 'dash'),
          };
          const dataPelengkapOtherIdea = res.filter(
            item => item.ideaId.toString() !== currentIdeaData.id,
          );
          storeAsyncStorageObject(
            '@PELENGKAP_DATA_IDEA',
            dataPelengkapOtherIdea.concat([dataPelengkapIdeaAfter]),
          ).then(() => {
            setMessageSuccessUpdateIdeaModalVisible(true);
          });
        });
      } else if (
        res.status === 'SOMETHING_WRONG' ||
        res.status === 'UNAUTHORIZED' ||
        res.status === 'VALIDATION_ERROR' ||
        res.status === 'BACKEND_ERROR' ||
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

  const toggleActive = index => {
    if (activeIndexOfContent !== index) {
      setActiveIndexOfContent(index);
      handleFadeIn();
    }
  };

  const handleEdited = () => {
    if (!edited) {
      setEdited(true);
    }
  };

  const handleCompleted = () => {
    let completed = true;
    // idea description check
    if (
      currentIdeaData?.desc[0]?.value?.trim()?.length === 0 ||
      currentIdeaData?.desc[1]?.value?.trim()?.length === 0 ||
      currentIdeaData?.desc[2]?.value === null ||
      currentIdeaData?.categoryIdea?.length === 0 ||
      currentIdeaData?.allowJoin === null
    ) {
      completed = false;
    }
    // story behind check
    if (
      currentIdeaData?.gc[0].value.trim().length === 0 ||
      currentIdeaData?.gc[1].value.trim().length === 0 ||
      currentIdeaData?.gc[2].value.trim().length === 0
    ) {
      completed = false;
    }
    // lean canvas check
    let customer = currentIdeaData?.lc.filter(item => {
      return item.field === 'customers';
    });
    let problem = currentIdeaData?.lc.filter(item => {
      return item.field === 'problems';
    });
    let earlyAdopter = currentIdeaData?.lc.filter(item => {
      return item.field === 'earlyAdopters';
    });
    let existingSolution = currentIdeaData?.lc.filter(item => {
      return item.field === 'existingSolutions';
    });
    let uniqueValue = currentIdeaData?.lc.filter(item => {
      return item.field === 'uniqueValues';
    });
    let proposedSolution = currentIdeaData?.lc.filter(item => {
      return item.field === 'proposedSolutions';
    });
    if (
      customer?.length === 0 ||
      problem?.length === 0 ||
      earlyAdopter?.length === 0 ||
      existingSolution?.length === 0 ||
      uniqueValue?.length === 0 ||
      proposedSolution?.length === 0
    ) {
      completed = false;
    }
    // teams check (not necessary)
    // additional attachment check (not necessary)
    return completed && edited;
  };

  const backToPreviousPage = (withRefresh = false) => {
    if (withRefresh) {
      const pageBack = route.params?.fromPage
        ? route.params?.fromPage
        : 'SubmittedIdea';
      navigation.navigate(`${pageBack}`, {
        userToken: route.params?.userToken,
        refresh: {status: true},
      });
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    stepSessionRef.current?.scrollToIndex({
      index: activeIndexOfContent,
      animated: true,
      viewOffset: 0,
      viewPosition: 0.5,
    });
  }, [activeIndexOfContent, isFlatlistMounted]);

  useEffect(() => {
    if (route.params.indexSection !== undefined && isFlatlistMounted) {
      setActiveIndexOfContent(route.params.indexSection);
    }
  }, [route.params?.indexSection, isFlatlistMounted]);

  useEffect(() => {
    handleFadeIn();
    fetchIdea();
  }, []);

  useBackHandler(() => {
    backToPreviousPage();
    return true;
  });

  return (
    <View style={styles.page}>
      <Header
        backButton
        onBackPress={() => {
          if (edited) {
            setMessageDiscardEditModalVisible(true);
          } else {
            backToPreviousPage(false);
          }
        }}
        backText="Back"
        title="Edit Idea"
        withNotification={false}
        // onNotificationPress={() => navigation.navigate('Notification')}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
          <Gap height={16} />
          <FlatList
            ref={stepSessionRef}
            data={stepSession}
            keyExtractor={(_, index) => index.toString()}
            scrollEnabled={true}
            horizontal
            showsHorizontalScrollIndicator={false}
            inverted={false}
            onContentSizeChange={() => {
              if (!isFlatlistMounted) {
                setIsFlatlistMounted(true);
              }
            }}
            contentContainerStyle={{
              paddingHorizontal: 16,
            }}
            renderItem={({item, index}) => {
              return (
                <View
                  style={styles.tabContainer(
                    index === 0
                      ? 'start'
                      : index === stepSession.length - 1
                      ? 'end'
                      : 'middle',
                  )}>
                  <TouchableOpacity
                    style={styles.tabItem(activeIndexOfContent === index)}
                    onPress={() => toggleActive(index)}>
                    <Text
                      numberOfLines={2}
                      style={styles.tabTitle(activeIndexOfContent === index)}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />

          <Animated.View style={{padding: 16, opacity: fadeAnim}}>
            {/* edit idea description */}
            {activeIndexOfContent === 0 && (
              <EditIdeaDescription
                ideaTitle={currentIdeaData?.desc[0].value}
                ideaCover={
                  currentIdeaData?.desc[2].value
                    ? currentIdeaData?.desc[2].value
                    : null
                }
                ideaCategory={currentIdeaData?.categoryIdea[0]?.id}
                ideaDesc={currentIdeaData?.desc[1].value}
                allowToJoin={currentIdeaData?.allowJoin === '1' ? true : false}
                onIdeaTitleChange={newTitle => {
                  if (currentIdeaData !== null) {
                    let tempCurrentIdeaData = {...currentIdeaData};
                    tempCurrentIdeaData.desc[0].value = newTitle;
                    setCurrentIdeaData(tempCurrentIdeaData);
                    handleEdited();
                  }
                }}
                onIdeaCoverChange={newCover => {
                  if (currentIdeaData !== null) {
                    let tempCurrentIdeaData = {...currentIdeaData};
                    tempCurrentIdeaData.desc[2].value = newCover;
                    setCurrentIdeaData(tempCurrentIdeaData);
                    handleEdited();
                  }
                }}
                onIdeaCategoryChange={(newCategoryId, newCategoryName) => {
                  if (currentIdeaData !== null) {
                    let tempCurrentIdeaData = {...currentIdeaData};
                    tempCurrentIdeaData.categoryIdea[0].id = newCategoryId;
                    tempCurrentIdeaData.categoryIdea[0].name = newCategoryName;
                    setCurrentIdeaData(tempCurrentIdeaData);
                    handleEdited();
                  }
                }}
                // onDropdownValueChange={() => handleEdited()}
                onIdeaDescChange={newDesc => {
                  if (currentIdeaData !== null) {
                    let tempCurrentIdeaData = {...currentIdeaData};
                    tempCurrentIdeaData.desc[1].value = newDesc;
                    setCurrentIdeaData(tempCurrentIdeaData);
                    handleEdited();
                  }
                }}
                onAllowToJoinChange={newAllowToJoin => {
                  if (currentIdeaData !== null) {
                    let tempCurrentIdeaData = {...currentIdeaData};
                    tempCurrentIdeaData.allowJoin =
                      newAllowToJoin === true ? '1' : 0;
                    setCurrentIdeaData(tempCurrentIdeaData);
                    handleEdited();
                  }
                }}
              />
            )}
            {/* edit story behind */}
            {activeIndexOfContent === 1 && (
              <EditStoryBehind
                why={currentIdeaData?.gc[0].value}
                how={currentIdeaData?.gc[1].value}
                what={currentIdeaData?.gc[2].value}
                onWhyChange={newWhy => {
                  if (currentIdeaData !== null) {
                    let tempCurrentIdeaData = {...currentIdeaData};
                    tempCurrentIdeaData.gc[0].value = newWhy;
                    setCurrentIdeaData(tempCurrentIdeaData);
                    handleEdited();
                  }
                }}
                onHowChange={newHow => {
                  if (currentIdeaData !== null) {
                    let tempCurrentIdeaData = {...currentIdeaData};
                    tempCurrentIdeaData.gc[1].value = newHow;
                    setCurrentIdeaData(tempCurrentIdeaData);
                    handleEdited();
                  }
                }}
                onWhatChange={newWhat => {
                  if (currentIdeaData !== null) {
                    let tempCurrentIdeaData = {...currentIdeaData};
                    tempCurrentIdeaData.gc[2].value = newWhat;
                    setCurrentIdeaData(tempCurrentIdeaData);
                    handleEdited();
                  }
                }}
              />
            )}
            {/* edit story lean canvas */}
            {activeIndexOfContent === 2 && (
              <EditLeanCanvas
                customer={currentIdeaData?.lc.filter(item => {
                  return item.field === 'customers';
                })}
                problem={currentIdeaData?.lc.filter(item => {
                  return item.field === 'problems';
                })}
                earlyAdopter={currentIdeaData?.lc.filter(item => {
                  return item.field === 'earlyAdopters';
                })}
                existingSolution={currentIdeaData?.lc.filter(item => {
                  return item.field === 'existingSolutions';
                })}
                uniqueValue={currentIdeaData?.lc.filter(item => {
                  return item.field === 'uniqueValues';
                })}
                proposedSolution={currentIdeaData?.lc.filter(item => {
                  return item.field === 'proposedSolutions';
                })}
                onLeanCanvasChange={(type, field, value) => {
                  if (currentIdeaData !== null) {
                    if (type === 'add') {
                      let tempCurrentIdeaData = {...currentIdeaData};
                      tempCurrentIdeaData.lc.push({field: field, value: value});
                      setCurrentIdeaData(tempCurrentIdeaData);
                      handleEdited();
                    } else if (type === 'remove') {
                      let tempCurrentIdeaData = {...currentIdeaData};
                      let tempLeanCanvas = tempCurrentIdeaData.lc.filter(
                        item => {
                          return item.field !== field || item.value !== value;
                        },
                      );
                      tempCurrentIdeaData.lc = tempLeanCanvas;
                      setCurrentIdeaData(tempCurrentIdeaData);
                      handleEdited();
                    }
                  }
                }}
              />
            )}
            {/* edit teams */}
            {activeIndexOfContent === 3 && (
              <EditTeams
                userToken={route.params?.userToken}
                isGuest={
                  route.params.isGuest === undefined
                    ? false
                    : route.params.isGuest
                }
                listUserData={route.params?.listUserData}
                ideaName={actualIdeaData?.desc[0]?.value}
                teams={currentIdeaData?.approval}
                onProfilePress={(person, id) => {
                  if (person === 'me') {
                    navigation.navigate('MyProfile', {
                      editable: false,
                      userId: decodedJwt.data.id,
                      userToken: route.params?.userToken,
                      ideaData: route.params?.ideaDataList,
                    });
                  } else if (person === 'others') {
                    navigation.navigate('MyProfile', {
                      editable: false,
                      userId: id,
                      userToken: route.params?.userToken,
                      ideaData: route.params?.ideaDataList,
                    });
                  }
                }}
                onTeamsRemoved={index => {
                  if (currentIdeaData !== null) {
                    let tempCurrentIdeaData = {...currentIdeaData};
                    tempCurrentIdeaData.approval.splice(index, 1);
                    setCurrentIdeaData(tempCurrentIdeaData);
                    handleEdited();
                  }
                }}
                onTeamsChange={(index, newName, newTeamStructure) => {
                  if (currentIdeaData !== null) {
                    let tempCurrentIdeaData = {...currentIdeaData};
                    tempCurrentIdeaData.approval[index].name = newName;
                    tempCurrentIdeaData.approval[index].teamStructure =
                      newTeamStructure;
                    setCurrentIdeaData(tempCurrentIdeaData);
                    handleEdited();
                  }
                }}
                onLeaveIdea={() => {
                  navigation.navigate('JoinedIdea', {
                    userToken: route.params?.userToken,
                    leavingIdea: {status: true},
                  });
                }}
              />
            )}
            {/* edit additional attachment */}
            {activeIndexOfContent === 4 && (
              <EditAdditionalAttachment
                attachment={currentIdeaData.files}
                listUserData={route.params?.listUserData}
                onRemoveAttachment={index => {
                  if (currentIdeaData !== null) {
                    let tempCurrentIdeaData = {...currentIdeaData};
                    tempCurrentIdeaData.files.splice(index, 1);
                    setCurrentIdeaData(tempCurrentIdeaData);
                    handleEdited();
                  }
                }}
                onAddAttachment={newAttachment => {
                  if (currentIdeaData !== null) {
                    let fixNewAttachment = {
                      id: Math.floor(
                        Math.random() * Math.floor(Math.random() * Date.now()),
                      ).toString(),
                      field:
                        newAttachment.type === 'File'
                          ? 'additionalFileAttachment'
                          : 'additionalFileLinkAttachment',
                      value: {
                        name: newAttachment.desc,
                        extension:
                          newAttachment.type === 'File'
                            ? newAttachment.documentName
                                .split('.')
                                ?.slice(-1)[0]
                            : null,
                        link:
                          newAttachment.type === 'File'
                            ? newAttachment.documentName
                            : newAttachment.link,
                      },
                      ideaId: currentIdeaData.id,
                      uploadedById: decodedJwt.data.id,
                      uploadedByName: decodedJwt.data.name,
                      uploadedDate: dateToText(new Date()),
                    };
                    let tempCurrentIdeaData = {...currentIdeaData};
                    tempCurrentIdeaData.files.push(fixNewAttachment);
                    setCurrentIdeaData(tempCurrentIdeaData);
                    handleEdited();
                  }
                }}
              />
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity
          style={styles.actionButton('discard')}
          onPress={() => {
            if (edited) {
              setMessageDiscardEditModalVisible(true);
            } else {
              backToPreviousPage(false);
            }
          }}>
          <Text style={styles.actionButtonText('discard')}>Discard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton(
            handleCompleted() ? 'finish' : 'finishDisabled',
          )}
          disabled={!handleCompleted()}
          onPress={() => {
            handleSaveEdit();
          }}>
          <Text style={styles.actionButtonText('finish')}>Finish</Text>
        </TouchableOpacity>
      </View>
      {/* modal discard confirmation message */}
      <ModalMessage
        visible={messageDiscardEditModalVisible}
        withIllustration
        illustrationType="confused"
        message={
          <Text>
            Are you sure want{' '}
            <Text style={{color: colors.pending}}>to leave this page</Text>? You
            will lose all unsaved progress.
          </Text>
        }
        withCancelButton
        withConfirmButton
        onCancel={() => setMessageDiscardEditModalVisible(false)}
        onConfirm={() => {
          setMessageDiscardEditModalVisible(false);
          backToPreviousPage(false);
        }}
        onRequestClose={() => setMessageDiscardEditModalVisible(false)}
      />
      {/* modal success update idea message */}
      <ModalMessage
        visible={messageSuccessUpdateIdeaModalVisible}
        withIllustration
        illustrationType="smile"
        title="Success"
        message={
          <Text
            style={{...styles.customMessageStyle, color: colors.text.primary}}>
            You have <Text style={styles.customMessageStyle}>updated</Text> your
            Idea
          </Text>
        }
        withBackButton
        onBack={() => {
          setMessageSuccessUpdateIdeaModalVisible(false);
          backToPreviousPage(true);
        }}
        onRequestClose={() => {
          setMessageSuccessUpdateIdeaModalVisible(false);
          backToPreviousPage(true);
        }}
      />

      <LoadingProcessFull visible={loading.visible} message={loading.message} />
      <RefreshFull
        visible={showRefreshBUtton}
        onPress={() => {
          setShowRefreshButton(false);
          fetchIdea();
        }}
        onOffsetTouch={() => backToPreviousPage(false)}
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

export default EditIdea;

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: '#FFFFFF'},
  tabContainer: type => ({
    backgroundColor: colors.tertiary,
    paddingVertical: 4,
    paddingRight: type === 'end' ? 4 : 0,
    paddingLeft: type === 'start' ? 4 : 0,
    borderTopLeftRadius: type === 'start' ? 32 : 0,
    borderBottomLeftRadius: type === 'start' ? 32 : 0,
    borderTopRightRadius: type === 'end' ? 32 : 0,
    borderBottomRightRadius: type === 'end' ? 32 : 0,
    overflow: 'hidden',
  }),
  tabItem: active => ({
    flex: 1,
    backgroundColor: active ? colors.primary : '#00000000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 32,
    justifyContent: 'center',
  }),
  tabTitle: active => ({
    fontFamily: fonts.secondary[600],
    fontSize: 12,
    lineHeight: 15,
    color: active ? colors.white : colors.text.primary,
    textAlign: 'center',
  }),
  actionButtonContainer: {
    height: 76,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  customMessageStyle: {
    fontFamily: fonts.primary[400],
    fontSize: 12,
    lineHeight: 22,
    color: colors.success,
  },
});
