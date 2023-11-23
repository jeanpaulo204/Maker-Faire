import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Telas do aplicativo
import LoginScreen from './rotas/LoginScreen';
import HomeScreen from './rotas/HomeScreen';
import Formulario from './rotas/Formulario';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="Entrar">
      <Stack.Screen name="Entrar" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Formulario" component={Formulario} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
