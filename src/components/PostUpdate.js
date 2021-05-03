import { dbService, storageService } from "fbase";
import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import {v4 as uuidv4} from "uuid"   //create random id
import PostCloud from "./PostCloud";

const PostUpdate = ({postObj,toggleEditing}) => {
    const [newPost, setNewPost] = useState(postObj.text);
    const [newAttachment, setNewAttachment] = useState(postObj.attachmentURL);
    const onSubmit = async (event) => {
        event.preventDefault();
        let newAttachmentURL = "";
        if(newAttachment !== ""){
            const attachmentRef = storageService.ref().child(`${postObj.creatorId}/${uuidv4()}`);
            const response = await attachmentRef.putString(newAttachment, "data_url");
            
            newAttachmentURL = await response.ref.getDownloadURL();
        }
        await dbService.doc(`posts/${postObj.id}`).update({
            text: newPost,
            attachmentURL : newAttachmentURL
          });
        toggleEditing();
    }
    const onChange = (event) => {
        const {
            target: {value},
        }   = event;
        setNewPost(value);
    }
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
            setNewAttachment(result);
        };
        reader.readAsDataURL(theFile);
        console.log(storageService.ref().child(postObj.attachmentURL))
    };
    const onClearAttachment = () => {
        setNewAttachment("");
    }
    
    return (
        <>
        <form onSubmit={onSubmit} className="container postEdit">
            <input 
                type="text" 
                placeholder="Edit your post" 
                value={newPost} 
                onChange={onChange} 
                required 
                autoFocus 
                className="formInput"/>
            
            {newAttachment && (
                <div className="factoryForm__attachment">
                    <img
                    src={newAttachment}
                    style={{
                        backgroundImage: newAttachment,
                    }}
                    alt=""
                    />
                    <PostCloud userObj={postObj} setAttachment={setNewAttachment}/>
                    <div style={{visibility: "collapse"}}>
                    <label htmlFor="update-file" className="factoryUpdate__label">
                        <span>Change photos</span>
                        <FontAwesomeIcon icon={faPlus} />
                    </label>
                    <input 
                        id="update-file"
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        style={{
                        opacity: 0,
                        }}
                    />
                    </div>
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                    <span>Remove</span>
                    <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
                
            )}
            <input type="submit" value="Update Post" className="formBtn"/>
            
        </form>
        <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
        </span>
        </>
    )

} 
export default PostUpdate;