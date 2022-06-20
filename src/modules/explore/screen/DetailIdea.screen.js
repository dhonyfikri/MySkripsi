import _ from 'lodash';
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
  IcLikeActive,
  IcSmileEmote,
  IcUnactiveLike,
} from '../../../assets/icon';
import CardDetailTeamDesc from '../../../components/CardDetailTeamsDesc';
import CardProfile from '../../../components/CardProfile';
import CardReply from '../../../components/CardReply';
import DetailIdeaDesc from '../../../components/DetailIdeaDesc';
import Divider from '../../../components/Divider';
import Gap from '../../../components/Gap';
import Header from '../../../components/Header';
import RefreshFull from '../../../components/RefreshFull';
import LeanCanvasItem from '../../../components/LeanCanvasItem';
import LoadingProcessFull from '../../../components/LoadingProcessFull';
import MultilineTextView from '../../../components/MultilineTextView';
import {GetDetailIdeaAPI} from '../../../config/RequestAPI/IdeaAPI';
import {colors} from '../../../utils/ColorsConfig/Colors';
import fonts from '../../../utils/FontsConfig/Fonts';
import DummyResponseDetailIdea from '../../riset/DummyResponseDetailIdea';
import CardComment from '../../../components/CardCommentSementara';
import ModalMessage from '../../../components/ModalMessage';
import {AddLikeAPI} from '../../../config/RequestAPI/LikeAPI';
import jwtDecode from 'jwt-decode';
import {AddCommentAPI} from '../../../config/RequestAPI/CommentAPI';
import {useBackHandler} from '@react-native-community/hooks';
import {
  getAsyncStorage,
  getAsyncStorageObject,
} from '../../../utils/AsyncStorage/StoreAsyncStorage';

