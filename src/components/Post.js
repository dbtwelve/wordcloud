import { dbService } from "fbase";
import React, { useState } from "react";

const Post = ({postObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newPost, setNewPost] = useState(postObj.text);
    const onDeleteClick = async () => {
        const isDelete = window.confirm("Are you sure you want to delete this post?");
        if(isDelete){
            await dbService.doc(`posts/${postObj.id}`).delete();
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
        <div>
            {
                
                editing ? (
                    <>
                    <form onSubmit={onSubmit}>
                        <input type="text" placeholder="Edit your post" value={newPost} onChange={onChange} required/>
                        <input type="submit" value="Update Post"/>
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                    </>
                    ) : (
                    <>
                    <h4>{postObj.text}</h4>
                    {isOwner && (
                        <>
                        <button onClick={onDeleteClick}>Delete</button>
                        <button onClick={toggleEditing}>Edit Post</button>
                        </>
                    )}
                    </>
                    )
                
            }
            
        </div>
    );
};

export default Post;