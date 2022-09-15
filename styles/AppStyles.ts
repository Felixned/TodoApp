import { Platform, StatusBar, StyleSheet } from 'react-native';
import { Dimensions } from "react-native";

var fullWidth = Dimensions.get('window').width;
var fullHeight = Dimensions.get('window').height;

export const mainDarkBackgroundColor = '#202124';
export const primaryColor = '#A27320';
export const secondaryColor = '#272631';
export const tertiaryColor = '#707070';
export const dangerColor = '#5D1414';
export const white = '#FFF';
const linkColor = '#6FAFF2';

const smallerFontSize = 15;
export const smallFontSize = 18;
export const mediumFontSize = 21;
const titleFontSize = 24;
const bigTitleFontSize = 27;

export const tinySpacing = 5;
export const smallerSpacing = 10;
export const smallSpacing = 15;
export const mediumSpacing = 20;
const bigSpacing = 30;
export const largerSpacing = 40;
const veryLargeSpacing = 60;
const hugeSpacing = 100;

const smallRadius = 4;
export const mediumRadius = 15;
export const largeRadius = 20;
const bigRadius = 35;

const titleFont = 'CSMS';
export const textFont = 'Europa-Regular';

export default StyleSheet.create({
  ClassicContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fullHeightMinusHeaderContainer: {
    backgroundColor: mainDarkBackgroundColor,
    position: 'relative',
    height: fullHeight,

  },
  fullScreenAppContainerCentered: {
    flex: 1,
    backgroundColor: mainDarkBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: StatusBar.currentHeight,
  },
  fullScreenAppContainer: {
    backgroundColor: mainDarkBackgroundColor,
    flex: 1,
    position: 'relative',
    marginTop: StatusBar.currentHeight,
  },
  allScreenSpaceAvailableCenteredContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  allScreenSpaceAvailableContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  safeAreaStyle: {
    flex: 1,
    backgroundColor: 'mainDarkBackgroundColor'
  },
  paddingCenteredContainer: {
    width: fullWidth * 0.8,
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallPaddingCenteredContainer: {
    width: fullWidth * 0.9,
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexRowContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  ModalButton: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: mediumRadius,
    borderColor: tertiaryColor,
    height: largerSpacing,
    marginHorizontal: smallSpacing,
  },
  modalCenteredText: {
    fontSize: smallerFontSize,
    fontFamily: textFont,
    color: white,
    textAlign: 'center',
    marginVertical: largerSpacing,
    marginHorizontal: mediumSpacing
  },
  shareModalCenteredText: {
    fontSize: smallerFontSize,
    fontFamily: textFont,
    color: white,
    textAlign: 'center',
    marginVertical: mediumSpacing,
    marginHorizontal: smallerSpacing
  },
  topBotSmallerMargin: {
    marginBottom: smallerSpacing,
    marginTop: smallerSpacing,
  },
  topBotMediumMargin: {
    marginBottom: mediumSpacing,
    marginTop: mediumSpacing,
  },
  topBotBigMargin: {
    marginVertical: largerSpacing,
  },
  botBigMaring: {
    marginBottom: largerSpacing,
  },
  botMediumMaring: {
    marginBottom: mediumSpacing,
  },
  botSmallMaring: {
    marginBottom: smallSpacing,
  },
  botHugeMaring: {
    paddingBottom: hugeSpacing,
  },
  topBigSpace: {
    marginTop: largerSpacing,
  },
  topMediumSpace: {
    marginTop: mediumSpacing,
  },
  horizontalMediumSpace: {
    marginHorizontal: mediumSpacing,
  },
  horizontalBigSpace: {
    marginHorizontal: bigSpacing,
  },
  horizontalVeryLargeSpace: {
    marginHorizontal: veryLargeSpacing,
  },
  white: {
    color: white,
  },
  primaryColor: {
    color: primaryColor,
  },
  dangerColor: {
    color: dangerColor,
  },
  linkColor: {
    color: linkColor,
  },
  centeredText: {
    textAlign: 'center',
  },
  smallerText: {
    fontSize: smallerFontSize,
    fontFamily: textFont
  },
  smallText: {
    fontSize: smallFontSize,
    fontFamily: textFont
  },
  mediumText: {
    fontSize: mediumFontSize,
    fontFamily: textFont
  },
  bigText: {
    fontSize: titleFontSize,
    fontFamily: textFont
  },
  titleText: {
    fontSize: bigTitleFontSize,
    fontFamily: titleFont,
  },
  fatPressableStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: mediumSpacing,
    paddingBottom: mediumSpacing,
    width: '100%',
    backgroundColor: primaryColor,
    borderRadius: bigRadius,
  },
  fatPressableTextStyle: {
    color: white,
    fontSize: titleFontSize,
    fontFamily: textFont,
    textAlign: 'center',
    paddingHorizontal: smallerSpacing,
  },
  mediumPressableStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: smallSpacing,
    paddingBottom: smallSpacing,
    width: '100%',
    borderRadius: bigRadius,
  },
  mediumPressableTextStyle: {
    color: white,
    fontSize: mediumFontSize,
    fontFamily: textFont,
    textAlign: 'center',
    paddingHorizontal: smallerSpacing,
  },
  backgroundPrimary: {
    backgroundColor: primaryColor
  },
  backgroundDanger: {
    backgroundColor: dangerColor
  },
  backgroundTertiary: {
    backgroundColor: tertiaryColor
  },
  mediumSpacingLeftAndRight: {
    marginLeft: mediumSpacing,
    marginRight: mediumSpacing,
  },
  smallSpacingLeftAndRight: {
    marginLeft: smallSpacing,
    marginRight: smallSpacing,
  },
  inputWithTopLabelContainer: {
    width: '100%',
    marginBottom: mediumSpacing,
  },
  textInputStyle: {
    width: '100%',
    backgroundColor: secondaryColor,
    borderWidth: 1,
    borderColor: tertiaryColor,
    paddingHorizontal: mediumSpacing,
    paddingVertical: smallerSpacing,
    borderRadius: smallRadius,
    color: white,
  },
  textInputStyleSmall: {
    width: '100%',
    backgroundColor: secondaryColor,
    borderWidth: 1,
    borderColor: tertiaryColor,
    paddingHorizontal: smallerSpacing,
    paddingVertical: tinySpacing,
    borderRadius: smallRadius,
    color: white,
  },
  inputTopLabel: {
    fontFamily: textFont,
    fontSize: mediumFontSize,
    color: white,
  },
  inputTopLabelSmall: {
    fontFamily: textFont,
    fontSize: smallFontSize,
    color: white,
  },
  relative: {
    position: 'relative',
  }
});