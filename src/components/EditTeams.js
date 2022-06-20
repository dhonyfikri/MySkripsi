import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useState, useRef} from 'react';
import fonts from '../utils/FontsConfig/Fonts';
import {colors} from '../utils/ColorsConfig/Colors';
import Gap from './Gap';
import {IcDotThree} from '../assets/icon';
import RBSheet from 'react-native-raw-bottom-sheet';
import Divider from './Divider';
import ModalAction from './ModalAction';
import EditActionButton from './EditActionButton';
import ModalMessage from './ModalMessage';
import EditTeamStructureField from './EditTeamStructureField';
import jwtDecode from 'jwt-decode';

const EditTeams = ({
  userToken,
  isGuest,
  ideaName,
  teams,
  listUserData = [],
  onTeamsChange = () => {},
  onTeamsRemoved = () => {},
  onProfilePress = () => {},
  onLeaveIdea = () => {},
}) => {
  const decodedJwt = userToken ? jwtDecode(userToken?.authToken) : null;
  const refRBSheetActionForMe = useRef();
  const refRBSheetActionForOthers = useRef();
  const refRBSheetActionForMeAsGuest = useRef();
  const refRBSheetActionForOthersAsGuest = useRef();

  const [selectedTeams, setSelectedTeams] = useState({index: null, data: null});
  const [removeTeamMessage, setRemoveTeamMessage] = useState('');
  const [leaveIdeaMessage, setLeaveIdeaMessage] = useState('');
  const [modalRemoveTeamsVisible, setModalRemoveTeamsVisible] = useState(false);
  const [modalLeaveIdeaVisible, setModalLeaveIdeaVisible] = useState(false);
  const [modalChangeTeamStructureVisible, setModalChangeTeamStructureVisible] =
    useState(false);
  const [
    messageRemoveTeamConfirmationModalVisible,
    setMessageRemoveTeamConfirmationModalVisible,
  ] = useState(false);
  const [
    messageSuccessRemoveTeamModalVisible,
    setMessageSuccessRemoveTeamModalVisible,
  ] = useState(false);
  const [
    messageSuccessLeaveIdeaModalVisible,
    setMessageSuccessLeaveIdeaModalVisible,
  ] = useState(false);
  const [
    messageDiscardRemoveTeamModalVisible,
    setMessageDiscardRemoveTeamModalVisible,
  ] = useState(false);
  const [
    messageDiscardLeaveIdeaModalVisible,
    setMessageDiscardLeaveIdeaModalVisible,
  ] = useState(false);

  return (
    <>
      <FlatList
        data={teams}
        keyExtractor={(_, index) => index.toString()}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        inverted={false}
        renderItem={({item, index}) => {
          return (
            <>
              {item.status === 'Approved' && (
                <>
                  <View style={styles.container}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <ScrollView
                        contentContainerStyle={{flexGrow: 1}}
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        <Text style={styles.teamName}>
                          {
                            listUserData.filter(
                              userItem => userItem.id === item.userId,
                            )[0]?.name
                          }
                        </Text>
                      </ScrollView>
                      <Gap width={8} />
                      <TouchableOpacity
                        style={{flexDirection: 'row', alignItems: 'center'}}
                        onPress={() => {
                          setSelectedTeams({index: index, data: item});
                          // case for me as teams
                          if (item.userId === decodedJwt?.data.id) {
                            if (isGuest) {
                              refRBSheetActionForMeAsGuest.current.open();
                            } else {
                              refRBSheetActionForMe.current.open();
                            }
                          } else {
                            if (isGuest) {
                              refRBSheetActionForOthersAsGuest.current.open();
                            } else {
                              refRBSheetActionForOthers.current.open();
                            }
                          }
                        }}>
                        <IcDotThree />
                      </TouchableOpacity>
                    </View>
                    <Gap height={12} />
                    <View style={styles.detailContainer}>
                      <View style={styles.detailTextWrapper}>
                        <Text style={styles.titleDetail}>NIP</Text>
                        <Gap width={16} />
                        <View style={styles.detailField}>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={styles.valueDetail}>
                            {
                              listUserData.filter(
                                userItem => userItem.id === item.userId,
                              )[0]?.nik
                            }
                          </Text>
                        </View>
                      </View>
                      <Gap height={16} />
                      <View style={styles.detailTextWrapper}>
                        <Text style={styles.titleDetail}>Team Structure</Text>
                        <Gap width={16} />
                        <View style={styles.detailField}>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={styles.valueDetail}>
                            {item.teamStructure}
                          </Text>
                        </View>
                      </View>
                      <Gap height={16} />
                      <View style={styles.detailTextWrapper}>
                        <Text style={styles.titleDetail}>Unit</Text>
                        <Gap width={16} />
                        <View style={styles.detailField}>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={styles.valueDetail}>
                            {
                              listUserData.filter(
                                userItem => userItem.id === item.userId,
                              )[0]?.unit
                            }
                          </Text>
                        </View>
                      </View>
                      <Gap height={16} />
                      <View style={styles.detailTextWrapper}>
                        <Text style={styles.titleDetail}>Status</Text>
                        <Gap width={16} />
                        <View style={styles.detailField}>
                          <View
                            style={styles.statusContainer(
                              item.status.toLowerCase(),
                            )}>
                            <Text style={styles.statusText}>{item.status}</Text>
                          </View>
                        </View>
                      </View>
                      <Gap height={16} />
                      <View style={styles.detailTextWrapper}>
                        <Text style={styles.titleDetail}>Created Date</Text>
                        <Gap width={16} />
                        <View style={styles.detailField}>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={styles.valueDetail}>
                            {item.createdDate}
                          </Text>
                        </View>
                      </View>
                      <Gap height={16} />
                      <View style={styles.detailTextWrapper}>
                        <Text style={styles.titleDetail}>Approved Date</Text>
                        <Gap width={16} />
                        <View style={styles.detailField}>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={styles.valueDetail}>
                            {item.approvedDate}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  {index !== teams.length - 1 && <Gap height={16} />}
                </>
              )}
            </>
          );
        }}
      />
      {/* Bottom sheet action for me*/}
      <RBSheet
        ref={refRBSheetActionForMe}
        closeOnDragDown={true}
        closeOnPressMask={false}
        animationType="fade"
        height={230}
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
              onPress={() => refRBSheetActionForMe.current.close()}>
              <Text style={styles.bottomSheetCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <Gap height={16} />
          <Divider />
          <Gap height={16} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={{padding: 16}}
              onPress={() => {
                refRBSheetActionForMe.current.close();
                onProfilePress('me', null);
              }}>
              <Text style={styles.buttonText('normal')}>Detail Profile</Text>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity
              style={{padding: 16}}
              onPress={() => {
                refRBSheetActionForMe.current.close();
                setModalChangeTeamStructureVisible(true);
              }}>
              <Text style={styles.buttonText('normal')}>
                Change Team Structure
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
      {/* Bottom sheet action for others*/}
      <RBSheet
        ref={refRBSheetActionForOthers}
        closeOnDragDown={true}
        closeOnPressMask={false}
        animationType="fade"
        height={285}
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
              onPress={() => refRBSheetActionForOthers.current.close()}>
              <Text style={styles.bottomSheetCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <Gap height={16} />
          <Divider />
          <Gap height={16} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={{padding: 16}}
              onPress={() => {
                refRBSheetActionForOthers.current.close();
                onProfilePress('others', selectedTeams.data.userId);
              }}>
              <Text style={styles.buttonText('normal')}>Detail Profile</Text>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity
              style={{padding: 16}}
              onPress={() => {
                refRBSheetActionForOthers.current.close();
                setModalChangeTeamStructureVisible(true);
              }}>
              <Text style={styles.buttonText('normal')}>
                Change Team Structure
              </Text>
            </TouchableOpacity>
          </View>
          <Gap height={8} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={{padding: 16}}
              onPress={() => {
                refRBSheetActionForOthers.current.close();
                setModalRemoveTeamsVisible(true);
              }}>
              <Text style={styles.buttonText('danger')}>Remove Member</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>

      {/* Bottom sheet action for me as guest*/}
      <RBSheet
        ref={refRBSheetActionForMeAsGuest}
        closeOnDragDown={true}
        closeOnPressMask={false}
        animationType="fade"
        height={228}
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
              onPress={() => refRBSheetActionForMeAsGuest.current.close()}>
              <Text style={styles.bottomSheetCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <Gap height={16} />
          <Divider />
          <Gap height={16} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={{padding: 16}}
              onPress={() => {
                refRBSheetActionForMeAsGuest.current.close();
                onProfilePress('me', null);
              }}>
              <Text style={styles.buttonText('normal')}>Detail Profile</Text>
            </TouchableOpacity>
          </View>
          <Gap height={8} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={{padding: 16}}
              onPress={() => {
                refRBSheetActionForMeAsGuest.current.close();
                setModalLeaveIdeaVisible(true);
              }}>
              <Text style={styles.buttonText('danger')}>Leave Idea</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
      {/* Bottom sheet action for others as guest*/}
      <RBSheet
        ref={refRBSheetActionForOthersAsGuest}
        closeOnDragDown={true}
        closeOnPressMask={false}
        animationType="fade"
        height={168}
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
              onPress={() => refRBSheetActionForOthersAsGuest.current.close()}>
              <Text style={styles.bottomSheetCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <Gap height={16} />
          <Divider />
          <Gap height={16} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={{padding: 16}}
              onPress={() => {
                refRBSheetActionForOthersAsGuest.current.close();
                onProfilePress('others', selectedTeams.data.userId);
              }}>
              <Text style={styles.buttonText('normal')}>Detail Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
      {/* Modal remove team action */}
      <ModalAction
        visible={modalRemoveTeamsVisible}
        title="Leave Idea"
        onCloseButtonPress={() => {
          if (removeTeamMessage.length > 0) {
            setMessageDiscardRemoveTeamModalVisible(true);
          } else {
            setModalRemoveTeamsVisible(false);
            setRemoveTeamMessage('');
          }
        }}
        onRequestClose={() => {
          if (removeTeamMessage.length > 0) {
            setMessageDiscardRemoveTeamModalVisible(true);
          } else {
            setModalRemoveTeamsVisible(false);
            setRemoveTeamMessage('');
          }
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
              remove
            </Text>{' '}
            this member?{' '}
            <Text
              style={{
                ...styles.noticeText,
                fontFamily: fonts.secondary[700],
              }}>
              {selectedTeams.data?.nik} - {selectedTeams.data?.name}
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
            textAlignVertical="top"
            style={styles.board}
            placeholder="Fill your reason.."
            onChangeText={text => {
              setRemoveTeamMessage(text);
            }}>
            <Text style={{lineHeight: 20}}>{removeTeamMessage}</Text>
          </TextInput>
        </View>
        <Gap height={16} />
        <EditActionButton
          disableSaveButton={removeTeamMessage.trim().length <= 0}
          onDiscardPress={() => {
            if (removeTeamMessage.length > 0) {
              setMessageDiscardRemoveTeamModalVisible(true);
            } else {
              setModalRemoveTeamsVisible(false);
              setRemoveTeamMessage('');
            }
          }}
          onSavePress={() => {
            setModalRemoveTeamsVisible(false);
            setMessageRemoveTeamConfirmationModalVisible(true);
          }}
        />
      </ModalAction>
      {/* Modal leave idea action */}
      <ModalAction
        visible={modalLeaveIdeaVisible}
        title="Leave Idea"
        onCloseButtonPress={() => {
          if (leaveIdeaMessage.length > 0) {
            setMessageDiscardLeaveIdeaModalVisible(true);
          } else {
            setModalLeaveIdeaVisible(false);
            setLeaveIdeaMessage('');
          }
        }}
        onRequestClose={() => {
          if (leaveIdeaMessage.length > 0) {
            setMessageDiscardLeaveIdeaModalVisible(true);
          } else {
            setModalLeaveIdeaVisible(false);
            setLeaveIdeaMessage('');
          }
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
              {ideaName}
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
            if (leaveIdeaMessage.length > 0) {
              setMessageDiscardLeaveIdeaModalVisible(true);
            } else {
              setModalLeaveIdeaVisible(false);
              setLeaveIdeaMessage('');
            }
          }}
          onSavePress={() => {
            setModalLeaveIdeaVisible(false);
            setLeaveIdeaMessage('');
            console.log(selectedTeams);
            setMessageSuccessLeaveIdeaModalVisible(true);
          }}
        />
      </ModalAction>
      {/* Modal change team structure action */}
      <ModalAction
        visible={modalChangeTeamStructureVisible}
        title="Change Team Structure"
        onCloseButtonPress={() => {
          setModalChangeTeamStructureVisible(false);
        }}
        onRequestClose={() => {
          setModalChangeTeamStructureVisible(false);
        }}
        contentBackground={colors.secondary}
        withTitleDivider={false}>
        <View
          style={{
            ...styles.noticeContainer,
            backgroundColor: colors.divider,
            marginHorizontal: -12,
            paddingHorizontal: 12,
            borderRadius: 0,
          }}>
          <Text style={styles.noticeText}>
            You are{' '}
            <Text
              style={{
                ...styles.noticeText,
                fontFamily: fonts.secondary[700],
                color: colors.danger,
              }}>
              changing
            </Text>{' '}
            your member’s Teams Structure!
          </Text>
        </View>
        <Gap height={16} />
        <EditTeamStructureField
          teamName={
            listUserData.filter(
              userItem => userItem.id === selectedTeams.data?.userId,
            )[0]?.name
          }
          selectedTeamStructure={selectedTeams.data?.teamStructure}
          teamStructureItem={[
            {label: 'Hipster', value: 'Hipster'},
            {label: 'Hustler', value: 'Hustler'},
            {label: 'Hacker', value: 'Hacker'},
          ]}
          onDiscardPress={() => {
            setModalChangeTeamStructureVisible(false);
          }}
          onSave={(newName, newTeamStructure) => {
            setModalChangeTeamStructureVisible(false);
            onTeamsChange(selectedTeams.index, newName, newTeamStructure);
          }}
        />
      </ModalAction>
      {/* modal remove team confirmation */}
      <ModalMessage
        visible={messageRemoveTeamConfirmationModalVisible}
        withIllustration
        illustrationType="confused"
        message={
          <Text>
            Are you sure want to remove this member?. If yes,{' '}
            {
              <Text style={{fontFamily: fonts.primary[700]}}>
                {selectedTeams.data?.name}
              </Text>
            }{' '}
            must apply to join again
          </Text>
        }
        withCancelButton
        withConfirmButton
        onCancel={() => {
          setMessageRemoveTeamConfirmationModalVisible(false);
          setRemoveTeamMessage('');
        }}
        onConfirm={() => {
          setMessageRemoveTeamConfirmationModalVisible(false);
          setRemoveTeamMessage('');
          onTeamsRemoved(selectedTeams.index);
          setMessageSuccessRemoveTeamModalVisible(true);
        }}
        onRequestClose={() => {
          setMessageRemoveTeamConfirmationModalVisible(false);
          setRemoveTeamMessage('');
        }}
      />
      {/* modal success remove team message */}
      <ModalMessage
        visible={messageSuccessRemoveTeamModalVisible}
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
          setMessageSuccessRemoveTeamModalVisible(false);
        }}
        onRequestClose={() => {
          setMessageSuccessRemoveTeamModalVisible(false);
        }}
      />
      {/* modal success leave idea message */}
      <ModalMessage
        visible={messageSuccessLeaveIdeaModalVisible}
        withIllustration
        illustrationType="confused"
        title="You’re all done"
        message={
          <Text>
            You have <Text style={{color: colors.reject}}>left</Text> your team
          </Text>
        }
        withBackButton
        onBack={() => {
          setMessageSuccessLeaveIdeaModalVisible(false);
          onLeaveIdea();
        }}
        onRequestClose={() => {
          setMessageSuccessLeaveIdeaModalVisible(false);
          onLeaveIdea();
        }}
      />
      {/* modal discard confirmation for remove team message */}
      <ModalMessage
        visible={messageDiscardRemoveTeamModalVisible}
        withIllustration
        illustrationType="confused"
        message={
          <Text>
            Are you sure want to{' '}
            <Text style={{color: colors.pending}}>leave this page</Text>? You
            will lose all unsaved progress.
          </Text>
        }
        withCancelButton
        withConfirmButton
        onCancel={() => {
          setMessageDiscardRemoveTeamModalVisible(false);
        }}
        onConfirm={() => {
          setMessageDiscardRemoveTeamModalVisible(false);
          setModalRemoveTeamsVisible(false);
          setRemoveTeamMessage('');
        }}
        onRequestClose={() => {
          setMessageDiscardRemoveTeamModalVisible(false);
        }}
      />
      {/* modal discard confirmation for leave idea message */}
      <ModalMessage
        visible={messageDiscardLeaveIdeaModalVisible}
        withIllustration
        illustrationType="confused"
        message={
          <Text>
            Are you sure want to{' '}
            <Text style={{color: colors.pending}}>leave this page</Text>? You
            will lose all unsaved progress.
          </Text>
        }
        withCancelButton
        withConfirmButton
        onCancel={() => {
          setMessageDiscardLeaveIdeaModalVisible(false);
        }}
        onConfirm={() => {
          setMessageDiscardLeaveIdeaModalVisible(false);
          setModalLeaveIdeaVisible(false);
          setLeaveIdeaMessage('');
        }}
        onRequestClose={() => {
          setMessageDiscardLeaveIdeaModalVisible(false);
        }}
      />
    </>
  );
};

export default EditTeams;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: colors.dot,
    borderRadius: 16,
  },
  teamName: {
    flex: 1,
    fontFamily: fonts.secondary[700],
    fontSize: 16,
    lineHeight: 25.6,
    color: colors.text.primary,
  },
  detailContainer: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  detailField: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  detailTextWrapper: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    alignItems: 'flex-end',
  },
  titleDetail: {
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    lineHeight: 15,
    color: colors.text.primary,
  },
  valueDetail: {
    fontFamily: fonts.secondary[600],
    fontSize: 12,
    lineHeight: 15,
    color: colors.text.primary,
  },
  statusContainer: type => ({
    backgroundColor:
      type === 'approved'
        ? colors.success
        : type === 'pending'
        ? colors.pending
        : type === 'rejected'
        ? colors.reject
        : colors.success,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  }),
  statusText: {
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    lineHeight: 15,
    color: colors.white,
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
  customMessageStyle: {
    fontFamily: fonts.primary[400],
    fontSize: 12,
    lineHeight: 22,
    color: colors.success,
  },
});
