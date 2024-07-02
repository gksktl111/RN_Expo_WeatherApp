import { StyleSheet, View, Dimensions, Text, StatusBar, ScrollView } from 'react-native';
import { useEffect, useState } from "react";
import * as Location from 'expo-location';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

interface WeatherType {
    main: {
        temp: number;
    };
    weather: {
        main: string;
        description: string;
    }[];
    dt_txt: string;
}

export default function HomeScreen() {
    const [city, setCity] = useState<string>('Loading');
    const [days, setDays] = useState<WeatherType[]>([]);
    const [ok, setOk] = useState(true);

    const getWeather = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setOk(false);
            return;
        }

        const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
        const location = await Location.reverseGeocodeAsync(
            { latitude, longitude },
            { useGoogleMaps: false }
        );

        if (location[0].city) {
            setCity(location[0].city);
        } else {
            setCity('Unknown');
        }

        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`);
        const json = await response.json();

        setDays(
            json.list.filter((weather: any) => {
                return weather.dt_txt.includes("05:00:00");
            })
        );
    };

    useEffect(() => {
        getWeather();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle={"dark-content"} />
            <View style={styles.city}>
                <Text style={styles.cityName}>{city}</Text>
            </View>

            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.weather}
            >
                {days.map((day, index) => (
                    <View key={index} style={styles.day}>
                        <Text style={styles.date}>{day.dt_txt}</Text>
                        <Text style={styles.temp}>{day.main.temp.toFixed(1)}</Text>
                        <Text style={styles.description}>{day.weather[0].main}</Text>
                        <Text style={styles.tinyText}>{day.weather[0].description}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "skyblue"
    },
    city: {
        flex: 1,
        backgroundColor: "skyblue",
        justifyContent: "center",
        alignItems: "center",
    },
    cityName: {
        fontSize: 48,
        fontWeight: "500",
    },
    weather: {},
    day: {
        width: SCREEN_WIDTH,
        alignItems: "center",
    },
    date: {
        fontSize: 20,
        marginTop: 20,
    },
    temp: {
        fontSize: 178,
        marginTop: 50,
    },
    description: {
        fontSize: 60,
        marginTop: -30,
    },
    tinyText: {
        fontSize: 20,
        marginTop: -10,
    }
});
