import React from 'react';
import { ChromePicker } from 'react-color';

const ColorPicker = ({ color, setColor }) => {

    return (
        <div>
            <ChromePicker
                className="ml-10"
                color={color}
                onChange={(e) => setColor(e.hex)}
            />
        </div>
    );
};

export default ColorPicker;
