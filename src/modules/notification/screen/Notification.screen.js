import jwtDecode from 'jwt-decode';
import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CardIdeaInvitationNotif from '../../../components/CardIdeaInvitationNotif';
import Header from '../../../components/Header';
import style from '../../../config/Style/style.cfg';
import {
  getAsyncStorageObject,
  storeAsyncStorageObject,
} from '../../../utils/AsyncStorage/StoreAsyncStorage';

const Notification = ({navigation, route}) => {
  const decodedJwt = jwtDecode(route.params?.userToken.authToken);
  const [notificationList, setNotificationList] = useState([]);
  console.log(notificationList);

  const fetchNotification = () => {
    getAsyncStorageObject('@NOTIFICATION').then(res => {
      setNotificationList(
        res.filter(item => item.userTarget === decodedJwt.data.id),
      );
    });
  };

  const acceptIdeaInvitation = notifTarget => {
    let notifToUpdate = {
      ...notifTarget,
      openStatus: true,
      value: {...notifTarget.value, status: 'Approved'},
    };
    console.log(notifToUpdate);
    getAsyncStorageObject('@PELENGKAP_DATA_IDEA').then(dataPelengkapIdea => {
      let pelengkapIdeaToUpdate = dataPelengkapIdea.filter(
        pelengkapIdeaItem =>
          pelengkapIdeaItem.ideaId === notifTarget.value.ideaId,
      )[0];
      pelengkapIdeaToUpdate.teams = pelengkapIdeaToUpdate.teams.concat([
        {
          id: Math.floor(
            Math.random() * Math.floor(Math.random() * Date.now()),
          ).toString(),
          userId: notifTarget.value.userId,
          teamStructure: notifTarget.value.teamStructure,
          status: 'Approved',
          notes: notifTarget.value.notes,
          createdDate: notifTarget.value.createdDate,
          approvedDate: notifTarget.value.approvedDate,
        },
      ]);
      storeAsyncStorageObject(
        '@PELENGKAP_DATA_IDEA',
        dataPelengkapIdea
          .filter(
            pelengkapIdeaItem =>
              pelengkapIdeaItem.ideaId !== notifTarget.value.ideaId,
          )
          .concat([pelengkapIdeaToUpdate]),
      ).then(() => {
        getAsyncStorageObject('@NOTIFICATION').then(notifList => {
          const otherNotifList = notifList.filter(
            notifItem => notifItem.id !== notifTarget.id,
          );
          storeAsyncStorageObject(
            '@NOTIFICATION',
            otherNotifList.concat([notifToUpdate]),
          ).then(() => {
            console.log('Notification updated');
            fetchNotification();
          });
        });
      });
    });
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        backButton
        onBackPress={() => navigation.goBack()}
        backText="Back"
        title="Notification"
        withNotification={false}
      />
      {notificationList.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{padding: 16}}>
          <FlatList
            data={notificationList}
            keyExtractor={(_, index) => index.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            inverted={true}
            renderItem={({item, index}) => (
              <>
                {item.type === 'IDEA_INVITATION' && (
                  <CardIdeaInvitationNotif
                    openStatus={item.openStatus}
                    ideaName={item.value.ideaName}
                    status={item.value.status}
                    onAcceptPress={() => acceptIdeaInvitation(item)}
                  />
                )}
              </>
            )}
          />
        </ScrollView>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../../../assets/image/notification.png')}
            style={{width: 200, height: 300}}
          />
          <Text style={[style.h4, {color: '#085D7A'}]}>
            We are ready Soon! See you!
          </Text>
        </View>
      )}
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    height: 65,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  back: {
    marginHorizontal: 10,
  },
  notif: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
