
import { StyleSheet, Text, View } from 'react-native';
import React, {useEffect} from "react"
import {Slot, SplashScreen, Stack} from "expo-router";
import {useFonts} from "expo-font"

export default function App() {
    return (
        <Stack>
            <Stack.Screen name ="Login" options={{headerShown: false}}/>
        </Stack>
    );
}

const styles = StyleSheet.create({
    container : {
        display : "flex",
        flex : 1,
        alignItems : "center",
        justifyContent : "center"
    }
})
