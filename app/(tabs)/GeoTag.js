import { StatusBar } from 'expo-status-bar';
import {StyleSheet, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import { Icon, MD3Colors } from 'react-native-paper';
import { Button, Dialog, Portal, PaperProvider, Text, Snackbar } from 'react-native-paper';
import {useEffect, useState} from "react";
import axios from "axios";
import {useSelector} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";
import * as Location from "expo-location";
import haversine from "haversine-distance";
import { showMessage, hideMessage } from "react-native-flash-message";


const AttendanceModal = ({visible, setVisible,data}) => {
    const CONSTANTS = useSelector((state) => state.CONSTANTS);
    const hideDialog = () => setVisible(false);
    let [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                //error
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            let { latitude, longitude } = loc.coords;
            setLocation({latitude, longitude})
        })()

    }, []);

    const markAttendance = async () => {
        //check if user is inside the geotag: get freshLocation and check
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            //error
            showMessage({
                message: "Location Permission denied",
                type: "danger",
            });
            return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        let { latitude, longitude } = loc.coords;
        setLocation({latitude, longitude})
        const distance = haversine(
            { latitude, longitude },
            { latitude: Number(data.location[0]), longitude: Number(data.location[1]) },
        );

        if(distance > data.radius) {
            showMessage({
                message: "You are not inside this GeoTag's coverage",
                type: "danger",
            });
            //not within radius: error
            return;
        }

        //mark attendance

        try {

            const user = JSON.parse(await AsyncStorage.getItem("user"));
            const token = await AsyncStorage.getItem("token");

            if(!user.facultyId || !token){
                //no user or no token
                showMessage({
                    message: "No user found",
                    type: "danger",
                });
                router.replace("/Login");
                return;
            }

            let body = {
                facultyId: user.facultyId,
                location: loc.coords,
                geoTag: data,
                token,
            };
            console.log(body);

            let data2 = await axios.post(
                `${CONSTANTS.ip}/api/markAttendance`,
                body,
            );

            data2 = data2.data

            if (data2.status === "ok") {
                console.log("success");
                setVisible(false);
            } else {
                showMessage({
                    message: "Couldn't Mark Attendance. Something went wrong",
                    type: "danger",
                });
                // console.log(data2);
            }

            // console.log(userId, location);
            // await setDoc(doc(db, 'attendance', userId), {
            //     timestamp: new Date(),
            //     location,
            // });
            // alert('Attendance marked successfully');
        } catch (error) {
            showMessage({
                message: "Something went wrong",
                type: "danger",
            });
            // alert("Error marking attendance: " + error.message);
        }

    };

    return (
                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title >Confirm Attendance</Dialog.Title>
                        <Dialog.Content>
                            <Text variant="titleMedium">GeoTag : {data.name}</Text>
                            <Text variant="titleMedium">Date : {new Date().toLocaleString()} </Text>
                            <Text variant="titleMedium">Location : {Number(data.location[0]).toFixed(2)}, {Number(data.location[1]).toFixed(2)}</Text>
                            <Text variant="titleMedium">Radius : {data.radius} metres</Text>
                            <Text variant="titleMedium">Current Location : {Number(location?.latitude).toFixed(2)}, {Number(location?.longitude).toFixed(2)}</Text>
                            <Text variant="titleMedium">Distance from Center : {Number(data.distance).toFixed(2)} metres</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialog}>Cancel</Button>
                            <Button onPress={markAttendance}>Mark Attendance</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
    );
};

function SnackBarCont({visible, setVisible, message, setMessage}) {
    const onDismissSnackBar = () => {
        setMessage("")
        setVisible(false)
    };

    return(    <Portal>
        <Snackbar
            duration={4000}

            visible={visible}
            onDismiss={onDismissSnackBar}
            // action={{
            //     label: 'OK',
            //     onPress: () => {
            //         // Do something
            //     },
            // }}
            >
            {message}
        </Snackbar>
    </Portal>)
}

