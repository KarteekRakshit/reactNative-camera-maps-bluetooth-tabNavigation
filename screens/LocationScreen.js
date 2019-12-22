
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    PermissionsAndroid
} from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
//https://github.com/Agontuk/react-native-geolocation-service
//https://github.com/react-native-community/react-native-maps

export default class LocationScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            where: { lat: null, lng: null },
            error: null
        };
    }


    requestExternalStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'My App Storage Permission',
                    message: 'My App needs access to your location ' +
                        'so you can fetch your location',
                },
            );
            return granted;
        } catch (err) {
            console.error('Failed to request permission ', err);
            return null;
        }
    };


    async componentDidMount() {
        let geoOptions = {
            enableHighAccuracy: true,
            timeOut: 20000,
            maximumAge: 60 * 60 * 24
        };
        try {
            await this.requestExternalStoragePermission().then(permissionRes => {
                console.log('permissionRes', permissionRes)
                if (permissionRes == "granted") {
                    //navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoFailure, geoOptions)

                    Geolocation.getCurrentPosition(
                        (position) => {
                            console.log(position);
                        },
                        (error) => {
                            // See error code charts below.
                            console.log('aiyor', error.code, error.message);
                        },
                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                    );
                }
            })


        }
        catch (e) {
            console.log('cameraRollErr:', e)
        }
        // navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoFailure, geoOptions)
    }

    geoSuccess = (position) => {
        this.setState({
            ready: true,
            where: {
                lat: position.coords.latitude, lng: position.coords.longitude
            }
        })

    }
    geoFailure = (err) => {
        this.setState({ error: err.message })
        console.log('err in fetching GeoLoacation')
    }



    // render() {
    //     return (
    //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //             <View style={styles.container}>
    //                 {this.state.ready &&
    //                     (
    //                         <MapView
    //                             provider={PROVIDER_GOOGLE} // remove if not using Google Maps
    //                             style={styles.map}
    //                             region={{
    //                                 //latitude: 37.78825,
    //                                 //longitude: -122.4324,
    //                                 latitude: this.state.where.lat,
    //                                 longitude: this.state.where.lng,
    //                                 latitudeDelta: 0.015,
    //                                 longitudeDelta: 0.0121,
    //                             }}
    //                         >
    //                         </MapView>
    //                     )}
    //                 {!this.state.ready && (
    //                     <Text>Using GeoLocation </Text>
    //                 )}

    //             </View>
    //         </View >
    //     );
    // }


    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.container}>
                    <MapView
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={styles.map}
                        region={{
                            latitude: 37.78825,
                            longitude: -122.4324,
                            latitudeDelta: 0.015,
                            longitudeDelta: 0.0121,
                        }}
                    >
                    </MapView>
                </View>
            </View >
        );
    }
}


const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});