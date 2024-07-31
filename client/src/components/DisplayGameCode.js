import React, {useRef, useState} from 'react';

const DisplayGameCode = ({gameID}) => {
    const [copySuccess, setCopySuccess] = useState(false);
    const textInputRef = useRef(null);

    const copyToClipboard = () => {
        const textToCopy = textInputRef.current.value;
    
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                setCopySuccess(true);
                console.log('Text copied to clipboard');
            })
            .catch(err => {
                console.error('Error copying text to clipboard: ', err);
                setCopySuccess(false);
            });
    };
    

    return (
        <div className="row my-3 text-center">
            <div className="col-sm"></div>
            <div className="col-sm-8">
                <h4>Send this code to your friends so that they can join your game!</h4>
                <div className="input-group mb-3">
                    <input type="text"
                            ref={textInputRef}
                            value={gameID}
                            readOnly 
                            className="form-control" />
                    <div className="ipnut-group-append">
                        <button className="btn btn-outline-secondary"
                                onClick={copyToClipboard}
                                type="button">Copy Game Code</button>
                    </div>
                </div>
                {copySuccess ? <div className="alert alert-success"
                                    role="alert">Successfully Copied Game Code</div> : null}
            </div>
            <div className="col-sm"></div>
        </div>
    )
}

export default DisplayGameCode;