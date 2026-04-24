import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
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

  const initialRegion = {
    latitude: segredos[0]?.latitude ?? -27.5954,
    longitude: segredos[0]?.longitude ?? -48.548,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

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
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
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
                {segredo.fotoUri ? (
                  <Image
                    source={{ uri: segredo.fotoUri }}
                    style={styles.calloutImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.calloutSemFoto}>Sem foto</Text>
                )}
              </View>
            </Callout>
          </Marker>
        ))}

      </MapView>


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
  calloutContainer: { width: 180, padding: 8 },
  calloutText: { fontWeight: 'bold', textAlign: 'center' },
  calloutImage: {
    width: '100%',
    height: 90,
    marginTop: 8,
    borderRadius: 6,
  },
  calloutSemFoto: {
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
    fontSize: 12,
  },
  avisoContainer: { position: 'absolute', top: 50, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: 10, borderRadius: 20 },
  avisoText: { color: '#fff' }
});
