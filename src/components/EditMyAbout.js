import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput} from 'react-native';
import EditActionButton from '../components/EditActionButton';
import {EditAboutAPI} from '../config/RequestAPI/UserAPI';
import {colors} from '../utils/ColorsConfig/Colors';
import fonts from '../utils/FontsConfig/Fonts';
import Gap from './Gap';
import LoadingProcessFull from './LoadingProcessFull';
import ModalMessage from './ModalMessage';

const EditMyAbout = ({
  userToken,
  openModalDiscardReff,
  text,
  onSavePress = () => {},
  onDiscardPress,
}) => {
  const [newText, setNewText] = useState(text !== undefined ? text : '');
  const [messageDiscardEditModalVisible, setMessageDiscardEditModalVisible] =
    useState(false);
  const [messageSuccessModalVisible, setMessageSuccessModalVisible] =
    useState(false);
  const [loading, setLoading] = useState({
    visible: false,
    message: 'Please wait',
  });
  const [messageModal, setMessageModal] = useState({
    visible: false,
    message: undefined,
    title: undefined,
    type: 'smile',
    onClose: () => {},
  });
  const [edited, setEdited] = useState(false);

  const handleEditAbout = () => {
    setLoading({...loading, visible: true});
    EditAboutAPI(userToken, newText).then(res => {
      setLoading({...loading, visible: false});
      if (res.status === 'SUCCESS') {
        setMessageSuccessModalVisible(true);
      } else if (
        res.status === 'SOMETHING_WRONG' ||
        res.status === 'FAILED' ||
        res.status === 'SERVER_ERROR'
      ) {
        setMessageModal({
          ...messageModal,
          visible: true,
          title: 'Failed',
          message: res.message,
          type: 'confused',
        });
      }
    });
  };

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
    <>
      <Text style={styles.title}>
        Descrioption<Text style={{...styles.title, color: 'red'}}>*</Text>
      </Text>
      <Gap height={8} />
      <TextInput
        multiline
        textAlignVertical="top"
        autoCorrect={false}
        style={styles.board}
        onChangeText={text => {
          setNewText(text);
          stateEdited();
        }}>
        <Text style={{lineHeight: 22}}>{newText}</Text>
      </TextInput>
      <Gap height={24} />
      <EditActionButton
        disableSaveButton={!edited}
        onDiscardPress={() => discard()}
        onSavePress={() => handleEditAbout()}
      />

      <LoadingProcessFull visible={loading.visible} message={loading.message} />

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
            You have <Text style={styles.customMessageStyle}>updated</Text>{' '}
            about yourself!
          </Text>
        }
        withBackButton
        onBack={() => {
          setMessageSuccessModalVisible(false);
          onSavePress(newText);
        }}
        onRequestClose={() => {
          setMessageSuccessModalVisible(false);
          onSavePress(newText);
        }}
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
    </>
  );
};

export default EditMyAbout;

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    lineHeight: 17,
    color: colors.text.primary,
  },
  board: {
    height: 175,
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
    color: colors.success,
  },
});
