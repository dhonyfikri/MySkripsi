import DateTimePicker from '@react-native-community/datetimepicker';
import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import {
  IcCalendar,
  IcCamera,
  IcChevronDown,
  IcOutlinedClose,
} from '../assets/icon';
import {colors} from '../utils/ColorsConfig/Colors';
import {dateToText, textToDate} from '../utils/DateConfig/DateConvert';
import fonts from '../utils/FontsConfig/Fonts';
import Gap from './Gap';
import ModalMessage from './ModalMessage';
import EditActionButton from './EditActionButton';
import {InitialIcon} from './InitialIcon';
import {
  TeamStructureData,
  UnitData,
  WorkingLocationData,
} from '../utils/SupportData/SupportData';
import _ from 'lodash';

const EditMyProfile = ({
  openModalDiscardReff,
  profileData,
  onSavePress = () => {},
  onDiscardPress = () => {},
}) => {
  const [currentProfileData, setCurrentProfileData] = useState(profileData);
  const [photoProfileChanged, setPhotoProfileChanged] = useState(false);
  const [disableSaveButton, setDisableSaveButton] = useState(true);
  const [messageDiscardEditModalVisible, setMessageDiscardEditModalVisible] =
    useState(false);
  const [messageSuccessModalVisible, setMessageSuccessModalVisible] =
    useState(false);
  const [edited, setEdited] = useState(false);

  const [focusedInput, setFocusedInput] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [openDropdownWorkingLocation, setOpenDropdownWorkingLocation] =
    useState(false);
  const [valueDropdownWorkingLocation, setValueDropdownWorkingLocation] =
    useState(profileData.workingLocation);
  const [itemsDropdownWorkingLocation, setItemsDropdownWorkingLocation] =
    useState(_.cloneDeep(WorkingLocationData));

  const [openDropdownTeamStructure, setOpenDropdownTeamStructure] =
    useState(false);
  const [valueDropdownTeamStructure, setValueDropdownTeamStructure] = useState(
    profileData.teamStructure,
  );
  const [itemsDropdownTeamStructure, setItemsDropdownTeamStructure] = useState(
    _.cloneDeep(TeamStructureData),
  );

  const [openDropdownUnit, setOpenDropdownUnit] = useState(false);
  const [valueDropdownUnit, setValueDropdownUnit] = useState(profileData.unit);
  const [itemsDropdownUnit, setItemsDropdownUnit] = useState(
    _.cloneDeep(UnitData),
  );

  const takeProfilePhotoFromLibrary = () => {
    ImageCropPicker.openPicker({
      width: 80 * 4,
      height: 80 * 4,
      mediaType: 'photo',
      cropping: true,
    }).then(image => {
      console.log(image);
      if (image.size <= 1000000000) {
        setCurrentProfileData({
          ...currentProfileData,
          pictures: {uri: image.path},
        });
        setPhotoProfileChanged(true);
        stateEdited();
      }
    });
  };

  const _onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'set') {
      const currentDate = selectedDate || new Date();

      const tempDate = new Date(currentDate);
      const fullDate = dateToText(tempDate);

      setCurrentProfileData({...currentProfileData, tglLahir: fullDate});
      stateEdited();
    }
  };

  const save = () => {
    const newProfileData = {
      ...currentProfileData,
      workingLocation: valueDropdownWorkingLocation,
      teamStructure: valueDropdownTeamStructure,
      unit: valueDropdownUnit,
    };
    onSavePress(newProfileData, photoProfileChanged);
  };

  useEffect(() => {
    let disableSave = false;
    if (
      currentProfileData.name?.trim().length === 0 ||
      currentProfileData.nik?.trim().length === 0 ||
      currentProfileData.noTelp?.trim().length === 0 ||
      currentProfileData.tglLahir?.trim().length === 0 ||
      currentProfileData.pekerjaan?.trim().length === 0
    ) {
      disableSave = true;
    }
    if (disableSaveButton !== disableSave) {
      setDisableSaveButton(disableSave);
    }
  }, [currentProfileData]);

  // cek perubahan state dropdown
  useEffect(() => {
    if (valueDropdownWorkingLocation !== profileData.workingLocation) {
      stateEdited();
    }
    if (valueDropdownTeamStructure !== profileData.teamStructure) {
      stateEdited();
    }
    if (valueDropdownUnit !== profileData.unit) {
      stateEdited();
    }
  }, [
    valueDropdownWorkingLocation,
    valueDropdownTeamStructure,
    valueDropdownUnit,
  ]);

  useEffect(() => {
    if (openModalDiscardReff !== undefined) {
      openModalDiscardReff.current = () => discard();
    }
  }, [edited]);

  const discard = () => {
    if (edited) {
      setMessageDiscardEditModalVisible(true);
    } else {
      onDiscardPress();
    }
  };

  const stateEdited = () => {
    if (!edited) {
      setEdited(true);
    }
  };

  return (
    <View style={{paddingHorizontal: 12}}>
      <Gap height={12} />
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            height: 80,
            width: 80,
            borderRadius: 80 / 2,
            overflow: 'hidden',
          }}>
          <View style={{position: 'absolute', top: 0, left: 0}}>
            <InitialIcon
              width={80}
              height={80}
              name={currentProfileData.name}
              fontSize={40}
            />
          </View>
          <Image
            style={{width: '100%', height: '100%', resizeMode: 'cover'}}
            source={currentProfileData.pictures}
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              padding: 10,
              borderRadius: 50,
              backgroundColor: '#00000044',
            }}
            onPress={() => takeProfilePhotoFromLibrary()}>
            <IcCamera />
          </TouchableOpacity>
        </View>
      </View>
      <Gap height={16} />
      <Text style={styles.title}>
        Full Name <Text style={{...styles.title, color: colors.alert}}>*</Text>
      </Text>
      <View style={styles.field(focusedInput === 'nameField')}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your name"
          onFocus={() => setFocusedInput('nameField')}
          onBlur={() => setFocusedInput('')}
          onChangeText={text => {
            setCurrentProfileData({...currentProfileData, name: text});
            stateEdited();
          }}>
          <Text style={{...styles.textInput, lineHeight: 15}}>
            {currentProfileData.name}
          </Text>
        </TextInput>
      </View>
      <Text style={styles.title}>
        NIP <Text style={{...styles.title, color: colors.alert}}>*</Text>
      </Text>
      <View style={styles.field(focusedInput === 'nipField')}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your employee ID number"
          keyboardType="decimal-pad"
          onFocus={() => setFocusedInput('nipField')}
          onBlur={() => setFocusedInput('')}
          onChangeText={text => {
            setCurrentProfileData({...currentProfileData, nik: text});
            stateEdited();
          }}>
          <Text style={{lineHeight: 15}}>{currentProfileData.nik}</Text>
        </TextInput>
      </View>
      <Text style={styles.title}>
        Phone Number{' '}
        <Text style={{...styles.title, color: colors.alert}}>*</Text>
      </Text>
      <View style={styles.field(focusedInput === 'phoneNumberField')}>
        <TextInput
          style={styles.textInput}
          placeholder="Type your phone number"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          onFocus={() => setFocusedInput('phoneNumberField')}
          onBlur={() => setFocusedInput('')}
          onChangeText={text => {
            setCurrentProfileData({...currentProfileData, noTelp: text});
            stateEdited();
          }}>
          <Text style={{lineHeight: 15}}>{currentProfileData.noTelp}</Text>
        </TextInput>
      </View>
      <Text style={styles.title}>
        Email <Text style={{...styles.title, color: colors.alert}}>*</Text>
      </Text>
      <View style={styles.field(focusedInput === 'emailField')}>
        <TextInput
          editable={false}
          style={styles.textInput}
          placeholder="type your email address"
          keyboardType="email-address"
          textContentType="emailAddress"
          onFocus={() => setFocusedInput('emailField')}
          onBlur={() => setFocusedInput('')}
          onChangeText={text => {
            setCurrentProfileData({...currentProfileData, email: text});
            stateEdited();
          }}>
          <Text style={{lineHeight: 15}}>{currentProfileData.email}</Text>
        </TextInput>
      </View>
      <Text style={styles.title}>
        Birth of Date{' '}
        <Text style={{...styles.title, color: colors.alert}}>*</Text>
      </Text>
      <View style={{...styles.field(false), paddingVertical: 6}}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => setShowDatePicker(true)}>
          <Text
            style={{
              ...styles.textInput,
              lineHeight: 15,
              flex: 1,
            }}>
            {currentProfileData.tglLahir}
          </Text>
          <Gap width={4} />
          <IcCalendar />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>
        Job Title <Text style={{...styles.title, color: colors.alert}}>*</Text>
      </Text>
      <View style={styles.field(focusedInput === 'jobTitleField')}>
        <TextInput
          style={styles.textInput}
          placeholder="type your job title"
          onFocus={() => setFocusedInput('jobTitleField')}
          onBlur={() => setFocusedInput('')}
          onChangeText={text => {
            setCurrentProfileData({...currentProfileData, pekerjaan: text});
            stateEdited();
          }}>
          <Text style={{lineHeight: 15}}>{currentProfileData.pekerjaan}</Text>
        </TextInput>
      </View>
      {/* dropdown working location */}
      <Text style={styles.title}>
        Working Location{' '}
        <Text style={{...styles.title, color: colors.alert}}>*</Text>
      </Text>
      <DropDownPicker
        open={openDropdownWorkingLocation}
        value={valueDropdownWorkingLocation}
        items={itemsDropdownWorkingLocation}
        setOpen={setOpenDropdownWorkingLocation}
        setValue={setValueDropdownWorkingLocation}
        setItems={setItemsDropdownWorkingLocation}
        placeholder="Select Location"
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
        modalTitle="Work Location"
        modalTitleStyle={styles.dropdownModalTitle}
        listItemLabelStyle={styles.dropdownListItemLabel}
        modalContentContainerStyle={styles.dropdownModalContentContainer}
        labelStyle={styles.dropdownLabel}
        placeholderStyle={styles.dropdownPlaceholder}
      />
      {/* dropdown team structure */}
      <Text style={styles.title}>
        Team Structure{' '}
        <Text style={{...styles.title, color: colors.alert}}>*</Text>
      </Text>
      <DropDownPicker
        open={openDropdownTeamStructure}
        value={valueDropdownTeamStructure}
        items={itemsDropdownTeamStructure}
        setOpen={setOpenDropdownTeamStructure}
        setValue={setValueDropdownTeamStructure}
        setItems={setItemsDropdownTeamStructure}
        placeholder="Select Structure"
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
        modalTitle="Team Structure"
        modalTitleStyle={styles.dropdownModalTitle}
        listItemLabelStyle={styles.dropdownListItemLabel}
        modalContentContainerStyle={styles.dropdownModalContentContainer}
        labelStyle={styles.dropdownLabel}
        placeholderStyle={styles.dropdownPlaceholder}
      />
      {/* dropdown unit */}
      <Text style={styles.title}>
        Unit <Text style={{...styles.title, color: colors.alert}}>*</Text>
      </Text>
      <DropDownPicker
        open={openDropdownUnit}
        value={valueDropdownUnit}
        items={itemsDropdownUnit}
        setOpen={setOpenDropdownUnit}
        setValue={setValueDropdownUnit}
        setItems={setItemsDropdownUnit}
        placeholder="Select Unit"
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
        modalTitle="Unit"
        modalTitleStyle={styles.dropdownModalTitle}
        listItemLabelStyle={styles.dropdownListItemLabel}
        modalContentContainerStyle={styles.dropdownModalContentContainer}
        labelStyle={styles.dropdownLabel}
        placeholderStyle={styles.dropdownPlaceholder}
      />
      <Text style={styles.title}>
        Role <Text style={{...styles.title, color: colors.alert}}>*</Text>
      </Text>
      <View
        style={{
          ...styles.field(focusedInput === 'role'),
          backgroundColor: colors.divider,
        }}>
        <TextInput
          style={styles.textInput}
          placeholder="Your role"
          editable={false}>
          <Text style={{lineHeight: 15}}>
            {currentProfileData.roleId === '1'
              ? 'Admin'
              : currentProfileData.roleId === '2'
              ? 'Innovator'
              : currentProfileData.roleId === '3'
              ? 'Innovation Manager'
              : 'Unknown'}
          </Text>
        </TextInput>
      </View>
      <Gap height={4} />
      <Text style={styles.noticeText}>* Indicates required</Text>
      <Gap height={24} />
      <EditActionButton
        disableSaveButton={disableSaveButton || !edited}
        onDiscardPress={() => discard()}
        onSavePress={() => setMessageSuccessModalVisible(true)}
      />
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          maximumDate={new Date()}
          value={
            currentProfileData.tglLahir !== undefined &&
            currentProfileData.tglLahir !== null &&
            currentProfileData.tglLahir !== ''
              ? textToDate(currentProfileData.tglLahir)
              : new Date()
          }
          mode="date"
          display="calendar"
          onChange={_onDateChange}
        />
      )}

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

      {/* modal success message */}
      <ModalMessage
        visible={messageSuccessModalVisible}
        withIllustration
        illustrationType="smile"
        title="Success"
        message={
          <Text
            style={{...styles.customMessageStyle, color: colors.text.primary}}>
            You have <Text style={styles.customMessageStyle}>updated</Text> your
            personal information!
          </Text>
        }
        withBackButton
        onBack={() => {
          setMessageSuccessModalVisible(false);
          save();
        }}
        onRequestClose={() => {
          setMessageSuccessModalVisible(false);
          save();
        }}
      />
    </View>
  );
};

export default EditMyProfile;

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    lineHeight: 17,
    color: colors.text.primary,
    marginBottom: 8,
  },
  field: focused => ({
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: focused ? colors.primary : colors.border,
    borderRadius: 32,
    marginBottom: 12,
  }),
  textInput: {
    paddingVertical: 0,
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    color: colors.text.primary,
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderRadius: 32,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 12,
  },
  dropdownCore: {borderWidth: 0, minHeight: 0, height: 29},
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
    fontSize: 12,
    lineHeight: 15,
  },
  dropdownPlaceholder: {
    color: colors.text.tertiary,
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    lineHeight: 15,
  },
  noticeText: {
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    lineHeight: 15,
    color: colors.alert,
  },
  customMessageStyle: {
    fontFamily: fonts.primary[400],
    fontSize: 12,
    lineHeight: 22,
    color: colors.success,
  },
});
