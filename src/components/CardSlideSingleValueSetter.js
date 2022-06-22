import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Slider from '@react-native-community/slider';
import {colors} from '../utils/ColorsConfig/Colors';
import fonts from '../utils/FontsConfig/Fonts';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Gap from './Gap';

const CheckBoxBouncy = ({isChecked, onPress = () => {}}) => {
  return (
    <BouncyCheckbox
      size={20}
      fillColor={colors.primary}
      unfillColor={colors.white}
      disableBuiltInState
      iconStyle={{
        borderColor: isChecked ? colors.primary : colors.divider,
        borderRadius: 6,
        marginRight: -15,
      }}
      onPress={() => onPress(!isChecked)}
      isChecked={isChecked}
      style={{
        marginRight: 0,
        alignSelf: 'flex-end',
      }}
    />
  );
};

const CardSlideSingleValueSetter = ({
  tingkatHierarki = 0,
  title,
  value,
  isActive,
  onCbPress = () => {},
  onValueChange = () => {},
}) => {
  return (
    <View
      style={{
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: colors.secondary,
        borderRadius: 8,
        marginRight: 70 * tingkatHierarki,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <CheckBoxBouncy isChecked={isActive} onPress={res => onCbPress(res)} />
        <Gap width={16} />
        <Text
          style={{
            fontFamily: fonts.secondary[500],
            fontSize: 15,
            lineHeight: 18,
            color: colors.text.primary,
          }}>
          {title}
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <Slider
            value={value}
            style={{
              width: '100%',
              height: 20,
              padding: 0,
            }}
            thumbTintColor={colors.pending}
            minimumValue={0}
            step={1}
            maximumValue={100}
            minimumTrackTintColor={
              tingkatHierarki === 0 ? colors.primary : colors.success
            }
            maximumTrackTintColor={colors.border}
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
            {value}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CardSlideSingleValueSetter;

const styles = StyleSheet.create({});