const DetailIdeaScreen = ({navigation, route}) => {
  // const ideaData = _.cloneDeep(DummyResponseDetailIdea);

  const decodedJwt = route.params?.userToken
    ? jwtDecode(route.params.userToken.authToken)
    : {};

  const refRBSheetComment = useRef();

  const [activeIndexOfContent, setActiveIndexOfContent] = useState(0);
  const [loading, setLoading] = useState({
    visible: true,
    message: 'Please wait',
  });
  const [ideaData, setIdeaData] = useState(undefined);
  const [commentText, setCommentText] = useState('');
  const [showRefreshBUtton, setShowRefreshButton] = useState(false);
  const [messageModal, setMessageModal] = useState({
    visible: false,
    message: undefined,
    title: undefined,
    type: 'smile',
    onClose: () => {},
  });
  const [replyData, setReplyData] = useState({
    replying: false,
    nameToReply: '',
    commentIdToReply: '',
  });
  const [disableLikeButton, setDisableLikeButton] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

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

  const setChanged = () => {
    if (!isChanged) {
      setIsChanged(true);
    }
  };

  const customerLC = [];
  const problemLC = [];
  const earlyAdopterLC = [];
  const existingSolutionLC = [];
  const uniqueValueLC = [];
  const proposedSolutionLC = [];

  if (ideaData) {
    ideaData?.lc?.map(res => {
      if (res.field === 'customers') {
        customerLC.push(res.value);
      }
      if (res.field === 'problems') problemLC.push(res.value);
      if (res.field === 'earlyAdopters') earlyAdopterLC.push(res.value);
      if (res.field === 'existingSolutions') existingSolutionLC.push(res.value);
      if (res.field === 'uniqueValues') uniqueValueLC.push(res.value);
      if (res.field === 'proposedSolutions') proposedSolutionLC.push(res.value);
    });
  }

  console.log(ideaData?.approval);

  const likeStatus =
    ideaData?.like?.filter(item => item.createdBy === decodedJwt.data.id)
      .length > 0;

  const fetchIdeas = () => {
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

  const handleLike = () => {
    setDisableLikeButton(true);
    AddLikeAPI(route.params?.userToken.authToken, route.params?.ideaId).then(
      res => {
        setDisableLikeButton(false);
        console.log(res);
        const tempIdeaData = {...ideaData};
        if (res.status === 'SUCCESS' || res.status === 'UNDEFINED_HEADER') {
          setChanged();
          let temptLikeList = tempIdeaData.like;
          if (likeStatus) {
            temptLikeList = [];
            temptLikeList = ideaData?.like?.filter(
              item => item.createdBy !== decodedJwt.data.id,
            );
            tempIdeaData.totalLike = tempIdeaData.totalLike - 1;
          } else {
            temptLikeList.push({
              // id: '5',
              ideaId: route.params?.ideaId,
              createdBy: decodedJwt.data.id,
            });
            tempIdeaData.totalLike = tempIdeaData.totalLike + 1;
          }
          tempIdeaData.like = temptLikeList;
          setIdeaData(tempIdeaData);
        } else if (
          res.status === 'SOMETHING_WRONG' ||
          res.status === 'NOT_FOUND' ||
          res.status === 'UNAUTHORIZED' ||
          res.status === 'SERVER_ERROR'
        ) {
          setMessageModal({
            ...messageModal,
            visible: true,
            title: 'Failed',
            message: res.message,
            type: 'confused',
            // onClose: () => {},
          });
        }
      },
    );
  };

  const handleComment = () => {
    setLoading({...loading, visible: true, message: 'Adding your comment'});
    AddCommentAPI(
      route.params?.userToken.authToken,
      ideaData.id,
      commentText,
    ).then(res => {
      setLoading({...loading, visible: false});
      console.log(res);
      if (res.status === 'SUCCESS' || res.status === 'UNDEFINED_HEADER') {
        setChanged();
        const tempCommentList = [...ideaData.comment];
        tempCommentList.push({
          // id: '5',
          ideaId: ideaData.id,
          commentId: '0',
          comment: commentText,
          createdBy: decodedJwt.data.id,
          replyComment: [],
        });
        setIdeaData({
          ...ideaData,
          comment: tempCommentList,
          totalComment: ideaData.totalComment + 1,
        });
        setCommentText('');
      } else if (
        res.status === 'SOMETHING_WRONG' ||
        res.status === 'NOT_FOUND' ||
        res.status === 'UNAUTHORIZED' ||
        res.status === 'SERVER_ERROR'
      ) {
        setMessageModal({
          ...messageModal,
          visible: true,
          title: 'Failed',
          message: res.message,
          type: 'confused',
          // onClose: () => {},
        });
      }
    });
  };

  const backToPreviousPage = () => {
    if (isChanged) {
      navigation.navigate('TabNavigation', {
        screen: 'Home',
        params: {
          userToken: route.params?.userToken,
          refresh: {status: true},
        },
      });
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  useBackHandler(() => {
    backToPreviousPage();
    return true;
  });

  // let commentCount = 0;
  // if (ideaData) {
  //   ideaData?.comment?.map(item => {
  //     commentCount += 1;
  //     item.replyComment?.map(() => {
  //       commentCount += 1;
  //     });
  //   });
  // }

  return (
    <View style={styles.page}>
      <Header
        backButton
        onBackPress={() => {
          backToPreviousPage();
        }}
        backText="Back"
        onNotificationPress={() =>
          navigation.navigate('Notification', {
            userToken: route.params?.userToken,
          })
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        <CardProfile
          withJoinButton={true}
          userData={route.params?.creatorData}
          onCreatorPress={() => {
            navigation.navigate('MyProfile', {
              editable: false,
              userId: route.params?.creatorData.id,
              userToken: route.params?.userToken,
              ideaData: route.params?.ideaDataList,
            });
          }}
        />
        <Gap height={16} />
        <View style={styles.interactions}>
          <TouchableOpacity
            style={styles.interactionsItem}
            onPress={() => {
              if (!disableLikeButton) {
                handleLike();
              }
            }}>
            {likeStatus ? (
              <IcLikeActive width={24} height={24} />
            ) : (
              <IcUnactiveLike width={24} height={24} />
            )}

            <Gap width={6.5} />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.interactionsText}>
              {ideaData ? ideaData.totalLike : '-'}
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
              {ideaData ? ideaData.totalComment : '-'}
            </Text>
          </TouchableOpacity>
          <Gap width={6.5} />
          <TouchableOpacity>
            <IcEnvelope width={24} height={24} />
          </TouchableOpacity>
        </View>
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
              title={ideaData?.desc[0]?.value}
              desc={ideaData?.desc[1]?.value}
              image={ideaData?.desc[2]?.value}
            />
          </Animated.View>
        )}
        {activeIndexOfContent === 1 && (
          <Animated.View
            style={{...styles.dataSessionContainer, opacity: fadeAnim}}>
            <Gap height={4} />
            <Text style={styles.title}>Why</Text>
            <Gap height={4} />
            <MultilineTextView text={ideaData?.gc[0]?.value} height={150} />
            <Gap height={21} />
            <Text style={styles.title}>How</Text>
            <Gap height={4} />
            <MultilineTextView text={ideaData?.gc[1]?.value} height={150} />
            <Gap height={21} />
            <Text style={styles.title}>What</Text>
            <Gap height={4} />
            <MultilineTextView text={ideaData?.gc[2]?.value} height={150} />
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
            {ideaData &&
              (ideaData.approval?.length > 0 ? (
                ideaData.approval
                  .filter(item => item.status === 'Approved')
                  .map((team, index) => {
                    const teamData = route.params?.listUser.filter(
                      item => item.id === team.userId,
                    )[0];
                    return (
                      <View key={index.toString()}>
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
                      </View>
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
              {ideaData
                ? ideaData.totalComment > 100
                  ? '100+'
                  : ideaData?.totalComment
                : '-'}{' '}
              Comment
              {ideaData?.totalComment > 1 && 's'}
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
                        userList={route.params?.listUser}
                        commentsData={item}
                        onMainRepplyPress={(commentId, creatorName) => {
                          setReplyData({
                            status: true,
                            commentIdToReply: commentId,
                            nameToReply: creatorName,
                          });
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
                // marginHorizontal: 16,
                padding: 8,
                paddingLeft: 16,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: colors.text.primary,
                overflow: 'hidden',
              }}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <TextInput
                  placeholder="Leave a comment"
                  autoCorrect={false}
                  multiline
                  style={{
                    maxHeight: 100,
                    fontFamily: fonts.primary[400],
                    fontSize: 12,
                    color: colors.text.primary,
                    padding: 0,
                  }}
                  onChangeText={text => setCommentText(text)}>
                  <Text style={{lineHeight: 22}}>{commentText}</Text>
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
                    }}
                    onPress={() => {
                      if (ideaData && commentText.trim().length > 0) {
                        handleComment();
                      }
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
      <LoadingProcessFull visible={loading.visible} message={loading.message} />
      <RefreshFull
        visible={showRefreshBUtton}
        onPress={() => {
          setShowRefreshButton(false);
          fetchIdeas();
        }}
        onOffsetTouch={() => navigation.goBack()}
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

export default DetailIdeaScreen;

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
