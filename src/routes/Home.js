import Post from "components/Post";
import PostFactory from "components/PostFactory";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";


//export default () => <span>Home</span>;
const Home = ({userObj}) => {
    
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
    
    return (
        <div>
            <PostFactory userObj={userObj}/>
            <div>
                {postlist.map((list) => (
                    <Post key={list.id} postObj={list} isOwner={list.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    );
};
export default Home;