import { dbService, storageService } from "fbase";
import React, { useState } from "react"
import {v4 as uuidv4} from "uuid"   //create random id

const PostFactory = ({userObj}) => {
    const [upload, setUpload] =  useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentURL = "";
        console.log(attachment)
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
        setAttachment(null);
    }
    return (
        <form onSubmit={onSubmit}>
            <input value={upload} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
            <input type="file" accept="image/*" onChange={onFileChange}/>
            <input type="submit" value="Upload" />
            {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px"/>
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
                
            )}
        </form>
    )};

export default PostFactory;