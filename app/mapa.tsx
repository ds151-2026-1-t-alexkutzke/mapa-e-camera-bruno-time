import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
// TODO: Importar AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define o formato que o segredo terá
interface Segredo {
  id: string;
  texto: string;
  fotoUri: string | null;
  latitude: number;
  longitude: number;
}

export default function MapaScreen() {
  const [segredos, setSegredos] = useState<Segredo[]>([]);

  // Carrega os dados toda vez que a tela é aberta
  useEffect(() => {
    carregarSegredos();
  }, []);

  const carregarSegredos = async () => {
    // TODO 5: Ler a lista de segredos do AsyncStorage, fazer JSON.parse() e colocar no estado setSegredos.
    const segredosSalvos = await AsyncStorage.getItem('segredos');
    if (segredosSalvos) {
      setSegredos(JSON.parse(segredosSalvos));
    }
  };

  return (
    <View style={styles.container}>
      {/* TODO 6: O MapView precisa receber o initialRegion ou region */}
      {location ? (
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: location.latitude
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
      >

        {/* TODO 7: Fazer um map() no array de segredos para criar os Markers */}
        {segredos.map((segredo) => (
          <Marker
            key={segredo.id}
            coordinate={{ latitude: segredo.latitude, longitude: segredo.longitude }}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutText}>{segredo.texto}</Text>
                {/* Desafio Bônus: Mostrar a miniatura da foto aqui dentro! */}
              </View>
            </Callout>
          </Marker>
        ))}

      </MapView>
      ) : (
        <Text style={styles.loadingText}>Buscando localização...</Text>
      )}


      {segredos.length === 0 && (
        <View style={styles.avisoContainer}>
          <Text style={styles.avisoText}>Nenhum segredo salvo ainda. Vá na outra aba!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingText: { flex: 1, textAlign: 'center', textAlignVertical: 'center', color: '#fff' },
  map: { width: '100%', height: '100%' },
  calloutContainer: { width: 150, padding: 5 },
  calloutText: { fontWeight: 'bold', textAlign: 'center' },
  avisoContainer: { position: 'absolute', top: 50, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: 10, borderRadius: 20 },
  avisoText: { color: '#fff' }
});
