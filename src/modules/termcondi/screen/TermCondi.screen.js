import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Gap from '../../../components/Gap';
import Header from '../../../components/Header';
import MultilineTextViewTermCondi from '../../../components/MultilineTextViewTermCondi';
import {colors} from '../../../utils/ColorsConfig/Colors';
import fonts from '../../../utils/FontsConfig/Fonts';

const TermCondi = ({navigation, route}) => {
  const [activeIndexOfContent, setActiveIndexOfContent] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const handleFadeIn = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleActive = index => {
    if (activeIndexOfContent !== index) {
      setActiveIndexOfContent(index);
      handleFadeIn();
    }
  };

  useEffect(() => {
    handleFadeIn();
  }, []);

  return (
    <View style={styles.page}>
      <Header
        backButton
        onBackPress={() => navigation.goBack()}
        backText="Back"
        title="Terms and Policies"
        onNotificationPress={() => navigation.navigate('Notification')}
      />
      <View style={styles.contentContainer}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tabItem(activeIndexOfContent === 0)}
            onPress={() => toggleActive(0)}>
            <Text
              numberOfLines={2}
              style={styles.tabTitle(activeIndexOfContent === 0)}>
              Terms & Condition
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabItem(activeIndexOfContent === 1)}
            onPress={() => toggleActive(1)}>
            <Text
              numberOfLines={2}
              style={styles.tabTitle(activeIndexOfContent === 1)}>
              Privacy & Policy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabItem(activeIndexOfContent === 2)}
            onPress={() => toggleActive(2)}>
            <Text
              numberOfLines={2}
              style={styles.tabTitle(activeIndexOfContent === 2)}>
              FAQ
            </Text>
          </TouchableOpacity>
        </View>
        <Gap height={16} />
        {activeIndexOfContent === 0 && (
          <Animated.View
            style={{...styles.dataSessionContainer, opacity: fadeAnim}}>
            <Text style={styles.titleBoard}>Terms and Conditions</Text>
            <Gap height={22} />
            <MultilineTextViewTermCondi>
              <Text
                style={{
                  fontFamily: fonts.secondary[700],
                  fontSize: 16,
                  lineHeight: 25.6,
                  color: colors.text.primary,
                }}>
                Lorem Ipsum
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: 14,
                  lineHeight: 17,
                  color: colors.text.primary,
                }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud Lorem Ipsum Lorem
                ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud{' '}
              </Text>
              <Gap height={30} />
              <Text
                style={{
                  fontFamily: fonts.secondary[700],
                  fontSize: 16,
                  lineHeight: 25.6,
                  color: colors.text.primary,
                }}>
                Lorem Ipsum
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: 14,
                  lineHeight: 17,
                  color: colors.text.primary,
                }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud Lorem Ipsum Lorem
                ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud{' '}
              </Text>
              <Gap height={30} />
              <Text
                style={{
                  fontFamily: fonts.secondary[700],
                  fontSize: 16,
                  lineHeight: 25.6,
                  color: colors.text.primary,
                }}>
                Lorem Ipsum
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: 14,
                  lineHeight: 17,
                  color: colors.text.primary,
                }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud Lorem Ipsum Lorem
                ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud{' '}
              </Text>
              <Gap height={30} />
              <Text
                style={{
                  fontFamily: fonts.secondary[700],
                  fontSize: 16,
                  lineHeight: 25.6,
                  color: colors.text.primary,
                }}>
                Lorem Ipsum
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: 14,
                  lineHeight: 17,
                  color: colors.text.primary,
                }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud Lorem Ipsum Lorem
                ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud{' '}
              </Text>
            </MultilineTextViewTermCondi>
          </Animated.View>
        )}
        {activeIndexOfContent === 1 && (
          <Animated.View
            style={{...styles.dataSessionContainer, opacity: fadeAnim}}>
            <Text style={styles.titleBoard}>Privacy and Policy</Text>
            <Gap height={22} />
            <MultilineTextViewTermCondi>
              <Text
                style={{
                  fontFamily: fonts.secondary[700],
                  fontSize: 16,
                  lineHeight: 25.6,
                  color: colors.text.primary,
                }}>
                Lorem Ipsum
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: 14,
                  lineHeight: 17,
                  color: colors.text.primary,
                }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud Lorem Ipsum Lorem
                ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud{' '}
              </Text>
              <Gap height={30} />
              <Text
                style={{
                  fontFamily: fonts.secondary[700],
                  fontSize: 16,
                  lineHeight: 25.6,
                  color: colors.text.primary,
                }}>
                Lorem Ipsum
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: 14,
                  lineHeight: 17,
                  color: colors.text.primary,
                }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud Lorem Ipsum Lorem
                ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud{' '}
              </Text>
              <Gap height={30} />
              <Text
                style={{
                  fontFamily: fonts.secondary[700],
                  fontSize: 16,
                  lineHeight: 25.6,
                  color: colors.text.primary,
                }}>
                Lorem Ipsum
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: 14,
                  lineHeight: 17,
                  color: colors.text.primary,
                }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud Lorem Ipsum Lorem
                ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud{' '}
              </Text>
              <Gap height={30} />
              <Text
                style={{
                  fontFamily: fonts.secondary[700],
                  fontSize: 16,
                  lineHeight: 25.6,
                  color: colors.text.primary,
                }}>
                Lorem Ipsum
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: 14,
                  lineHeight: 17,
                  color: colors.text.primary,
                }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud Lorem Ipsum Lorem
                ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud{' '}
              </Text>
            </MultilineTextViewTermCondi>
          </Animated.View>
        )}
        {activeIndexOfContent === 2 && (
          <Animated.View
            style={{...styles.dataSessionContainer, opacity: fadeAnim}}>
            <Text style={styles.titleBoard}>FAQ</Text>
            <Gap height={22} />
            <MultilineTextViewTermCondi>
              <Text
                style={{
                  fontFamily: fonts.secondary[700],
                  fontSize: 16,
                  lineHeight: 25.6,
                  color: colors.text.primary,
                }}>
                Lorem Ipsum
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: 14,
                  lineHeight: 17,
                  color: colors.text.primary,
                }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud Lorem Ipsum Lorem
                ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud{' '}
              </Text>
              <Gap height={30} />
              <Text
                style={{
                  fontFamily: fonts.secondary[700],
                  fontSize: 16,
                  lineHeight: 25.6,
                  color: colors.text.primary,
                }}>
                Lorem Ipsum
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: 14,
                  lineHeight: 17,
                  color: colors.text.primary,
                }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud Lorem Ipsum Lorem
                ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud{' '}
              </Text>
              <Gap height={30} />
              <Text
                style={{
                  fontFamily: fonts.secondary[700],
                  fontSize: 16,
                  lineHeight: 25.6,
                  color: colors.text.primary,
                }}>
                Lorem Ipsum
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: 14,
                  lineHeight: 17,
                  color: colors.text.primary,
                }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud Lorem Ipsum Lorem
                ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud{' '}
              </Text>
              <Gap height={30} />
              <Text
                style={{
                  fontFamily: fonts.secondary[700],
                  fontSize: 16,
                  lineHeight: 25.6,
                  color: colors.text.primary,
                }}>
                Lorem Ipsum
              </Text>
              <Text
                style={{
                  fontFamily: fonts.secondary[400],
                  fontSize: 14,
                  lineHeight: 17,
                  color: colors.text.primary,
                }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud Lorem Ipsum Lorem
                ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud Lorem ipsum dolor sit amet,
                consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud{' '}
              </Text>
            </MultilineTextViewTermCondi>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export default TermCondi;

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: '#FFFFFF'},
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.tertiary,
    padding: 4,
    borderRadius: 32,
    overflow: 'hidden',
  },
  tabItem: active => ({
    flex: 1,
    backgroundColor: active ? colors.primary : '#00000000',
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  tabTitle: active => ({
    fontFamily: fonts.secondary[600],
    fontSize: 11,
    lineHeight: 15,
    color: active ? colors.white : colors.text.primary,
    textAlign: 'center',
  }),
  dataSessionContainer: {
    backgroundColor: colors.tertiary,
    paddingVertical: 16,
    // paddingHorizontal: 12,
    borderRadius: 16,
    flex: 1,
  },
  titleBoard: {
    fontFamily: fonts.secondary[700],
    fontSize: 16,
    lineHeight: 25.6,
    color: colors.text.primary,
    textAlign: 'center',
  },
});
