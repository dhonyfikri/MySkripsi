import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import {
  IcActiveOpenFile,
  IcActiveTrash,
  IcChevronDown,
  IcOutlinedClose,
} from '../assets/icon';
import SwipeButton from '../components/SwipeButton';
import {colors} from '../utils/ColorsConfig/Colors';
import fonts from '../utils/FontsConfig/Fonts';
import BoardTextInput from './BoardTextInput';
import CardCreateIdeaSession from './CardCreateIdeaSession';
import Gap from './Gap';

const CreateIdeaDescription = ({
  ideaTitle,
  ideaCover,
  ideaCategory,
  ideaDesc,
  allowToJoin,
  onIdeaTitleChange = () => {},
  onIdeaCoverChange = () => {},
  onIdeaCategoryChange = () => {},
  onIdeaDescChange = () => {},
  onAllowToJoinChange = () => {},
  onDropdownValueChange,
}) => {
  const [openDropdownIdeaCategory, setOpenDropdownIdeaCategory] =
    useState(false);
  const [valueDropdownIdeaCategory, setValueDropdownIdeaCategory] =
    useState(ideaCategory);
  const [itemsDropdownIdeaCategory, setItemsDropdownIdeaCategory] = useState([
    {label: 'Lingkungan', value: '1'},
    {label: 'Social Colaboration', value: '2'},
  ]);

  const takeCoverPhotoFromLibrary = () => {
    ImageCropPicker.openPicker({
      width: 800,
      height: 800,
      mediaType: 'photo',
      cropping: true,
    }).then(image => {
      if (image.size <= 1000000000) {
        onIdeaCoverChange({
          uri: image.path,
          mime: image.mime,
          name: image.path?.split('/')?.slice(-1)[0],
        });
      }
    });
  };

  const handleToggle = value => {
    onAllowToJoinChange(value);
  };

  useEffect(() => {
    onIdeaCategoryChange(
      valueDropdownIdeaCategory,
      itemsDropdownIdeaCategory.filter(
        item => item.value === valueDropdownIdeaCategory,
      )[0]?.label,
    );
  }, [valueDropdownIdeaCategory]);

  useEffect(() => {
    setValueDropdownIdeaCategory(ideaCategory);
  }, [ideaCategory]);

  return (
    <CardCreateIdeaSession>
      <Text style={styles.fieldTitle}>
        Title Idea<Text style={{color: colors.alert}}>*</Text>
      </Text>
      <View style={styles.field}>
        <TextInput
          style={styles.titleInput}
          placeholder="(Max. 50 Characters)"
          onChangeText={text => {
            onIdeaTitleChange(text);
          }}>
          <Text style={{...styles.titleInput, lineHeight: 20}}>
            {ideaTitle}
          </Text>
        </TextInput>
      </View>
      <Gap height={16} />
      <Text style={styles.fieldTitle}>
        Idea Cover Image (JPG, GIF, or PNG 10 MB)
        <Text style={{color: colors.alert}}>*</Text>
      </Text>
      <View style={styles.uploadContainer(ideaCover !== null)}>
        {ideaCover !== null && (
          <>
            <Text
              style={styles.fileTitle}
              numberOfLines={1}
              ellipsizeMode="middle">
              {ideaCover.uri?.split('/')?.slice(-1)}
            </Text>
            <Gap height={10} />
          </>
        )}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {ideaCover !== null && (
            <View style={{flex: 1, flexDirection: 'row'}}>
              <TouchableOpacity
                style={{
                  paddingRight: 8,
                  paddingVertical: 8,
                }}
                onPress={() => {
                  onIdeaCoverChange(null);
                }}>
                <IcActiveTrash />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={takeCoverPhotoFromLibrary}>
            <IcActiveOpenFile />
            <Gap width={8} />
            <Text style={styles.imagePickerButtonText}>
              {ideaCover === null ? 'Choose File' : 'Change File'}
            </Text>
          </TouchableOpacity>

          {ideaCover === null && (
            <>
              <Gap width={12} />
              <Text style={styles.unUploadedImageText} numberOfLines={1}>
                Drop files here
              </Text>
            </>
          )}
        </View>
      </View>
      <Gap height={16} />
      <Text style={styles.fieldTitle}>
        Idea Category<Text style={{color: colors.alert}}>*</Text>
      </Text>
      <DropDownPicker
        open={openDropdownIdeaCategory}
        value={valueDropdownIdeaCategory}
        items={itemsDropdownIdeaCategory}
        setOpen={setOpenDropdownIdeaCategory}
        setValue={setValueDropdownIdeaCategory}
        setItems={setItemsDropdownIdeaCategory}
        onChangeValue={onDropdownValueChange}
        placeholder="Choose Category"
        ArrowUpIconComponent={({style}) => <IcChevronDown style={style} />}
        ArrowDownIconComponent={({style}) => <IcChevronDown style={style} />}
        CloseIconComponent={({style}) => (
          <IcOutlinedClose style={{...style, marginRight: -10}} />
        )}
        closeAfterSelecting={true}
        containerStyle={styles.dropdownWrapper}
        style={styles.dropdownCore}
        listMode="MODAL"
        modalProps={{
          animationType: 'fade',
          transparent: true,
          presentationStyle: 'overFullScreen',
        }}
        modalTitle="Idea Category"
        modalTitleStyle={styles.dropdownModalTitle}
        listItemLabelStyle={styles.dropdownListItemLabel}
        modalContentContainerStyle={styles.dropdownModalContentContainer}
        labelStyle={styles.dropdownLabel}
        placeholderStyle={styles.dropdownPlaceholder}
      />
      <Gap height={16} />
      <Text style={styles.fieldTitle}>
        Description<Text style={{color: colors.alert}}>*</Text>
      </Text>

      <BoardTextInput
        text={ideaDesc}
        placeholder="(Max. 1000 Characters)"
        maxLength={1000}
        height={155}
        onChangeText={text => {
          onIdeaDescChange(text);
        }}
      />
      <Gap height={16} />
      <Text style={styles.switchTitle}>
        Allow other people to join your Idea ?
      </Text>
      <Gap height={12} />
      <SwipeButton onToggle={handleToggle} value={allowToJoin} />
    </CardCreateIdeaSession>
  );
};

export default CreateIdeaDescription;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 32,
  },
  sessionTitle: {
    fontFamily: fonts.secondary[700],
    fontSize: 16,
    lineHeight: 25.6,
    color: colors.text.primary,
  },
  fieldTitle: {
    marginBottom: 8,
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    lineHeight: 17,
  },
  field: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 32,
  },
  titleInput: {
    padding: 0,
    fontFamily: fonts.secondary[400],
    fontSize: 16,
    color: colors.text.secondary,
    top: 2,
  },
  uploadContainer: selected => ({
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: selected ? 8 : 32,
  }),
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: colors.primary2,
    borderRadius: 32,
  },
  imagePickerButtonText: {
    fontFamily: fonts.secondary[600],
    fontSize: 16,
    lineHeight: 22,
    color: colors.primary2,
  },
  unUploadedImageText: {
    flex: 1,
    marginRight: 12,
    fontFamily: fonts.primary[400],
    fontSize: 16,
    lineHeight: 25.6,
    color: colors.text.tertiary2,
  },
  fileTitle: {
    fontFamily: fonts.primary[400],
    fontSize: 16,
    lineHeight: 25.6,
    color: colors.text.tertiary2,
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderRadius: 32,
    borderColor: colors.border,
    overflow: 'hidden',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  dropdownCore: {
    borderWidth: 0,
    minHeight: 0,
  },
  dropdownModalTitle: {
    fontFamily: fonts.secondary[500],
    fontSize: 16,
    lineHeight: 20,
    color: colors.text.primary,
    marginLeft: -10,
  },
  dropdownListItemLabel: {
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    lineHeight: 15,
    color: colors.text.primary,
  },
  dropdownModalContentContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 60,
    marginVertical: 200,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 50,
  },
  dropdownLabel: {
    color: colors.text.secondary,
    fontFamily: fonts.secondary[400],
    fontSize: 16,
    lineHeight: 20,
    marginLeft: -10,
  },
  dropdownPlaceholder: {
    color: colors.text.tertiary,
    fontFamily: fonts.secondary[400],
    fontSize: 16,
    lineHeight: 20,
    marginLeft: -10,
  },
  switchTitle: {
    fontFamily: fonts.secondary[400],
    fontSize: 14,
    lineHeight: 17,
    color: colors.text.tertiary,
  },
});
