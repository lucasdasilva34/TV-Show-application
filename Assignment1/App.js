import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';

const App = () => {
  const [query, setQuery] = useState('');
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [cast, setCast] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
      setShows(response.data);
      setSelectedShow(null); // Reset the selected show when new search is made
      setCast([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectShow = async (id) => {
    try {
      const showResponse = await axios.get(`https://api.tvmaze.com/shows/${id}`);
      setSelectedShow(showResponse.data);

      const castResponse = await axios.get(`https://api.tvmaze.com/shows/${id}/cast`);
      setCast(castResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderShowItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelectShow(item.show.id)}>
      <Text style={styles.title}>{item.show.name}</Text>
      {item.show.image && <Image source={{ uri: item.show.image.medium }} style={styles.image} />}
    </TouchableOpacity>
  );

  const renderCastItem = ({ item }) => (
    <View style={styles.castItemContainer}>
      {item.person.image && <Image source={{ uri: item.person.image.medium }} style={styles.castImage} />}
      <View style={styles.castDetails}>
        <Text style={styles.castName}>{item.person.name}</Text>
        <Text style={styles.characterName}>as {item.character.name}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={query}
        onChangeText={setQuery}
        placeholder="Search TV Shows"
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
      {selectedShow ? (
        <FlatList
          data={cast}
          keyExtractor={(item) => item.person.id.toString()}
          renderItem={renderCastItem}
          ListHeaderComponent={() => (
            <View>
              <Text style={styles.showTitle}>{selectedShow.name}</Text>
              {selectedShow.image && <Image source={{ uri: selectedShow.image.original }} style={styles.showImage} />}
              <Text style={styles.showSummary}>{selectedShow.summary?.replace(/<[^>]+>/g, '') || 'No summary available'}</Text>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={shows}
          keyExtractor={(item) => item.show.id.toString()}
          renderItem={renderShowItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    color: '#fff',
    fontSize: 18,
  },
  searchInput: {
    fontSize: 18,
    padding: 10,
    color: '#fff',
    backgroundColor: '#555',
    marginHorizontal: 10,
    marginTop: 30,
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: '#444',
    padding: 10,
    margin: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  showTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    padding: 10,
  },
  showImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  showSummary: {
    color: '#ccc',
    padding: 10,
  },
  castItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  castImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 10,
  },
  castDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  castName: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  characterName: {
    color: '#AAA',
  },
});

export default App;
