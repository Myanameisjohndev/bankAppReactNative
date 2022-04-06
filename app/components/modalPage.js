import React, {Fragment, useState, useEffect} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions} from 'react-native';


const {height} = Dimensions.get('window');


const Modal = ({Show,Page, hideMe, Navigation}) => {
    const [state, setState] = useState({
        opacity: new Animated.Value(0),
        container: new Animated.Value(height),
        modal: new Animated.Value(height)
    });

    const openModal = () => {
        Animated.sequence([
            Animated.timing(state.container, {toValue: 0, duration: 100}),
            Animated.timing(state.opacity, {toValue: 1, duration: 300}),
            Animated.spring(state.modal, {toValue: 0, bounciness: 100, useNativeDriver: true})
        ]).start()
    }

    const closeModal = () => {
        Animated.sequence([
            Animated.timing(state.modal, {toValue: height, duration: 400, useNativeDriver: true}),
            Animated.timing(state.opacity, {toValue: 0, duration: 300}),
            Animated.timing(state.container, {toValue: height, duration: 100})
        ]).start();
    }

    useEffect(() => {
        if (Show) {
            openModal();
        } else {
            closeModal();
        }
    }, [Show])

    if (! Show ) return null;

    return (
        <Animated.View
            style={[styles.container, {
                opacity: state.opacity,
                transform: [
                    {translateY: state.container}
                ]
            }]}
        >
            <Animated.View
                style={[styles.modal, {
                    transform: [
                        {translateY: state.modal}
                    ]
                }]}
            >
                <Fragment>
                    <TouchableOpacity onBackdropPress={() => hideMe()} onPressOut={() => hideMe()} onPress={() => hideMe()} style={styles.indicator} />
                    {Page(Navigation)}
                </Fragment>
            </Animated.View>
        </Animated.View>
    )
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        zIndex: 10
    },
    modal: {
        bottom: 0,
        position: 'absolute',
        height: '99%',
        backgroundColor: '#1C1C1C',
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingLeft: 7,
        paddingRight: 7
    },
    indicator: {
        width: 50,
        height: 20,
        backgroundColor: '#ccc',
        borderRadius: 50,
        alignSelf: 'center',
        marginTop: 5
    },
    text: {
        marginTop: 50,
        textAlign: 'center'
    },
    btn: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        backgroundColor: '#9b59b6',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    }
});

export default Modal