import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import PostUpdate from "./PostUpdate";

const Post = ({postObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    
    const onImageClick = () => {
        window.open(postObj.attachmentURL)
    };
    const onDeleteClick = async () => {
        const isDelete = window.confirm("Are you sure you want to delete this post?");
        if(isDelete){
            await dbService.doc(`posts/${postObj.id}`).delete();
            await storageService.refFromURL(postObj.attachmentURL).delete();
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    
    
    return (
        <>
        <div className="post">
            {
                
                editing ? ( //Edit버튼을 눌렸을 경우
                    <>
                    {isOwner && (
                        <PostUpdate postObj={postObj} toggleEditing={toggleEditing} />
                    )

                    }
                    </>
                    ) : (
                    <>
                    {postObj.attachmentURL && <img onClick={onImageClick} src={postObj.attachmentURL} alt={postObj.attachmentURL}/>}
                    
                    <h4>{postObj.text}</h4>
                    
                    
                    {isOwner && (
                        <div className="post__actions">
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
        </>
    );
};

export default Post;