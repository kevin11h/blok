import * as React from "react";
import { Animated } from "react-native";
import { inject, observer } from "mobx-react/native";
import { reaction } from "mobx";
import styled from "styled-components/native";
import Camera from "react-native-camera";
import ButtonOpaque from "../composites/ButtonOpaque";
import { CameraStoreInterface } from "../store/_camera";
import { isIphoneX } from "../services/utilities";
import { width } from "../style/dimension";
import Text from "../components/Text";
import { COLOR } from "../services/enums";

// --- types --- //
export interface Props {
  camera?: CameraStoreInterface;
}

export interface State {
  transition: Animated.Value;
  fade: Animated.Value;
  reverse: boolean;
}

// --- styles --- //
const CameraOverlay = styled(Camera)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  z-index: 15;
`;

const AnimatedCameraOverlay = Animated.createAnimatedComponent(CameraOverlay);

const Cancel = styled(ButtonOpaque)`
  position: absolute;
  bottom: ${isIphoneX() ? "40px" : "20px"};
  align-self: center;
`;

const Frame = styled.Image`
  width: ${width * 0.8}px;
  height: ${width * 0.8}px;
`;

const Laser = styled.Image`
  width: ${width * 0.9}px;
  height: ${width * 0.9 * 0.3}px;
  position: absolute;
  top: ${(p: { reverse: boolean }) => (p.reverse ? -width * 0.9 * 0.03 : -width * 0.9 * 0.27)}px;
`;

const AnimatedLaser = Animated.createAnimatedComponent(Laser);

const Container = styled.View`
  position: relative;
  align-items: center;
`;

const Tip = styled(Text)`
  position: absolute;
  top: ${isIphoneX() ? "60px" : "40px"};
  align-self: center;
`;

@inject("camera")
@observer
class CameraView extends React.Component<Props, State> {
  visibilityListener;

  // -- state -- //
  state = {
    transition: new Animated.Value(0),
    fade: new Animated.Value(0),
    reverse: false
  };

  // --- methods --- //
  componentDidMount() {
    this.visibilityListener = reaction(
      () => this.props.camera.show,
      () => {
        if (this.props.camera.show) this.camera();
      }
    );
  }

  componentWillUnmount() {
    this.visibilityListener();
  }

  camera = () => {
    this.setState({ transition: new Animated.Value(0), fade: new Animated.Value(0) }, () => {
      Animated.timing(this.state.fade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start(() => this.scaner(1));
    });
  };

  scaner = value => {
    if (this.props.camera.show) {
      Animated.timing(this.state.transition, {
        toValue: value,
        duration: 2700,
        delay: 300,
        useNativeDriver: true
      }).start(() => {
        this.setState({ reverse: !this.state.reverse });
        this.scaner(value === 1 ? 0 : 1);
      });
    }
  };

  onBarcode = event => {
    const qrISO = "ORG.ISO.QRCODE";
    if (event.type.toUpperCase() === qrISO && event.data !== this.props.camera.barcode)
      this.props.camera.setBarcode(event.data);
  };

  // --- render --- //
  render() {
    const { camera, ...props } = this.props;
    const { transition, fade, reverse } = this.state;
    return camera.show ? (
      <AnimatedCameraOverlay
        style={{ opacity: fade }}
        onBarCodeRead={this.onBarcode}
        aspect={Camera.constants.Aspect.fill}
        {...props}
      >
        <Tip shadow color={COLOR.white}>
          Point camera at barcode
        </Tip>
        <Container>
          <AnimatedLaser
            source={require("../../assets/images/qr-scanner-laser.png")}
            reverse={reverse}
            style={{
              transform: [
                {
                  translateY: transition.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, width * 0.82]
                  })
                },
                {
                  rotate: reverse ? "180deg" : "0deg"
                }
              ],
              opacity: transition.interpolate({
                inputRange: [0, 0.3, 0.6, 1],
                outputRange: [0, 1, 1, 0]
              })
            }}
          />
          <Frame source={require("../../assets/images/qr-scanner-frame.png")} />
        </Container>
        <Cancel text="CANCEL" onPress={() => camera.toggleCamera(false)} />
      </AnimatedCameraOverlay>
    ) : null;
  }
}

export default CameraView;
