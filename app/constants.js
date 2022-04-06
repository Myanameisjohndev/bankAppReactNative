import React from "react";
import {Image} from "react-native";
import {logoWhiteLabel} from './style/pallet';

export const Logo = ({moreStyle, imagem}) => {
    console.log(logoWhiteLabel)
    let style;
    imagem = !imagem  ? logoWhiteLabel: imagem
    if (Array.isArray(moreStyle)) {
        let newArray = [
            {
                resizeMode: 'contain',
                width: 500, height: 500
            }
        ];
        newArray = newArray.concat(moreStyle);
        style = newArray;
    } else {
        style = {
            ...{
                resizeMode: 'contain',
                width: 350, height: 350
            }, ...moreStyle
        }
    }
    return <Image source={logoWhiteLabel} style={style} />;
}
