import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {colors} from '../utils/ColorsConfig/Colors';
import fonts from '../utils/FontsConfig/Fonts';
import CardCreateIdeaSession from './CardCreateIdeaSession';
import Gap from './Gap';

const CreateStoryBehind = ({
  onNextReff,
  onUpdate = () => {},
  onNextRequest = () => {},
}) => {
  const [storyBehind, setStoryBehind] = useState({
    why: '',
    how: '',
    what: '',
  });

  useEffect(() => {
    let isCompleted = false;
    if (
      storyBehind.why !== '' &&
      storyBehind.how !== '' &&
      storyBehind.what !== ''
    ) {
      isCompleted = true;
    }
    onUpdate(isCompleted);
  }, [storyBehind]);

  useEffect(() => {
    if (onNextReff !== undefined) {
      onNextReff.current = () => onNextRequest(storyBehind);
    }
  });

  return (
    <CardCreateIdeaSession title="Story Behind" mandatory>
      <Text style={styles.fieldTitle}>
        Why “What is your case? What do you believe?”
      </Text>
      <TextInput
        multiline
        placeholder="(Max. 1000 Characters)"
        maxLength={1000}
        textAlignVertical="top"
        autoComplete="off"
        autoCorrect={false}
        style={styles.board}
        onChangeText={text => {
          setStoryBehind({...storyBehind, why: text});
        }}>
        <Text style={{lineHeight: 20}}>{storyBehind.why}</Text>
      </TextInput>
      <Gap height={16} />
      <Text style={styles.fieldTitle}>
        How “Specific actions taken to realise your Why. How do you achieve your
        Why?”
      </Text>
      <TextInput
        multiline
        placeholder="(Max. 1000 Characters)"
        maxLength={1000}
        textAlignVertical="top"
        autoComplete="off"
        autoCorrect={false}
        style={styles.board}
        onChangeText={text => {
          setStoryBehind({...storyBehind, how: text});
        }}>
        <Text style={{lineHeight: 20}}>{storyBehind.how}</Text>
      </TextInput>
      <Gap height={16} />
      <Text style={styles.fieldTitle}>
        What “What do you offer to achieve your Why?”
      </Text>
      <TextInput
        multiline
        placeholder="(Max. 1000 Characters)"
        maxLength={1000}
        textAlignVertical="top"
        autoComplete="off"
        autoCorrect={false}
        style={styles.board}
        onChangeText={text => {
          setStoryBehind({...storyBehind, what: text});
        }}>
        <Text style={{lineHeight: 20}}>{storyBehind.what}</Text>
      </TextInput>
    </CardCreateIdeaSession>
  );
};

export default CreateStoryBehind;

const styles = StyleSheet.create({
  fieldTitle: {
    marginBottom: 8,
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    lineHeight: 17,
  },
  board: {
    height: 155,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 12,
    fontFamily: fonts.primary[400],
    fontSize: 16,
    color: colors.text.primary,
  },
});
