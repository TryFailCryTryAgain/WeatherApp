import { Image } from 'expo-image';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';

import { useForm, Controller } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";


type CityData = {
  city: string;
};

export default function HomeScreen() {

  const { control: weatherControl, handleSubmit: handleWeatherSubmit } = useForm<CityData>();

  const onSubmit = (data: CityData) => {
    console.log(data);
  };


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <MaterialCommunityIcons 
          name='weather-sunset'
          size={310}
          color={"#70dbeeff"}
        />
      }>
      <SafeAreaView>
        <ThemedView style={styles.titleContainer}>
          <ThemedText style={styles.title}>Get a Weather Rapport</ThemedText>
          <ThemedView>
            <ThemedText>Enter a City:</ThemedText>
            <Controller 
              control={weatherControl}
              name='city'
              render={({ field: { onChange, value } }) => (
                <TextInput 
                  style={styles.WeatherInput}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </ThemedView>
          <ThemedView>
            <Pressable onPress={handleWeatherSubmit(onSubmit)}>
              <ThemedText>Submit</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 5,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  WeatherInput: {
    borderWidth: 2,
    borderColor: '#FAFAFA',
    borderRadius: 7,
    paddingVertical: 6,
    paddingHorizontal: 12,
    color: '#ccc',
  }
});
