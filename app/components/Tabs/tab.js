import React from "react";
import {Container, TabsContainer, TabItem, TabText} from "./tab.css";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function Tabs({translateY, Navigation, toggleHistory, togglePay, toggleTransfer, toggleCredit, toggleReceive, showAnticipation, toggleAnticipation}) {
    return (
        <Container
            style={{
                transform: [
                    {
                        translateY: translateY.interpolate({
                            inputRange: [0, 400],
                            outputRange: [0, 30],
                            extrapolate: 'clamp',
                        }),
                    },
                ],
                opacity: translateY.interpolate({
                    inputRange: [0, 400],
                    outputRange: [1, 0.3],
                    extrapolate: 'clamp',
                }),
            }}
        >
            <TabsContainer>
                {showAnticipation() === true && false && <TabItem onPress={() => toggleAnticipation()}>
                    <MaterialIcons name="attach-money" size={24} color="#FFF" />
                    <TabText>Antecipação</TabText>
                </TabItem>}
                <TabItem onPress={() => togglePay()}>
                    <AntDesign name="barcode" size={24} color="#FFF" />
                    <TabText>Pagar</TabText>
                </TabItem>
                <TabItem onPress={() => toggleHistory()}>
                    <MaterialIcons name="history" size={24} color="#FFF" />
                    <TabText>Histórico</TabText>
                </TabItem>
                <TabItem onPress={() => toggleTransfer()}>
                    <FontAwesome name="send" size={24} color="#FFF" />
                    <TabText>Transferir</TabText>
                </TabItem>
                <TabItem onPress={() => toggleReceive()}>
                    <FontAwesome5 name="hand-holding-usd" size={24} color="#FFF" />
                    <TabText>Receber</TabText>
                </TabItem>

            </TabsContainer>
        </Container>
    );
}
