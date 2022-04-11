import {createDrawerNavigator} from '@react-navigation/drawer';
import {useNavigationState} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {HomeDrawer, IconFaq} from '../assets/icon';
import {defaultAuthState} from '../config/Auth.cfg';
import GetDataProfile from '../config/GetData/GetDataProfile';
import RoutesCategoryManagement from '../config/Routes/RoutesCategoryManagement';
import RoutesTalentApproval from '../config/Routes/RoutesTalentApproval';
import IdeaManagement from '../modules/administrator/screen/IdeaManagement.screen';
import Faq from '../modules/faq/screen/Faq.screen';
import MyIdea from '../modules/myidea/screen/MyIdea.route';
import {
  getAsyncStorageObject,
  storeAsyncStorageObject,
} from '../utils/AsyncStorage/StoreAsyncStorage';
import DrawerContent from './DrawerContent';
import getData from './GetData';
import LoadingFull from './LoadingFull';
import RefreshFull from './RefreshFull';
import TabNavigation from './Tabs';

const Drawer = createDrawerNavigator();

const DrawerNavigation = ({navigation, route}) => {
  const [data, setData] = useState(defaultAuthState);
  const [dataProfile, setDataProfile] = useState({});
  const [synchronizing, setSynchronizing] = useState({status: true});
  const [showRefresh, setShowRefresh] = useState(false);

  const getOnlineDataAndStoreToStorage = () => {
    console.log('getting');
    setSynchronizing({status: true});
    setShowRefresh(false);
    GetDataProfile(data.id).then(res => {
      setSynchronizing({status: false});
      if (res !== undefined) {
        console.log('yes');
        storeAsyncStorageObject('DATA_PROFILE', res);
        setDataProfile(res);
      } else {
        console.log('no');
        setShowRefresh(true);
      }
    });
  };

  useEffect(() => {
    console.log('yah');
    getData().then(jsonValue => setData(jsonValue));
  }, []);

  useEffect(() => {
    if (data !== defaultAuthState) {
      console.log('aduh');
      getAsyncStorageObject('DATA_PROFILE')
        .then(val => {
          if (val) {
            setDataProfile(val);
          }
          getOnlineDataAndStoreToStorage();
        })
        .catch(err => {
          console.log('ooppss... no result with message: ', err);
          getOnlineDataAndStoreToStorage();
        });
    }
  }, [data]);

  // example to get route name
  const screenName = useNavigationState(
    state => state.routes[state.index].name,
  );

  // example to get route index
  const routeIndex = useNavigationState(state => state.index);

  // on resume handler from other page
  useEffect(() => {
    if (route.params?.onResume.refresh) {
      getOnlineDataAndStoreToStorage();
    }
  }, [route.params?.onResume]);

  return (
    <>
      <Drawer.Navigator
        drawerContent={props => (
          <DrawerContent
            {...props}
            nama={dataProfile.name}
            email={dataProfile.email}
            profile={{uri: dataProfile.pictures}}
            profileIf={dataProfile.pictures}
          />
        )}>
        <Drawer.Screen
          name="TabNavigation"
          component={TabNavigation}
          options={{
            drawerLabel: 'Home',
            headerShown: false,
            drawerIcon: () => <HomeDrawer />,
            activeTintColor: '#085D7A',
          }}
        />
        {/* <Drawer.Screen
          name="TalentBooster"
          component={TalentBooster}
          options={{
            drawerLabel: 'Talent Booster',
            headerShown: false,
            drawerIcon: () => <Talent />,
            activeTintColor: '#085D7A',
          }}
        /> */}
        <Drawer.Screen
          name="RoutesSubmittedIdea"
          component={MyIdea}
          options={{
            drawerLabel: 'List Idea',
            headerShown: false,
            drawerLabelStyle: {marginLeft: 60, fontSize: 14},
            groupName: 'My Idea',
            activeTintColor: '#085D7A',
          }}
        />
        <Drawer.Screen
          name="TalentApproval"
          component={RoutesTalentApproval}
          options={{
            drawerLabel: 'Talent Approval',
            headerShown: false,
            drawerLabelStyle: {marginLeft: 20, fontSize: 14},
            groupName: 'My Idea',
            activeTintColor: '#085D7A',
          }}
        />
        {/* <Drawer.Screen
          name="UserManagement"
          component={RoutesUserManagement}
          options={{
            drawerLabel: 'User Management',
            headerShown: false,
            drawerLabelStyle: {marginLeft: 60, fontSize: 14},
            activeTintColor: '#085D7A',
            groupName: 'Administrator',
          }}
        /> */}
        {dataProfile.roleId === 5 || dataProfile.roleId === 6 ? (
          <Drawer.Screen
            name="CategoryManagement"
            component={RoutesCategoryManagement}
            options={{
              drawerLabel: 'Category Management',
              headerShown: false,
              drawerLabelStyle: {marginLeft: 60, fontSize: 14},
              activeTintColor: '#085D7A',
              groupName: 'Administrator',
            }}
          />
        ) : (
          <Drawer.Screen
            name="CategoryManagement"
            component={RoutesCategoryManagement}
            options={{
              drawerLabel: 'Category Management',
              headerShown: false,
              drawerLabelStyle: {marginLeft: 60, fontSize: 14},
              activeTintColor: '#085D7A',
              groupName: 'Administrator',
            }}
          />
        )}
        {dataProfile.roleId === 5 || dataProfile.roleId === 6 ? (
          <Drawer.Screen
            name="IdeaManagement"
            component={IdeaManagement}
            options={{
              drawerLabel: 'Idea Management',
              headerShown: false,
              drawerLabelStyle: {marginLeft: 60, fontSize: 14},
              activeTintColor: '#085D7A',
              groupName: 'Administrator',
            }}
          />
        ) : (
          <Drawer.Screen
            name="IdeaManagement"
            component={IdeaManagement}
            options={{
              drawerLabel: 'Idea Management',
              headerShown: false,
              drawerLabelStyle: {marginLeft: 60, fontSize: 14},
              activeTintColor: '#085D7A',
              groupName: 'Administrator',
            }}
          />
        )}

        {/* <Drawer.Screen
          name="RoleManagement"
          component={RoleManagement}
          options={{
            drawerLabel: 'Role Management',
            headerShown: false,
            drawerLabelStyle: {marginLeft: 60, fontSize: 14},
            activeTintColor: '#085D7A',
            groupName: 'Administrator',
          }}
        /> */}

        <Drawer.Screen
          name="Faq"
          component={Faq}
          options={{
            drawerLabel: 'FAQ',
            headerShown: false,
            drawerIcon: () => <IconFaq />,
            activeTintColor: '#085D7A',
          }}
        />
        {/* <Drawer.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            drawerLabel: 'Dashboard',
            headerShown: false,
            drawerIcon: () => <Talent />,
            activeTintColor: '#085D7A',
          }}
        /> */}
        {/* <Drawer.Screen
          name="Latihan"
          component={Latihan}
          options={{
            drawerLabel: 'Notification',
            headerShown: false,
            drawerIcon: () => <HomeDrawer />,
          }}
        /> */}
        {/* <Drawer.Screen
          name="EventManagement"
          component={EventManagement}
          options={{
            drawerLabel: 'Event Management',
            headerShown: false,
            drawerIcon: () => <HomeDrawer />,
          }}
        /> */}
      </Drawer.Navigator>
      {synchronizing.status && <LoadingFull text={'Getting Data...'} />}
      {showRefresh && (
        <RefreshFull
          onPress={getOnlineDataAndStoreToStorage}
          message="Failed to get data from server"
        />
      )}
    </>
  );
};

export default DrawerNavigation;
