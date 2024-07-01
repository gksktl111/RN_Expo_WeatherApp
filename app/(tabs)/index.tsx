import {StyleSheet, View, Text, StatusBar } from 'react-native';


export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                안녕하세요 저는 박민규 입니다
            </Text>
            <StatusBar barStyle="dark-content"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    text:{
        fontSize:28,
        color:"blue",
    }
});
