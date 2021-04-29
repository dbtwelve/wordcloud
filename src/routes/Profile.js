import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

export default ({refreshUser, userObj}) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName)
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
    const getMyPosts = async() => {
        const posts = await dbService
                            .collection("posts")
                            .where("creatorId", "==", userObj.uid)
                            .orderBy("createdAt")
                            .get();
        console.log(posts.docs.map((doc) => doc.data()));
    }
    useEffect(() => {
        getMyPosts();
    }, [])

    const onChange = (event) => {
        const {
            target: {value}
        } = event;
        setNewDisplayName(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await userObj.updateProfile({
                displayName: newDisplayName,
            })
            refreshUser();
        }
    }
    return (
        <>
        <form onSubmit={onSubmit}>
            <input
                onChange={onChange}
                type="text"
                placeholder="Display Name"
                value={newDisplayName}
            />
            <input type="submit" value="Update Profile"/>
        </form>
        <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};