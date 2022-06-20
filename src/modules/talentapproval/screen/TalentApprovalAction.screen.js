import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  IcComment,
  IcEnvelope,
  IcSmileEmote,
  IcUnactiveLike,
} from '../../../assets/icon';
import CardComment from '../../../components/CardComment';
import CardDetailTeamDesc from '../../../components/CardDetailTeamsDesc';
import CardProfile from '../../../components/CardProfile';
import CardReply from '../../../components/CardReply';
import DetailIdeaDesc from '../../../components/DetailIdeaDesc';
import Divider from '../../../components/Divider';
import EditActionButton from '../../../components/EditActionButton';
import Gap from '../../../components/Gap';
import Header from '../../../components/Header';
import LeanCanvasItem from '../../../components/LeanCanvasItem';
import ModalAction from '../../../components/ModalAction';
import ModalMessage from '../../../components/ModalMessage';
import MultilineTextView from '../../../components/MultilineTextView';
import TalentApprovalAcceptOrReject from '../../../components/TalentApprovalAcceptOrReject';
import {colors} from '../../../utils/ColorsConfig/Colors';
import fonts from '../../../utils/FontsConfig/Fonts';
import DummyResponseDetailIdea from '../../riset/DummyResponseDetailIdea';
import _ from 'lodash';
import LoadingProcessFull from '../../../components/LoadingProcessFull';
import RefreshFull from '../../../components/RefreshFull';
import {GetDetailIdeaAPI} from '../../../config/RequestAPI/IdeaAPI';
import {
  getAsyncStorageObject,
  storeAsyncStorageObject,
} from '../../../utils/AsyncStorage/StoreAsyncStorage';
import jwtDecode from 'jwt-decode';
import {dateToText} from '../../../utils/DateConfig/DateConvert';

