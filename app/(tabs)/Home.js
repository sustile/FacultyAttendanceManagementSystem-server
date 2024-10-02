import {SafeAreaView, ScrollView, StyleSheet, View, StatusBar} from 'react-native';
import * as Location from "expo-location";

import { Text } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';
import {useEffect, useRef, useState} from "react";
import GeoTag from "./GeoTag";
import {useSelector} from "react-redux";
import axios from "axios";
import haversine from "haversine-distance";
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import {router} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Dialog, Portal } from 'react-native-paper';
import { showMessage, hideMessage } from "react-native-flash-message";

// import JsonSearch from "search-array";

import{FilterDataAdvanced} from 'filter-data-advanced/dist/FilterDataAdvanced';

let obj = new FilterDataAdvanced();

export default function () {
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [tags, setTags] = useState([]);
    const CONSTANTS = useSelector((state) => state.CONSTANTS);
    const tagRef = useRef(null);
    const [nearestTag, setNearestTag] = useState(null);
    let [user, setUser] = useState(null);
    let [displayTag, setDisplayTag] = useState([]);

    useEffect(() => {
        tagRef.current = tags;
    }, [tags]);

    useEffect(() => {
        if(searchQuery.trim() === ""){
            setDisplayTag(tags)
        }else{
            // const searcher = new JsonSearch(tags)
            let found = obj.filterByValue(tags, searchQuery);
            setDisplayTag(found)
        }
    }, [searchQuery, tags])

    useEffect(() => {
        if (!location) return;
        let { latitude, longitude } = location.coords;
        let x = [];
        let final = [];
        tagRef.current.forEach((el) => {
            const distance = haversine(
                { latitude, longitude },
                { latitude: Number(el.location[0]), longitude: Number(el.location[1]) },
            );
            final.push({ ...el, distance })
            if (distance <= el.radius) {
                x.push({ ...el, distance });
            }
        });
        x.sort(function (a, b) {
            return a.distance - b.distance;
        });
        if (x.length === 0) {
            setNearestTag(null);
        } else {
            setNearestTag(x[0]);
        }
        setTags(final)
    }, [location]);

    useEffect(() => {
        (async () => {
            const token = await AsyncStorage.getItem("token");
            console.log(token)
            if (!token) {
                showMessage({
                    message: "No user found",
                    type: "danger",
                });
                router.replace('/Login');
            } else {
                try {
                    let { data } = await axios.post(`${CONSTANTS.ip}/api/getBasicData`, {
                        token,
                    });
                    // console.log(data.user)
                    if (data.status === "ok") {
                        setUser(data.user)
                        await AsyncStorage.setItem("user", JSON.stringify(data.user));
                    } else {
                        showMessage({
                            message: "Couldn't get user data",
                            type: "danger",
                        });
                        router.replace('/Login');
                    }
                } catch (err) {
                    showMessage({
                        message: "Something went wrong",
                        type: "danger",
                    });
                    // router.replace('/Login');
                    // console.log(err.message);
                }
            }
        })();
    }, []);


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

            try {
                let { data } = await axios.get(`${CONSTANTS.ip}/api/getAllTag`);
                if (data.status === "ok") {
                    // AsyncStorage.setItem("token", data.token);
                    // AsyncStorage.setItem("user", data.user);
                    // navigation.navigate("Home");
                    // setTags(data.tags);

                    let { latitude, longitude } = loc.coords;
                    let x = [];
                    let final = [];
                    data.tags.forEach((el) => {
                        const distance = haversine(
                            { latitude, longitude },
                            { latitude: Number(el.location[0]), longitude: Number(el.location[1]) },
                        );
                        final.push({ ...el, distance })
                        if (distance <= el.radius) {
                            x.push({ ...el, distance });
                        }
                    });
                    x.sort(function (a, b) {
                        return a.distance - b.distance;
                    });
                    if (x.length === 0) {
                        setNearestTag(null);
                    } else {
                        setNearestTag(x[0]);
                    }
                    setTags(final)

                } else {
                    showMessage({
                        message: "No user found",
                        type: "danger",
                    });
                    //error or no user found or invalid username/ pass
                }
            } catch {
                showMessage({
                    message: "Something went wrong",
                    type: "danger",
                });
            }

            navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation(position);
                },
                (error) => {

                    showMessage({
                        message: "Something went wrong",
                        type: "danger",
                    });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 1000,
                    distanceFilter: 10,
                },
            );
        })();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollCont}>
                <View style={styles.header}>
                    <Text variant={"titleLarge"}>Welcome, {user?.name}</Text>
                    <Searchbar
                        style={{borderRadius: 10}}
                        placeholder="Search"
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                    />
                </View>
                <View style={styles.divider} ></View>
                <View style={styles.mainCont}>
                    <View style={styles.mainCont.header}  >
                        <Text variant="titleLarge" style={{color : "#1b263b"}}>Nearest GeoTags</Text>
                        <Text variant="titleSmall" style={{color : "#778da9"}}>Mark your Attendance</Text>
                    </View>
                    <ScrollView contentContainerStyle={styles.mainCont.wrapper} >
                        {tags.length === 0 && <ActivityIndicator animating={true} />}
                        {displayTag.map((el, i) => <GeoTag data={el} key={i} />)}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height : "100%",
        width : "100%",
        flex : 1,
        justifyContent : "center",
        paddingTop : StatusBar.currentHeight,
        // paddingBottom : 10,
        // backgroundColor : "red",
        paddingLeft: 20,
        paddingRight: 20
    },

    divider:{
      backgroundColor:"#dedbd2", height : 2,
    },

    scrollCont : {
        flex: 1,
        flexGrow: 1,
        width : "100%",
        // backgroundColor : "blue",
        // justifyContent : "center",
        paddingTop : 10,
        // paddingBottom : 50,
        rowGap : 20,
        // rowGap : "100px"
    } ,

    mainCont : {
        flex : 1,
        rowGap : 20,
        // flexDirection : "column",
        // alignItems: 'flex-start',
        // justifyContent: 'center',
        // width : 100
        // backgroundColor: "red"

        header:{
            // rowGap :
        },

        wrapper: {
            // backgroundColor : "red",
            // flex : 1,
            rowGap : 8,
        }
    },

    header: {
        // flex: 1,
        flexDirection : "column",
        alignItems: 'flex-start',
        justifyContent: 'center',
        // backgroundColor : "blue",
        rowGap : 15
    }
});
