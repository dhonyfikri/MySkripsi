import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Slider from '@react-native-community/slider';
import {colors} from '../utils/ColorsConfig/Colors';
import fonts from '../utils/FontsConfig/Fonts';
import Gap from './Gap';

const CardSlideDoubleValueSetter = ({
  tingkatHierarki = 0,
  titleLeft = 'value1',
  titleRight = 'value2',
  value = -8,
  onValueChange = () => {},
}) => {
  let valueLeft = 0;
  let valueRight = 0;
  if (value === 0) {
    valueLeft = 1;
    valueRight = 1;
  } else if (value < 0) {
    valueLeft = parseFloat((1 / (value * -1 + 1)).toFixed(3));
    valueRight = value * -1 + 1;
  } else {
    valueLeft = value + 1;
    valueRight = parseFloat((1 / (value + 1)).toFixed(3));
  }
  return (
    <View
      style={{
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: colors.secondary,
        borderRadius: 8,
        marginRight: 40 * tingkatHierarki,
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text
          style={{
            fontFamily: fonts.secondary[500],
            fontSize: 15,
            color: colors.text.primary,
          }}>
          {titleLeft}
        </Text>
        <Gap width={16} />
        <Text
          style={{
            fontFamily: fonts.secondary[500],
            fontSize: 15,
            color: colors.text.primary,
          }}>
          {titleRight}
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            backgroundColor:
              tingkatHierarki === 0 ? colors.primary : colors.success,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 4,
            borderRadius: 8,
            width: 60,
            height: 30,
          }}>
          <Text
            style={{
              fontFamily: fonts.secondary[500],
              fontSize: 15,
              color: colors.white,
            }}>
            {valueLeft}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Slider
            value={value}
            style={{
              width: '100%',
              height: 20,
              padding: 0,
            }}
            thumbTintColor={colors.pending}
            minimumValue={-8}
            step={1}
            maximumValue={8}
            minimumTrackTintColor={
              tingkatHierarki === 0 ? colors.primary : colors.success
            }
            maximumTrackTintColor={
              tingkatHierarki === 0 ? colors.reject : colors.danger
            }
            onValueChange={res => onValueChange(res)}
          />
        </View>
        <View
          style={{
            backgroundColor:
              tingkatHierarki === 0 ? colors.primary : colors.success,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 4,
            borderRadius: 8,
            width: 60,
            height: 30,
          }}>
          <Text
            style={{
              fontFamily: fonts.secondary[500],
              fontSize: 15,
              color: colors.white,
            }}>
            {valueRight}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CardSlideDoubleValueSetter;

const styles = StyleSheet.create({});
