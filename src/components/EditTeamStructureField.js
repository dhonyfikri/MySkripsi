import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {IcChevronDown, IcOutlinedClose} from '../assets/icon';
import {colors} from '../utils/ColorsConfig/Colors';
import fonts from '../utils/FontsConfig/Fonts';
import EditActionButton from './EditActionButton';
import Gap from './Gap';

const EditTeamStructureField = ({
  teamName,
  teamStructureItem,
  selectedTeamStructure = null,
  onDiscardPress,
  onSave = () => {},
}) => {
  const [name, setName] = useState(teamName);
  const [openDropdownTeamStructure, setOpenDropdownTeamStructure] =
    useState(false);
  const [valueDropdownTeamStructure, setValueDropdownTeamStructure] = useState(
    selectedTeamStructure,
  );
  const [itemsDropdownTeamStructure, setItemsDropdownTeamStructure] =
    useState(teamStructureItem);

  return (
    <>
      <Text style={styles.fieldTitle}>Team Name</Text>
      <View style={styles.field}>
        <TextInput
          editable={false}
          style={styles.titleInput}
          placeholder="Nama"
          onChangeText={text => {
            setName(text);
          }}>
          <Text style={{...styles.titleInput, lineHeight: 20}}>{name}</Text>
        </TextInput>
      </View>
      <Gap height={16} />
      {/* dropdown team structure */}
      <Text style={styles.fieldTitle}>
        Team Structure<Text style={{color: colors.reject}}>*</Text>
      </Text>
      <DropDownPicker
        open={openDropdownTeamStructure}
        value={valueDropdownTeamStructure}
        items={itemsDropdownTeamStructure}
        setOpen={setOpenDropdownTeamStructure}
        setValue={setValueDropdownTeamStructure}
        setItems={setItemsDropdownTeamStructure}
        placeholder="Choose"
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
      <EditActionButton
        disableSaveButton={
          // name?.trim().length <= 0 ||
          valueDropdownTeamStructure === null
        }
        onDiscardPress={onDiscardPress}
        onSavePress={() => {
          onSave(name, valueDropdownTeamStructure);
        }}
      />
    </>
  );
};

export default EditTeamStructureField;

const styles = StyleSheet.create({
  fieldTitle: {
    marginBottom: 8,
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    lineHeight: 17,
  },
  field: {
    paddingHorizontal: 12,
    paddingVertical: 1.5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 32,
    backgroundColor: colors.white,
  },
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
});
