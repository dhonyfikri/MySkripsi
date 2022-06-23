import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import {IcActiveOpenFile, IcChevronDown, IcOutlinedClose} from '../assets/icon';
import {colors} from '../utils/ColorsConfig/Colors';
import fonts from '../utils/FontsConfig/Fonts';
import Gap from './Gap';
import {dateToText} from '../utils/DateConfig/DateConvert';
import EditActionButton from './EditActionButton';

const AddAdditionalAttachmentField = ({
  onSave = () => {},
  onDiscard = () => {},
}) => {
  const [openDropdownType, setOpenDropdownType] = useState(false);
  const [valueDropdownType, setValueDropdownType] = useState(null);
  const [itemsDropdownType, setItemsDropdownType] = useState([
    {label: 'Link', value: 'Link'},
    {label: 'File', value: 'File'},
  ]);

  const [attachment, setAttachment] = useState({
    // desc: '',
    // documentName: '',
    // source: '',
    // type: null,
    // uploadedDate: '',
    // uploadedBy: 'Thom Yorke',
    type: null,
    source: '',
    desc: '',
    documentName: '',
    link: '',
  });

  const handleDocumentSelection = async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        allowMultiSelection: false,
      });
      setAttachment({
        ...attachment,
        source: response[0].uri,
        documentName: response[0].name,
      });
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    setAttachment({
      ...attachment,
      documentName: '',
      source: '',
      link: '',
      type: valueDropdownType,
    });
  }, [valueDropdownType]);

  return (
    <>
      {/* dropdown team structure */}
      <Text style={styles.fieldTitle}>Choose Attachment Type</Text>
      <DropDownPicker
        open={openDropdownType}
        value={valueDropdownType}
        items={itemsDropdownType}
        setOpen={setOpenDropdownType}
        setValue={setValueDropdownType}
        setItems={setItemsDropdownType}
        placeholder="Type"
        ArrowUpIconComponent={({style}) => (
          <IcChevronDown style={{...style, marginRight: 8}} />
        )}
        ArrowDownIconComponent={({style}) => (
          <IcChevronDown style={{...style, marginRight: 8}} />
        )}
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
        modalTitle="Attachment Type"
        modalTitleStyle={styles.dropdownModalTitle}
        listItemLabelStyle={styles.dropdownListItemLabel}
        modalContentContainerStyle={styles.dropdownModalContentContainer}
        labelStyle={styles.dropdownLabel}
        placeholderStyle={styles.dropdownPlaceholder}
      />
      <Gap height={16} />
      {valueDropdownType === 'File' ? (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.filePickerButton}
            onPress={() => handleDocumentSelection()}>
            <IcActiveOpenFile />
            <Gap width={8} />
            <Text style={styles.filePickerButtonText}>
              {attachment.documentName === '' ? 'Choose File' : 'Change File'}
            </Text>
          </TouchableOpacity>
          <Gap width={12} />
          <Text
            style={styles.fileNameText}
            numberOfLines={1}
            ellipsizeMode="middle">
            {attachment.documentName === ''
              ? 'No File Choosen'
              : attachment.documentName}
          </Text>
        </View>
      ) : (
        <View style={styles.field(valueDropdownType === null ? true : false)}>
          <TextInput
            style={styles.titleInput}
            editable={valueDropdownType === null ? false : true}
            placeholder="Use http:// or https://"
            onChangeText={text => {
              setAttachment({...attachment, link: text});
            }}>
            <Text style={{...styles.titleInput, lineHeight: 20}}>
              {attachment.link}
            </Text>
          </TextInput>
        </View>
      )}
      <Gap height={16} />
      <Text style={styles.fieldTitle}>
        Description<Text style={{color: colors.alert}}>*</Text>
      </Text>
      <TextInput
        multiline
        editable={valueDropdownType === null ? false : true}
        placeholder="(Max. 1000 Characters)"
        maxLength={1000}
        textAlignVertical="top"
        autoComplete="off"
        autoCorrect={false}
        style={styles.board(valueDropdownType === null ? true : false)}
        onChangeText={text => {
          setAttachment({...attachment, desc: text});
        }}>
        <Text style={{lineHeight: 20}}>{attachment.desc}</Text>
      </TextInput>
      <Gap height={16} />
      <EditActionButton
        disableSaveButton={
          attachment.type === null ||
          (attachment.type === 'File' && attachment.source.length === 0) ||
          (attachment.type === 'Link' && attachment.link.length === 0) ||
          attachment.desc.length === 0
        }
        onDiscardPress={onDiscard}
        onSavePress={() => {
          // let newAttachment = {...attachment};
          // newAttachment.uploadedDate = dateToText(new Date());
          onSave(attachment);
        }}
      />
    </>
  );
};

export default AddAdditionalAttachmentField;

const styles = StyleSheet.create({
  fieldTitle: {
    marginBottom: 8,
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    lineHeight: 17,
  },
  field: disabled => ({
    backgroundColor: disabled ? colors.divider : colors.white,
    paddingHorizontal: 12,
    paddingVertical: 1.5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 32,
  }),
  titleInput: {
    padding: 0,
    fontFamily: fonts.secondary[400],
    fontSize: 16,
    color: colors.text.primary,
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderRadius: 32,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  dropdownCore: {borderWidth: 0, minHeight: 0, height: 32},
  dropdownModalTitle: {
    fontFamily: fonts.secondary[500],
    fontSize: 16,
    lineHeight: 20,
    color: colors.text.primary,
    marginLeft: -10,
  },
  dropdownListItemLabel: {
    fontFamily: fonts.secondary[400],
    fontSize: 16,
    lineHeight: 20,
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
  },
  dropdownPlaceholder: {
    color: colors.text.tertiary,
    fontFamily: fonts.secondary[400],
    fontSize: 16,
    lineHeight: 20,
  },
  filePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: colors.primary2,
    borderRadius: 32,
  },
  filePickerButtonText: {
    fontFamily: fonts.secondary[600],
    fontSize: 16,
    lineHeight: 22,
    color: colors.primary2,
  },
  fileNameText: {
    flex: 1,
    marginRight: 12,
    fontFamily: fonts.primary[400],
    fontSize: 16,
    lineHeight: 25.6,
    color: colors.text.tertiary2,
  },
  board: disabled => ({
    backgroundColor: disabled ? colors.divider : colors.white,
    height: 175,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
    fontFamily: fonts.primary[400],
    fontSize: 16,
    color: colors.text.primary,
  }),
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.alert,
    borderRadius: 32,
  },
  removeButtonText: {
    fontFamily: fonts.secondary[600],
    fontSize: 12,
    lineHeight: 16,
    color: colors.alert,
  },
});
