import { StatusBar } from 'expo-status-bar';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {Link, useRouter, Slot} from "expo-router"
import React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
    // return (
    //     <View style={styles.container}>
    //         {/*<Text>Hello nIGGA</Text>*/}
    //         <StatusBar style="auto"  />
    //         <Link href={"/Home"} style={{color : "blue", cursor : "pointer"}}>Go to Home!</Link>
    //     </View>
    // );
    // return (<)

    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsMounted(true);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, []);


    useEffect(() => {
        (async () => {
            if (isMounted) {
                const token = await AsyncStorage.getItem("token");
                if (!token) {
                    router.replace('/Login');
                } else {
                    router.replace('/Home');
                }
            }
        })();
    }, [isMounted]);


    // return (
    //     <>
    //         {isMounted ? <Slot /> : null} {/* Ensure Slot is rendered after mounting */}
    //     </>
    // );
    // if (!isMounted) {
    //     return (
    //         <View>
    //             <ActivityIndicator size="large" color="#0000ff" />
    //             <Text>Loading...</Text> {/* Correct use of <Text> to avoid the error */}
    //         </View>
    //     );
    // }

    // return (
    //     <View style={{ flex: 1 }}>
    //         <Slot /> {/* Required to render the current route's content */}
    //     </View>
    // );
    return null
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