const TalentApprovalAction = ({navigation, route}) => {
  const approvalData = route.params.approvalData;
  const decodedJwt = jwtDecode(route.params?.userToken.authToken);
  // const ideaData = _.cloneDeep(DummyResponseDetailIdea);

  const refRBSheetComment = useRef();

  const [ideaData, setIdeaData] = useState(undefined);
  const [finish, setFinish] = useState(false);
  const [activeIndexOfContent, setActiveIndexOfContent] = useState(0);
  const [approveMessage, setApproveMessage] = useState('');
  const [rejectMessage, setRejectMessage] = useState('');
  const [modalApproveVisible, setModalApproveVisible] = useState(false);
  const [modalRejectVisible, setModalRejectVisible] = useState(false);
  const [loading, setLoading] = useState({
    visible: true,
    message: 'Please wait',
  });
  const [showRefreshBUtton, setShowRefreshButton] = useState(false);
  const [messageSuccessModalVisible, setMessageSuccessModalVisible] =
    useState(false);
  const [
    messageSuccessRejectModalVisible,
    setMessageSuccessRejectModalVisible,
  ] = useState(false);
  const [replyData, setReplyData] = useState({
    replying: false,
    nameToReply: '',
  });

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

  const toggleActive = index => {
    if (activeIndexOfContent !== index) {
      setActiveIndexOfContent(index);
      handleFadeIn();
    }
  };

  const customerLC = [];
  const problemLC = [];
  const earlyAdopterLC = [];
  const existingSolutionLC = [];
  const uniqueValueLC = [];
  const proposedSolutionLC = [];

  ideaData?.lc.map(res => {
    if (res.field === 'customers') {
      customerLC.push(res.value);
    }
    if (res.field === 'problems') problemLC.push(res.value);
    if (res.field === 'earlyAdopters') earlyAdopterLC.push(res.value);
    if (res.field === 'existingSolutions') existingSolutionLC.push(res.value);
    if (res.field === 'uniqueValues') uniqueValueLC.push(res.value);
    if (res.field === 'proposedSolutions') proposedSolutionLC.push(res.value);
  });

  const fetchIdeas = () => {
    setLoading({...loading, visible: true, message: 'Please wait'});
    setShowRefreshButton(false);
    GetDetailIdeaAPI(
      route.params?.userToken?.authToken,
      route.params?.approvalData.ideaId,
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
            // allowJoin: route.params?.allowJoin ? route.params?.allowJoin : '0',
            files: pelengkapDataIdea ? pelengkapDataIdea.files : [],
            approval: pelengkapDataIdea ? pelengkapDataIdea.teams : [],
          };
          fixData.desc[2].value = {
            uri: pelengkapDataIdea?.cover.uri,
            mime:
              'image/' + pelengkapDataIdea?.cover.uri?.split('.')?.slice(-1)[0],
            name: pelengkapDataIdea?.cover.uri?.split('/')?.slice(-1)[0],
          };
          setIdeaData(fixData);
        } else if (res.status === 'SERVER_ERROR') {
          setShowRefreshButton(true);
        }
      });
    });
  };

  const approving = () => {
    setLoading({...loading, visible: false, message: 'Approving'});
    getAsyncStorageObject('@PELENGKAP_DATA_IDEA').then(res => {
      const dataPelengkapIdea = res.filter(
        item => item.ideaId.toString() === route.params?.approvalData.ideaId,
      )[0];
      const dataPelengkapTeamBefore = dataPelengkapIdea?.teams.filter(
        item => item.id === route.params?.approvalData.id,
      )[0];
      dataPelengkapTeamBefore.approvedDate = dateToText(new Date());
      dataPelengkapTeamBefore.status = 'Approved';
      dataPelengkapIdea.teams = dataPelengkapIdea.teams
        .filter(item => item.id !== route.params?.approvalData.id)
        .concat([dataPelengkapTeamBefore]);
      const dataPelengkapOtherIdea = res.filter(
        item => item.ideaId.toString() !== route.params?.approvalData.ideaId,
      );
      console.log(dataPelengkapOtherIdea.concat([dataPelengkapIdea]));
      storeAsyncStorageObject(
        '@PELENGKAP_DATA_IDEA',
        dataPelengkapOtherIdea.concat([dataPelengkapIdea]),
      ).then(() => {
        setLoading({...loading, visible: false});
        setMessageSuccessModalVisible(true);
      });
    });
  };

  const rejecting = () => {
    setLoading({...loading, visible: false, message: 'Rejecting'});
    getAsyncStorageObject('@PELENGKAP_DATA_IDEA').then(res => {
      const dataPelengkapIdea = res.filter(
        item => item.ideaId.toString() === route.params?.approvalData.ideaId,
      )[0];
      const dataPelengkapTeamBefore = dataPelengkapIdea?.teams.filter(
        item => item.id === route.params?.approvalData.id,
      )[0];
      dataPelengkapTeamBefore.status = 'Rejected';
      dataPelengkapIdea.teams = dataPelengkapIdea.teams
        .filter(item => item.id !== route.params?.approvalData.id)
        .concat([dataPelengkapTeamBefore]);
      const dataPelengkapOtherIdea = res.filter(
        item => item.ideaId.toString() !== route.params?.approvalData.ideaId,
      );
      console.log(dataPelengkapOtherIdea.concat([dataPelengkapIdea]));
      storeAsyncStorageObject(
        '@PELENGKAP_DATA_IDEA',
        dataPelengkapOtherIdea.concat([dataPelengkapIdea]),
      ).then(() => {
        setLoading({...loading, visible: false});
        setMessageSuccessRejectModalVisible(true);
      });
    });
  };

  useEffect(() => {
    handleFadeIn();
    fetchIdeas();
  }, []);

  useEffect(() => {
    if (finish) {
      // navigation.goBack();
      navigation.navigate('TalentApproval', {
        userToken: route.params?.userToken,
        refresh: {status: true},
      });
    }
  }, [finish]);

  let commentCount = 0;
  ideaData?.comment.map(item => {
    commentCount += 1;
    item.replyComment.map(() => {
      commentCount += 1;
    });
  });

  return (
    <View style={styles.page}>
      <Header
        backButton
        onBackPress={() => navigation.goBack()}
        backText="Back"
        onNotificationPress={() => navigation.navigate('Notification')}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        <Gap height={8} />
        <TalentApprovalAcceptOrReject
          isPending={approvalData.status?.toLowerCase() === 'pending'}
          name={approvalData.personName}
          onRejectPress={() => setModalRejectVisible(true)}
          onAcceptPress={() => setModalApproveVisible(true)}
        />
        <Gap height={24} />
        <CardProfile
          userData={
            route.params?.listUserData.filter(
              item => item.id === decodedJwt.data.id,
            )[0]
          }
          withJoinButton={false}
        />
        {/* <Gap height={16} />
        <View style={styles.interactions}>
          <TouchableOpacity style={styles.interactionsItem}>
            <IcUnactiveLike width={24} height={24} />
            <Gap width={6.5} />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.interactionsText}>
              482
            </Text>
          </TouchableOpacity>
          <Gap width={6.5} />
          <TouchableOpacity
            style={styles.interactionsItem}
            onPress={() => refRBSheetComment.current.open()}>
            <IcComment width={24} height={24} />
            <Gap width={6.5} />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.interactionsText}>
              {commentCount}
            </Text>
          </TouchableOpacity>
          <Gap width={6.5} />
          <TouchableOpacity>
            <IcEnvelope width={24} height={24} />
          </TouchableOpacity>
        </View> */}
        <Gap height={24} />
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tabItem(activeIndexOfContent === 0)}
            onPress={() => toggleActive(0)}>
            <Text
              numberOfLines={2}
              style={styles.tabTitle(activeIndexOfContent === 0)}>
              Idea Desc
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabItem(activeIndexOfContent === 1)}
            onPress={() => toggleActive(1)}>
            <Text
              numberOfLines={2}
              style={styles.tabTitle(activeIndexOfContent === 1)}>
              Story Behind
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabItem(activeIndexOfContent === 2)}
            onPress={() => toggleActive(2)}>
            <Text
              numberOfLines={2}
              style={styles.tabTitle(activeIndexOfContent === 2)}>
              Lean Canvas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabItem(activeIndexOfContent === 3)}
            onPress={() => toggleActive(3)}>
            <Text
              numberOfLines={2}
              style={styles.tabTitle(activeIndexOfContent === 3)}>
              Teams
            </Text>
          </TouchableOpacity>
        </View>
        <Gap height={16} />
        {activeIndexOfContent === 0 && (
          <Animated.View
            style={{...styles.dataSessionContainer, opacity: fadeAnim}}>
            <DetailIdeaDesc
              title={ideaData?.desc[0].value}
              desc={ideaData?.desc[1].value}
              image={ideaData?.desc[2].value}
            />
          </Animated.View>
        )}
        {activeIndexOfContent === 1 && (
          <Animated.View
            style={{...styles.dataSessionContainer, opacity: fadeAnim}}>
            <>
              <Gap height={4} />
              <Text style={styles.title}>Why</Text>
              <Gap height={4} />
              <MultilineTextView text={ideaData.gc[0].value} height={150} />
              <Gap height={21} />
              <Text style={styles.title}>How</Text>
              <Gap height={4} />
              <MultilineTextView text={ideaData.gc[1].value} height={150} />
              <Gap height={21} />
              <Text style={styles.title}>What</Text>
              <Gap height={4} />
              <MultilineTextView text={ideaData.gc[2].value} height={150} />
            </>
          </Animated.View>
        )}
        {activeIndexOfContent === 2 && (
          <Animated.View
            style={{...styles.dataSessionContainer, opacity: fadeAnim}}>
            <LeanCanvasItem
              title="CUSTOMER, siapa yang ingin kamu solusikan?"
              mandatory
              content={customerLC}
            />
            <LeanCanvasItem
              title="PROBLEM, apa problem mereka yang ingin disolusikan?"
              mandatory
              content={problemLC}
            />
            <LeanCanvasItem
              title="EARLY ADOPTER, siapa saja dari target di atas yg bisa kamu gapai duluan
        dalam 3 bln ke depan?"
              mandatory
              content={earlyAdopterLC}
            />
            <LeanCanvasItem
              title="EXISTING SOLUTION, per hari ini, bagaimana biasanya mereka mensolusikan
        probem-problem itu?"
              mandatory
              content={existingSolutionLC}
            />
            <LeanCanvasItem
              title="UNIQUE VALUE, apa yang bikin kamu berbeda dan keren, jadi mereka mau
        pindah ke kamu?"
              mandatory
              content={uniqueValueLC}
            />
            <LeanCanvasItem
              title="PROPOSED SOLUTION, so, jadi apa yang akan/sedang kamu buat agar mereka
        bisa cinta banget sama kamu?"
              mandatory
              content={proposedSolutionLC}
            />
          </Animated.View>
        )}
        {activeIndexOfContent === 3 && (
          <Animated.View
            style={{...styles.dataSessionContainer, opacity: fadeAnim}}>
            {ideaData !== null &&
              (ideaData.approval.length > 0 ? (
                ideaData.approval
                  .filter(item => item.status === 'Approved')
                  .map((team, index) => {
                    const teamData = route.params?.listUserData.filter(
                      item => item.id === team.userId,
                    )[0];
                    return (
                      <>
                        <CardDetailTeamDesc
                          no={index + 1}
                          nama={teamData?.name}
                          nip={teamData?.nik}
                          teamStructure={team.teamStructure}
                          workLocation={teamData?.workingLocation}
                          unit={teamData?.unit}
                        />
                        {index !== ideaData.approval.length - 1 && (
                          <Gap height={12} />
                        )}
                      </>
                    );
                  })
              ) : (
                <View
                  style={{
                    flex: 1,
                    marginVertical: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: fonts.secondary[500],
                      fontSize: 12,
                    }}>
                    Not Available
                  </Text>
                </View>
              ))}
          </Animated.View>
        )}
      </ScrollView>
      {/* Bottom sheet comment */}
      <RBSheet
        ref={refRBSheetComment}
        closeOnDragDown={true}
        closeOnPressMask={true}
        animationType="fade"
        height={550}
        dragFromTopOnly={true}
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
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.bottomSheetTitle}>
              {commentCount > 100 ? '100+' : commentCount} Comment
              {commentCount > 1 && 's'}
            </Text>
            <TouchableOpacity
              style={styles.cancelContainer}
              onPress={() => refRBSheetComment.current.close()}>
              <Text style={styles.bottomSheetCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <Gap height={32} />
          <View style={{flex: 1}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <FlatList
                data={ideaData?.comment}
                keyExtractor={(_, index) => index.toString()}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                inverted={false}
                renderItem={({item, index}) => {
                  return (
                    <>
                      <CardComment
                        commentsData={item}
                        onMainRepplyPress={name => {
                          setReplyData({status: true, nameToReply: name});
                        }}
                      />
                      {index !== ideaData.comment.length - 1 && (
                        <Gap height={16} />
                      )}
                    </>
                  );
                }}
              />
            </ScrollView>
            <Divider />
            <Gap height={18} />
            {replyData.status === true && (
              <>
                <CardReply
                  name={replyData.nameToReply}
                  onClosePress={() =>
                    setReplyData({...replyData, status: false})
                  }
                />
                <Gap height={12} />
              </>
            )}
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 16,
                padding: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: colors.text.primary,
                overflow: 'hidden',
              }}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <TextInput
                  placeholder="Leave a comment"
                  multiline
                  style={{
                    maxHeight: 100,
                    fontFamily: fonts.primary[400],
                    fontSize: 12,
                    color: colors.text.primary,
                    padding: 0,
                  }}>
                  <Text style={{lineHeight: 22}}></Text>
                </TextInput>
              </View>
              <Gap width={16} />
              <View style={{justifyContent: 'flex-end'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity>
                    <IcSmileEmote />
                  </TouchableOpacity>
                  <Gap width={16} />
                  <TouchableOpacity
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 24,
                      borderRadius: 16,
                      backgroundColor: colors.primary,
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.secondary[600],
                        fontSize: 12,
                        lineHeight: 15,
                        color: colors.white,
                      }}>
                      Post
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Gap height={10} />
          </View>
        </View>
      </RBSheet>
      {/* Modal approve action */}
      <ModalAction
        visible={modalApproveVisible}
        title="Approve Join Request"
        onCloseButtonPress={() => setModalApproveVisible(false)}
        onRequestClose={() => setModalApproveVisible(false)}>
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeText}>
            Are you sure you want to{' '}
            <Text
              style={{
                ...styles.noticeText,
                fontFamily: fonts.secondary[700],
                color: colors.success,
              }}>
              approve
            </Text>{' '}
            this request from{' '}
            <Text
              style={{
                ...styles.noticeText,
                fontFamily: fonts.secondary[700],
              }}>
              {approvalData.personName}
            </Text>
            ?{' '}
            <Text
              style={{
                ...styles.noticeText,
                fontFamily: fonts.secondary[700],
              }}>
              {approvalData.ideaName}
            </Text>
          </Text>
        </View>
        <Gap height={28} />
        <Text style={styles.messageTitle}>
          Please fill the reason in the field below*
        </Text>
        <Gap height={8} />
        <TextInput
          multiline
          textAlignVertical="top"
          style={styles.board}
          placeholder="(Max. 60 Characters)"
          maxLength={60}
          onChangeText={text => {
            setApproveMessage(text);
          }}>
          <Text style={{lineHeight: 22}}>{approveMessage}</Text>
        </TextInput>
        <Gap height={48} />
        <EditActionButton
          disableSaveButton={approveMessage.trim().length <= 0}
          onDiscardPress={() => setModalApproveVisible(false)}
          onSavePress={() => {
            setModalApproveVisible(false);
            approving();
          }}
        />
      </ModalAction>
      {/* Modal reject action */}
      <ModalAction
        visible={modalRejectVisible}
        title="Reject Join Request"
        onCloseButtonPress={() => setModalRejectVisible(false)}
        onRequestClose={() => setModalRejectVisible(false)}>
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeText}>
            Are you sure you want to{' '}
            <Text
              style={{
                ...styles.noticeText,
                fontFamily: fonts.secondary[700],
                color: colors.reject,
              }}>
              reject
            </Text>{' '}
            this request from{' '}
            <Text
              style={{
                ...styles.noticeText,
                fontFamily: fonts.secondary[700],
              }}>
              {approvalData.personName}
            </Text>
            ?{' '}
            <Text
              style={{
                ...styles.noticeText,
                fontFamily: fonts.secondary[700],
              }}>
              {approvalData.ideaName}
            </Text>
          </Text>
        </View>
        <Gap height={28} />
        <Text style={styles.messageTitle}>
          Please fill the reason in the field below*
        </Text>
        <Gap height={8} />
        <TextInput
          multiline
          textAlignVertical="top"
          style={styles.board}
          placeholder="(Max. 60 Characters)"
          maxLength={60}
          onChangeText={text => {
            setRejectMessage(text);
          }}>
          <Text style={{lineHeight: 22}}>{rejectMessage}</Text>
        </TextInput>
        <Gap height={48} />
        <EditActionButton
          disableSaveButton={rejectMessage.trim().length <= 0}
          onDiscardPress={() => setModalRejectVisible(false)}
          onSavePress={() => {
            setModalRejectVisible(false);
            rejecting();
          }}
        />
      </ModalAction>
      {/* modal success message */}
      <ModalMessage
        visible={messageSuccessModalVisible}
        withIllustration
        illustrationType="smile"
        title="Success"
        message={
          <Text style={styles.customMessageStyle}>
            You have{' '}
            <Text style={{...styles.customMessageStyle, color: colors.success}}>
              approved
            </Text>{' '}
            this request
          </Text>
        }
        withBackButton
        onBack={() => {
          setMessageSuccessModalVisible(false);
          setFinish(true);
        }}
        onRequestClose={() => {
          setMessageSuccessModalVisible(false);
          setFinish(true);
        }}
      />
      {/* modal success reject message */}
      <ModalMessage
        visible={messageSuccessRejectModalVisible}
        withIllustration
        illustrationType="confused"
        title="You’re all done"
        message={
          <Text style={styles.customMessageStyle}>
            You have{' '}
            <Text style={{...styles.customMessageStyle, color: colors.reject}}>
              rejected
            </Text>{' '}
            this request
          </Text>
        }
        withBackButton
        onBack={() => {
          setMessageSuccessRejectModalVisible(false);
          setFinish(true);
        }}
        onRequestClose={() => {
          setMessageSuccessRejectModalVisible(false);
          setFinish(true);
        }}
      />
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

