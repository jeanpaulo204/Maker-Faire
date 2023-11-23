import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Alert, LogBox  } from 'react-native'; // Import Alert
import { Input, Button, Card, Chip } from 'react-native-elements';
import axios from 'axios';
import image from '../assets/makerFaire.png';

const Formulario = ({ route, navigation }) => {
  const { username,  projectID, projectUnidade,  projectName, onProjectRemove } = route.params;
  const [estetica, setEstetica] = useState('');
  const [apresentacao, setApresentacao] = useState('');
  const [dominioDeConteudo, setDominioDeConteudo] = useState('');
  const [complexidadeECriatividade, setComplexidadeECriatividade] = useState('');
  const [inovacaoESustentabilidade, setInovacaoESustentabilidade] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

  
  const validateAndSave = (nota, nomeNota) => {
    const notaAjustada = parseInt(nota, 10);

    if (isNaN(notaAjustada) || !Number.isInteger(notaAjustada) || notaAjustada < 6 || notaAjustada > 10) {
      Alert.alert('Erro', `${nomeNota} deve ser um número inteiro entre 6 e 10. Confirme se preencheu o campo corretamente.`);
      return false;
    }

    // Atualize o estado com a nota ajustada
    switch (nomeNota) {
      case 'Estética':
        setEstetica(notaAjustada.toString());
        break;
      case 'Apresentação':
        setApresentacao(notaAjustada.toString());
        break;
      case 'Domínio de Conteúdo':
        setDominioDeConteudo(notaAjustada.toString());
        break;
      case 'Complexidade e Criatividade do Projeto':
        setComplexidadeECriatividade(notaAjustada.toString());
        break;
      case 'Inovação e Sustentabilidade':
        setInovacaoESustentabilidade(notaAjustada.toString());
        break;
      default:
        break;
    }

    return true;
  };

  const handleSave = async () => {
    if (
      !validateAndSave(estetica, 'Estética') ||
      !validateAndSave(apresentacao, 'Apresentação') ||
      !validateAndSave(dominioDeConteudo, 'Domínio de Conteúdo') ||
      !validateAndSave(complexidadeECriatividade, 'Complexidade e Criatividade do Projeto') ||
      !validateAndSave(inovacaoESustentabilidade, 'Inovação e Sustentabilidade')
    ) {
      return;
    }

    try {
      const response = await axios.post('http://172.18.137.87:5000/salvar_dados', [
        {
          Jurado:{
            JURADO: username,
          },

          Projeto: {
            ID_UNIDADE: projectID,
            UNIDADEESCOLAR: projectUnidade,
            PROJETO: projectName,
          },

          Voto:{
            Estetica: estetica,
            Apresentacao: apresentacao,
            DominioDeConteudo: dominioDeConteudo,
            ComplexidadeECriatividade: complexidadeECriatividade,
            InovacaoESustentabilidade: inovacaoESustentabilidade,
          }
   
        },
      ]);

      console.log('Resposta da requisição POST:', response.data);

      // Limpe os campos após o salvamento bem-sucedido
      setEstetica('');
      setApresentacao('');
      setDominioDeConteudo('');
      setComplexidadeECriatividade('');
      setInovacaoESustentabilidade('');

      // Remova o projeto da lista usando o callback fornecido
      onProjectRemove(projectName);

      // Exiba a mensagem de sucesso apenas se a requisição foi bem-sucedida
      if (response.data.status === 'success') {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          navigation.goBack()
        }, 1000);
      }
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', backgroundColor: '#1C315E' }}>
      <Image source={image} style={{ width: 450, height: 100, marginBottom: 30, resizeMode: 'cover', alignSelf: 'center' }} />
      <View>
        <Card>
          {showSuccessMessage && <Chip title="✅ Voto enviado com sucesso!" containerStyle={{ marginVertical: 15 }} />}

          <View style={styles.jurado}>
            <Text style={{ fontSize: 25 }}>👤 JURADO: {username}</Text>
            <Text style={{ fontSize: 17 }}>📝{projectName}</Text>
          </View>

          <Input placeholder="Estética" keyboardType="numeric" onChangeText={(value) => setEstetica(value)} value={estetica} />
          <Input placeholder="Apresentação" keyboardType="numeric" onChangeText={(value) => setApresentacao(value)} value={apresentacao} />
          <Input placeholder="Domínio de Conteúdo" keyboardType="numeric" onChangeText={(value) => setDominioDeConteudo(value)} value={dominioDeConteudo} />
          <Input
            placeholder="Complexidade e Criatividade do Projeto"
            keyboardType="numeric"
            onChangeText={(value) => setComplexidadeECriatividade(value)}
            value={complexidadeECriatividade}
          />
          <Input
            placeholder="Inovação e Sustentabilidade"
            keyboardType="numeric"
            onChangeText={(value) => setInovacaoESustentabilidade(value)}
            value={inovacaoESustentabilidade}
          />

          <Button title="Salvar" onPress={handleSave} />
          <View style={{ marginBottom: 10 }}></View>
          <Button title="Voltar"  onPress={() => navigation.goBack()} />
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  jurado: {
    padding: 10,
  },
});

export default Formulario;
