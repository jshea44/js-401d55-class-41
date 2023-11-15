import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { NativeBaseProvider, Button } from 'native-base';

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [image, setImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          Permissions required to access camera.
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  return (
    <NativeBaseProvider>
      <SafeAreaView style={styles.container}>
        {showCamera ? (
          <Camera style={styles.camera} type={type}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraType}
              >
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setShowCamera(false)}
              >
                <Text style={styles.text}>Exit Camera</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        ) : (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Button onPress={() => setShowCamera(true)}>Access Camera</Button>
            <Button title="Pick an image from camera roll" onPress={pickImage}>
              Open Photo Library
            </Button>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 200, height: 200 }}
              />
            )}
          </View>
        )}
      </SafeAreaView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
