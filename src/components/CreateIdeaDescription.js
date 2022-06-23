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
import {IdeaCategory} from '../utils/SupportData/SupportData';
import CardCreateIdeaSession from './CardCreateIdeaSession';
import Gap from './Gap';

const CreateIdeaDescription = ({
  onNextReff,
  onEdited = () => {},
  onUpdate = () => {},
  onNextRequest = () => {},
}) => {
  const [ideaDescription, setIdeaDescription] = useState({
    title: '',
    cover: null,
    category: null,
    description: '',
    allowToJoin: true,
  });

  const [openDropdownIdeaCategory, setOpenDropdownIdeaCategory] =
    useState(false);
  const [valueDropdownIdeaCategory, setValueDropdownIdeaCategory] = useState(
    ideaDescription.category,
  );
  const [itemsDropdownIdeaCategory, setItemsDropdownIdeaCategory] =
    useState(IdeaCategory);

  const takeCoverPhotoFromLibrary = () => {
    ImageCropPicker.openPicker({
      width: 800,
      height: 800,
      mediaType: 'photo',
      cropping: true,
    }).then(image => {
      if (image.size <= 1000000000) {
        setIdeaDescription({
          ...ideaDescription,
          cover: {
            uri: image.path,
            mime: image.mime,
            name: image.path?.split('/')?.slice(-1)[0],
          },
        });
        onEdited();
      }
    });
  };

  const handleToggle = value => {
    setIdeaDescription({...ideaDescription, allowToJoin: value});
    onEdited();
  };

  useEffect(() => {
    setIdeaDescription({
      ...ideaDescription,
      category: valueDropdownIdeaCategory,
    });
    if (valueDropdownIdeaCategory !== null) {
      onEdited();
    }
  }, [valueDropdownIdeaCategory]);

  useEffect(() => {
    let isCompleted = false;
    if (
      ideaDescription.title !== '' &&
      ideaDescription.cover !== null &&
      ideaDescription.category !== null &&
      ideaDescription.description !== ''
    ) {
      isCompleted = true;
    }
    onUpdate(isCompleted);
  }, [ideaDescription]);

  useEffect(() => {
    if (onNextReff !== undefined) {
      onNextReff.current = () => onNextRequest(ideaDescription);
    }
    // }, [ideaDescription]); // ya Allah... menghapus dependensi ini bikin aku inget waktu susah cari sinyal di Tegal sampe jauh-jauh ke kota buat ngerjain ini :') . sekarang malah dihapus hhmmm...
  });

  return (
    <CardCreateIdeaSession title="Idea Description" mandatory>
      <Text style={styles.fieldTitle}>
        Title Idea<Text style={{color: colors.alert}}>*</Text>
      </Text>
      <View style={styles.field}>
        <TextInput
          style={styles.titleInput}
          placeholder="(Max. 50 Characters)"
          onChangeText={text => {
            setIdeaDescription({...ideaDescription, title: text});
            onEdited();
          }}>
          <Text style={{...styles.titleInput, lineHeight: 20}}>
            {ideaDescription.title}
          </Text>
        </TextInput>
      </View>
      <Gap height={16} />
      <Text style={styles.fieldTitle}>
        Idea Cover Image (JPG, GIF, or PNG 10 MB)
        <Text style={{color: colors.alert}}>*</Text>
      </Text>
      <View style={styles.uploadContainer(ideaDescription.cover !== null)}>
        {ideaDescription.cover !== null && (
          <>
            <Text
              style={styles.fileTitle}
              numberOfLines={1}
              ellipsizeMode="middle">
              {ideaDescription.cover.uri?.split('/')?.slice(-1)}
            </Text>
            <Gap height={10} />
          </>
        )}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {ideaDescription.cover !== null && (
            <View style={{flex: 1, flexDirection: 'row'}}>
              <TouchableOpacity
                style={{
                  paddingRight: 8,
                  paddingVertical: 8,
                }}
                onPress={() => {
                  setIdeaDescription({...ideaDescription, cover: null});
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
              {ideaDescription.cover === null ? 'Choose File' : 'Change File'}
            </Text>
          </TouchableOpacity>

          {ideaDescription.cover === null && (
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
      <TextInput
        multiline
        placeholder="(Max. 60 Characters)"
        maxLength={1000}
        textAlignVertical="top"
        autoComplete="off"
        autoCorrect={false}
        style={styles.board}
        onChangeText={text => {
          setIdeaDescription({...ideaDescription, description: text});
          onEdited();
        }}>
        <Text style={{lineHeight: 20}}>{ideaDescription.description}</Text>
      </TextInput>
      <Gap height={16} />
      <Text style={styles.switchTitle}>
        Allow other people to join your Idea ?
      </Text>
      <Gap height={12} />
      <SwipeButton
        onToggle={handleToggle}
        value={ideaDescription.allowToJoin}
      />
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
    color: colors.text.primary,
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
    color: colors.text.primary,
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
  board: {
    height: 155,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 12,
    fontFamily: fonts.primary[400],
    fontSize: 16,
    color: colors.text.primary,
  },
  switchTitle: {
    fontFamily: fonts.secondary[400],
    fontSize: 14,
    lineHeight: 17,
    color: colors.text.tertiary,
  },
});
