import {SafeAreaView, ScrollView, StyleSheet, View, StatusBar} from 'react-native';
import {ActivityIndicator} from "react-native-paper";
import GeoTag from "./GeoTag";
import { Text } from 'react-native-paper';
import { showMessage, hideMessage } from "react-native-flash-message";
import RecordTag from "./RecordTag";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";
import axios from "axios";
import {useSelector} from "react-redux";

export default function Record() {
    const [records, setRecords] = useState([]);
    const CONSTANTS = useSelector((state) => state.CONSTANTS);

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
                    let { data } = await axios.post(`${CONSTANTS.ip}/api/getRecords`, {
                        token,
                    });
                    // console.log(data.user)
                    if (data.status === "ok") {

                        setRecords(data.records)
                        // await AsyncStorage.setItem("user", JSON.stringify(data.user));
                    } else {
                        showMessage({
                            message: "Couldn't get Attendance Record",
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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollCont}>
                <View style={styles.mainCont}>
                    <View style={styles.mainCont.header}  >
                        <Text variant="titleLarge" style={{color : "#1b263b"}}>Attendance Records</Text>
                        <Text variant="titleSmall" style={{color : "#778da9"}}>View your Attendance Data</Text>
                    </View>
                    <View style={styles.divider} ></View>
                    <ScrollView contentContainerStyle={styles.mainCont.wrapper} >
                        {records.map((el,i) => <RecordTag data={el} key={i} />)}
                        {/*<RecordTag/>*/}
                        {/*{tags.length === 0 && <ActivityIndicator animating={true} />}*/}
                        {/*{tags.map((el, i) => <GeoTag data={el} key={i} />)}*/}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
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
            rowGap : 16,
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

