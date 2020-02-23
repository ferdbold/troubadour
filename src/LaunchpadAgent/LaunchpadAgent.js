export default class LaunchpadAgent {
  constructor() {
    this.setButtonColor = this.setButtonColor.bind(this);
    this.onMidiInput = this.onMidiInput.bind(this);

    this._onDeviceConnectedCB = null;
    this._onButtonPressedCB = null;

    navigator.requestMIDIAccess().then(
      (midiAccess) => {
        for (let input of midiAccess.inputs.values()) {
          input.onmidimessage = this.onMidiInput;

          if (this._onDeviceConnectedCB) {
            this._onDeviceConnectedCB(input.name);
          }
        }

        console.log(this._inputs);
      },
      () => { console.log('Cannot access MIDI devices'); }
    );
  }

  setButtonColor(coords, color) {

  }

  onMidiInput(midiMessage) {
    const note = midiMessage.data[1];
    const isPressed = (midiMessage.data[2] === 127);
    const buttonCoords = [Math.floor(note / 16), note % 16];

    if (isPressed && this._onButtonPressedCB) {
      this._onButtonPressedCB(buttonCoords);
    }
  }
}
