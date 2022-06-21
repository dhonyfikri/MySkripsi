import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {colors} from '../utils/ColorsConfig/Colors';
import fonts from '../utils/FontsConfig/Fonts';
import Divider from './Divider';
import Gap from './Gap';
import {windowHeight} from './WindowDimensions';

const DetailIdeaDesc = props => {
  return (
    <View>
      <View style={styles.imageWrap}>
        <Image source={{uri: props?.image?.uri}} style={styles.imageContent} />
      </View>
      <Gap height={10} />
      <Text style={styles.h2}>Title Idea</Text>
      <Divider stroke={1} />
      <Text style={styles.text(false)}>{props.title}</Text>
      <Text style={styles.h2}>Description</Text>
      <Divider stroke={1} />
      <Text style={styles.text(true)}>{props.desc}</Text>
    </View>
  );
};

export default DetailIdeaDesc;
const styles = StyleSheet.create({
  text: isLast => ({
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: isLast ? 0 : 16,
    textAlign: 'justify',
    fontFamily: fonts.primary[400],
    lineHeight: 22,
  }),
  h2: {
    fontFamily: fonts.secondary[500],
    fontSize: 16,
    lineHeight: 25.6,
    color: colors.text.primary,
  },
  imageWrap: {
    borderWidth: 0,
    borderRadius: 10,
    marginBottom: 10,
  },
  imageContent: {
    width: '100%',
    height: windowHeight / 3.5,
    borderRadius: 10,
    resizeMode: 'cover',
  },
});
