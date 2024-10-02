import {SafeAreaView, StyleSheet, Text, View, StatusBar} from 'react-native';
import {useEffect, useRef, useState} from "react";
import * as Location from "expo-location";
import MapView, {Circle, Marker} from "react-native-maps";
import axios from "axios";
import {useSelector} from "react-redux";
import {ActivityIndicator} from "react-native-paper";
import { showMessage, hideMessage } from "react-native-flash-message";

export default function Maps() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [tags, setTags] = useState([]);
    const CONSTANTS = useSelector((state) => state.CONSTANTS);
    const tagRef = useRef(null);

    useEffect(() => {
        (async () => {
            // const token = await AsyncStorage.getItem("token");
            // if (!token) {
            //     navigation.navigate("Login");
            // }

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                showMessage({
                    message: "Location Permission denied",
                    type: "danger",
                });
                // setErrorMsg("Permission to access location was denied");
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);

            navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation(position);
                },
                (error) => console.log(error),
                {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 1000,
                    distanceFilter: 10,
                },
            );
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                let { data } = await axios.get(`${CONSTANTS.ip}/api/getAllTag`);
                if (data.status === "ok") {
                    // AsyncStorage.setItem("token", data.token);
                    // AsyncStorage.setItem("user", data.user);
                    // navigation.navigate("Home");
                    setTags(data.tags);
                } else {
                    showMessage({
                        message: "Something went wrong",
                        type: "danger",
                    });
                    //error or no user found or invalid username/ pass
                }
            } catch {}
        })();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {location ? (
                <MapView
                    style={styles.map}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    showsCompass={true}
                    showsScale={true}
                    showsBuildings={true}
                    zoomEnabled={true}
                    zoomTapEnabled={true}
                    zoomControlEnabled={true}
                >
                    {tags.map((el) => {
                        return (
                            <View key={el._id}>
                                <Marker
                                    coordinate={{
                                        latitude: Number(el.location[0]),
                                        longitude: Number(el.location[1]),
                                    }}
                                />
                                <Circle
                                    center={{
                                        latitude: Number(el.location[0]),
                                        longitude: Number(el.location[1]),
                                    }}
                                    lineJoin={"round"}
                                    strokeWidth={2}
                                    strokeColor={"rgba(239, 35, 60, 1)"}
                                    fillColor={"rgba(239, 35, 60, 0.3)"}
                                    radius={el.radius}
                                    title={"You're here"}
                                />
                            </View>
                        );
                    })}
                </MapView>
            ) : (
                <ActivityIndicator animating={true} />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop : StatusBar.currentHeight,
    },
    map: {
        width: "100%",
        height: "100%",
    },
});

