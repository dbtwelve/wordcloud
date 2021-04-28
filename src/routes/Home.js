import Post from "components/Post";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

//export default () => <span>Home</span>;
const Home = ({userObj}) => {
    const [upload, setUpload] =  useState("");
    const [postlist, setPostList] =  useState([]);
    /*
    const getPostList = async() => {
        const dbPosts = await dbService.collection("posts").get();
        dbPosts.forEach((document) => {
            const postObject = {
                ...document.data(),
                id: document.id,
            }
            //console.log(postObject)
            setPostList(prev => [postObject, ...prev]);
        })
        
    }*/
    useEffect(() => {
        //getPostList();
        //실시간으로 화면에 나타내기 위해 snapshot 사용
        dbService.collection("posts").onSnapshot(snapshot => {
            const postArray = snapshot.docs.map(doc => ({
                id:doc.id,
                ...doc.data(),
            }));
            setPostList(postArray);
        });
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("posts").add({
            text : upload,
            createdAt : Date.now(),
            creatorId : userObj.uid,
        });
        setUpload("");
    };
    const onChange = (event) => {
        const {target: {value}} = event;
        setUpload(value);
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={upload} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="submit" value="Upload" />
            </form>
            <div>
                {postlist.map((list) => (
                    <Post key={list.id} postObj={list} isOwner={list.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    );
};
export default Home;