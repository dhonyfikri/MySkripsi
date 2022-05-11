import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {IcDotThree} from '../assets/icon';
import {colors} from '../utils/ColorsConfig/Colors';
import fonts from '../utils/FontsConfig/Fonts';
import Gap from './Gap';

const CardSubmittedIdea = ({
  ideaName,
  ownerName,
  createdDate,
  onDotThreePress,
}) => {
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={styles.ideaName}>{ideaName}</Text>
        <Gap width={8} />
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={onDotThreePress}>
          <IcDotThree />
        </TouchableOpacity>
      </View>
      <Gap height={12} />
      <View style={styles.detailContainer}>
        <View style={styles.detailTextWrapper}>
          <Text style={styles.titleDetail}>Created by</Text>
          <Gap width={16} />
          <View
            style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.valueDetail}>
              {ownerName}
            </Text>
          </View>
        </View>
        <Gap height={16} />
        <View style={styles.detailTextWrapper}>
          <Text style={styles.titleDetail}>Created date</Text>
          <Gap width={16} />
          <View
            style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.valueDetail}>
              {createdDate}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CardSubmittedIdea;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: colors.dot,
    borderRadius: 16,
  },
  ideaName: {
    flex: 1,
    fontFamily: fonts.secondary[700],
    fontSize: 16,
    lineHeight: 25.6,
    color: colors.text.primary,
  },
  detailContainer: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  detailTextWrapper: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  titleDetail: {
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    lineHeight: 15,
    color: colors.text.primary,
  },
  valueDetail: {
    fontFamily: fonts.secondary[600],
    fontSize: 12,
    lineHeight: 15,
    color: colors.text.primary,
  },
});
