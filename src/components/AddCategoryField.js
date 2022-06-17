import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import DropDownPicker from 'react-native-dropdown-picker';
import {IcChevronDown, IcOutlinedClose} from '../assets/icon';
import {colors} from '../utils/ColorsConfig/Colors';
import {dateToText} from '../utils/DateConfig/DateConvert';
import fonts from '../utils/FontsConfig/Fonts';
import EditActionButton from './EditActionButton';
import Gap from './Gap';
import ModalMessage from './ModalMessage';

const CheckBoxItem = ({
  title,
  isHeader,
  isChecked,
  require,
  onPress = () => {},
}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <BouncyCheckbox
        size={20}
        fillColor={colors.primary}
        unfillColor={colors.white}
        disableBuiltInState
        iconStyle={{
          borderColor: isChecked ? colors.primary : colors.divider,
          borderRadius: 6,
          marginRight: -15,
        }}
        onPress={onPress}
        isChecked={isChecked}
        style={{
          marginRight: 0,
          alignSelf: 'flex-end',
        }}
      />
      <Gap width={8} />
      <Text
        style={{
          flex: 1,
          fontFamily: isHeader ? fonts.secondary[600] : fonts.secondary[400],
          fontSize: 14,
          lineHeight: 20,
          color: colors.text.primary,
        }}>
        {title}
        {require && <Text style={{color: colors.reject}}> *</Text>}
      </Text>
    </View>
  );
};

const AddCategoryField = ({
  mainCategoryList,
  categoryTypeItem,
  mainCategoryItem,
  onDiscardPress,
  onSave = () => {},
}) => {
  const [messageDiscardEditModalVisible, setMessageDiscardEditModalVisible] =
    useState(false);

  const [categoryName, setCategoryName] = useState('');
  const [openDropdownCategoryType, setOpenDropdownCategoryType] =
    useState(false);
  const [valueDropdownCategoryType, setValueDropdownCategoryType] =
    useState(null);
  const [itemsDropdownCategoryType, setItemsDropdownCategoryType] =
    useState(categoryTypeItem);

  const [openDropdownMainCategory, setOpenDropdownMainCategory] =
    useState(false);
  const [valueDropdownMainCategory, setValueDropdownMainCategory] =
    useState(null);
  const [itemsDropdownMainCategory, setItemsDropdownMainCategory] =
    useState(mainCategoryItem);

  const [requiredCategory, setRequiredCategory] = useState(true);

  const [isEdited, setIsEdited] = useState(false);

  const handleEdited = () => {
    if (!isEdited) {
      setIsEdited(true);
    }
  };

  const disableCategoryNameInput =
    valueDropdownCategoryType === null ||
    (valueDropdownCategoryType === '2' && valueDropdownMainCategory === null);

  return (
    <>
      {/* dropdown category type */}
      <Text style={styles.fieldTitle}>Category Type</Text>
      <DropDownPicker
        open={openDropdownCategoryType}
        value={valueDropdownCategoryType}
        items={itemsDropdownCategoryType}
        setOpen={setOpenDropdownCategoryType}
        setValue={setValueDropdownCategoryType}
        setItems={setItemsDropdownCategoryType}
        placeholder="Choose Category Type"
        onChangeValue={() => {
          setValueDropdownMainCategory(null);
          handleEdited();
        }}
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
        modalTitle="Team Structure"
        modalTitleStyle={styles.dropdownModalTitle}
        listItemLabelStyle={styles.dropdownListItemLabel}
        modalContentContainerStyle={styles.dropdownModalContentContainer}
        labelStyle={styles.dropdownLabel}
        placeholderStyle={styles.dropdownPlaceholder}
      />
      <Gap height={16} />

      {valueDropdownCategoryType === '2' && (
        <>
          {/* dropdown main category */}
          <Text style={styles.fieldTitle}>Main Category</Text>
          <DropDownPicker
            open={openDropdownMainCategory}
            value={valueDropdownMainCategory}
            items={itemsDropdownMainCategory}
            setOpen={setOpenDropdownMainCategory}
            setValue={setValueDropdownMainCategory}
            setItems={setItemsDropdownMainCategory}
            placeholder="Choose Main Category"
            onChangeValue={() => handleEdited()}
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
            modalTitle="Team Structure"
            modalTitleStyle={styles.dropdownModalTitle}
            listItemLabelStyle={styles.dropdownListItemLabel}
            modalContentContainerStyle={styles.dropdownModalContentContainer}
            labelStyle={styles.dropdownLabel}
            placeholderStyle={styles.dropdownPlaceholder}
          />
          <Gap height={16} />
        </>
      )}

      <Text style={styles.fieldTitle}>
        Category Name<Text style={{color: colors.reject}}>*</Text>
      </Text>
      <View style={styles.field(disableCategoryNameInput)}>
        <TextInput
          editable={!disableCategoryNameInput}
          style={styles.titleInput}
          placeholder="Name Of Category"
          onChangeText={text => {
            setCategoryName(text);
            handleEdited();
          }}>
          <Text style={{...styles.titleInput, lineHeight: 20}}>
            {categoryName}
          </Text>
        </TextInput>
      </View>
      <Gap height={16} />
      <CheckBoxItem
        title="Required to be filled"
        isChecked={requiredCategory}
        onPress={() => {
          setRequiredCategory(!requiredCategory);
          handleEdited();
        }}
        require
      />
      <Gap height={16} />
      <EditActionButton
        disableSaveButton={
          disableCategoryNameInput || categoryName.trim().length === 0
        }
        onDiscardPress={() => {
          if (isEdited) {
            setMessageDiscardEditModalVisible(true);
          } else {
            onDiscardPress();
          }
        }}
        onSavePress={() => {
          onSave({
            id: Math.floor(
              Math.random() * Math.floor(Math.random() * Date.now()),
            ),
            categoryName: categoryName,
            type: valueDropdownCategoryType,
            parentId:
              valueDropdownMainCategory !== null
                ? valueDropdownMainCategory
                : '0',
            required: requiredCategory,
            status: '1',
            createdDate: dateToText(new Date()),
            updatedDate: dateToText(new Date()),
          });
        }}
      />

      {/* modal discard confirmation message */}
      <ModalMessage
        visible={messageDiscardEditModalVisible}
        withIllustration
        illustrationType="confused"
        message="Are you sure want to leave this page? You will lose all unsaved progress."
        withCancelButton
        withConfirmButton
        onCancel={() => setMessageDiscardEditModalVisible(false)}
        onConfirm={() => {
          setMessageDiscardEditModalVisible(false);
          onDiscardPress();
        }}
        onRequestClose={() => setMessageDiscardEditModalVisible(false)}
      />
    </>
  );
};

export default AddCategoryField;

const styles = StyleSheet.create({
  fieldTitle: {
    marginBottom: 8,
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    lineHeight: 17,
  },
  field: (disable = false) => ({
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 32,
    backgroundColor: disable ? colors.divider : colors.white,
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
  dropdownCore: {borderWidth: 0, minHeight: 0, height: 38},
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
});