export default function GeoTag({data}) {
    const CONSTANTS = useSelector((state) => state.CONSTANTS);
    const [visible, setVisible] = useState(false);
    const [snackVisible, setSnackVisible] = useState(false);
    const [snackMessage, setSnackMessage] = useState("")

    async function clickHandler(){
        if(data.distance > data.radius) {
            // if(!snackVisible){
            //     setSnackMessage("You are not inside this GeoTag")
            //     setSnackVisible(true)
            // }
            showMessage({
                message: "You are not inside this GeoTag",
                type: "danger",
            });
            return
        };

        const token = await AsyncStorage.getItem("token");
        if (!token) {
            router.replace('/Login');
        } else {
            try {
                let { data } = await axios.post(`${CONSTANTS.ip}/api/checkAttendanceStatus`, {
                    token,
                });
                console.log(data)
                if (data.status === "ok") {
                    if(data.attendanceStatus) {
                        setVisible(true)
                    }else{
                        // if(!snackVisible){
                        //
                        // setSnackMessage("Already Marked Attendance for the Day")
                        // setSnackVisible(true)
                        // }
                        showMessage({
                            message: "Already Marked Attendance for the Day",
                            type: "danger",
                        });
                        //user already gave attendance for the day
                    }
                } else {
                    showMessage({
                        message: "No user found",
                        type: "danger",
                    });
                    router.replace('/Login');
                }
            } catch (err) {
                // router.replace('/Login');
                showMessage({
                    message: "Something went wrong",
                    type: "danger",
                });
                // console.log(err.message);
            }
        }
    }


    // console.log(data)
    return (
        <>
            <TouchableOpacity  onPress={clickHandler} >

        <View style={{...styles.container, backgroundColor : (data.distance <= data.radius) ? "rgba(153, 217, 140, 0.75)" : "rgba(230, 57, 70, 0.7)"}}>
            <View style={styles.mainCont} >
                <View style={styles.mainCont.header}>
                    <Icon
                        source="map-marker"
                        color={"#26262C"}
                        size={20}
                    />
                    <Text variant="titleSmall" style={{color : "#26262C"}}>{Number(data.location[0]).toFixed(2)}, {Number(data.location[1]).toFixed(2)}</Text>
                </View>
                <Text variant="titleMedium" style={{color : "#08080C"}}>{data.name}</Text>
                <Text variant="titleSmall" style={{color : "#26262C"}}>{data.radius}m Radius</Text>
            </View>
            {(data.distance <= data.radius) &&
                <View style={styles.distWrapper}>
                    <View style={styles.distCont} >
                        <Text variant="bodySmall" style={{color : "#26262C"}}>Inside By</Text>
                        <Text variant="titleMedium" style={{color : "#08080C"}}>{data.distance.toFixed(1)}m</Text>
                    </View>
                    <View style={styles.btnCont} >
                        <Icon
                            source="arrow-right"
                            color={"#26262C"}
                            size={16}
                        />
                    </View>
                </View>}
        </View>
            </TouchableOpacity >

            <SnackBarCont visible={snackVisible} setVisible={setSnackVisible} message={snackMessage} setMessage={setSnackMessage}  />
            <AttendanceModal visible={visible} setVisible={setVisible} data={data} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection : "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius : 10,
        // backgroundColor : "rgba(153, 217, 140, 0.75)",
    },
    mainCont: {
        flexDirection : "column",
        alignItems: 'flex-start',
        rowGap: 4,
        justifyContent: 'center',
        paddingTop: 16,
        paddingBottom: 16,

        header : {
            flexDirection : "row",
            alignItems: 'center',
            columnGap: 6,
            justifyContent: 'flex-start',
        }
    },
    distWrapper:{
        flexDirection : "column",
        alignItems: 'center',
        rowGap: 10,
        justifyContent: 'space-between',
        paddingLeft: 12,
        paddingRight: 6,
    },
    distCont: {
        flexDirection : "column",
        alignItems: 'center',
        rowGap: 2,
        justifyContent: 'center',
        // backgroundColor : "red",
        width : "100%"
    },

    btnCont:{
        flexDirection : "row",
        alignItems: 'center',
        columnGap : 6,
        justifyContent: 'flex-end',
        backgroundColor : "rgba(153, 217, 140, 1)",
        paddingTop : 4,
        paddingBottom : 4,
        paddingLeft: 8,
        paddingRight : 8,
        borderRadius : 4
    }
});
