import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {colors} from '../utils/ColorsConfig/Colors';
import {IcButtonJoin} from '../assets/icon';
import Gap from '../components/Gap';
import fonts from '../utils/FontsConfig/Fonts';
import {InitialIcon} from './InitialIcon';

const CardProfile = ({
  withJoinButton = true,
  onJoinButtonPress,
  userData,
  onCreatorPress,
}) => {
  const name = userData?.name
    ? userData?.name?.replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
      })
    : '-';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={onCreatorPress}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 50 / 2,
            overflow: 'hidden',
          }}>
          <View style={{position: 'absolute', left: 0, top: 0}}>
            <InitialIcon
              width={50}
              height={50}
              name={userData?.name}
              fontSize={20}
            />
          </View>
          <Image
            source={userData?.pictures}
            style={{width: '100%', height: '100%', resizeMode: 'cover'}}
          />
        </View>
        <Gap width={10} />
        <View style={styles.detailWrapper}>
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.nameText}>
            {name}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.zipText}>
            {userData?.nik !== '' ? userData?.nik : '-'}
          </Text>
        </View>
      </TouchableOpacity>
      {withJoinButton && (
        <>
          <Gap width={10} />
          <TouchableOpacity style={styles.button} onPress={onJoinButtonPress}>
            <IcButtonJoin />
            <Gap width={8} />
            <Text style={styles.textButton}>Join Idea</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default CardProfile;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  detailWrapper: {
    flex: 1,
  },
  nameText: {
    color: colors.text.primary,
    fontFamily: fonts.secondary[600],
    fontSize: 12,
    lineHeight: 15,
  },
  zipText: {
    color: colors.text.secondary,
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    lineHeight: 17,
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 32,
    alignItems: 'center',
  },
  textButton: {
    color: colors.white,
    fontFamily: fonts.secondary[600],
    fontSize: 12,
    lineHeight: 15,
  },
});
