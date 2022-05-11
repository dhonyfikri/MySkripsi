import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
} from 'react-native';
import React, {useState, useCallback, useMemo, useRef} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import Header from '../../../components/Header';
import {colors} from '../../../utils/ColorsConfig/Colors';
import {IcFilter, IcSearch, IcTime} from '../../../assets/icon';
import Gap from '../../../components/Gap';
import fonts from '../../../utils/FontsConfig/Fonts';
import CardTalentApproval from '../../../components/CardTalentApproval';
import Divider from '../../../components/Divider';

const TalentApproval = ({navigation, route}) => {
  const dataFromServer = [
    {
      id: 1,
      status: 'Approved',
      ideaId: 1,
      ideaName: 'Smart Bike',
      personId: 4,
      personName: 'Siti Bojong G.',
      activity: 'Request to Join Idea',
      requestDate: '20/12/2022, 12:00:01',
    },
    {
      id: 2,
      status: 'Rejected',
      ideaId: 1,
      ideaName: 'Smart Bike',
      personId: 6,
      personName: 'Tony Stark',
      activity: 'Request to Join Idea',
      requestDate: '20/12/2022, 13:00:01',
    },
    {
      id: 3,
      status: 'Pending',
      ideaId: 1,
      ideaName: 'Smart Bike',
      personId: 12,
      personName: 'Gusion.',
      activity: 'Request to Join Idea',
      requestDate: '20/12/2022, 14:00:01',
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

  const [talentApprovalRequest, setTalentApprovalRequest] =
    useState(dataFromServer);
  const [talentApprovalToShow, setTalentApprovalToShow] =
    useState(dataFromServer);
  const [searchText, setSearchText] = useState('');
  const [pendingClicked, setPendingClicked] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  let pendingRequestCount = 0;
  talentApprovalRequest.map(item => {
    if (item.status.toLowerCase() === 'pending') {
      pendingRequestCount += 1;
    }
  });

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
    setTalentApprovalToShow(tempTalentApproval);
  };

  return (
    <View style={styles.page}>
      <Header
        backButton
        onBackPress={() => navigation.goBack()}
        backText="Back"
        title="Talent Approval"
        onNotificationPress={() => navigation.navigate('Notification')}
      />
      <View style={styles.contentContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                height: '100%',
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 32,
              }}>
              <TextInput
                style={{
                  flex: 1,
                  marginHorizontal: 24,
                  padding: 0,
                  fontFamily: fonts.secondary[400],
                  fontSize: 14,
                  lineHeight: 17,
                  color: colors.text.primary,
                }}
                placeholder="Search..."
                value={searchText}
                onChangeText={text => setSearchText(text)}
              />
              <TouchableOpacity
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 32 / 2,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setPendingClicked(false);
                  matchToSearch();
                }}>
                <IcSearch />
              </TouchableOpacity>
            </View>
            <Gap width={4} />
            <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
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
                    personName={item.personName}
                    ideaName={item.ideaName}
                    activity={item.activity}
                    status={item.status}
                    requestDate={item.requestDate}
                    onViewPress={() => console.log(item.personName)}
                  />
                </>
              );
            }}
          />
        </ScrollView>
      </View>
      {/* filter modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}>
        <View
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: '#00000088',
          }}>
          {filterModalVisible && (
            <BottomSheet
              ref={bottomSheetRef}
              index={1}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}>
              <View style={styles.bottomSheetContentContainer}>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text style={styles.bottomSheetTitle}>Filters</Text>
                  <TouchableOpacity
                    style={styles.titleContainer}
                    onPress={() => setFilterModalVisible(false)}>
                    <Text style={styles.bottomSheetCancelButtonText}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
                <Gap height={16} />
                <Divider />
                <Gap height={16} />
              </View>
            </BottomSheet>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default TalentApproval;

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: '#FFFFFF'},
  contentContainer: {
    flex: 1,
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
});
