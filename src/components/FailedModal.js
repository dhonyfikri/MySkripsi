import {
  Image,
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import style from '../config/Style/style.cfg';
import {useState} from 'react/cjs/react.development';

const FailedModal = props => {
  const [visible, setVisible] = useState(true);
  const [data, setData] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
      props.getData(data);
    }, 3000);
  }, []);
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        // props.navigation.pop();
      }}>
      <View style={styles.centeredView}>
        <View style={styles.centeredcontainer}>
          <View style={styles.modalView}>
            <View style={styles.inputContainer}>
              <Image
                source={require('../assets/gif/failed.gif')}
                style={{width: 140, height: 140}}
              />
              <Text style={[style.h2, {color: '#D31A15'}]}>FAILED</Text>
              <Text style={[style.h4, {marginTop: 20, textAlign: 'center'}]}>
                {props.desc}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FailedModal;

const styles = StyleSheet.create({
  centeredcontainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '70%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
