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
        const getData = 
        dbService.collection("posts").orderBy("createdAt","desc").onSnapshot(snapshot => {
            const postArray = snapshot.docs.map(doc => ({
                id:doc.id,
                ...doc.data(),
            }));
            //console.log(postArray)
        
            setPostList(postArray);
        });
        return () => getData();
    }, []);
    
    return (
        <div className="container">
            <PostFactory userObj={userObj}/>
            <div style={{ marginTop: 30 }}>
                {postlist.map((list) => (
                    <Post key={list.id} postObj={list} isOwner={list.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    );
};
export default Home;