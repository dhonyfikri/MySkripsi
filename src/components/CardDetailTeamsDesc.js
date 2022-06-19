import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import Divider from '../components/Divider';
import {colors} from '../utils/ColorsConfig/Colors';
import fonts from '../utils/FontsConfig/Fonts';
import Gap from './Gap';

const CardDetailTeamDesc = ({
  no,
  nama,
  nip,
  teamStructure,
  workLocation,
  unit,
}) => {
  return (
    <View style={styles.card}>
      <View>
        <View style={styles.fieldWrapper}>
          <Text style={styles.titleText}>Team Member</Text>
          <Divider stroke={1} />
        </View>
        <View style={styles.fieldWrapper}>
          <Text style={styles.titleText}>Nama</Text>
          <Divider stroke={1} />
        </View>
        <View style={styles.fieldWrapper}>
          <Text style={styles.titleText}>NIP</Text>
          <Divider stroke={1} />
        </View>
        <View style={styles.fieldWrapper}>
          <Text style={styles.titleText}>Team Structure</Text>
          <Divider stroke={1} />
        </View>
        <View style={styles.fieldWrapper}>
          <Text style={styles.titleText}>Work Location</Text>
          <Divider stroke={1} />
        </View>
        <View style={styles.fieldWrapper}>
          <Text style={styles.titleText}>Unit</Text>
          <Divider stroke={1} />
        </View>
      </View>
      <View style={styles.contentWrapper}>
        <View style={styles.fieldWrapper}>
          <View style={{flexDirection: 'row'}}>
            <Gap width={30} />
            <Text numberOfLines={1} style={styles.colon}>
              {': '}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text numberOfLines={1} style={styles.contentText}>
                {no !== undefined ? no : '-'}
              </Text>
            </ScrollView>
          </View>
          <Divider stroke={1} />
        </View>
        <View style={styles.fieldWrapper}>
          <View style={{flexDirection: 'row'}}>
            <Gap width={30} />
            <Text numberOfLines={1} style={styles.colon}>
              {': '}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text numberOfLines={1} style={styles.contentText}>
                {nama !== undefined ? nama : '-'}
              </Text>
            </ScrollView>
          </View>
          <Divider stroke={1} />
        </View>
        <View style={styles.fieldWrapper}>
          <View style={{flexDirection: 'row'}}>
            <Gap width={30} />
            <Text numberOfLines={1} style={styles.colon}>
              {': '}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text numberOfLines={1} style={styles.contentText}>
                {nip !== undefined ? nip : '-'}
              </Text>
            </ScrollView>
          </View>
          <Divider stroke={1} />
        </View>
        <View style={styles.fieldWrapper}>
          <View style={{flexDirection: 'row'}}>
            <Gap width={30} />
            <Text numberOfLines={1} style={styles.colon}>
              {': '}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text numberOfLines={1} style={styles.contentText}>
                {teamStructure !== undefined ? teamStructure : '-'}
              </Text>
            </ScrollView>
          </View>
          <Divider stroke={1} />
        </View>
        <View style={styles.fieldWrapper}>
          <View style={{flexDirection: 'row'}}>
            <Gap width={30} />
            <Text numberOfLines={1} style={styles.colon}>
              {': '}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text numberOfLines={1} style={styles.contentText}>
                {workLocation !== undefined ? workLocation : '-'}
              </Text>
            </ScrollView>
          </View>
          <Divider stroke={1} />
        </View>
        <View style={styles.fieldWrapper}>
          <View style={{flexDirection: 'row'}}>
            <Gap width={30} />
            <Text numberOfLines={1} style={styles.colon}>
              {': '}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text numberOfLines={1} style={styles.contentText}>
                {unit !== undefined ? unit : '-'}
              </Text>
            </ScrollView>
          </View>
          <Divider stroke={1} />
        </View>
      </View>
    </View>
  );
};

export default CardDetailTeamDesc;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAFAFB',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingTop: 12,
    flexDirection: 'row',
  },
  contentWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  fieldWrapper: {
    height: 22,
    justifyContent: 'flex-end',
    marginBottom: 15.5,
  },
  titleText: {
    color: colors.text.primary,
    fontFamily: fonts.secondary[600],
    fontSize: 12,
    lineHeight: 15,
  },
  colon: {
    color: colors.text.secondary,
    fontFamily: fonts.primary[400],
    fontSize: 12,
    lineHeight: 15,
  },
  contentText: {
    flex: 1,
    color: colors.text.secondary,
    fontFamily: fonts.primary[400],
    fontSize: 12,
    lineHeight: 15,
  },
});
