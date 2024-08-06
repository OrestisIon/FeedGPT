
import React from 'react';


function ImageComponent({ imageData }) {
    // The imageData prop is expected to be an object like:
    // { data: "base64string", id: 3, mime_type: "image/x-icon" }

    // Construct the full src string
    const imageSrc = `data:${imageData.mime_type};base64,${imageData.data}`;

    return (
        <img src={imageSrc} alt="Icon" />
    );
}


export default ImageComponent;