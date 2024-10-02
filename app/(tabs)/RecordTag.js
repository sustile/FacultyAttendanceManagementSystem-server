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

export default function RecordTag({data}) {
    return (
        <View style={{...styles.container}}>
            <View style={{...styles.mainCont, borderBottomLeftRadius : 0, borderBottomRightRadius : 0}} >
                <View style={styles.mainCont.header}>
                    <Icon
                        source="map-marker"
                        color={"rgba(38, 38, 44, 0.6)"}
                        size={20}
                    />
                    <Text variant="titleSmall" style={{color : "rgba(38, 38, 44, 0.6)"}}>{Number(data.location.latitude).toFixed(2)}, {Number(data.location.longitude).toFixed(2)}</Text>
                </View>
                <Text variant="titleMedium" style={{color : "#08080C"}}>{new Date(data.creation).toLocaleString()}</Text>
                <Text variant="bodySmall" style={{color : "#26262C"}}>Inside By {Number(data.location.distance).toFixed(2)}m</Text>
            </View>
            <View style={{...styles.mainCont, backgroundColor: "rgba(153, 217, 140, 0.75)",borderTopLeftRadius : 0,
                borderTopRightRadius : 0,
                borderTopWidth : 2,
                borderTopColor : "#73A769",}}  >
                <View style={styles.mainCont.header}>
                    <Icon
                        source="map-marker"
                        color={"#26262C"}
                        size={20}
                    />
                    <Text variant="titleSmall" style={{color : "#26262C"}}>{Number(data.geoTag.location[0]).toFixed(2)}, {Number(data.geoTag.location[1]).toFixed(2)} ({data.geoTag.radius}m Radius)</Text>
                </View>
                <Text variant="titleMedium" style={{color : "#08080C"}}>{data.geoTag.name}</Text>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection : "column",
        alignItems: 'center',
        justifyContent: 'space-between',

        borderRadius : 10,
        // backgroundColor : "red"

    },
    mainCont: {
        flexDirection : "column",
        alignItems: 'flex-start',
        rowGap: 4,
        justifyContent: 'center',
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 20,
        paddingRight: 20,
        width : "100%",
        backgroundColor : "rgba(0,0,0,0.02)",
        borderRadius : 10,


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
