import React from 'react';
import { ChromePicker } from 'react-color';

const ColorPicker = ({ color, setColor }) => {

    return (
        <ChromePicker
            className="ml-10"
            color={color}
            onChange={(e) => setColor(e.hex)}
        />
    );
};

export default ColorPicker;
