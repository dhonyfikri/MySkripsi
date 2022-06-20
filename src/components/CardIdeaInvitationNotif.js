import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors} from '../utils/ColorsConfig/Colors';
import fonts from '../utils/FontsConfig/Fonts';
import Gap from './Gap';

const CardIdeaInvitationNotif = ({
  openStatus,
  ideaName,
  status,
  onPress,
  onAcceptPress,
}) => {
  return (
    <TouchableOpacity
      disabled
      onPress={onPress}
      style={{
        backgroundColor: openStatus ? colors.divider : colors.divider2,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: colors.divider,
        borderRadius: 8,
        padding: 16,
      }}>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontFamily: fonts.secondary[400],
              fontSize: 15,
              lineHeight: 20,
              color: colors.text.primary,
            }}>
            Invitation to join idea{' '}
            <Text
              style={{
                fontFamily: fonts.secondary[600],
                color: colors.text.primary,
              }}>
              ({ideaName})
            </Text>
          </Text>
          <Text
            style={{
              fontFamily: fonts.secondary[500],
              fontSize: 12,
              lineHeight: 18,
              color: colors.text.primary,
            }}>
            Status: {status}
          </Text>
        </View>
        <Gap width={12} />
        <TouchableOpacity
          onPress={onAcceptPress}
          style={{
            height: 34,
            justifyContent: 'center',
            paddingHorizontal: 12,
            backgroundColor: openStatus ? colors.border : colors.primary,
            borderRadius: 8,
          }}>
          <Text
            style={{
              fontFamily: fonts.secondary[500],
              fontSize: 12,
              lineHeight: 18,
              color: colors.white,
            }}>
            Accept
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default CardIdeaInvitationNotif;

const styles = StyleSheet.create({});
