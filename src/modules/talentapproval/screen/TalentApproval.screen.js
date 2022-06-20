import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {IcFilter, IcSearch, IcTime} from '../../../assets/icon';
import CardTalentApproval from '../../../components/CardTalentApproval';
import FilterTalentApproval from '../../../components/FilterTalentApproval';
import Gap from '../../../components/Gap';
import Header from '../../../components/Header';
import {colors} from '../../../utils/ColorsConfig/Colors';
import fonts from '../../../utils/FontsConfig/Fonts';
import {dateToText, textToDate} from '../../../utils/DateConfig/DateConvert';
import {GetIdeasAPI} from '../../../config/RequestAPI/IdeaAPI';
import jwtDecode from 'jwt-decode';
import {getAsyncStorageObject} from '../../../utils/AsyncStorage/StoreAsyncStorage';
import LoadingProcessFull from '../../../components/LoadingProcessFull';
import RefreshFull from '../../../components/RefreshFull';
import axios from 'axios';
import {ApiGatewayBaseUrl} from '../../../config/Environment.cfg';

const TalentApproval = ({navigation, route}) => {
  const decodedJwt = jwtDecode(route.params?.userToken.authToken);
  const dataFromServer = [
    {
      id: 1,
      status: 'Approved',
      ideaId: 1,
      ideaName: 'Smart Bike',
      personId: 4,
      personName: 'Siti Bojong G.',
      activity: 'Request to Join Idea',
      requestDate: '22/12/2022, 12:00:01',
    },
    {
      id: 2,
      status: 'Rejected',
      ideaId: 1,
      ideaName: 'Smart Bike',
      personId: 6,
      personName: 'Tony Stark',
      activity: 'Request to Join Idea',
      requestDate: '23/12/2022, 13:00:01',
    },
    {
      id: 3,
      status: 'Pending',
      ideaId: 1,
      ideaName: 'Smart Bike',
      personId: 12,
      personName: 'Gusion.',
      activity: 'Request to Join Idea',
      requestDate: '21/12/2022, 14:00:01',
    },
    {
      id: 4,
      status: 'Pending',
      ideaId: 1,
      ideaName: 'Smart Bike',
      personId: 22,
      personName: 'Abinara',
      activity: 'Request to Join Idea',
      requestDate: '20/12/2022, 15:00:01',
    },
  ];

  const refRBSheetFilter = useRef();

  const [talentApprovalRequest, setTalentApprovalRequest] = useState([]);
  const [talentApprovalToShow, setTalentApprovalToShow] = useState([]);
  const [submittedIdea, setSubmittedIdea] = useState([]);
  const [listUserData, setListUserData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [pendingClicked, setPendingClicked] = useState(false);
  const [filterByStatusValue, setFilterByStatusValue] = useState([
    'approved',
    'rejected',
    'pending',
  ]);
  const [filterByDateValue, setFilterByDateValue] = useState('latest');
  const [onResume, setOnResume] = useState({status: true});
  const [loading, setLoading] = useState({
    visible: true,
    message: 'Please Wait',
  });
  const [showRefreshBUtton, setShowRefreshButton] = useState(false);

  let pendingRequestCount = 0;
  talentApprovalRequest.map(item => {
    if (item.status.toLowerCase() === 'pending') {
      pendingRequestCount += 1;
    }
  });

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
                      let fixSubmittedIdea = fixResult.filter(
                        item => item.createdBy === decodedJwt.data.id,
                      );
                      let tempTalentApprovalTail = [];
                      fixSubmittedIdea.map(ideaItem => {
                        ideaItem.teams?.map(teamItem => {
                          if (teamItem.userId !== decodedJwt.data.id) {
                            tempTalentApprovalTail.push({
                              id: teamItem.id,
                              status: teamItem.status,
                              ideaId: ideaItem.id,
                              ideaName: ideaItem.desc[0].value,
                              personId: teamItem.userId,
                              personName: listUser.filter(
                                userItem => userItem.id === teamItem.userId,
                              )[0].name,
                              activity: 'Request to join idea',
                              requestDate: teamItem.createdDate,
                            });
                          }
                        });
                      });
                      setTalentApprovalRequest(tempTalentApprovalTail);
                      setSubmittedIdea(fixSubmittedIdea);
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

  const showOnlyPendingStatus = () => {
    const tempTalentApproval = [];
    talentApprovalRequest.map(item => {
      if (item.status.toLowerCase() === 'pending') {
        tempTalentApproval.push(item);
      }
    });
    setTalentApprovalToShow(tempTalentApproval);
  };

  const matchToSearch = () => {
    let tempTalentApproval = [];
    if (searchText === '') {
      tempTalentApproval = talentApprovalRequest;
    } else {
      talentApprovalRequest.map(item => {
        if (item.personName.toLowerCase().includes(searchText.toLowerCase())) {
          tempTalentApproval.push(item);
        }
      });
    }
    setTalentApprovalToShow(matchToFilter(tempTalentApproval));
  };

  const matchToFilter = value => {
    let tempTalentApproval = value.filter(item => {
      return filterByStatusValue.includes(item.status.toLowerCase());
    });
    if (filterByDateValue === 'latest') {
      tempTalentApproval.sort(function (a, b) {
        return (
          textToDate(b.requestDate.split(',')[0]) -
          textToDate(a.requestDate.split(',')[0])
        );
      });
    } else if (filterByDateValue === 'earliest') {
      tempTalentApproval.sort(function (a, b) {
        return (
          textToDate(a.requestDate.split(',')[0]) -
          textToDate(b.requestDate.split(',')[0])
        );
      });
    } else if (filterByDateValue === 'last modified') {
      tempTalentApproval.sort(function (a, b) {
        return (
          textToDate(b.requestDate.split(',')[0]) -
          textToDate(a.requestDate.split(',')[0])
        );
      });
    }
    return tempTalentApproval;
  };

  useEffect(() => {
    setTalentApprovalToShow(matchToFilter(talentApprovalRequest));
  }, [filterByStatusValue, filterByDateValue, talentApprovalRequest, onResume]);

  useEffect(() => {
    if (route.params?.refresh?.status) {
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
        title="Talent Approval"
        onNotificationPress={() =>
          navigation.navigate('Notification', {
            userToken: route.params?.userToken,
          })
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        {pendingRequestCount > 0 && !pendingClicked ? (
          <>
            <TouchableOpacity
              style={styles.pendingNoticeButton}
              onPress={() => {
                setPendingClicked(true);
                showOnlyPendingStatus();
              }}>
              <IcTime />
              <Gap width={12} />
              <Text style={styles.pendingNoticeButtonText}>
                {pendingRequestCount} Pending
              </Text>
            </TouchableOpacity>
            <Gap height={16} />
          </>
        ) : (
          <></>
        )}
        <View style={styles.searchFilterWrapper}>
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
                setPendingClicked(false);
                matchToSearch();
              }}>
              <IcSearch />
            </TouchableOpacity>
          </View>
          <Gap width={4} />
          <TouchableOpacity onPress={() => refRBSheetFilter.current.open()}>
            <IcFilter />
          </TouchableOpacity>
        </View>
        <Gap height={16} />
        <FlatList
          data={talentApprovalToShow}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          inverted={false}
          renderItem={({item, index}) => {
            return (
              <>
                {index !== 0 && <Gap height={16} />}
                <CardTalentApproval
                  stateListLength={talentApprovalToShow.length}
                  raiseDelay={index}
                  personName={item.personName}
                  ideaName={item.ideaName}
                  activity={item.activity}
                  status={item.status}
                  requestDate={item.requestDate}
                  onViewPress={() => {
                    navigation.navigate('TalentApprovalAction', {
                      approvalData: item,
                      userToken: route.params?.userToken,
                      listUserData: listUserData,
                    });
                    console.log(item);
                  }}
                />
              </>
            );
          }}
        />
      </ScrollView>
      {/* Bottom sheet filter */}
      <RBSheet
        ref={refRBSheetFilter}
        closeOnDragDown={true}
        closeOnPressMask={true}
        animationType="fade"
        height={550}
        dragFromTopOnly={false}
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
            <Text style={styles.bottomSheetTitle}>Filters</Text>
            <TouchableOpacity
              style={styles.cancelContainer}
              onPress={() => refRBSheetFilter.current.close()}>
              <Text style={styles.bottomSheetCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <Gap height={16} />
          <FilterTalentApproval
            statusFilter={filterByStatusValue}
            dateFilter={filterByDateValue}
            onApply={(newStatusFilter, newDateFilter) => {
              setFilterByStatusValue(newStatusFilter);
              setFilterByDateValue(newDateFilter);
              setPendingClicked(false);
              setOnResume({status: true});
              refRBSheetFilter.current.close();
            }}
          />
        </View>
      </RBSheet>
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

export default TalentApproval;

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: '#FFFFFF'},
  searchFilterWrapper: {
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
  contentContainer: {
    padding: 16,
  },
  pendingNoticeButton: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.primary,
    borderRadius: 32,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  pendingNoticeButtonText: {
    color: colors.white,
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    lineHeight: 17,
  },
  bottomSheetContentContainer: {
    height: '100%',
    padding: 16,
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
  cancelContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});
