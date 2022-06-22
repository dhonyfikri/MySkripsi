import React from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {colors} from '../utils/ColorsConfig/Colors';
import fonts from '../utils/FontsConfig/Fonts';
import Divider from './Divider';
import Gap from './Gap';

const CardMyIdeas = ({myIdeas = [], showAll = false, showLimit = 2}) => {
  const ideas = showAll ? myIdeas : myIdeas.slice(0, showLimit);
  return (
    <>
      {ideas?.map((item, index) => {
        return (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => {
              console.log(`index ${item.id} ${item.desc[0].value} clicked`);
            }}>
            <View style={styles.main}>
              {/* <Image style={styles.picture} source={item.picture} /> */}
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 6,
                  overflow: 'hidden',
                }}>
                <Image
                  style={{
                    ...styles.picture,
                    position: 'absolute',
                    left: 0,
                    right: 0,
                  }}
                  source={require('../assets/image/img_dummy_my_idea_1.png')}
                />
                <Image
                  style={{...styles.picture, width: '100%', height: '100%'}}
                  source={item.desc[2].value}
                />
              </View>
              <Gap width={12} />
              <Text numberOfLines={4} style={styles.title}>
                {item.desc[0].value}
              </Text>
            </View>
            <Gap height={8} />
            <Text numberOfLines={2} style={styles.desc}>
              {item.desc[1].value}
            </Text>
            {index + 1 !== ideas.length && (
              <>
                <Gap height={8} />
                <Divider lineColors={colors.divider2} />
                <Gap height={8} />
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </>
  );
};

export default CardMyIdeas;

const styles = StyleSheet.create({
  main: {flexDirection: 'row', width: '83.5%', alignItems: 'center'},
  picture: {width: 100, height: 100, borderRadius: 6, resizeMode: 'cover'},
  title: {
    flex: 1,
    fontFamily: fonts.secondary[600],
    fontSize: 12,
    lineHeight: 15,
    color: colors.text.tertiary3,
  },
  desc: {
    fontFamily: fonts.primary[400],
    fontSize: 12,
    lineHeight: 22,
    color: colors.text.tertiary2,
  },
});
