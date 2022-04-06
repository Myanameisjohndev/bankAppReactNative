import {StyleSheet, Dimensions, Platform} from 'react-native';
import {
  darkButton,
  disabledButton,
  lightButton,
  text_button,
  text_dark,
  text_inDark,
  text_light,
  degrade_secundario,
} from './pallet';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

let hdisp = Dimensions.get('window').height;
let wdisp = Dimensions.get('window').width;

let style = StyleSheet.create({
  cor_fundo: {
    backgroundColor: darkButton,
  },
  h1: {
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Quicksand' : 'Quicksand-semi',
    fontWeight: Platform.OS === 'ios' ? '600' : 'normal',
  },
  h1_dark: {
    color: '#000',
    fontFamily: Platform.OS === 'ios' ? 'Quicksand' : 'Quicksand-semi',
    fontWeight: Platform.OS === 'ios' ? '600' : 'normal',
  },
  h3: {
    marginTop: 22,
    fontSize: 23,
    color: text_dark,
    fontFamily: Platform.OS === 'ios' ? 'Quicksand' : 'Quicksand-semi',
    fontWeight: Platform.OS === 'ios' ? '600' : 'normal',
  },
  h3_black: {
    marginTop: 22,
    fontSize: 23,
    color: '#000',
    fontFamily: Platform.OS === 'ios' ? 'Quicksand' : 'Quicksand-semi',
    fontWeight: Platform.OS === 'ios' ? '600' : 'normal',
  },
  h3_no_margin: {
    fontSize: 23,
    color: text_dark,
    fontFamily: Platform.OS === 'ios' ? 'Quicksand' : 'Quicksand-semi',
    fontWeight: Platform.OS === 'ios' ? '600' : 'normal',
  },
  h3_no_margin_light: {
    fontSize: 23,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Quicksand' : 'Quicksand-semi',
    fontWeight: Platform.OS === 'ios' ? '600' : 'normal',
  },
  h3_no_margin_light_new: {
    fontSize: 23,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Quicksand' : 'Quicksand-semi',
    fontWeight: Platform.OS === 'ios' ? '600' : 'normal',
  },
  h3_light_new: {
    marginTop: 22,
    fontSize: 23,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Quicksand' : 'Quicksand-semi',
    fontWeight: Platform.OS === 'ios' ? '600' : 'normal',
  },
  h3_light: {
    marginTop: 22,
    fontSize: 23,
    color: text_light,
    fontFamily: Platform.OS === 'ios' ? 'Quicksand' : 'Quicksand-semi',
    fontWeight: Platform.OS === 'ios' ? '600' : 'normal',
  },
  centerAll: {
    textAlign: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  justifyText: {
    textAlign: 'justify',
  },
  buttonWhite: {
    backgroundColor: lightButton,
    width: 324,
    height: 68,
    borderRadius: 4,
  },
  buttonGreen: {
    backgroundColor: text_inDark,
    width: 324,
    height: 68,
    borderRadius: 4,
  },
  buttonDark: {
    backgroundColor: darkButton,
    width: 324,
    height: 68,
    borderRadius: 4,
    borderColor: '#8e8e9d',
  },
  buttonCartoes: {
    backgroundColor: 'white',
    width: 324,
    height: 68,
    borderRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: disabledButton,
    width: 324,
    height: 68,
    borderRadius: 4,
  },
  buttonDisabledSCLAlert: {
    backgroundColor: disabledButton,
  },
  buttonTextColor: {
    color: text_button,
    fontWeight: 'bold',
  },
  fontBold: {
    fontFamily: 'Quicksand-bold',
    fontWeight: Platform.OS === 'ios' ? '600' : 'normal',
  },
  fontDefault: {
    fontFamily: Platform.OS === 'ios' ? 'Quicksand' : 'Quicksand-semi',
    fontWeight: Platform.OS === 'ios' ? '600' : 'normal',
    fontSize: 18,
  },
  circle: {
    width: 65,
    height: 65,
    borderRadius: 65 / 2,
    textAlign: 'center',
    alignContent: 'center',
    borderWidth: 2.5,
    borderColor: '#9e9e9e',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 2,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  fixBottom: {
    position: 'absolute',
    bottom: 15,
  },
  fontRegular: {
    fontFamily: 'Quicksand',
  },
  defaultColor: {
    color: text_dark,
  },
  input: {
    width: undefined,
    height: 67,
    borderRadius: 5,
    borderColor: '#D0D0D0',
    borderWidth: 1,
    marginTop: 12,
    flex: 1,
    fontSize: 23,
    paddingLeft: 15,
  },
  arrow: {
    fontSize: 35,
    paddingLeft: 50,
    paddingTop: 100,
  },
  icones: {
    color: text_button,
  },
  circulo: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    textAlign: 'center',
    alignContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  customButton: {
    width: wp('45%'),
    height: 60,
    borderWidth: 1,
    borderRadius: 0.9,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowRadius: 2,
    elevation: 0.2,
  },
  fontLight: {
    color: text_light,
  },
});

export default style;
