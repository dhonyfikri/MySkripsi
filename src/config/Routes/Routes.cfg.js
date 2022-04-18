import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import DrawerNavigation from '../../components/Drawer';
import Faq from '../../modules/faq/screen/Faq.screen';
import Login from '../../modules/login/screen/Login.screen';
import Main from '../../modules/main/screen/Main.screen';
import Notification from '../../modules/notification/screen/Notification.screen';
import privacyPolicy from '../../modules/privacyPolicy/screen/privacyPolicy.screen';
import SearchScreen from '../../modules/search/screen/Search.screen';
import SplashScreen from '../../modules/splash/screen/Splash.screen';
import TermCondi from '../../modules/termcondi/screen/TermCondi.screen';
import TopIdea from '../../modules/trending/screen/TopIdea.screen';
import Page404 from '../../modules/page404/Page404.screen';
import RoutesProfile from './RoutesProfile';
const Stack = createNativeStackNavigator();

const Routes = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
        name="TopIdea"
        component={TopIdea}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Main"
        component={Main}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DrawerNavigation"
        component={DrawerNavigation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Faq" component={Faq} options={{headerShown: false}} />
      <Stack.Screen
        name="RouteProfile"
        component={RoutesProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={privacyPolicy}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TermCondi"
        component={TermCondi}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Page404"
        component={Page404}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default Routes;