export default TalentApprovalAction;

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: '#FFFFFF'},
  contentContainer: {
    padding: 16,
  },
  interactions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionsText: {
    color: colors.text.secondary,
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    lineHeight: 15,
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.tertiary,
    padding: 4,
    borderRadius: 32,
    overflow: 'hidden',
  },
  tabItem: active => ({
    flex: 1,
    backgroundColor: active ? colors.primary : '#00000000',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 32,
    justifyContent: 'center',
  }),
  tabTitle: active => ({
    fontFamily: fonts.secondary[600],
    fontSize: 11,
    lineHeight: 14,
    color: active ? colors.white : colors.text.primary,
    textAlign: 'center',
  }),
  dataSessionContainer: {
    backgroundColor: colors.tertiary,
    padding: 16,
    borderRadius: 16,
  },
  noticeContainer: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    backgroundColor: colors.dot,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
  },
  noticeText: {
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    lineHeight: 15,
    color: colors.text.primary,
  },
  messageTitle: {
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    lineHeight: 15,
    color: colors.text.primary,
  },
  board: {
    height: 90,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 12,
    fontFamily: fonts.primary[400],
    fontSize: 12,
    color: colors.text.tertiary,
  },
  customMessageStyle: {
    fontFamily: fonts.primary[400],
    fontSize: 12,
    lineHeight: 22,
    color: colors.text.primary,
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
