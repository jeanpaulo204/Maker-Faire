import React, { useState, useEffect } from 'react';
import { View, Text,  StyleSheet } from 'react-native';
import { Input, Button, Card, PricingCard } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://172.18.137.87:5000/autenticar', {
        username: username,
        password: password,
      });

      // Se a autenticação for bem-sucedida, armazene o usuário localmente
      if (response.data.status === "success") {
        await AsyncStorage.setItem('user', username);

        // Atualize o estado, se necessário
        setUsername('');
        setPassword('');

        // Navegue para a tela Home, passando o nome do usuário como parâmetro
        navigation.navigate('Home', { username: username });
      } else {
        console.log('Falha na autenticação');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  useEffect(() => {
    // Verifique se há um usuário armazenado localmente ao carregar o componente
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        // Se houver um usuário armazenado, navegue para a tela Home
        navigation.navigate('Home', {  username: storedUser });
      }
    };

    checkUser();
  }, []);

  return (
    

<View style={styles.container}>
<View style={styles.box}>
<Text style={styles.title}>Maker Faire</Text>
<Input
        placeholder="Nome do Jurado"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <Input
        placeholder="Código de acesso"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      
      <Button
              title="Entrar"
              loading={false}
              loadingProps={{ size: 'small', color: 'white' }}
              buttonStyle={{
                backgroundColor: 'rgba(111, 202, 186, 1)',
                borderRadius: 5,
              }}
              titleStyle={{ fontWeight: 'bold', fontSize: 15 }}
              containerStyle={{
                marginHorizontal: 50,
                height: 40,
                width: 200,
                marginVertical: 10,
              }}
              onPress={handleLogin}
            />
</View>
</View>

  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#3498db', // Cor de fundo azul
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  box: {
    width: '80%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },


 
});

