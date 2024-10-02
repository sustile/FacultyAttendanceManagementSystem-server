
import { StyleSheet, View, Image } from 'react-native';
import React, {useEffect} from "react"

import { BottomNavigation, Text } from 'react-native-paper';
import Home from "./Home";
import Record from "./Record";
import Maps from "./Maps";

const HomeRoute = () => {
    return <Home/>
};

const MapRoute = () => <Maps/>;

const RecordRoute = () => <Record/>;

const TabIcon = ({icon, color, name, focused}) => {
    return (
        <View style={styles.container}>
            <Image source={icon} resizeMode={"contain"} tintColor={color} />
            <Text className={``} style={styles.container.text} >{name}</Text>
        </View>
    )
}

export default function App() {
    const [index, setIndex] = React.useState(1);
    const [routes] = React.useState([
        { key: 'Maps', title: 'Maps', focusedIcon: 'map', unfocusedIcon: 'map-legend'},
        { key: 'Home', title: 'Home', focusedIcon: 'home', unfocusedIcon: "home-outline" },
        { key: 'Record', title: 'Records', focusedIcon: 'book-variant', unfocusedIcon:"book-outline" },
        // { key: 'notifications', title: 'Notifications', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        Home: HomeRoute,
        Maps: MapRoute,
        Record: RecordRoute,
    });

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />
    );

    // return (
    //    <>
    //        <Tabs  screenOptions={{tabBarShowLabel : false, tabBarActiveTintColor : "#FFA001", tabBarInactiveTintColor : "#CDCDE0", tabBarStyle : {
    //            backgroundColor : "#222222",
    //                borderTopWidth : 1,
    //
    //                }}}>
    //            <Tabs.Screen name={"Home"} options={{
    //                title: "Home",
    //                headerShown : false,
    //                tabBarIcon: ({color, focused}) => (<TabIcon icon={""} color={color} name={"Home"} focused={focused}/>)
    //            }}/>
    //            <Tabs.Screen name={"Bookmark"} options={{
    //                title: "Bookmark",
    //                headerShown : false,
    //                tabBarIcon: ({color, focused}) => (<TabIcon icon={""} color={color} name={"Bookmark"} focused={focused}/>)
    //            }}/>
    //            <Tabs.Screen name={"Test"} options={{
    //                title: "Test",
    //                headerShown : false,
    //                tabBarIcon: ({color, focused}) => (<TabIcon icon={""} color={color} name={"Test"} focused={focused}/>)
    //            }}/>
    //
    //        </Tabs>
    //    </>
    // );
}

const styles = StyleSheet.create({
    container : {
        display : "flex",
        flex : 1,
        // gap : ,
        alignItems : "center",
        justifyContent : "center",

        text : {
            // fontFamily : "Poppins-Black",
            color : "#FFFFFF"
        }
    }
})
