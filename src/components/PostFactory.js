import { dbService, storageService } from "fbase";
import React, { useState } from "react"
import {v4 as uuidv4} from "uuid"   //create random id
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudDownloadAlt, faFont, faPlus, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

const PostFactory = ({userObj}) => {
    const [upload, setUpload] =  useState("");
    const [textURL, setTextURL] = useState("");
    const [isURL, setIsURL] = useState(false);
    const [isTXT, setIsTXT] = useState(false);
    const [attachment, setAttachment] = useState("");

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
        fetch('http://127.0.0.1:8000/wordcloud/', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sourceType: s_type, 
                source: textURL,
                uid: userObj.uid,
                imageURL: ""
            })
            
        })
        .then(res => res.json())
        .then((Response) => {
            console.log('response:',Response)
            //setAttachment(Response.imageURL)
            getBase64FromUrl(Response.imageURL).then(data => setAttachment(data))
        })
        
        

    };
    const onSubmit = async (event) => {
        console.log(upload,userObj.uid,attachment)
        if (upload === "") {
            return;
        }      
        event.preventDefault();
        let attachmentURL = "";
        if(attachment !== ""){
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            
            attachmentURL = await response.ref.getDownloadURL();
        }
        const post = {
            text : upload,
            createdAt : Date.now(),
            creatorId : userObj.uid,
            attachmentURL
        }
        await dbService.collection("posts").add(post);
        setUpload("");
        setAttachment("");
        setIsTXT(false);
        setIsURL(false);
    };
    const onChange = (event) => {
        const {target: {value}} = event;
        setUpload(value);
    };
    const onChangeURL = (event) => {
        const {target: {value}} = event;
        setTextURL(value);
    };
    const onFileChange = (event) => {
        const {
            target: {files},
        }   =   event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: {result},
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };
    const onClearAttachment = () => {
        setAttachment("");
    }
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
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                className="factoryInput__input"
                value={upload}
                onChange={onChange}
                type="text"
                placeholder="What's on your mind?"
                maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
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
            <div style={{visibility: "collapse"}}>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input 
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                opacity: 0,
                }}
            />
            </div>
            {attachment && (
                <div className="factoryForm__attachment">
                    <img
                    src={attachment}
                    style={{
                        backgroundImage: attachment,
                    }}
                    alt=""
                    />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                    <span>Remove</span>
                    <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
                
            )}
        </form>
    )};

export default PostFactory;