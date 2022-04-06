import React from "react";
import {Container, TabsContainer, TabItem, TabText, TabItemMore} from "./tab.css";

export default function Favorites({translateY, list}) {
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
                {list && list.map(favorito => {
                    return (
                        <TabItem onPress={() => null}>
                            <TabText style={{
                                alignSelf: "center",
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingTop: '5%'
                            }}>{favorito.nome_completo}</TabText>
                        </TabItem>
                    )
                })}
            </TabsContainer>
        </Container>
    );
}
