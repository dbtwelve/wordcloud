import { dbService, storageService } from "fbase";
import React, { useState } from "react"
import {v4 as uuidv4} from "uuid"   //create random id
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import PostCloud from "./PostCloud";

const PostFactory = ({userObj}) => {
    const [upload, setUpload] =  useState("");
    
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event) => {
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
        
    };
    const onChange = (event) => {
        const {target: {value}} = event;
        setUpload(value);
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
    

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                className="factoryInput__input"
                value={upload}
                onChange={onChange}
                type="text"
                placeholder="Comment for your cloud."
                maxLength={120}
                />
                {PostCloud.set}
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <PostCloud userObj={userObj} setAttachment={setAttachment}/>
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