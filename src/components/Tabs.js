import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  IcDashboardActive,
  IcDashboardInactive,
  IcEventActive,
  IcEventInactive,
  IcHomeActive,
  IcHomeInactive,
  IcUserActive,
  IcUserInactive,
} from '../assets/icon';
import MainCreateIdea from '../modules/createidea/screen/MainCreateIdea';
import DashboardPage from '../modules/dashboard/screen/Dashboard.screen';
import Event from '../modules/event/screen/Event.screen';
import ExploreContent from '../modules/explore/screen/ExploreContent.screen';
import Profile from '../modules/profile/screen/Profile.screen';
import {colors} from '../utils/ColorsConfig/Colors';
import fonts from '../utils/FontsConfig/Fonts';
import Gap from './Gap';
import Header from './Header';

const Tab = createBottomTabNavigator();

const NormalTabIcon = ({focused, icon, label}) => {
  return (
    <View style={styles.wrapIcon}>
      {icon}
      <Gap height={6} />
      <Text
        style={{
          fontFamily: focused ? fonts.secondary[500] : fonts.secondary[400],
          fontSize: 12,
          lineHeight: 15,
          color: focused ? colors.primary : colors.border,
        }}>
        {label}
      </Text>
    </View>
  );
};

const CustomTabIcon = ({children, onPress}) => {
  return (
    <View
      style={{
        width: (Dimensions.get('window').width * 20) / 100,
        height: 103,
        top: -28,
        paddingBottom: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
      <View
        style={{
          backgroundColor: colors.tertiary,
          width: 65,
          height: 65,
          borderRadius: 65 / 2,
          justifyContent: 'center',
          alignItems: 'center',
          // elevation: 2,
        }}>
        <TouchableOpacity
          onPress={onPress}
          style={{
            backgroundColor: colors.primary,
            width: 48,
            height: 48,
            borderRadius: 48 / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/icon/plus.png')}
            style={{width: 25, height: 25}}
          />
        </TouchableOpacity>
      </View>
      <Gap height={5.4} />
      <View
        style={{
          width: '100%',
          height: 15,
          justifyContent: 'flex-start',
        }}>
        {children}
      </View>
    </View>
  );
};

const TabNavigation = ({navigation, route}) => {
  return (
    <>
      <StatusBar backgroundColor={colors.secondary} barStyle="dark-content" />
      <View style={{flex: 1}}>
        <Header
          withLogo
          onNotificationPress={() =>
            navigation.navigate('Notification', {
              userToken: route.params?.userToken,
            })
          }
        />
        <Tab.Navigator
          backBehavior="initialRoute"
          initialRouteName="Home"
          screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {
              // position: 'absolute',
              height: 76,
              backgroundColor: colors.tertiary,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 7,
              },
              shadowOpacity: 0.41,
              shadowRadius: 9.11,
              elevation: 10,
            },
          }}>
          <Tab.Screen
            name="Home"
            component={ExploreContent}
            initialParams={{
              userToken: route.params?.userToken,
            }}
            options={{
              headerShown: false,
              tabBarIcon: ({focused}) => (
                <NormalTabIcon
                  focused={focused}
                  icon={focused ? <IcHomeActive /> : <IcHomeInactive />}
                  label="Home"
                />
              ),
            }}
          />
          <Tab.Screen
            name="Events"
            component={Event}
            options={{
              headerShown: false,
              tabBarIcon: ({focused}) => (
                <NormalTabIcon
                  focused={focused}
                  icon={focused ? <IcEventActive /> : <IcEventInactive />}
                  label="Events"
                />
              ),
            }}
          />
          <Tab.Screen
            name="Create"
            component={MainCreateIdea}
            initialParams={{userToken: route.params?.userToken}}
            options={{
              headerShown: false,
              tabBarIcon: ({focused}) => (
                <>
                  <Text
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      fontFamily: focused
                        ? fonts.secondary[500]
                        : fonts.secondary[400],
                      fontSize: 12,
                      lineHeight: 15,
                      color: focused ? colors.primary : colors.border,
                    }}>
                    Create Idea
                  </Text>
                </>
              ),
              tabBarButton: props => {
                return <CustomTabIcon {...props} />;
              },
            }}
          />
          <Tab.Screen
            name="Dashboard"
            component={DashboardPage}
            options={{
              headerShown: false,
              tabBarIcon: ({focused}) => (
                <NormalTabIcon
                  focused={focused}
                  icon={
                    focused ? <IcDashboardActive /> : <IcDashboardInactive />
                  }
                  label="Dashboard"
                />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            initialParams={{
              userToken: route.params?.userToken,
            }}
            options={{
              headerShown: false,
              tabBarIcon: ({focused}) => (
                <NormalTabIcon
                  focused={focused}
                  icon={focused ? <IcUserActive /> : <IcUserInactive />}
                  label="User"
                />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </>
  );
};

export default TabNavigation;

const styles = StyleSheet.create({
  wrapIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});
