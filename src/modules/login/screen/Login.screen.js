import CheckBox from '@react-native-community/checkbox';
import React, {useState} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LoadingProcessFull from '../../../components/LoadingProcessFull';
import ModalMessage from '../../../components/ModalMessage';
import {LoginAPI} from '../../../config/RequestAPI/LoginAPI';
import {storeAsyncStorageObject} from '../../../utils/AsyncStorage/StoreAsyncStorage';
import {colors} from '../../../utils/ColorsConfig/Colors';
// import styles from '../style/Login.style';

const Login = ({navigation, route}) => {
  let _toggleCheckBox = false;
  if (route.params !== undefined && route.params.checked !== undefined) {
    _toggleCheckBox = route.params.checked;
  }

  const [toggleCheckBox, setToggleCheckBox] = useState(_toggleCheckBox);
  const [loading, setLoading] = useState({visible: false, message: undefined});
  const [messageModal, setMessageModal] = useState({
    visible: false,
    message: undefined,
    title: undefined,
    type: 'smile',
    onClose: () => {},
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalidEmail, setInvalidEmail] = useState(true);
  const [invalidPassword, setInvalidPassword] = useState(true);

  const handleSignIn = () => {
    email.trim() === '' ? setInvalidEmail(false) : setInvalidEmail(true);
    password.trim() === ''
      ? setInvalidPassword(false)
      : setInvalidPassword(true);
    if (email.trim() !== '' && password.trim() !== '') {
      setLoading({...loading, visible: true});
      LoginAPI(email, password, toggleCheckBox).then(res => {
        setLoading({...loading, visible: false});
        if (res.status === 'SUCCESS') {
          storeAsyncStorageObject('@USER_TOKEN', res.data).then(() => {
            navigation.replace('TabNavigation', {userToken: res.data});
          });
        } else if (
          res.status === 'SOMETHING_WRONG' ||
          res.status === 'USER_NOT_FOUND' ||
          res.status === 'UNAUTHORIZED' ||
          res.status === 'INVALID_EMAIL' ||
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
    }
  };

  const handleSignUp = () => {
    navigation.push('Register');
  };

  const handleForgotPassword = () => {
    navigation.push('ForgotPassword');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('../../../assets/image/logo-ideabox.png')}
          style={styles.logo}
        />
        <Text style={styles.header}>
          Welcome back to {`\n`}
          <Text style={{color: '#5F49D2'}}>Ideabox</Text> Family
        </Text>
        <Text style={styles.subHeader}>Please login to your account</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.titleInput}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="type your email"
          keyboardType="email-address"
          onChangeText={text => {
            setEmail(text);
          }}
        />
        <Text style={[styles.invalid, {opacity: invalidEmail ? 0 : 1}]}>
          Incorrect email
        </Text>
        <Text style={styles.titleInput}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="type your password"
          secureTextEntry={true}
          onChangeText={text => {
            setPassword(text);
          }}
        />
        <Text style={[styles.invalid, {opacity: invalidPassword ? 0 : 1}]}>
          Incorrect Password{' '}
        </Text>
        <View style={styles.buttonContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={newValue => setToggleCheckBox(newValue)}
              onCheckColor="red"
            />
            <Text
              style={[
                styles.sideButtonContainer,
                {
                  color: '#1A1A1A',
                  fontFamily: 'Poppins-Regular',
                },
              ]}>
              Remember Me
            </Text>
          </View>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text
              style={[
                styles.sideButtonContainer,
                {color: '#7C4BFF', fontFamily: 'Poppins-SemiBold'},
              ]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.getstarted}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.bottomText}>
          Dont't have an account?
          <Text
            style={{fontFamily: 'LeagueSpartan-SemiBold', color: '#7C4BFF'}}
            onPress={handleSignUp}>
            {' '}
            Register
          </Text>
        </Text>
      </View>
      <LoadingProcessFull visible={loading.visible} message={loading.message} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  header: {
    alignItems: 'center',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    fontSize: 24,
    lineHeight: 33.6,
    color: 'black',
    marginTop: 24.03,
  },
  subHeader: {
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: '#1A1A1A',
    opacity: 0.71,
    marginTop: 4,
  },
  inputContainer: {
    marginTop: 12,
    marginHorizontal: 16,
  },
  titleInput: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 20,
    color: 'black',
    marginTop: 12,
  },
  input: {
    height: 47,
    marginTop: 4,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: '#BDBDBD',
    marginHorizontal: 0,
    borderRadius: 8,
    fontFamily: 'Poppins-Regular',
  },
  invalid: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 15,
    color: '#EE4443',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 9,
    marginBottom: 0,
  },
  sideButtonContainer: {
    fontSize: 14,
    lineHeight: 17,
  },
  button: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 52,
    width: 358,
    borderRadius: 5,
    backgroundColor: '#5F49D2',
    marginTop: 39,
    marginHorizontal: 0,
  },
  getstarted: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  bottomText: {
    fontFamily: 'LeagueSpartan-Regular',
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 32,
    color: '#1A1A1A',
  },
});

export default Login;
