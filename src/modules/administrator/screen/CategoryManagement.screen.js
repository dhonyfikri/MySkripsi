import {useBackHandler} from '@react-native-community/hooks';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, {useEffect, useState, useRef} from 'react';
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
import {IcAddOrangeRounded, IcSearch} from '../../../assets/icon';
import AddCategoryField from '../../../components/AddCategoryField';
import CardCategoryTail from '../../../components/CardCategoryTail';
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
import {colors} from '../../../utils/ColorsConfig/Colors';
import fonts from '../../../utils/FontsConfig/Fonts';

const CategoryManagement = ({navigation, route}) => {
  const decodedJwt = jwtDecode(route.params?.userToken.authToken);

  const dataFromServer = [
    {
      id: '1654907406594',
      categoryName: 'Lingkungan',
      type: '1',
      parentId: '0',
      required: true,
      status: '1',
      createdBy: '13',
      updatedBy: '13',
      createdDate: '04/02/2022',
      updatedDate: '04/02/2022',
    },
    {
      id: '1654907409462',
      categoryName: 'Peduli Duafa',
      type: '2',
      parentId: '1654907406594',
      required: true,
      status: '1',
      createdBy: '13',
      updatedBy: '13',
      createdDate: '04/02/2022',
      updatedDate: '04/02/2022',
    },
    {
      id: '1654907406255',
      categoryName: 'Edukasi Umum',
      type: '2',
      parentId: '1654907406594',
      required: true,
      status: '1',
      createdBy: '13',
      updatedBy: '13',
      createdDate: '04/02/2022',
      updatedDate: '04/02/2022',
    },
    ////////////////////////////////////
    {
      id: '1654907402745',
      categoryName: 'Social Colaboration',
      type: '1',
      parentId: '0',
      required: true,
      status: '1',
      createdBy: '13',
      updatedBy: '13',
      createdDate: '05/02/2022',
      updatedDate: '05/02/2022',
    },
    {
      id: '1654907404899',
      categoryName: 'Kerja Bakti',
      type: '2',
      parentId: '1654907402745',
      required: true,
      status: '1',
      createdBy: '13',
      updatedBy: '13',
      createdDate: '04/02/2022',
      updatedDate: '04/02/2022',
    },
    {
      id: '1654907403544',
      categoryName: 'Rapat Teknis',
      type: '2',
      parentId: '1654907402745',
      required: true,
      status: '1',
      createdBy: '13',
      updatedBy: '13',
      createdDate: '04/02/2022',
      updatedDate: '04/02/2022',
    },
  ];

  const refRBSheetAction = useRef();

  const [categoryData, setCategoryData] = useState([]);
  const [categoryDataToShow, setCategoryDataToShow] = useState([]);
  const [searchText, setSearchText] = useState('');
  // hanya pembantu selama api belum jalan
  const [listUserData, setListUserData] = useState([]);
  const [ideaDataList, setIdeaDataList] = useState([]);
  /////////////////////////////////////////

  // console.log(
  //   Math.floor(Math.random() * Math.floor(Math.random() * Date.now())),
  // );

  const [modalDeleteCategoryVisible, setModalDeleteCategoryVisible] =
    useState(false);
  const [modalAddCategoryVisible, setModalAddCategoryVisible] = useState(false);
  const [
    messageSuccessDeleteCategoryModalVisible,
    setMessageSuccessDeleteCategoryModalVisible,
  ] = useState(false);
  const [
    messageSuccessAddCategoryModalVisible,
    setMessageSuccessAddCategoryModalVisible,
  ] = useState(false);
  const [messageSuccessActiveDeactive, setMessageSuccessActiveDeactive] =
    useState({visible: false, type: 'active'});
  const [deleteIdeaMessage, setDeleteIdeaMessage] = useState('');
  const [loading, setLoading] = useState({
    visible: true,
    message: 'Please Wait',
  });
  const [showRefreshBUtton, setShowRefreshButton] = useState(false);
  const [selectedCategoryTile, setSelectedCategoryTile] = useState(null);

  const matchToSearch = () => {
    let tempCategoryData = [];
    if (searchText === '') {
      tempCategoryData = categoryData;
    } else {
      tempCategoryData = categoryData.filter(item =>
        item.categoryName.toLowerCase().includes(searchText.toLowerCase()),
      );
    }
    setCategoryDataToShow(tempCategoryData);
  };

  const activateCategory = () => {
    setLoading({visible: true, message: 'Activate Category'});
    setCategoryData(
      categoryData
        .filter(item => true)
        .map(item => {
          if (
            item.id === selectedCategoryTile.id &&
            (selectedCategoryTile.parentId === '0' ||
              categoryData.filter(
                item => item.id === selectedCategoryTile.parentId,
              )[0]?.status === '1')
          ) {
            return {...item, status: '1'};
          } else {
            return item;
          }
        }),
    );
    setLoading({...loading, visible: false});
    setMessageSuccessActiveDeactive({visible: true, type: 'active'});
    refRBSheetAction.current.close();
  };

  const deactivateCategory = () => {
    setLoading({visible: true, message: 'Deactivate Category'});
    setCategoryData(
      categoryData
        .filter(item => true)
        .map(item => {
          if (
            item.id === selectedCategoryTile.id ||
            item.parentId === selectedCategoryTile.id
          ) {
            return {...item, status: '0'};
          } else {
            return item;
          }
        }),
    );
    setLoading({...loading, visible: false});
    setMessageSuccessActiveDeactive({visible: true, type: 'deactive'});
    refRBSheetAction.current.close();
  };

  const deleteCategory = () => {
    setLoading({visible: true, message: 'Deleting Category'});
    setCategoryData(
      categoryData.filter(
        item =>
          item.id !== selectedCategoryTile.id &&
          item.parentId !== selectedCategoryTile.id,
      ),
    );
    setLoading({...loading, visible: false});
    setModalDeleteCategoryVisible(false);
    setMessageSuccessDeleteCategoryModalVisible(true);
  };

  const fetchIdeas = () => {
    setLoading({message: 'Please Wait', visible: true});
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
          uniqueUserId.push(
            jwtDecode(route.params?.userToken?.authToken).data.id,
          );
        });
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

        axios
          .all(listGetUserRequest)
          .then(
            axios.spread((...responses) => {
              responses.map(item => {
                if (item.data.data.length > 0) {
                  listUser.push(item.data.data[0]);
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
              setIdeaDataList(fixResult);
              setListUserData(listUser);
              setLoading({...loading, visible: false});
            }),
          )
          .catch(errors => {
            setLoading({...loading, visible: false});
            setShowRefreshButton(true);
            console.log(errors);
          });
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

  useEffect(() => {
    if (route.params?.refresh?.status) {
      // todo something

      //////////////////
      navigation.setParams({
        ...route.params,
        refresh: {status: false},
      });
    }
  }, [route.params?.refresh]);

  useEffect(() => {
    matchToSearch();
  }, [categoryData]);

  useEffect(() => {
    fetchIdeas();
    setCategoryData(dataFromServer);
  }, []);

  return (
    <View style={styles.page}>
      <Header
        backButton
        onBackPress={() => navigation.goBack()}
        backText="Back"
        title="Category Management"
        onNotificationPress={() => navigation.navigate('Notification')}
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
          <TouchableOpacity onPress={() => setModalAddCategoryVisible(true)}>
            <IcAddOrangeRounded />
          </TouchableOpacity>
        </View>
        <Gap height={16} />
        <FlatList
          data={categoryDataToShow}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          inverted={false}
          renderItem={({item, index}) => {
            return (
              <>
                {index !== 0 && <Gap height={16} />}
                <CardCategoryTail
                  categoryName={item.categoryName}
                  type={item.type}
                  status={item.status}
                  valueLength={categoryData.length}
                  raiseDelay={selectedCategoryTile === null ? index : 0}
                  onDotThreePress={() => {
                    setSelectedCategoryTile(item);
                    refRBSheetAction.current.open();
                  }}
                  onCardPress={() => {
                    refRBSheetAction.current.close();
                    navigation.navigate('DetailCategory', {
                      categoryData: categoryData.filter(
                        _item => _item.id === item.id,
                      )[0],
                      listUserData: listUserData,
                    });
                  }}
                />
              </>
            );
          }}
        />
      </ScrollView>

      {/* Bottom sheet action */}
      <RBSheet
        ref={refRBSheetAction}
        closeOnDragDown={true}
        closeOnPressMask={true}
        animationType="fade"
        height={350}
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
            <TouchableOpacity
              style={{padding: 16}}
              onPress={() => {
                refRBSheetAction.current.close();
                navigation.navigate('DetailCategory', {
                  categoryData: categoryData.filter(
                    item => item.id === selectedCategoryTile.id,
                  )[0],
                  listUserData: listUserData,
                });
              }}>
              <Text style={styles.buttonText('normal')}>Detail Category</Text>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity style={{padding: 16}}>
              <Text style={styles.buttonText('normal')}>Edit Category</Text>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity
              style={{padding: 16}}
              onPress={() => {
                refRBSheetAction.current.close();
                setModalDeleteCategoryVisible(true);
              }}>
              <Text style={styles.buttonText('normal')}>Remove Category</Text>
            </TouchableOpacity>
          </View>
          <Gap height={8} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={{padding: 16}}
              onPress={() => {
                if (selectedCategoryTile?.status === '1') {
                  deactivateCategory();
                } else {
                  activateCategory();
                }
              }}>
              <Text style={styles.buttonText('danger')}>
                {selectedCategoryTile?.status === '1'
                  ? 'Deactivate Category'
                  : 'Activate Category'}
              </Text>
            </TouchableOpacity>
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

      {/* Modal add category action */}
      <ModalAction
        visible={modalAddCategoryVisible}
        title="Add Category"
        onCloseButtonPress={() => {
          setModalAddCategoryVisible(false);
        }}
        onRequestClose={() => {
          setModalAddCategoryVisible(false);
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
          <Text style={styles.noticeText}>Add New Category</Text>
        </View>
        <Gap height={16} />
        <AddCategoryField
          categoryTypeItem={[
            {label: 'Main Category', value: '1'},
            {label: 'Sub Category', value: '2'},
          ]}
          mainCategoryItem={categoryData
            .filter(item => item.parentId === '0')
            .map(item => {
              return {label: item.categoryName, value: item.id};
            })}
          onDiscardPress={() => {
            setModalAddCategoryVisible(false);
          }}
          onSave={newCategory => {
            let tempCategoryData = [...categoryData];
            tempCategoryData.push({
              ...newCategory,
              createdBy: decodedJwt.data.id,
              updatedBy: decodedJwt.data.id,
            });
            setCategoryData(tempCategoryData);
            setModalAddCategoryVisible(false);
            setMessageSuccessAddCategoryModalVisible(true);
          }}
        />
      </ModalAction>

      {/* Modal delete category action */}
      <ModalAction
        visible={modalDeleteCategoryVisible}
        title="Delete Idea"
        onCloseButtonPress={() => {
          setModalDeleteCategoryVisible(false);
          setDeleteIdeaMessage('');
        }}
        onRequestClose={() => {
          setModalDeleteCategoryVisible(false);
          setDeleteIdeaMessage('');
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
              delete
            </Text>{' '}
            this category?{' '}
            <Text
              style={{
                ...styles.noticeText,
                fontFamily: fonts.secondary[700],
              }}>
              {selectedCategoryTile?.categoryName}
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
              setDeleteIdeaMessage(text);
            }}>
            <Text style={{lineHeight: 20}}>{deleteIdeaMessage}</Text>
          </TextInput>
        </View>
        <Gap height={16} />
        <EditActionButton
          disableSaveButton={deleteIdeaMessage.trim().length <= 0}
          onDiscardPress={() => {
            setModalDeleteCategoryVisible(false);
            setDeleteIdeaMessage('');
          }}
          onSavePress={() => {
            deleteCategory();
          }}
        />
      </ModalAction>

      {/* modal success add category message */}
      <ModalMessage
        visible={messageSuccessAddCategoryModalVisible}
        withIllustration
        illustrationType="smile"
        title="Success"
        message={
          <Text>
            You have <Text style={{color: colors.success}}>added</Text> this
            category
          </Text>
        }
        withBackButton
        onBack={() => {
          setMessageSuccessAddCategoryModalVisible(false);
        }}
        onRequestClose={() => {
          setMessageSuccessAddCategoryModalVisible(false);
        }}
      />

      {/* modal success delete category message */}
      <ModalMessage
        visible={messageSuccessDeleteCategoryModalVisible}
        withIllustration
        illustrationType="confused"
        title="You’re all done"
        message={
          <Text>
            You have <Text style={{color: colors.reject}}>deleted</Text> this
            category
          </Text>
        }
        withBackButton
        onBack={() => {
          setMessageSuccessDeleteCategoryModalVisible(false);
        }}
        onRequestClose={() => {
          setMessageSuccessDeleteCategoryModalVisible(false);
        }}
      />

      {/* modal success active deactive message */}
      <ModalMessage
        visible={messageSuccessActiveDeactive.visible}
        withIllustration
        illustrationType={
          messageSuccessActiveDeactive.type === 'active' ? 'smile' : 'confused'
        }
        title="You’re all done"
        message={
          messageSuccessActiveDeactive.type === 'active' ? (
            <Text>
              You have <Text style={{color: colors.success}}>Activated</Text>{' '}
              this category
            </Text>
          ) : (
            <Text>
              You have <Text style={{color: colors.reject}}>Deactivated</Text>{' '}
              category status!
            </Text>
          )
        }
        withBackButton
        onBack={() => {
          setMessageSuccessActiveDeactive({
            ...messageSuccessActiveDeactive,
            visible: false,
          });
        }}
        onRequestClose={() => {
          setMessageSuccessActiveDeactive({
            ...messageSuccessActiveDeactive,
            visible: false,
          });
        }}
      />
    </View>
  );
};

export default CategoryManagement;

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
});
