import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {IcAdd} from '../assets/icon';
import {colors} from '../utils/ColorsConfig/Colors';
import fonts from '../utils/FontsConfig/Fonts';
import CardCreateIdeaSession from './CardCreateIdeaSession';
import CreateTeamsField from './CreateTeamsField';
import Gap from './Gap';

const CreateTeams = ({
  onNextReff,
  listUserData,
  myId,
  onUpdate = () => {},
  onNextRequest = () => {},
}) => {
  const blankTeam = {
    id: '',
    name: '',
    email: '',
    teamStructure: null,
    workingLocation: '',
    unit: null,
    notes: 'Join yuk',
  };
  const [teams, setTeams] = useState([blankTeam]);

  const addTeamsField = () => {
    let tempTeams = [...teams];
    tempTeams.push(blankTeam);
    setTeams(tempTeams);
  };

  const reconstructTeams = (index, tempTeamItem) => {
    let tempTeams = [...teams];
    tempTeams[index] = {
      id: tempTeamItem.id,
      name: tempTeamItem.name,
      email: tempTeamItem.email,
      teamStructure:
        tempTeamItem.teamStructure !== null
          ? tempTeamItem.teamStructure
          : 'Hipster',
      workingLocation: tempTeamItem.workingLocation,
      unit: tempTeamItem.unit,
      notes: 'Join yuk',
    };
    setTeams(tempTeams);
  };

  const matchToUserList = (index, email) => {
    let tempTeamItem = {
      ...blankTeam,
      teamStructure: teams[index].teamStructure,
      email: teams[index].email,
    };
    for (let i = 0; i < listUserData?.length; i++) {
      if (listUserData[i].email === email) {
        if (teams.filter(item => item.id === listUserData[i].id).length === 0) {
          tempTeamItem = {...tempTeamItem, ...listUserData[i]};
        }
        break;
      }
    }
    reconstructTeams(index, tempTeamItem);
  };

  useEffect(() => {
    let tempTeamItem = {
      ...blankTeam,
      teamStructure: teams[0].teamStructure,
    };
    for (let i = 0; i < listUserData?.length; i++) {
      if (listUserData[i].id === myId) {
        tempTeamItem = {...tempTeamItem, ...listUserData[i]};
        break;
      }
    }
    reconstructTeams(0, tempTeamItem);
  }, [listUserData]);

  useEffect(() => {
    let isCompleted = true;
    for (let i = 0; i < teams.length; i++) {
      if (
        // teams[i].name === '' ||
        // teams[i].email === '' ||
        // teams[i].teamStructure === null ||
        // teams[i].workingLocation === '' ||
        // teams[i].unitId === null

        teams[i].id === '' ||
        teams[i].teamStructure === null
      ) {
        isCompleted = false;
        break;
      }
    }
    onUpdate(isCompleted);
  }, [teams]);

  useEffect(() => {
    if (onNextReff !== undefined) {
      const teamsToPass = teams.map(item => {
        return {
          userId: item.id,
          teamStructure: item.teamStructure,
          notes: item.notes,
        };
      });
      onNextReff.current = () => onNextRequest(teamsToPass);
    }
  });

  return (
    <>
      {teams.map((item, index) => {
        return (
          <View key={index.toString()}>
            <CardCreateIdeaSession
              title={index === 0 ? 'Teams' : undefined}
              mandatory={index === 0 ? true : false}>
              <CreateTeamsField
                disableEmailField={item.id === myId}
                title={`Team Member ${index + 1}`}
                withSelfDelete={index !== 0 ? true : false}
                emailValue={item.email}
                onEmailChange={newEmail => {
                  // let tempTeams = [...teams];
                  // tempTeams[index].email = newEmail;
                  // setTeams(tempTeams);
                  matchToUserList(index, newEmail);
                }}
                nameValue={item.name}
                onNameChange={newName => {
                  let tempTeams = [...teams];
                  tempTeams[index].name = newName;
                  setTeams(tempTeams);
                }}
                workingLocationValue={item.workingLocation}
                onWorkingLocationChange={newWorkingLocation => {
                  let tempTeams = [...teams];
                  tempTeams[index].workingLocation = newWorkingLocation;
                  setTeams(tempTeams);
                }}
                unitValue={item.unit}
                onUnitChange={newUnit => {
                  let tempTeams = [...teams];
                  tempTeams[index].unit = newUnit;
                  setTeams(tempTeams);
                }}
                teamStructureItem={[
                  {label: 'Hipster', value: 'Hipster'},
                  {label: 'Hustler', value: 'Hustler'},
                  {label: 'Hacker', value: 'Hacker'},
                ]}
                selectedTeamStructure={item.teamStructure}
                onTeamStructureChange={newTeamStructure => {
                  let tempTeams = [...teams];
                  tempTeams[index].teamStructure = newTeamStructure;
                  setTeams(tempTeams);
                }}
                onSelfDelete={() => {
                  let tempTeams = [...teams];
                  tempTeams.splice(index, 1);
                  setTeams(tempTeams);
                }}
              />
              {index === teams.length - 1 && (
                <>
                  <Gap height={16} />
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        addTeamsField();
                      }}>
                      <IcAdd />
                      <Gap width={8} />
                      <Text style={styles.addAnotherMemberText}>
                        Add another member
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </CardCreateIdeaSession>
            {index !== teams.length - 1 && <Gap height={16} />}
          </View>
        );
      })}
    </>
  );
};

export default CreateTeams;

const styles = StyleSheet.create({
  fieldTitle: {
    marginBottom: 8,
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    lineHeight: 17,
  },
  addAnotherMemberText: {
    fontFamily: fonts.secondary[600],
    fontSize: 12,
    lineHeight: 15,
    color: colors.primary,
  },
});
