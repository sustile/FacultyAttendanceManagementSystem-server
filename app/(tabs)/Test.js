import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function Test() {
    return (
        <View style={styles.container}>
            <Text style={styles.container.text}>Test</Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',

        text : {
            fontFamily : "Poppins-Black",
            color : "red"
        }
    },


});