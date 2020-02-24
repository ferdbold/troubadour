export default class LaunchpadAgent {
  static GRID_SIZE = 8;
  static COLORS = {
    NONE: 0,
    RED: 3,
    ORANGE: 19,
    GREEN: 48,
    YELLOW: 51
  }

  constructor() {
    this.setButtonColor = this.setButtonColor.bind(this);
    this.onMidiInput = this.onMidiInput.bind(this);

    this._buttonColors = [];
    for (let i = 0; i < LaunchpadAgent.GRID_SIZE; ++i) {
      let row = [];
      for (let j = 0; j < LaunchpadAgent.GRID_SIZE; ++j) {
        row.push(0);
      }
      this._buttonColors.push(row);
    }

    this._output = null;
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

        for (let output of midiAccess.outputs.values()) {
          this._output = output;
        }
      },
      () => { console.warning('Cannot access MIDI devices'); }
    );
  }

  setButtonColor(coords, color) {
    if (this._buttonColors[coords[0]][coords[1]] === color) {
      color = 0;
    }
    this._output.send([144, LaunchpadAgent.coordsToNote(coords), color]);

    this._buttonColors[coords[0]][coords[1]] = color;
  }

  onMidiInput(midiMessage) {
    const note = midiMessage.data[1];
    const isPressed = (midiMessage.data[2] === 127);
    const buttonCoords = [Math.floor(note / 16), note % 16];

    if (isPressed && this._onButtonPressedCB) {
      this._onButtonPressedCB(buttonCoords);
    }
  }

  static coordsToNote(coords) {
    return coords[0] * 16 + coords[1];
  }
}
