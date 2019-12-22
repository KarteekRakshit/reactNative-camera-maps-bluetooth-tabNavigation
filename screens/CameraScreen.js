
import React, { PureComponent } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    AppRegistry,
    Dimensions,
    ToastAndroid,
    PermissionsAndroid
} from 'react-native';

import { RNCamera } from 'react-native-camera'
import CameraRoll from "@react-native-community/cameraroll";

//https://react-native-community.github.io/react-native-camera/docs/rncamera
//https://github.com/react-native-community/react-native-cameraroll
export default class CameraScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            path: null,
        };
    }
    // takePicture = async () => {
    //     try {
    //         const data = await this.camera.takePictureAsync();
    //         console.log('Path to image: ' + data.uri);
    //     } catch (err) {
    //         console.log('err: ', err);
    //     }
    // };

    takePicture = async () => {
        // if (this.camera) {
        //     const options = { quality: 0.5, base64: true };
        //     const data = await this.camera.takePictureAsync(options);
        //     console.log(data.uri);
        // }


        // this.camera.takePictureAsync()
        //     .then((data) => {
        //         console.log(data);
        //         this.setState({ path: data.path })
        //     })
        //     .catch(err => console.error(err));

        if (this.camera) {
            const options = { quality: 0.5 };
            const data = await this.camera.takePictureAsync(options).then(async data => {
                console.log('fromSavingCameraroll', data.uri)
                ToastAndroid.show(data.uri, ToastAndroid.SHORT);
                try {
                    await this.requestExternalStoragePermission().then(permissionRes => {
                        console.log('permissionRes', permissionRes)
                        if (permissionRes == "granted") {
                            CameraRoll.saveToCameraRoll(data.uri, "photo");
                        }
                    })
                    //CameraRoll.saveToCameraRoll(data.uri, "photo");
                }
                catch (e) {
                    console.log('cameraRollErr:', e)
                }
            }).catch(err => {
                console.log('OMG Err:;;;;', err)
            });
            console.log('externalLoggg---:', data);
        }
    };


    renderImage() {
        return (
            <View>
                <Image
                    source={{ uri: this.state.path }}
                    style={styles.preview}
                />
                <Text
                    style={styles.cancel}
                    onPress={() => this.setState({ path: null })}
                >Cancel
            </Text>
            </View>
        );
    }

    requestExternalStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'My App Storage Permission',
                    message: 'My App needs access to your storage ' +
                        'so you can save your photos',
                },
            );
            return granted;
        } catch (err) {
            console.error('Failed to request permission ', err);
            return null;
        }
    };

    renderCamera() {
        return (
            // <View style={styles.container}>
            //     <RNCamera
            //         ref={cam => {
            //             this.camera = cam;
            //         }}
            //         style={styles.container}>
            //         <View style={styles.View}>
            //             <TouchableOpacity style={styles.capture} onPress={this.takePicture}>
            //                 <Text>Take Photo</Text>
            //             </TouchableOpacity>
            //         </View>
            //     </RNCamera>
            // </View>

            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    onGoogleVisionBarcodesDetected={({ barcodes }) => {
                        console.log(barcodes);
                    }}
                />
                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
                        {/* <Text style={{ fontSize: 14 }}> SNAP </Text> */}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }


    render() {
        return (
            <View style={styles.container}>
                {this.state.path ? this.renderImage() : this.renderCamera()}
            </View>
        );
    }
}



// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         flexDirection: 'row'
//     },
//     View: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         alignItems: 'center'
//     },
//     capture: {
//         flex: .1,
//         backgroundColor: 'steelblue',
//         borderRadius: 10,
//         color: 'red',
//         padding: 15,
//         margin: 45
//     }
// })


const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     flexDirection: 'column',
    //     backgroundColor: 'black',
    // },
    // preview: {
    //     flex: 1,
    //     justifyContent: 'flex-end',
    //     alignItems: 'center',
    // },
    // capture: {
    //     flex: 0,
    //     backgroundColor: '#fff',
    //     borderRadius: 5,
    //     padding: 15,
    //     paddingHorizontal: 20,
    //     alignSelf: 'center',
    //     margin: 20,
    // },

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    capture: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 5,
        borderColor: '#FFF',
        marginBottom: 15,
    },
    cancel: {
        position: 'absolute',
        right: 20,
        top: 20,
        backgroundColor: 'transparent',
        color: '#FFF',
        fontWeight: '600',
        fontSize: 17,
    }
});