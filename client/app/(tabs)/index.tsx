import { Platform, Pressable, StyleSheet } from 'react-native';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { useForm, Controller } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from 'axios';
import { useState } from 'react';
import { Image } from 'expo-image';

const apiKey = process.env.EXPO_PUBLIC_API_KEY; // Missing API Key
// Using https://www.weatherapi.com/

type CityData = {
  city: string;
};

export default function HomeScreen() {
  // Move ALL useState hooks inside the component function
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [temp, setTemp] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [weatherTxt, setWeatherTxt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { control: weatherControl, handleSubmit: handleWeatherSubmit } = useForm<CityData>();

  const onSubmit = async (data: CityData) => {
    if (!data.city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      // Use https instead of http
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(data.city)}&aqi=no`
      );
      
      console.log('Weather data:', response.data);

      setCity(response.data.location.name);
      setCountry(response.data.location.country);
      setTemp(response.data.current.temp_c);
      setWeatherTxt(response.data.current.condition.text);
      setImgUrl(`https:${response.data.current.condition.icon}`); // Add https: prefix
      
    } catch (error) {
      console.log("Failed to fetch data", error);
      setError("Failed to fetch weather data. Please try again.");
      
      if (axios.isAxiosError(error)) {
        console.log('Error response:', error.response?.data);
        if (error.response?.data?.error?.message) {
          setError(error.response.data.error.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const ShowKey = () => {
    console.log(apiKey);
  }

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
          
          <ThemedView style={styles.inputContainer}>
            <ThemedText style={styles.label}>Enter a City:</ThemedText>
            <Controller 
              control={weatherControl}
              name='city'
              render={({ field: { onChange, value } }) => (
                <TextInput 
                  style={styles.WeatherInput}
                  onChangeText={onChange}
                  value={value}
                  placeholder="e.g., Stockholm"
                  placeholderTextColor="#888"
                />
              )}
            />
          </ThemedView>

          {error ? (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          ) : null}

          <ThemedView style={styles.buttonContainer}>
            <Pressable 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleWeatherSubmit(onSubmit)}
              disabled={loading}
            >
              <ThemedText style={styles.buttonText}>
                {loading ? 'Loading...' : 'Get Weather'}
              </ThemedText>
            </Pressable>
            <Pressable style={styles.button} onPress={ShowKey}>
              <ThemedText style={styles.buttonText}>Show Key</ThemedText>
            </Pressable>
          </ThemedView>

          {city && (
            <ThemedView style={styles.outputContainer}>
              <ThemedText style={styles.outputTitle}>Weather Information:</ThemedText>
              <ThemedText style={styles.outputText}>City: {city}</ThemedText>
              <ThemedText style={styles.outputText}>Country: {country}</ThemedText>
              <ThemedText style={styles.outputText}>Temperature: {temp}°C</ThemedText>
              <ThemedText style={styles.outputText}>Condition: {weatherTxt}</ThemedText>
              
              {imgUrl && (
                <ThemedView style={styles.imageContainer}>
                  <Image 
                    source={imgUrl}
                    style={styles.weatherIcon}
                    contentFit="contain"
                  />
                </ThemedView>
              )}
            </ThemedView>
          )}
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
    gap: 20,
    padding: 20,
  },
  inputContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  outputContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    alignItems: 'center',
    gap: 10,
  },
  outputTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#010727',
  },
  outputText: {
    fontSize: 16,
    color: '#010727',
  },
  imageContainer: {
    marginTop: 10,
  },
  weatherIcon: {
    width: 64,
    height: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FAFAFA',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FAFAFA',
  },
  WeatherInput: {
    borderWidth: 2,
    borderColor: '#010727',
    borderRadius: 7,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: '#010727',
    backgroundColor: '#FFF',
    minWidth: 200,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#70dbee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 7,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  buttonText: {
    color: '#010727',
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});