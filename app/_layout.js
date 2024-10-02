import { StyleSheet, Text, View } from 'react-native';
import React, {useEffect} from "react"
import {Slot, SplashScreen, Stack} from "expo-router";
import {useFonts} from "expo-font"
import { Provider, useSelector } from "react-redux";
import store from "./../Store/store";
import {MD3LightTheme as DefaultTheme, PaperProvider} from 'react-native-paper';
import FlashMessage from "react-native-flash-message";


const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#76c893',
        secondary: '#b5e48c',
    },
};

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [fontsLoaded, error] = useFonts({
        "Poppins-Black" : require("./../assets/fonts/Poppins/Poppins-Black.ttf")
    })

    useEffect(() => {
        if(error) throw error;

        if(fontsLoaded) SplashScreen.hideAsync()
    }, [fontsLoaded]);

    if(!fontsLoaded && !error) return null;

    return (
        <Provider store={store}>
            <PaperProvider theme={theme}>
                <FlashMessage position="bottom" />
                <Stack>
                    <Stack.Screen name ="index" options={{headerShown: false}}/>
                    <Stack.Screen name ="(tabs)" options={{headerShown: false}}/>
                    <Stack.Screen name ="(auth)" options={{headerShown: false}}/>
                </Stack>
            </PaperProvider>
        </Provider>
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
