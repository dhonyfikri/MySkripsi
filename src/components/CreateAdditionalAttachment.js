import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {IcAdd} from '../assets/icon';
import {colors} from '../utils/ColorsConfig/Colors';
import fonts from '../utils/FontsConfig/Fonts';
import CardCreateIdeaSession from './CardCreateIdeaSession';
import CreateAdditionalAttachmentField from './CreateAdditionalAttachmentField';
import Divider from './Divider';
import Gap from './Gap';

const CreateAdditionalAttachment = ({
  onNextReff,
  onUpdate = () => {},
  onNextRequest = () => {},
}) => {
  const blankAttachment = {
    type: null,
    source: '',
    desc: '',
    documentName: '',
    link: '',
  };
  const [attachment, setAttachment] = useState([blankAttachment]);

  useEffect(() => {
    let isCompleted = true;
    if (attachment.length === 1) {
      if (
        attachment[0].type !== null ||
        attachment[0].source !== '' ||
        attachment[0].link !== '' ||
        attachment[0].desc !== ''
      ) {
        isCompleted = false;
        if (
          attachment[0].type !== null &&
          ((attachment[0].type === 'File' && attachment[0].source !== '') ||
            (attachment[0].type === 'Link' && attachment[0].link !== '')) &&
          attachment[0].desc !== ''
        ) {
          isCompleted = true;
        }
      }
    } else {
      for (let i = 0; i < attachment.length; i++) {
        if (
          attachment[i].type === null ||
          (attachment[i].type === 'File' && attachment[i].source === '') ||
          (attachment[i].type === 'Link' && attachment[i].link === '') ||
          attachment[i].desc === ''
        ) {
          isCompleted = false;
          break;
        }
      }
    }
    onUpdate(isCompleted);
  }, [attachment]);

  useEffect(() => {
    const newFileAttachment = attachment
      .filter(item => item.type === 'File')
      .map(item => {
        return {
          name: item.desc,
          extension: item.documentName.split('.')?.slice(-1)[0],
          link: item.documentName,
        };
      });
    const newLinkAttachment = attachment
      .filter(item => item.type === 'Link')
      .map(item => {
        return {name: item.desc, link: item.link};
      });
    if (onNextReff !== undefined) {
      if (attachment.length <= 1) {
        if (attachment[0].type === null) {
          onNextReff.current = () => onNextRequest([], []);
        } else {
          onNextReff.current = () =>
            onNextRequest(newFileAttachment, newLinkAttachment);
        }
      } else {
        onNextReff.current = () =>
          onNextRequest(newFileAttachment, newLinkAttachment);
      }
    }
  }, [attachment]);

  return (
    <CardCreateIdeaSession
      title="Additional Attachment (Optional)"
      desc="Other attachments that are not required, but are considered necessary to support the idea."
      mandatory={false}>
      {attachment.map((item, index) => {
        return (
          <View key={index.toString()}>
            <CreateAdditionalAttachmentField
              withSelfDelete={attachment.length > 1 ? true : false}
              onSelfDelete={() => {
                let tempAttachment = [...attachment];
                tempAttachment.splice(index, 1);
                setAttachment(tempAttachment);
              }}
              onClear={() => {
                setAttachment([blankAttachment]);
              }}
              selectedType={item.type}
              onTypeChange={newType => {
                let tempAttachment = [...attachment];
                tempAttachment[index].type = newType;
                setAttachment(tempAttachment);
              }}
              linkValue={item.link}
              onLinkChange={newLink => {
                let tempAttachment = [...attachment];
                tempAttachment[index].link = newLink;
                setAttachment(tempAttachment);
              }}
              onSourceChange={(newSource, newDocumentSourceName = '') => {
                let tempAttachment = [...attachment];
                tempAttachment[index].source = newSource;
                tempAttachment[index].documentName = newDocumentSourceName;
                setAttachment(tempAttachment);
              }}
              descValue={item.desc}
              onDescChange={newDesc => {
                let tempAttachment = [...attachment];
                tempAttachment[index].desc = newDesc;
                setAttachment(tempAttachment);
              }}
              attachmentDocumentName={item.documentName}
            />
            {index !== attachment.length - 1 && (
              <>
                <Gap height={16} />
                <Divider />
                <Gap height={16} />
              </>
            )}
            {index === attachment.length - 1 && (
              <>
                <Gap height={16} />
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      let tempAttachment = [...attachment];
                      tempAttachment.push(blankAttachment);
                      setAttachment(tempAttachment);
                    }}>
                    <IcAdd />
                    <Gap width={8} />
                    <Text style={styles.addAnotherAttachmentText}>
                      Add another attachment
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        );
      })}
    </CardCreateIdeaSession>
  );
};

export default CreateAdditionalAttachment;

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
  addAnotherAttachmentText: {
    fontFamily: fonts.secondary[600],
    fontSize: 12,
    lineHeight: 15,
    color: colors.primary,
  },
});
