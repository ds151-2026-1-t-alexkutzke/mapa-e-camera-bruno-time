import React, {useState, useRef} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
// TODO: Importar expo-camera, expo-location e async-storage
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NovoSegredoScreen() {
  const [texto, setTexto] = useState('');
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const cameraRef = useRef<any>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  // Lógica do botão de abrir câmera
  const handleAbrirCamera = async () => {
    // TODO 1: Pedir permissão da câmera
    // Se permitido, abrir a câmera mudando o estado:
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) return;
    }
    setIsCameraOpen(true);
  };

  // Lógica após tirar a foto
  const handleTirarFoto = async () => {
    // TODO 2: Usar o cameraRef para tirar a foto
    // Salvar a URI no estado setFotoUri e fechar a câmera
    if (cameraRef.current) {
      const fotoData = await cameraRef.current.takePictureAsync();
      setFotoUri(fotoData.uri);
      setIsCameraOpen(false); // Fecha a câmera e volta pro mapa
    }
  };

  // Lógica de salvar no armazenamento local
  const handleSalvarSegredo = async () => {
    if (!texto) {
      Alert.alert('Erro', 'Digite um segredo primeiro!');
      return;
    }

    // TODO 3: Buscar a localização atual do usuário (GPS)
    const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão de localização negada!');
        return;
      }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation.coords);

    // TODO 4: Montar o objeto do segredo e salvar no AsyncStorage
    const novoSegredo = {
      id: Date.now().toString(),
      texto: texto,
      fotoUri: fotoUri,
      latitude: location?.latitude,
      longitude: location?.longitude
    };

    try {
      const segredosSalvos = await AsyncStorage.getItem('segredos');
      const listaSegredos = segredosSalvos ? JSON.parse(segredosSalvos) : [];
      listaSegredos.push(novoSegredo);

      await AsyncStorage.setItem('segredos', JSON.stringify(listaSegredos));

      Alert.alert('Sucesso', 'Segredo salvo com sucesso!');
      setTexto('');
      setFotoUri(null);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o segredo.');
    }
  };

  // --- RENDERIZAÇÃO DA CÂMERA EM TELA CHEIA ---
  if (isCameraOpen) {
    return (
      <View style={styles.container}>
        <CameraView style={StyleSheet.absoluteFill} ref={cameraRef} />
        <View style={styles.cameraOverlay}>
          <TouchableOpacity style={styles.btnCapturar} onPress={handleTirarFoto}>
            <Text style={styles.btnText}>Capturar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnCancelar} onPress={() => setIsCameraOpen(false)}>
            <Text style={styles.btnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- RENDERIZAÇÃO DO FORMULÁRIO NORMAL ---
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Qual o seu segredo neste local?</Text>

      <TextInput
        style={styles.input}
        placeholder="Escreva algo marcante..."
        placeholderTextColor="#666"
        value={texto}
        onChangeText={setTexto}
        multiline
      />

      <View style={styles.fotoContainer}>
        {fotoUri ? (
          <Image source={{ uri: fotoUri }} style={styles.previewFoto} />
        ) : (
          <TouchableOpacity style={styles.btnFotoOutline} onPress={handleAbrirCamera}>
            <Text style={styles.btnFotoText}>📷 Adicionar Foto ao Segredo</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvarSegredo}>
        <Text style={styles.btnSalvarText}>Salvar Segredo e Localização 📍</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e1e', padding: 20 },
  label: { color: '#fff', fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  input: { backgroundColor: '#333', color: '#fff', padding: 15, borderRadius: 8, minHeight: 100, textAlignVertical: 'top' },
  fotoContainer: { marginVertical: 20, alignItems: 'center' },
  previewFoto: { width: '100%', height: 200, borderRadius: 8 },
  btnFotoOutline: { borderWidth: 1, borderColor: '#007bff', borderStyle: 'dashed', padding: 30, borderRadius: 8, width: '100%', alignItems: 'center' },
  btnFotoText: { color: '#007bff', fontSize: 16 },
  btnSalvar: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnSalvarText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cameraOverlay: { flex: 1, justifyContent: 'space-evenly', paddingBottom: 40, flexDirection: 'row', alignItems: 'flex-end' },
  btnCapturar: { backgroundColor: '#28a745', padding: 15, borderRadius: 30 },
  btnCancelar: { backgroundColor: '#dc3545', padding: 15, borderRadius: 30 },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
