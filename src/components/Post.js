import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Post = ({postObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newPost, setNewPost] = useState(postObj.text);
    const onDeleteClick = async () => {
        const isDelete = window.confirm("Are you sure you want to delete this post?");
        if(isDelete){
            await dbService.doc(`posts/${postObj.id}`).delete();
            await storageService.refFromURL(postObj.attachmentURL).delete();
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`posts/${postObj.id}`).update({
            text: newPost,
        });
        setEditing(false);
    }
    const onChange = (event) => {
        const {
            target: {value},
        }   = event;
        setNewPost(value);
    }
    return (
        <div className="post">
            {
                
                editing ? ( //Edit버튼을 눌렸을 경우
                    <>
                    {isOwner && (
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
                            <input type="submit" value="Update Post" className="formBtn"/>
                        </form>
                        <span onClick={toggleEditing} className="formBtn cancelBtn">
                            Cancel
                        </span>
                        </>
                    )

                    }
                    </>
                    ) : (
                    <>
                    {postObj.attachmentURL && <img src={postObj.attachmentURL} />}
                    
                    <h4>{postObj.text}</h4>
                    
                    
                    {isOwner && (
                        <div class="post__actions">
                            <span onClick={onDeleteClick}>
                            <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    )}
                    </>
                    )
                
            }
            
        </div>
    );
};

export default Post;