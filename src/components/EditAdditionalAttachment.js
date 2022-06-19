import React, {useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  IcAddOrangeRounded,
  IcCopyClipboard,
  IcDotThree,
  IcSearch,
} from '../assets/icon';
import {colors} from '../utils/ColorsConfig/Colors';
import fonts from '../utils/FontsConfig/Fonts';
import AddAdditionalAttachmentField from './AddAdditionalAttachmentField';
import Divider from './Divider';
import Gap from './Gap';
import ModalAction from './ModalAction';

const EditAdditionalAttachment = ({
  attachment,
  listUserData = [],
  onRemoveAttachment = () => {},
  onAddAttachment = () => {},
}) => {
  const refRBSheetActionLink = useRef();
  const refRBSheetActionFile = useRef();

  const [searchText, setSearchText] = useState('');
  const [tempSearchText, setTempSearchText] = useState('');
  const [selectedAttachment, setSelectedAttachment] = useState({
    index: null,
    data: null,
  });
  const [modalAddAttachmentVisible, setModalAddAttachmentVisible] =
    useState(false);

  return (
    <>
      <View style={styles.searchAndFilterWrapper}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={tempSearchText}
            onChangeText={text => setTempSearchText(text)}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              setSearchText(tempSearchText);
            }}>
            <IcSearch />
          </TouchableOpacity>
        </View>
        <Gap width={4} />
        <TouchableOpacity
          onPress={() => {
            setModalAddAttachmentVisible(true);
          }}>
          <IcAddOrangeRounded />
        </TouchableOpacity>
      </View>
      <Gap height={16} />
      <FlatList
        data={attachment}
        keyExtractor={(_, index) => index.toString()}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        inverted={false}
        renderItem={({item, index}) => {
          return (
            <>
              {searchText.length === 0 ||
              item.value.name
                .toLowerCase()
                .includes(searchText.toLowerCase()) ? (
                <>
                  <View style={styles.cardContainer}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <ScrollView
                        contentContainerStyle={{flexGrow: 1}}
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        <Text numberOfLines={1} style={styles.attachmentDesc}>
                          {item.value.name}
                        </Text>
                      </ScrollView>
                      <Gap width={8} />
                      <TouchableOpacity
                        style={{flexDirection: 'row', alignItems: 'center'}}
                        onPress={() => {
                          setSelectedAttachment({index: index, data: item});
                          if (item.field === 'additionalFileLinkAttachment') {
                            refRBSheetActionLink.current.open();
                          } else if (
                            item.field === 'additionalFileAttachment'
                          ) {
                            refRBSheetActionFile.current.open();
                          }
                        }}>
                        <IcDotThree />
                      </TouchableOpacity>
                    </View>
                    <Gap height={12} />
                    <View style={styles.detailContainer}>
                      <View style={styles.detailTextWrapper}>
                        <Text style={styles.titleDetail}>Attachment</Text>
                        <Gap width={16} />
                        <View style={styles.detailField}>
                          <ScrollView
                            contentContainerStyle={{
                              flexGrow: 1,
                              justifyContent: 'flex-end',
                            }}
                            horizontal
                            showsHorizontalScrollIndicator={false}>
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={styles.valueDetail}>
                              {item.value.link}
                            </Text>
                          </ScrollView>
                          {item.field === 'additionalFileLinkAttachment' && (
                            <>
                              <Gap width={4} />
                              <TouchableOpacity>
                                <IcCopyClipboard />
                              </TouchableOpacity>
                            </>
                          )}
                        </View>
                      </View>
                      <Gap height={16} />
                      <View style={styles.detailTextWrapper}>
                        <Text style={styles.titleDetail}>Type</Text>
                        <Gap width={16} />
                        <View style={styles.detailField}>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={styles.valueDetail}>
                            {item.field === 'additionalFileLinkAttachment'
                              ? 'Link'
                              : 'File'}
                          </Text>
                        </View>
                      </View>
                      <Gap height={16} />
                      <View style={styles.detailTextWrapper}>
                        <Text style={styles.titleDetail}>Uploaded by</Text>
                        <Gap width={16} />
                        <View style={styles.detailField}>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={styles.valueDetail}>
                            {/* {item.uploadedByName} */}
                            {
                              listUserData.filter(
                                itemUser => itemUser.id === item.uploadedById,
                              )[0]?.name
                            }
                          </Text>
                        </View>
                      </View>
                      <Gap height={16} />
                      <View style={styles.detailTextWrapper}>
                        <Text style={styles.titleDetail}>Uploaded date</Text>
                        <Gap width={16} />
                        <View style={styles.detailField}>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={styles.valueDetail}>
                            {item.uploadedDate}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  {index !== attachment.length - 1 && <Gap height={16} />}
                </>
              ) : (
                <></>
              )}
            </>
          );
        }}
      />
      {/* Modal add attachment */}
      <ModalAction
        visible={modalAddAttachmentVisible}
        title="Add New Attachment"
        onCloseButtonPress={() => {
          setModalAddAttachmentVisible(false);
        }}
        onRequestClose={() => {
          setModalAddAttachmentVisible(false);
        }}
        contentBackground={colors.secondary}
        withTitleDivider={false}>
        <AddAdditionalAttachmentField
          onDiscard={() => {
            setModalAddAttachmentVisible(false);
          }}
          onSave={newAttachment => {
            onAddAttachment(newAttachment);
            setModalAddAttachmentVisible(false);
          }}
        />
      </ModalAction>
      {/* Bottom sheet action link*/}
      <RBSheet
        ref={refRBSheetActionLink}
        closeOnDragDown={true}
        closeOnPressMask={false}
        animationType="fade"
        height={170}
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
              onPress={() => refRBSheetActionLink.current.close()}>
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
                refRBSheetActionLink.current.close();
                setSearchText('');
                onRemoveAttachment(selectedAttachment.index);
              }}>
              <Text style={styles.buttonText('danger')}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
      {/* Bottom sheet action file*/}
      <RBSheet
        ref={refRBSheetActionFile}
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
              onPress={() => refRBSheetActionFile.current.close()}>
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
                refRBSheetActionFile.current.close();
                // do download file here
              }}>
              <Text style={styles.buttonText('normal')}>Download File</Text>
            </TouchableOpacity>
          </View>
          <Gap height={8} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={{padding: 16}}
              onPress={() => {
                refRBSheetActionFile.current.close();
                setSearchText('');
                onRemoveAttachment(selectedAttachment.index);
              }}>
              <Text style={styles.buttonText('danger')}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    </>
  );
};

export default EditAdditionalAttachment;

const styles = StyleSheet.create({
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
  cardContainer: {
    padding: 12,
    backgroundColor: colors.dot,
    borderRadius: 16,
  },
  attachmentDesc: {
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
    alignItems: 'center',
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
});
