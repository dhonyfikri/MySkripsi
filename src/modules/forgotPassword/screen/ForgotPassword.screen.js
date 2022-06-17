import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../components/Header';
import {colors} from '../../../utils/ColorsConfig/Colors';

const ForgorPassword = ({navigation, route}) => {
  const [email, setEmail] = useState('');
  const [invalidEmail, setInvalidEmail] = useState(true);

  const handleSumbit = () => {
    email === '' ? setInvalidEmail(false) : setInvalidEmail(true);
    if (email !== '') {
      alert('Email has been sent to your email');
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <StatusBar backgroundColor={colors.secondary} barStyle="dark-content" />
      <Header
        backButton
        onBackPress={() => navigation.goBack()}
        backText="Back"
        withNotification={false}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{alignItems: 'center', marginBottom: 24}}>
            <Image
              source={require('../../../assets/image/logo-ideabox.png')}
              style={styles.logo}
            />
          </View>
          <Text style={styles.headerMain}>Forgot Password?</Text>
          <Text style={styles.subHeader}>
            Don’t worry, fill your email and we’ll send you a link to reset your
            password.
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.labelForm}>
            {' '}
            Email <Text style={{color: 'red'}}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="type your email"
            onChange={text => setEmail(text)}
          />
          <Text style={[styles.invalid, {opacity: invalidEmail ? 0 : 1}]}>
            Incorrect Email
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSumbit}>
          <Text style={styles.getstarted}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: colors.white,
  },
  header: {
    marginTop: 32,
  },
  headerMain: {
    fontWeight: '500',
    fontSize: 24,
    lineHeight: 33.6,
    color: 'black',
    fontFamily: 'Poppins-Medium',
    marginBottom: 4,
  },
  subHeader: {
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 26,
    color: '#1A1A1A',
    opacity: 0.71,
  },
  inputContainer: {
    marginTop: 24,
  },

  labelForm: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 20,
    color: 'black',
    marginLeft: -3,
  },
  input: {
    height: 50,
    borderWidth: 1,
    padding: 10,
    borderColor: '#BDBDBD',
    borderRadius: 5,
    marginHorizontal: 0,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 17,
    marginBottom: 0,
  },
  invalid: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 15,
    color: '#EE4443',
    marginTop: 4,
  },
  button: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 52,
    borderRadius: 5,
    backgroundColor: '#5F49D2',
    marginBottom: 20,
    marginTop: 16,
  },
  getstarted: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default ForgorPassword;
