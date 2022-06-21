import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import TabNavigation from '../../components/Tabs';
import CreateIdeaStep from '../../modules/createidea/screen/CreateIdeaStep';
import EditIdea from '../../modules/createidea/screen/EditIdea.screen';
import DetailIdeaScreen from '../../modules/explore/screen/DetailIdea.screen';
import ForgorPassword from '../../modules/forgotPassword/screen/ForgotPassword.screen';
import Login from '../../modules/login/screen/Login.screen';
import Main from '../../modules/main/screen/Main.screen';
import JoinedIdea from '../../modules/myidea/screen/JoinedIdea.screen';
import SubmittedIdea from '../../modules/myidea/screen/SubmittedIdea.screen';
import IdeaManagement from '../../modules/administrator/screen/IdeaManagement.screen';
import CategoryManagement from '../../modules/administrator/screen/CategoryManagement.screen';
import DetailCategory from '../../modules/administrator/screen/DetailCategory.screen';
import Notification from '../../modules/notification/screen/Notification.screen';
import Page404 from '../../modules/page404/Page404.screen';
import privacyPolicy from '../../modules/privacyPolicy/screen/privacyPolicy.screen';
import MyProfile from '../../modules/profile/screen/MyProfile.screen';
import RegisterScreen from '../../modules/register/screen/Register.screen';
import SplashScreen from '../../modules/splash/screen/Splash.screen';
import TalentApproval from '../../modules/talentapproval/screen/TalentApproval.screen';
import TalentApprovalAction from '../../modules/talentapproval/screen/TalentApprovalAction.screen';
import TermCondi from '../../modules/termcondi/screen/TermCondi.screen';
import CriteriaManagement from '../../modules/administrator/screen/CriteriaManagement.screen';
import PromotionManagement from '../../modules/administrator/screen/PromotionManagement';
import CriteriaPreferenceSetter from '../../modules/administrator/screen/CriteriaPreferenceSetter.screen';
import ResultRank from '../../modules/administrator/screen/ResultRank.screen';

const Stack = createNativeStackNavigator();

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 50,
    mass: 3,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const Routes = () => {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        animation: 'fade_from_bottom',
        animationTypeForReplace: 'push',
      }}>
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
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgorPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TabNavigation"
        component={TabNavigation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DetailIdea"
        component={DetailIdeaScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MyProfile"
        component={MyProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreateIdeaStep"
        component={CreateIdeaStep}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditIdea"
        component={EditIdea}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SubmittedIdea"
        component={SubmittedIdea}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="JoinedIdea"
        component={JoinedIdea}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TalentApproval"
        component={TalentApproval}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TalentApprovalAction"
        component={TalentApprovalAction}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="IdeaManagement"
        component={IdeaManagement}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PromotionManagement"
        component={PromotionManagement}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CriteriaPreferenceSetter"
        component={CriteriaPreferenceSetter}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ResultRank"
        component={ResultRank}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CriteriaManagement"
        component={CriteriaManagement}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CategoryManagement"
        component={CategoryManagement}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DetailCategory"
        component={DetailCategory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
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
