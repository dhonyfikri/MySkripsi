import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, {useEffect, useState, useRef} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {IcFilterCalendar, IcSearch} from '../../../assets/icon';
import CalendarRangePicker from '../../../components/CalendarRangePicker';
import CardJoinedIdea from '../../../components/CardJoinedIdea';
import Divider from '../../../components/Divider';
import EditActionButton from '../../../components/EditActionButton';
import Gap from '../../../components/Gap';
import Header from '../../../components/Header';
import LoadingProcessFull from '../../../components/LoadingProcessFull';
import ModalAction from '../../../components/ModalAction';
import ModalMessage from '../../../components/ModalMessage';
import RefreshFull from '../../../components/RefreshFull';
import {ApiGatewayBaseUrl} from '../../../config/Environment.cfg';
import {GetIdeasAPI} from '../../../config/RequestAPI/IdeaAPI';
import {
  getAsyncStorageObject,
  storeAsyncStorageObject,
} from '../../../utils/AsyncStorage/StoreAsyncStorage';
import {colors} from '../../../utils/ColorsConfig/Colors';
import {dateToText, textToDate} from '../../../utils/DateConfig/DateConvert';
import fonts from '../../../utils/FontsConfig/Fonts';

const JoinedIdea = ({navigation, route}) => {
  const decodedJwt = jwtDecode(route.params?.userToken.authToken);

  const refRBSheetAction = useRef();
  const refRBSheetCalendar = useRef();

  const [joinedIdea, setJoinedIdea] = useState([]);
  const [joinedIdeaToShow, setJoinedIdeaToShow] = useState([]);
  const [listUserData, setListUserData] = useState([]);
  const [ideaDataList, setIdeaDataList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedIdea, setSelectedIdea] = useState(null);

  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [filterDate, setFilterDate] = useState({
    start: 'Unlimited',
    end: 'Unlimited',
  });

  const [modalLeaveIdeaVisible, setModalLeaveIdeaVisible] = useState(false);
  const [
    messageSuccessLeaveIdeaModalVisible,
    setMessageSuccessLeaveIdeaModalVisible,
  ] = useState(false);
  const [leaveIdeaMessage, setLeaveIdeaMessage] = useState('');
  const [loading, setLoading] = useState({
    visible: true,
    message: 'Please Wait',
  });
  const [messageModal, setMessageModal] = useState({
    visible: false,
    message: undefined,
    title: undefined,
    type: 'smile',
    onClose: () => {},
  });
  const [showRefreshBUtton, setShowRefreshButton] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

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
                      setIdeaDataList(fixResult);
                      let fixSubmittedIdea = [];
                      fixResult
                        .filter(
                          item =>
                            item.createdBy !== decodedJwt.data.id &&
                            item.teams.filter(
                              team =>
                                team.userId === decodedJwt.data.id &&
                                team.status === 'Approved',
                            ).length > 0,
                        )
                        .map(item => {
                          fixSubmittedIdea.push({
                            ideaId: item.id,
                            ideaName: item.desc[0].value,
                            allowJoin: item.allowJoin,
                            ownerId: item.createdBy,
                            ownerName: item.user.name,
                            createdDate: dateToText(
                              textToDate(item.createdDate, 'dash'),
                            ),
                          });
                        });
                      setJoinedIdea(fixSubmittedIdea);
                      setListUserData(listUser);
                      setLoading({...loading, visible: false});
                    },
                  );
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

  const leavingIdea = () => {
    setLoading({...loading, visible: true, message: 'Leaving'});
    getAsyncStorageObject('@PELENGKAP_DATA_IDEA').then(res => {
      const dataPelengkapIdea = res.filter(
        item => item.ideaId.toString() === selectedIdea?.ideaId,
      )[0];
      const dataPelengkapTeamAfterLeave = dataPelengkapIdea?.teams.filter(
        item =>
          item.userId !== decodedJwt.data.id || item.status !== 'Approved',
      );
      dataPelengkapIdea.teams = dataPelengkapTeamAfterLeave;
      const dataPelengkapOtherIdea = res.filter(
        item => item.ideaId.toString() !== selectedIdea?.ideaId,
      );
      storeAsyncStorageObject(
        '@PELENGKAP_DATA_IDEA',
        dataPelengkapOtherIdea.concat([dataPelengkapIdea]),
      ).then(() => {
        setLoading({...loading, visible: false});
        setMessageSuccessLeaveIdeaModalVisible(true);
      });
    });
  };

  const matchToSearch = () => {
    let tempJoinedIdea = [];
    if (searchText === '') {
      tempJoinedIdea = joinedIdea;
    } else {
      joinedIdea.map(item => {
        if (item.ideaName.toLowerCase().includes(searchText.toLowerCase())) {
          tempJoinedIdea.push(item);
        }
      });
    }
    setJoinedIdeaToShow(matchToFilter(tempJoinedIdea));
  };

  const matchToFilter = value => {
    let tempJoinedIdea = [...value];
    if (filterDate.start !== 'Unlimited' && filterDate.end !== 'Unlimited') {
      const _tempJoinedIdea = value.filter(item => {
        return (
          textToDate(item.createdDate?.split(',')[0]) >=
            textToDate(filterDate.start) &&
          textToDate(item.createdDate?.split(',')[0]) <=
            textToDate(filterDate.end)
        );
      });
      tempJoinedIdea = _tempJoinedIdea;
    } else if (
      filterDate.start !== 'Unlimited' &&
      filterDate.end === 'Unlimited'
    ) {
      const _tempJoinedIdea = value.filter(item => {
        return (
          textToDate(item.createdDate?.split(',')[0]) >=
          textToDate(filterDate.start)
        );
      });
      tempJoinedIdea = _tempJoinedIdea;
    } else if (
      filterDate.start === 'Unlimited' &&
      filterDate.end !== 'Unlimited'
    ) {
      const _tempJoinedIdea = value.filter(item => {
        return (
          textToDate(item.createdDate?.split(',')[0]) <=
          textToDate(filterDate.end)
        );
      });
      tempJoinedIdea = _tempJoinedIdea;
    }

    return tempJoinedIdea;
  };

  const setChanged = () => {
    if (!isChanged) {
      setIsChanged(true);
    }
  };

  useEffect(() => {
    setJoinedIdeaToShow(matchToFilter(joinedIdea));
  }, [filterDate, joinedIdea]);

  useEffect(() => {
    if (route.params?.leavingIdea?.status) {
      setChanged();
      leavingIdea();
    }
    if (route.params?.leavingIdea?.status) {
      navigation.setParams({
        ...route.params,
        leavingIdea: {status: false},
      });
    }
  }, [route.params?.leavingIdea]);

  useEffect(() => {
    if (route.params?.refresh?.status) {
      setChanged();
      fetchIdeas();
    }
    if (route.params?.refresh?.status) {
      navigation.setParams({
        ...route.params,
        refresh: {status: false},
      });
    }
  }, [route.params?.refresh]);

  useEffect(() => {
    fetchIdeas();
  }, []);

  return (
    <View style={styles.page}>
      <Header
        backButton
        onBackPress={() => navigation.goBack()}
        backText="Back"
        title="Joined Idea"
        onNotificationPress={() =>
          navigation.navigate('Notification', {
            userToken: route.params?.userToken,
          })
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.searchAndFilterWrapper}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchText}
              onChangeText={text => setSearchText(text)}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => {
                matchToSearch();
              }}>
              <IcSearch />
            </TouchableOpacity>
          </View>
          <Gap width={4} />
          <TouchableOpacity onPress={() => refRBSheetCalendar.current.open()}>
            <IcFilterCalendar />
          </TouchableOpacity>
        </View>
        <Gap height={16} />
        <FlatList
          data={joinedIdeaToShow}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          inverted={false}
          renderItem={({item, index}) => {
            return (
              <>
                {index !== 0 && <Gap height={16} />}
                <CardJoinedIdea
                  valueLength={joinedIdeaToShow.length}
                  raiseDelay={index}
                  ideaName={item.ideaName}
                  ownerName={item.ownerName}
                  createdDate={item.createdDate}
                  onDotThreePress={() => {
                    console.log(item.ideaId, item.ideaName);
                    setSelectedIdea(item);
                    refRBSheetAction.current.open();
                  }}
                />
              </>
            );
          }}
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

      {/* Bottom sheet action */}
      <RBSheet
        ref={refRBSheetAction}
        closeOnDragDown={true}
        closeOnPressMask={true}
        animationType="fade"
        height={280}
        customStyles={{
          container: {
            paddingTop: 16,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
          wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
          draggableIcon: {
            backgroundColor: '#9CA3AF',
            margin: 0,
          },
        }}>
        <View style={styles.bottomSheetContentContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={styles.bottomSheetTitle}>Action</Text>
            <TouchableOpacity
              style={styles.titleContainer}
              onPress={() => refRBSheetAction.current.close()}>
              <Text style={styles.bottomSheetCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <Gap height={16} />
          <Divider />
          <Gap height={16} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{padding: 16}}>
              <Text style={styles.buttonText('normal')}>My Event</Text>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity
              style={{padding: 16}}
              onPress={() => {
                refRBSheetAction.current.close();
                navigation.navigate('EditIdea', {
                  fromPage: 'JoinedIdea',
                  ideaId: selectedIdea.ideaId,
                  allowJoin: selectedIdea.allowJoin,
                  userToken: route.params?.userToken,
                  ideaDataList: ideaDataList,
                  listUserData: listUserData,
                  isGuest: true,
                });
              }}>
              <Text style={styles.buttonText('normal')}>Edit Idea</Text>
            </TouchableOpacity>
          </View>
          <Gap height={8} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={{padding: 16}}
              onPress={() => {
                refRBSheetAction.current.close();
                setModalLeaveIdeaVisible(true);
              }}>
              <Text style={styles.buttonText('danger')}>Leave Idea</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
      {/* Bottom sheet calendar */}
      <RBSheet
        ref={refRBSheetCalendar}
        closeOnDragDown={true}
        closeOnPressMask={true}
        animationType="fade"
        onClose={() => setShowDateRangePicker(false)}
        customStyles={{
          container: {
            paddingTop: 16,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            height: showDateRangePicker ? 455 : 220,
          },
          wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
          draggableIcon: {
            backgroundColor: '#9CA3AF',
            margin: 0,
          },
        }}>
        <View style={styles.bottomSheetContentContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={styles.bottomSheetTitle}>Calender</Text>
            <TouchableOpacity
              style={styles.cancelContainer}
              onPress={() => refRBSheetCalendar.current.close()}>
              <Text style={styles.bottomSheetCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <Gap height={16} />
          <Divider />
          <Gap height={16} />
          <CalendarRangePicker
            actualDateFilter={filterDate}
            showRangePicker={showDateRangePicker}
            onClick={() => setShowDateRangePicker(!showDateRangePicker)}
            onDiscard={() => refRBSheetCalendar.current.close()}
            onSave={newDateFilter => {
              refRBSheetCalendar.current.close();
              setFilterDate(newDateFilter);
            }}
          />
        </View>
      </RBSheet>
      {/* Modal leave idea action */}
      <ModalAction
        visible={modalLeaveIdeaVisible}
        title="Leave Idea"
        onCloseButtonPress={() => {
          setModalLeaveIdeaVisible(false);
          setLeaveIdeaMessage('');
        }}
        onRequestClose={() => {
          setModalLeaveIdeaVisible(false);
          setLeaveIdeaMessage('');
        }}
        contentBackground={colors.secondary}
        withTitleDivider={false}>
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeText}>
            Are you sure you want to{' '}
            <Text
              style={{
                ...styles.noticeText,
                fontFamily: fonts.secondary[700],
                color: colors.reject,
              }}>
              leave
            </Text>{' '}
            this idea?{' '}
            <Text
              style={{
                ...styles.noticeText,
                fontFamily: fonts.secondary[700],
              }}>
              {selectedIdea?.ideaName}
            </Text>
          </Text>
        </View>
        <Gap height={28} />
        <View
          style={{
            padding: 16,
            backgroundColor: colors.white,
            borderRadius: 32,
          }}>
          <Text style={styles.messageTitle}>
            Please fill the reason in the field below
            <Text style={{color: colors.reject}}>*</Text>
          </Text>
          <Gap height={8} />
          <TextInput
            multiline
            autoCorrect={false}
            textAlignVertical="top"
            style={styles.board}
            placeholder="Fill your reason.."
            onChangeText={text => {
              setLeaveIdeaMessage(text);
            }}>
            <Text style={{lineHeight: 20}}>{leaveIdeaMessage}</Text>
          </TextInput>
        </View>
        <Gap height={16} />
        <EditActionButton
          disableSaveButton={leaveIdeaMessage.trim().length <= 0}
          onDiscardPress={() => {
            setModalLeaveIdeaVisible(false);
            setLeaveIdeaMessage('');
          }}
          onSavePress={() => {
            setModalLeaveIdeaVisible(false);
            // let tempIdea = joinedIdeaToShow.filter(item => {
            //   return item.ideaId !== selectedIdea.ideaId;
            // });
            setSelectedIdea(null);
            // setJoinedIdeaToShow(tempIdea);
            setLeaveIdeaMessage('');
            leavingIdea();
          }}
        />
      </ModalAction>
      {/* modal success leave idea message */}
      <ModalMessage
        visible={messageSuccessLeaveIdeaModalVisible}
        withIllustration
        illustrationType="confused"
        title="You’re all done"
        message={
          <Text>
            You have <Text style={{color: colors.reject}}>abandoned</Text> this
            Idea
          </Text>
        }
        withBackButton
        onBack={() => {
          setMessageSuccessLeaveIdeaModalVisible(false);
          fetchIdeas();
        }}
        onRequestClose={() => {
          setMessageSuccessLeaveIdeaModalVisible(false);
          fetchIdeas();
        }}
      />
    </View>
  );
};

export default JoinedIdea;

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: '#FFFFFF'},
  contentContainer: {
    padding: 16,
  },
  searchAndFilterWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 32,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 24,
    padding: 0,
    fontFamily: fonts.secondary[400],
    fontSize: 14,
    lineHeight: 17,
    color: colors.text.primary,
  },
  searchButton: {
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetContentContainer: {
    height: '100%',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  bottomSheetTitle: {
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    lineHeight: 17,
    color: colors.text.primary,
  },
  bottomSheetCancelButtonText: {
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    lineHeight: 15,
    color: colors.text.tertiary,
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: colors.dot,
    borderRadius: 32,
    overflow: 'hidden',
  },
  buttonText: type => ({
    textAlign: 'center',
    fontFamily: fonts.secondary[600],
    fontSize: 16,
    lineHeight: 20,
    color:
      type === 'normal'
        ? colors.text.primary
        : type === 'danger'
        ? colors.reject
        : colors.text.secondary,
  }),
  cancelContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  noticeContainer: {
    paddingVertical: 20,
    borderRadius: 16,
  },
  noticeText: {
    fontFamily: fonts.secondary[500],
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.primary,
  },
  messageTitle: {
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    lineHeight: 17,
    color: colors.text.primary,
  },
  board: {
    height: 155,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 12,
    fontFamily: fonts.primary[400],
    fontSize: 16,
    color: colors.text.tertiary,
  },
});
