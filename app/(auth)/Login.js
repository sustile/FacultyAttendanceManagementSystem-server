// import { StatusBar } from 'expo-status-bar';
import {SafeAreaView, ScrollView, StyleSheet, View, StatusBar} from 'react-native';
import LoginScreen from "./LoginScreen";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage, hideMessage } from "react-native-flash-message";

import { Text } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { Button } from 'react-native-paper';
import {useRouter} from "expo-router";


export default function App() {
    let [regNo, setRegNo] = useState("")
    let [pass, setPass] = useState("")
    const router = useRouter();
    const CONSTANTS = useSelector((state) => state.CONSTANTS);

    // useEffect(() => {
    //                 router.replace('/Home');
    //
    // }, []);


    async function submitHandler(){
        if(regNo.trim() !== "" && pass.trim() !== ""){
            try {
                let { data } = await axios.post(`${CONSTANTS.ip}/api/login`, {
                    regNo,
                    password : pass,
                });
                console.log(data);

                if (data.status === "ok") {
                    await AsyncStorage.setItem("token", data.token);
                    await AsyncStorage.setItem("user", JSON.stringify(data.user));
                    router.replace('/Home');
                    // navigation.navigate("Home");
                } else {
                    //error or no user found or invalid username/ pass
                }
            } catch(e) {
                console.log(e)
            }

        }
    }

    return (
        // <LoginScreen disableSignup disableSocialButtons disableDivider/>r
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle= {styles.scrollCont} >
                <View style={styles.header} >
                    <Text variant={"headlineLarge"} >Attendance App</Text>
                    <Text variant={"headlineSmall"} >Login</Text>
                </View>
                <View style={styles.mainCont}>
                    <TextInput
                        mode={"outlined"}
                        label="Registration Number"
                        value={regNo}
                        onChangeText={text => setRegNo(text)}
                    />
                    <TextInput
                        mode={"outlined"}
                        label={"Password"}
                        value={pass}
                        secureTextEntry
                        onChangeText={text => setPass(text)}
                        // right={<TextInput.Icon icon="eye" />}
                    />
                    <Button mode="contained" style={{ borderRadius : 3, marginTop : 30}} onPress={submitHandler}>
                        Login
                    </Button>
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
        // backgroundColor : "red",
        paddingLeft: 30,
        paddingRight: 30
    },

    scrollCont : {
        flex: 1,
        flexGrow: 1,
        width : "100%",
        // backgroundColor : "blue",
        justifyContent : "center",
        paddingTop : 50,
        paddingBottom : 50,
        rowGap : 40,
        // rowGap : "100px"
    } ,

    mainCont : {
        // flex : 1,
        rowGap : 10,
        // flexDirection : "column",
        // alignItems: 'flex-start',
        // justifyContent: 'center',
        // width : 100
    },

    header: {
        // flex: 1,
        flexDirection : "column",
        alignItems: 'flex-start',
        justifyContent: 'center',
        // backgroundColor : "blue",
        rowGap : 0
    }
});
