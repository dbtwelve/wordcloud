import React, { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudDownloadAlt, faFont, faSearch } from "@fortawesome/free-solid-svg-icons";
import https from 'https';


const PostCloud = ({userObj, setAttachment}) => {
    const [textURL, setTextURL] = useState("");
    const [isURL, setIsURL] = useState(false);
    const [isTXT, setIsTXT] = useState(false);

    const getBase64FromUrl = async (url) => {
        const data = await fetch(url);
        const blob = await data.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob); 
            reader.onloadend = function() {
            const base64data = reader.result;   
            resolve(base64data);
            }
        });
    }

    const onTextCloudSubmit = async (event) => {
        
        if (textURL === "") {
            setIsURL(false)
            setIsTXT(false)
            return;
        }      
        event.preventDefault();
        
        let s_type = ""
        if (isURL === true){
            s_type = "U"
        }
        else{
            s_type = "T"
        }
        //console.log(userObj)
        let uid = ""
        if(userObj.uid){
            uid = userObj.uid
        }
        else{
            uid = userObj.creatorId
        }
        //fetch('http://127.0.0.1:8000/wordcloud/', {
        fetch('https://3.37.27.136/wordcloud/', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
                
            },
            rejectUnauthorized: false,
            httpsAgent: new https.Agent({rejectUnauthorized: false}),
            body: JSON.stringify({
                sourceType: s_type, 
                source: textURL,
                uid: uid,
                imageURL: ""
            })
            
        })
        .then(res => res.json())
        .then((Response) => {
            //console.log('response:',Response)
            //setAttachment(Response.imageURL)
            getBase64FromUrl(Response.imageURL).then(data => setAttachment(data))
        })

    };

    const onChangeURL = (event) => {
        const {target: {value}} = event;
        setTextURL(value);
    };

    const toggleURL = () => {
        setIsURL((urlprev) => !urlprev);
        if(isTXT === true){
            setIsTXT(false)
            setTextURL("")
        }
        //console.log("isURL",isURL,"isTXT",isTXT)
    }
    const toggleTXT = () => {
        setIsTXT((txtprev) => !txtprev);
        if(isURL === true){
            setIsURL(false)
            setTextURL("")
        }
        //console.log("isTXT",isTXT,"isURL",isURL)
    }

    return (
        <>
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/> 
        <span>
            <label className="Input__label" onClick={toggleURL}>
                <span>URL</span>
                <FontAwesomeIcon icon={faSearch} />
            </label>
            <label className="Input__label" onClick={toggleTXT}>
                <span>TXT</span>
                <FontAwesomeIcon icon={faFont} />
            </label>
        </span>
        {
            isURL ? (
                <>
                <form onSubmit={onTextCloudSubmit} className="sourceForm">
                    <div className="factoryInput__container">
                        <input
                        className="URL_Input__input"
                        value={textURL}
                        onChange={onChangeURL}
                        type="url"
                        placeholder="Put your URL to convert wordcloud."
                        />
                        <button onClick={onTextCloudSubmit} type="submit" value="&darr;" className="URL_Input__arrow">
                            <FontAwesomeIcon icon={faCloudDownloadAlt} width="200px" height="200px" />
                        </button>
                    </div>
                </form>
                </>
            ) : (
                <>
                </>
            )
        }
        {
            isTXT ? (
                <>
                <form onSubmit={onTextCloudSubmit} className="sourceForm">
                    <div className="factoryInput__container">
                        <textarea
                        className="TXT_Input__input"
                        value={textURL}
                        onChange={onChangeURL}
                        placeholder="Put your Text to convert wordcloud."
                        />             
                        <button onClick={onTextCloudSubmit} type="submit" value="&darr;" className="TXT_Input__arrow">
                            <FontAwesomeIcon icon={faCloudDownloadAlt} width="200px" height="200px" />
                        </button>
                    </div>
                </form>
                </>
            ) : (
                <>
                </>
            )
        }
        </>
    )
};

export default PostCloud;