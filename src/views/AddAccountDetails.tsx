import * as React from "react";
import { inject, observer } from "mobx-react/native";
import { Clipboard, Keyboard, AlertIOS } from "react-native";
import styled from "styled-components/native";
import Input from "../components/Input";
import TouchableIcon from "../composites/TouchableIcon";
import { CameraStoreInterface } from "../store/_camera";
import ButtonGradient from "../composites/ButtonGradient";

// --- types --- //
export interface Props {
  name: string;
  address: string;
  onNameChange: (name: string) => void;
  onAddressChange: (address: string) => void;
  onAddressPaste: (address: string) => void;
  camera?: CameraStoreInterface;
}

// --- styling --- //
const ClipboardInput = styled.View`
  position: relative;
  width: 100%;
  margin-top: 20px;
`;

const DetailsContainer = styled.View`
  margin-top: 20px;
`;

const PasteIcon = styled(TouchableIcon)`
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 2;
`;

const AddressInput = styled(Input)`
  padding-right: 35px;
`;

@inject("camera")
@observer
class AddAccountDetails extends React.Component<Props, {}> {
  // --- methods --- //
  componentDidMount() {
    this.props.camera.reset();
  }

  componentWillReceiveProps(newProps) {
    const { barcode } = newProps.camera;
    if (barcode && !!barcode.barcode) AlertIOS.alert(barcode);
  }

  onAddressPaste = async () => {
    const data = await Clipboard.getString();
    this.props.onAddressPaste(data);
  };

  onShowCamera = () => {
    Keyboard.dismiss();
    this.props.camera.toggleCamera(true);
  };

  // --- render --- //
  render() {
    const { name, address, onNameChange, onAddressChange, ...props } = this.props;
    return (
      <DetailsContainer {...props}>
        <Input
          placeholder="Name"
          maxLength={25}
          value={name}
          onChangeText={name => onNameChange(name)}
        />
        <ClipboardInput>
          <AddressInput
            placeholder="Public Address"
            value={address}
            onChangeText={address => onAddressChange(address.replace(/\s/g, ""))}
          />
          <PasteIcon
            src={require("../../assets/images/icon-clipboard.png")}
            width="19px"
            height="22px"
            onPress={this.onAddressPaste}
          />
        </ClipboardInput>
        <ButtonGradient onPress={this.onShowCamera} text="CAMERA" />
      </DetailsContainer>
    );
  }
}

export default AddAccountDetails;
