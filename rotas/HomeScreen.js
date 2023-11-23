import React, { useState, useEffect } from 'react';
import { View, Image, FlatList, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { ListItem, Card, Divider, Chip, Text } from 'react-native-elements';
import axios from 'axios';
import image from '../assets/makerFaire.png';

const HomeScreen = ({ route, navigation }) => {
  const { username } = route.params;
  const [projects, setProjects] = useState([]);
  const [removedProject, setRemovedProject] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://172.18.137.87:5000/obter_dados');
        console.log('Resposta da API:', response.data);
        setProjects(response.data.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    // Chama a função de busca ao carregar o componente
    fetchData();
  }, []);

  const handleItemRemove = (projectName) => {
    setProjects((prevProjects) => prevProjects.filter((project) => project.PROJETO !== projectName));
    setRemovedProject(projectName);
  };

  const filteredProjects = projects.filter((project) =>
    project.PROJETO.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <ScrollView style={styles.container}>
      <TouchableOpacity
       key={`${item.ID_UNIDADE}-${item.PROJETO}`}
        onPress={() => {
        navigation.navigate('Formulario', {
        username,
        projectID: item.ID_UNIDADE,
        projectUnidade: item.UNIDADEESCOLAR,
        projectName: item.PROJETO,
            onProjectRemove: handleItemRemove,
          });
        }}
      >
        <Divider />
        <View style={styles.listContainer}>
          <ListItem.Content key={item.PROJETO}>
            <ListItem.Title>{item.ID_UNIDADE}- {item.PROJETO}</ListItem.Title>
            <ListItem.Subtitle>{item.UNIDADEESCOLAR}</ListItem.Subtitle>
          </ListItem.Content>
        </View>
        <Divider />
      </TouchableOpacity>
    </ScrollView>
  );

  const renderHeader = () => (
    <>
    <TextInput
      style={styles.searchInput}
      placeholder="Pesquisar projeto..."
      onChangeText={(text) => setSearchText(text)}
      value={searchText}
    />
  </>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#1C315E', alignItems: 'center', justifyContent: 'center' }}>
      <Image source={image} style={{ width: 300, marginTop: 40, height: 100, resizeMode: 'cover', alignSelf: 'center' }} />

      <Card>
        <Text style={{ fontSize: 25, color: 'black' }}>🟢 {username}</Text>
        {removedProject && (
          <Chip title={`Projeto Mais Recente Votado: ${removedProject}`} disabled containerStyle={{ marginVertical: 15 }} />
        )}
        <FlatList
      ListHeaderComponent={renderHeader}
      data={filteredProjects}
      keyExtractor={(item) => `${item.ID_UNIDADE}-${item.PROJETO}`}
      renderItem={({ item }) => renderItem({ item })}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    overflow: 'scroll',
  },
  listContainer: {
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
});

export default HomeScreen;
